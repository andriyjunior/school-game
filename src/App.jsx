import {useState, useEffect} from 'react';
import PlayerNameModal from './components/PlayerNameModal';
import HelpModal from './components/HelpModal';
import MainMenu from './components/MainMenu';
import CategorySelector from './components/CategorySelector';
import StatsBar from './components/StatsBar';
import {createSession, saveGameResult, endSession, getActiveLiveSessions, updateLiveSessionResult} from './firebase/database';

// Import game components
// Class 2 games
import GuessGame from './components/games/class2/GuessGame';
import MemoryGame from './components/games/class2/MemoryGame';
import SpellGame from './components/games/class2/SpellGame';
import MatchGame from './components/games/class2/MatchGame';
import SoundGame from './components/games/class2/SoundGame';

// Class 4 games
import DebugGame from './components/games/class4/DebugGame';

function App() {
    // Player state
    const [playerName, setPlayerName] = useState('');
    const [playerClass, setPlayerClass] = useState(null);
    const [showNameModal, setShowNameModal] = useState(true);

    // Game state
    const [currentGame, setCurrentGame] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [achievements, setAchievements] = useState([]);

    // Firebase session tracking
    const [sessionId, setSessionId] = useState(null);

    // Live session tracking
    const [activeLiveSession, setActiveLiveSession] = useState(null);

    // Help modal state
    const [showHelp, setShowHelp] = useState(false);
    const [helpGameType, setHelpGameType] = useState('');

    // Create Firebase session when player sets up
    useEffect(() => {
        const initSession = async () => {
            if (playerName && playerClass && !sessionId) {
                try {
                    const newSessionId = await createSession(playerName, playerClass);
                    setSessionId(newSessionId);
                    console.log('Session created:', newSessionId);
                } catch (error) {
                    console.error('Failed to create session:', error);
                }
            }
        };

        initSession();
    }, [playerName, playerClass, sessionId]);

    // Check for assigned live sessions
    useEffect(() => {
        const checkLiveSessions = async () => {
            if (playerName && playerClass) {
                try {
                    const liveSessions = await getActiveLiveSessions();
                    // Find sessions assigned to this player or all players
                    const assignedSession = liveSessions.find(session => {
                        const isForThisClass = session.playerClass === playerClass;
                        const isAssigned = session.participants.includes('all') ||
                                           session.participants.includes(playerName);
                        return isForThisClass && isAssigned;
                    });

                    if (assignedSession) {
                        console.log('Found assigned live session:', assignedSession);
                        setActiveLiveSession(assignedSession);

                        // Automatically set the game from live session
                        setCurrentGame(assignedSession.gameType);

                        // Set category for class 2 games, default to 'all' if not specified
                        const class2Games = ['guess', 'memory', 'spell', 'match', 'sound'];
                        if (class2Games.includes(assignedSession.gameType)) {
                            setSelectedCategory(assignedSession.category || 'all');
                        }
                    } else {
                        // No active session - allow free play
                        setActiveLiveSession(null);
                    }
                } catch (error) {
                    console.error('Failed to check live sessions:', error);
                }
            }
        };

        checkLiveSessions();
        // Check every 30 seconds for new assignments
        const interval = setInterval(checkLiveSessions, 30000);
        return () => clearInterval(interval);
    }, [playerName, playerClass]);

    // End session on page unload
    useEffect(() => {
        const handleBeforeUnload = async () => {
            if (sessionId) {
                try {
                    await endSession(sessionId, {
                        totalScore,
                        maxStreak,
                        achievements
                    });
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
    }, [sessionId, totalScore, maxStreak, achievements]);

    // Handle player setup
    const handlePlayerSetup = (name, classNumber) => {
        setPlayerName(name);
        setPlayerClass(classNumber);
        setShowNameModal(false);
    };

    // Handle game selection (shows category selector for class 2)
    const handleStartGame = (gameType) => {
        setCurrentGame(gameType);
        // For class 2 games, we need to select category first
        // Category selector will be shown in renderGame
    };

    // Handle category selection
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    // Handle back to menu
    const handleBackToMenu = () => {
        setCurrentGame('');
        setSelectedCategory('');
    };

    // Handle back to category selector
    const handleBackToCategories = () => {
        setSelectedCategory('');
    };

    // Handle score update
    const handleUpdateScore = async (points, gameDetails = {}) => {
        const newScore = totalScore + points;
        const newStreak = streak + 1;

        setTotalScore(newScore);
        setStreak(newStreak);

        // Update max streak
        if (newStreak > maxStreak) {
            setMaxStreak(newStreak);
        }

        // Save game result to Firebase
        if (sessionId && currentGame) {
            try {
                await saveGameResult(sessionId, {
                    gameType: currentGame,
                    points,
                    score: newScore,
                    streak: newStreak,
                    ...gameDetails
                });
            } catch (error) {
                console.error('Failed to save game result:', error);
            }
        }

        // Update live session if active
        if (activeLiveSession && playerName) {
            try {
                await updateLiveSessionResult(activeLiveSession.id, playerName, {
                    question: gameDetails.question || 'Питання',
                    correct: gameDetails.correct || false,
                    points,
                    gameType: currentGame,
                    ...gameDetails
                });
                console.log('Live session updated');
            } catch (error) {
                console.error('Failed to update live session:', error);
            }
        }
    };

    // Handle show help
    const handleShowHelp = (gameType) => {
        setHelpGameType(gameType);
        setShowHelp(true);
    };

    // Game name map for category selector
    const getGameName = (gameType) => {
        const gameNames = {
            guess: '🔮 Вгадай Тварину',
            memory: '🃏 Знайди Пару',
            spell: '✏️ Напиши Слово',
            match: '🔗 З\'єднай Слова',
            sound: '🔊 Хто як говорить?'
        };
        return gameNames[gameType] || '';
    };

    // Render current game
    const renderGame = () => {
        // Class 2 games need category selection
        const class2Games = ['guess', 'memory', 'spell', 'match', 'sound'];

        // If there's an active live session but game isn't loaded yet, show loading
        if (activeLiveSession && !currentGame) {
            return (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '4em', marginBottom: '20px' }}>🎮</div>
                    <h2 style={{ marginBottom: '15px' }}>Завантаження гри...</h2>
                    <p style={{ fontSize: '1.2em', opacity: 0.9 }}>
                        Сесія: {activeLiveSession.title}
                    </p>
                    <div style={{
                        marginTop: '20px',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }}>⏳</div>
                </div>
            );
        }

        // For class 2 games, skip category selector if live session is active
        if (class2Games.includes(currentGame) && !selectedCategory && !activeLiveSession) {
            // Show category selector only in free play mode
            return (
                <CategorySelector
                    gameName={getGameName(currentGame)}
                    onSelectCategory={handleSelectCategory}
                    onBack={handleBackToMenu}
                />
            );
        }

        switch (currentGame) {
            // Class 2 games - pass category
            case 'guess':
                return <GuessGame onBack={handleBackToCategories} onShowHelp={handleShowHelp}
                                  updateScore={handleUpdateScore} category={selectedCategory}/>;

            case 'memory':
                return <MemoryGame onBack={handleBackToCategories} onShowHelp={handleShowHelp}
                                   updateScore={handleUpdateScore} category={selectedCategory}/>;

            case 'spell':
                return <SpellGame onBack={handleBackToCategories} onShowHelp={handleShowHelp}
                                  updateScore={handleUpdateScore} category={selectedCategory}/>;

            case 'match':
                return <MatchGame onBack={handleBackToCategories} onShowHelp={handleShowHelp}
                                  updateScore={handleUpdateScore} category={selectedCategory}/>;

            case 'sound':
                return <SoundGame onBack={handleBackToCategories} onShowHelp={handleShowHelp}
                                  updateScore={handleUpdateScore} category={selectedCategory}/>;

            // Class 4 games
            case 'binary':
                return <div>BinaryGame - Create component</div>;
            // return <BinaryGame onBack={handleBackToMenu} onShowHelp={handleShowHelp} updateScore={handleUpdateScore} />;

            case 'parts':
                return <div>PartsGame - Create component</div>;

            case 'algorithm':
                return <div>AlgorithmGame - Create component</div>;

            case 'coding':
                return <div>CodingGame - Create component</div>;

            case 'pattern':
                return <div>PatternGame - Create component</div>;

            // New Class 4 games
            case 'pixel':
                return <div>PixelArtGame - Create component</div>;

            case 'debug':
                return <DebugGame onBack={handleBackToMenu} onShowHelp={handleShowHelp}
                                  updateScore={handleUpdateScore}/>;

            case 'sort':
                return <div>SortGame - Create component</div>;

            default:
                // Don't show MainMenu if we're in a live session
                if (activeLiveSession) {
                    return (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            color: 'white'
                        }}>
                            <div style={{ fontSize: '4em', marginBottom: '20px' }}>🎮</div>
                            <h2 style={{ marginBottom: '15px' }}>Завантаження гри...</h2>
                            <p style={{ fontSize: '1.2em', opacity: 0.9 }}>
                                Сесія: {activeLiveSession.title}
                            </p>
                        </div>
                    );
                }

                return (
                    <MainMenu
                        playerClass={playerClass}
                        onStartGame={handleStartGame}
                    />
                );
        }
    };
    console.log('test')
    return (
        <>
            {/* Player Name Modal */}
            {showNameModal && (
                <PlayerNameModal onSubmit={handlePlayerSetup}/>
            )}

            {/* Help Modal */}
            {showHelp && (
                <HelpModal
                    gameType={helpGameType}
                    onClose={() => setShowHelp(false)}
                />
            )}

            {/* Main Container */}
            <div className="container">

                {/* Player Welcome */}
                {playerName && !showNameModal && (
                    <div className="player-welcome">
                        Привіт, {playerName}! 🎮 Ти в {playerClass} класі
                    </div>
                )}

                {/* Stats Bar */}
                {currentGame && (
                    <StatsBar
                        totalScore={totalScore}
                        streak={streak}
                    />
                )}

                {/* Achievements Display */}
                <div className="achievements" id="achievements-display"></div>

                {/* Game Area */}
                {renderGame()}
            </div>
        </>
    );
}

export default App;
