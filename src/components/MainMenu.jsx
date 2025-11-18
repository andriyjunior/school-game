export default function MainMenu({ playerClass, onStartGame }) {
  const getGamesForClass = (classNumber) => {
    if (classNumber === 2) {
      return [
        { id: 'guess', name: 'Вгадай Тварину', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { id: 'memory', name: 'Знайди Пару', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { id: 'spell', name: 'Напиши Слово', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { id: 'match', name: "З'єднай Слова", gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { id: 'sound', name: 'Хто як говорить?', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
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
    } else {
      return [];
    }
  };

  const games = getGamesForClass(playerClass);

  if (games.length === 0) {
    return (
      <div className="menu">
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.5em', color: '#667eea' }}>
          Ігри для цього класу ще в розробці! 🎮
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
