export default function MainMenu({ playerClass, onStartGame }) {
  const getGamesForClass = (classNumber) => {
    // Classes 1-6 have games
    if (classNumber === 1) {
      return [
        { id: 'guess', name: 'Вгадай Тварину', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'memory', name: 'Знайди Пару', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 'spell', name: 'Напиши Слово', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
      ];
    } else if (classNumber === 2) {
      return [
        { id: 'guess', name: 'Вгадай Тварину', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'memory', name: 'Знайди Пару', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 'spell', name: 'Напиши Слово', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { id: 'match', name: "З'єднай Слова", gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { id: 'sound', name: 'Хто як говорить?', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
      ];
    } else if (classNumber === 3) {
      return [
        { id: 'algorithm-adventure', name: '🎮 Алгоритм Пригод', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      ];
    } else if (classNumber === 4) {
      return [
        { id: 'binary', name: '🔢 Двійкові числа', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'parts', name: '🖥️ Частини комп\'ютера', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 'algorithm', name: '📝 Алгоритми', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { id: 'coding', name: '💻 Основи програмування', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { id: 'pattern', name: '🧩 Закономірності', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { id: 'pixel', name: '🎨 Піксельна графіка', gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)' },
        { id: 'debug', name: '🐛 Детектив багів', gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)' },
        { id: 'sort', name: '📊 Сортування чисел', gradient: 'linear-gradient(135deg, #22c1c3 0%, #fdbb2d 100%)' }
      ];
    } else if (classNumber === 5 || classNumber === 6) {
      return [
        { id: 'algorithm-adventure', name: '🎮 Алгоритм Пригод', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'binary', name: '🔢 Двійкові числа', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'algorithm', name: '📝 Алгоритми', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
      ];
    } else {
      // Classes 7-11 don't have games - only tests
      return null;
    }
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
