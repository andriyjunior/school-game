import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  setPlayerInfo,
  initializeSession,
  finalizeSession,
} from './store/slices/playerSlice';
import {
  setCurrentGame,
  updateScoreAsync,
  resetGame,
} from './store/slices/gameSlice';
import {
  fetchAllLiveSessions,
  setActiveLiveSession,
} from './store/slices/liveSessionSlice';
import {
  setShowNameModal,
  openHelp,
  closeHelp,
} from './store/slices/uiSlice';
import { fetchTestById } from './store/slices/testSlice';
import { GameType, PlayerClass, CategoryType, GameDetails } from './types';

// Import components (keeping .jsx imports for now - hybrid approach)
import PlayerNameModal from './components/PlayerNameModal.jsx';
import HelpModal from './components/HelpModal.jsx';
import MainMenu from './components/MainMenu.jsx';
import StatsBar from './components/StatsBar.jsx';

// Import game components
import TakeTest from './components/games/TakeTest.jsx';
import AlgorithmGame from './components/games/class2/AlgorithmGame.tsx';

function App() {
  const dispatch = useAppDispatch();

  // Redux state
  const player = useAppSelector((state) => state.player);
  const game = useAppSelector((state) => state.game);
  const liveSession = useAppSelector((state) => state.liveSession);
  const ui = useAppSelector((state) => state.ui);

  // Create Firebase session when player sets up
  useEffect(() => {
    if (player.name && player.class && !player.sessionId) {
      dispatch(initializeSession({ playerName: player.name, playerClass: player.class }));
    }
  }, [player.name, player.class, player.sessionId, dispatch]);

  // Check for assigned live sessions
  useEffect(() => {
    const checkLiveSessions = async () => {
      if (player.name && player.class) {
        try {
          await dispatch(fetchAllLiveSessions()).unwrap();

          // Find sessions assigned to this player (only ONE session at a time)
          // Priority: Active sessions first, then most recent completed
          const assignedSessions = liveSession.allLiveSessions.filter((session) => {
            const isForThisClass = session.playerClass === player.class;
            const isAssigned =
              session.participants.includes('all') ||
              session.participants.includes(player.name);
            const isRelevant = session.status === 'active' || session.status === 'completed';
            return isForThisClass && isAssigned && isRelevant;
          });

          // Get the most important session: active first, then most recent completed
          const activeSessions = assignedSessions.filter(s => s.status === 'active');
          const assignedSession = activeSessions.length > 0
            ? activeSessions[0] // Take first active session
            : assignedSessions[0]; // Or first completed session

          if (assignedSession) {
            console.log('Found assigned live session:', assignedSession);
            dispatch(setActiveLiveSession(assignedSession));

            // Only auto-start test if session is ACTIVE (not completed)
            if (assignedSession.status === 'active') {
              dispatch(setCurrentGame('custom-test'));
            }
            // If completed, student can see results when they manually open test
          } else {
            // No live session - student can freely play games
            dispatch(setActiveLiveSession(null));
          }
        } catch (error) {
          console.error('Failed to check live sessions:', error);
        }
      }
    };

    checkLiveSessions();
    const interval = setInterval(checkLiveSessions, 20000); // Check every 20 seconds (reduced from 5s to save database reads)
    return () => clearInterval(interval);
  }, [player.name, player.class, dispatch, liveSession.allLiveSessions]);

  // Load custom test if game type is custom-test
  useEffect(() => {
    if (
      game.currentGame === 'custom-test' &&
      liveSession.activeLiveSession?.testId
    ) {
      dispatch(fetchTestById(liveSession.activeLiveSession.testId));
    }
  }, [game.currentGame, liveSession.activeLiveSession?.testId, dispatch]);

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (player.sessionId) {
        try {
          await dispatch(
            finalizeSession({
              sessionId: player.sessionId,
              stats: {
                totalScore: game.totalScore,
                maxStreak: game.maxStreak,
                achievements: game.achievements,
              },
            })
          );
        } catch (error) {
          console.error('Failed to end session:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [player.sessionId, game.totalScore, game.maxStreak, game.achievements, dispatch]);

  // Handle player setup
  const handlePlayerSetup = (name: string, classNumber: PlayerClass) => {
    dispatch(setPlayerInfo({ name, class: classNumber }));
    dispatch(setShowNameModal(false));
  };

  // Handle game selection
  const handleStartGame = (gameType: GameType) => {
    dispatch(setCurrentGame(gameType));
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    dispatch(resetGame());
  };

  // Handle score update
  const handleUpdateScore = async (points: number, gameDetails: GameDetails = {}) => {
    await dispatch(updateScoreAsync({ points, gameDetails }));
  };

  // Handle show help
  const handleShowHelp = (gameType: GameType) => {
    dispatch(openHelp(gameType));
  };

  // Render current game
  const renderGame = () => {
    // If there's an active live session but game isn't loaded yet, show loading
    if (liveSession.activeLiveSession && liveSession.activeLiveSession.status === 'active' && !game.currentGame) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>📝</div>
          <h2 style={{ marginBottom: '15px' }}>Завантаження тесту...</h2>
          <p style={{ fontSize: '1.2em', opacity: 0.9 }}>
            Сесія: {liveSession.activeLiveSession.title}
          </p>
          <div
            style={{
              marginTop: '20px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            ⏳
          </div>
        </div>
      );
    }

    switch (game.currentGame) {
      case 'algorithm-game':
        return (
          <AlgorithmGame
            onBack={handleBackToMenu}
            onShowHelp={handleShowHelp}
            updateScore={handleUpdateScore}
          />
        );

      case 'custom-test':
        return (
          <TakeTest
            onBack={handleBackToMenu}
            onShowHelp={handleShowHelp}
            updateScore={handleUpdateScore}
          />
        );

      default:
        // Don't show MainMenu if we're in an ACTIVE live session
        // If session is completed, allow access to main menu
        if (liveSession.activeLiveSession && liveSession.activeLiveSession.status === 'active') {
          return (
            <div
              style={{
                textAlign: 'center',
                padding: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                color: 'white',
              }}
            >
              <div style={{ fontSize: '4em', marginBottom: '20px' }}>📝</div>
              <h2 style={{ marginBottom: '15px' }}>Завантаження тесту...</h2>
              <p style={{ fontSize: '1.2em', opacity: 0.9 }}>
                Сесія: {liveSession.activeLiveSession.title}
              </p>
            </div>
          );
        }

        return <MainMenu playerClass={player.class} onStartGame={handleStartGame} />;
    }
  };

  return (
    <>
      {/* Player Name Modal */}
      {ui.showNameModal && <PlayerNameModal onSubmit={handlePlayerSetup} />}

      {/* Help Modal */}
      {ui.showHelp && (
        <HelpModal gameType={ui.helpGameType} onClose={() => dispatch(closeHelp())} />
      )}

      {/* Main Container */}
      <div className="container">
        {/* Player Welcome */}
        {player.name && !ui.showNameModal && (
          <div className="player-welcome">
            <i className="fas fa-user"></i> {player.name} • {player.class} клас
          </div>
        )}

        {/* Stats Bar */}
        {game.currentGame && <StatsBar totalScore={game.totalScore} streak={game.streak} />}

        {/* Achievements Display */}
        <div className="achievements" id="achievements-display"></div>

        {/* Game Area */}
        {renderGame()}
      </div>
    </>
  );
}

export default App;
