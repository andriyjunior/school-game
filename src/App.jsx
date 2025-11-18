import { useState } from 'react';
import PlayerNameModal from './components/PlayerNameModal';
import HelpModal from './components/HelpModal';
import MainMenu from './components/MainMenu';
import StatsBar from './components/StatsBar';

// Import game components as you create them
// import GuessGame from './components/games/class2/GuessGame';
// import BinaryGame from './components/games/class4/BinaryGame';
import DebugGame from './components/games/class4/DebugGame';
// etc...

function App() {
  // Player state
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState(null);
  const [showNameModal, setShowNameModal] = useState(true);

  // Game state
  const [currentGame, setCurrentGame] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Help modal state
  const [showHelp, setShowHelp] = useState(false);
  const [helpGameType, setHelpGameType] = useState('');

  // Handle player setup
  const handlePlayerSetup = (name, classNumber) => {
    setPlayerName(name);
    setPlayerClass(classNumber);
    setShowNameModal(false);
  };

  // Handle game selection
  const handleStartGame = (gameType) => {
    setCurrentGame(gameType);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setCurrentGame('');
  };

  // Handle score update
  const handleUpdateScore = (points) => {
    setTotalScore(prev => prev + points);
    setStreak(prev => prev + 1);
  };

  // Handle show help
  const handleShowHelp = (gameType) => {
    setHelpGameType(gameType);
    setShowHelp(true);
  };

  // Render current game
  const renderGame = () => {
    // Add game components as you create them
    switch (currentGame) {
      // Class 2 games
      case 'guess':
        return <div>GuessGame - Create component</div>;
        // return <GuessGame onBack={handleBackToMenu} onShowHelp={handleShowHelp} updateScore={handleUpdateScore} />;

      case 'memory':
        return <div>MemoryGame - Create component</div>;

      case 'spell':
        return <div>SpellGame - Create component</div>;

      case 'match':
        return <div>MatchGame - Create component</div>;

      case 'sound':
        return <div>SoundGame - Create component</div>;

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
        return <DebugGame onBack={handleBackToMenu} onShowHelp={handleShowHelp} updateScore={handleUpdateScore} />;

      case 'sort':
        return <div>SortGame - Create component</div>;

      default:
        return (
          <MainMenu
            playerClass={playerClass}
            onStartGame={handleStartGame}
          />
        );
    }
  };

  return (
    <>
      {/* Player Name Modal */}
      {showNameModal && (
        <PlayerNameModal onSubmit={handlePlayerSetup} />
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
        <h1>Навчальні Ігри</h1>

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
