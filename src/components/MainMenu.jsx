export default function MainMenu({ playerClass, onStartGame }) {
  const getGamesForClass = (classNumber) => {
    // Class 1 - basic games (coming soon)
    if (classNumber === 1) {
      return {
        games: [],
        title: '1 клас',
        description: 'Базові ігри для найменших: лічба, кольори, форми',
        emoji: '🎨'
      };
    }
    // Class 2 has computer science games
    if (classNumber === 2) {
      return {
        games: [
          { id: 'algorithm-game', name: '🎯 Алгоритм Пригод', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', desc: 'Вчимося складати алгоритми крок за кроком' },
          { id: 'pattern-game', name: '🔮 Візерунки', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', desc: 'Знаходимо закономірності та продовжуємо ряди' },
          { id: 'binary-game', name: '💡 Лампочки', gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', desc: 'Вивчаємо двійковий код через лампочки' },
          { id: 'bug-hunter', name: '🐛 Шукач Багів', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', desc: 'Шукаємо помилки в послідовностях' }
        ],
        title: '2 клас',
        description: 'Основи інформатики: алгоритми, візерунки, двійковий код',
        emoji: '🖥️'
      };
    }
    // Class 3 - intermediate games (coming soon)
    if (classNumber === 3) {
      return {
        games: [],
        title: '3 клас',
        description: 'Логічні завдання та основи програмування',
        emoji: '🧩'
      };
    }
    // Class 4 has advanced CS games
    if (classNumber === 4) {
      return {
        games: [
          { id: 'sorting-game', name: '📊 Сортування', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', desc: 'Вчимося сортувати дані різними способами' },
          { id: 'loop-game', name: '🔄 Цикли', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', desc: 'Розуміємо як працюють цикли в програмуванні' },
          { id: 'condition-game', name: '🔀 Умови', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', desc: 'Вивчаємо умовні оператори та логіку' }
        ],
        title: '4 клас',
        description: 'Поглиблена інформатика: сортування, цикли, умови',
        emoji: '💻'
      };
    }
    // All other classes (5-11) only have tests - no games
    return null;
  };

  const classData = getGamesForClass(playerClass);

  // For classes 5-11, show message about tests
  if (classData === null) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '3em', marginBottom: '15px' }}>👨‍🏫</div>
        <h2 style={{ color: '#667eea', marginBottom: '10px' }}>{playerClass} клас</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Зверніться до вчителя для доступу до тестів!
        </p>
      </div>
    );
  }

  // Header with class info
  const Header = () => (
    <div style={{
      textAlign: 'center',
      marginBottom: '25px',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderRadius: '15px'
    }}>
      <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{classData.emoji}</div>
      <h2 style={{
        color: '#667eea',
        fontSize: '1.8em',
        marginBottom: '8px'
      }}>
        {classData.title}
      </h2>
      <p style={{
        color: '#666',
        fontSize: '1.1em',
        margin: 0
      }}>
        {classData.description}
      </p>
    </div>
  );

  // For classes with no games yet (1, 3)
  if (classData.games.length === 0) {
    return (
      <div>
        <Header />
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '2em', marginBottom: '15px' }}>🚧</div>
          <div style={{ fontSize: '1.3em', color: '#667eea', marginBottom: '10px' }}>
            Ігри в розробці!
          </div>
          <div style={{ color: '#666' }}>
            Скоро тут з'являться цікаві завдання
          </div>
        </div>
      </div>
    );
  }

  // Classes with games (2, 4)
  return (
    <div>
      <Header />
      <div className="menu">
        {classData.games.map(game => (
          <button
            key={game.id}
            className="menu-btn"
            style={{ background: game.gradient }}
            onClick={() => onStartGame(game.id)}
            title={game.desc}
          >
            <div>{game.name}</div>
            <div style={{
              fontSize: '0.7em',
              opacity: 0.9,
              marginTop: '5px',
              fontWeight: 'normal'
            }}>
              {game.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
