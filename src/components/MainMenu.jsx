export default function MainMenu({ playerClass, onStartGame }) {
  const getGamesForClass = (classNumber) => {
    // All classes (1-11) only have tests - no games
    return null;
  };

  const games = getGamesForClass(playerClass);

  // For classes 7-11, show message about tests
  if (games === null) {
    return (
      <div className="menu" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          maxWidth: '600px'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>👨‍🏫</div>
          <div style={{ fontSize: '1.5em', color: '#667eea', marginBottom: '15px', fontWeight: 'bold' }}>
            У вас поки що немає тестів
          </div>
          <div style={{ fontSize: '1.1em', color: '#666', lineHeight: '1.6' }}>
            Зверніться до вчителя для доступу до тестів!
          </div>
        </div>
      </div>
    );
  }

  // For classes 1-6 with no games yet
  if (games.length === 0) {
    return (
      <div className="menu">
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.5em', color: '#667eea' }}>
          Ігри для {playerClass} класу ще в розробці! 🎮
        </div>
      </div>
    );
  }

  return (
    <div className="menu">
      {games.map(game => (
        <button
          key={game.id}
          className="menu-btn"
          style={{ background: game.gradient }}
          onClick={() => onStartGame(game.id)}
        >
          {game.name}
        </button>
      ))}
    </div>
  );
}
