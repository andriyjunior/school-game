import { useState, useEffect } from 'react';
import { createLiveSession, getAllSessions } from '../../firebase/database';
import { categories } from '../../data/animals';

export default function LiveSessionCreator({ onSessionCreated, onCancel }) {
  const [formData, setFormData] = useState({
    gameType: '',
    playerClass: 2,
    category: 'all',
    participantMode: 'all', // 'all' or 'selected'
    selectedPlayers: [],
    title: ''
  });

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const sessions = await getAllSessions({ limit: 100 });
      const playerNames = [...new Set(sessions.map(s => s.playerName))].filter(Boolean);
      setAvailablePlayers(playerNames);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const games = {
    2: [
      { id: 'guess', name: '🔮 Вгадай Тварину', hasCategory: true },
      { id: 'memory', name: '🃏 Знайди Пару', hasCategory: true },
      { id: 'spell', name: '✏️ Напиши Слово', hasCategory: true },
      { id: 'match', name: '🔗 З\'єднай Слова', hasCategory: true },
      { id: 'sound', name: '🔊 Хто як говорить?', hasCategory: true }
    ],
    4: [
      { id: 'binary', name: '🔢 Двійкова система', hasCategory: false },
      { id: 'algorithm', name: '🎯 Алгоритми', hasCategory: false }
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gameType) {
      alert('Будь ласка, оберіть гру!');
      return;
    }

    if (!formData.title.trim()) {
      alert('Будь ласка, введіть назву сесії!');
      return;
    }

    if (formData.participantMode === 'selected' && formData.selectedPlayers.length === 0) {
      alert('Будь ласка, оберіть хоча б одного учня!');
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        title: formData.title,
        gameType: formData.gameType,
        playerClass: formData.playerClass,
        category: formData.category,
        participants: formData.participantMode === 'all' ? ['all'] : formData.selectedPlayers
      };

      console.log('Creating live session with data:', sessionData);
      const sessionId = await createLiveSession(sessionData);
      console.log('Live session created successfully! ID:', sessionId);
      alert('Сесію успішно створено! ID: ' + sessionId);
      onSessionCreated(sessionId);
    } catch (error) {
      console.error('Error creating live session:', error);
      alert('Помилка створення сесії: ' + error.message + '\n\nПеревірте консоль браузера (F12) для деталей.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerName) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(playerName)
        ? prev.selectedPlayers.filter(p => p !== playerName)
        : [...prev.selectedPlayers, playerName]
    }));
  };

  const currentGames = games[formData.playerClass] || [];
  const selectedGame = currentGames.find(g => g.id === formData.gameType);

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#667eea' }}>
        Створити Нову Сесію
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Назва сесії:
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Наприклад: Контрольна робота 2 клас"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1em',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Клас:
          </label>
          <select
            value={formData.playerClass}
            onChange={(e) => setFormData({ ...formData, playerClass: parseInt(e.target.value), gameType: '' })}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1em',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          >
            <option value={2}>2 клас</option>
            <option value={4}>4 клас</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Гра:
          </label>
          <select
            value={formData.gameType}
            onChange={(e) => setFormData({ ...formData, gameType: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1em',
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          >
            <option value="">Оберіть гру...</option>
            {currentGames.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        {selectedGame && selectedGame.hasCategory && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Категорія:
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '1em',
                borderRadius: '8px',
                border: '2px solid #ddd'
              }}
            >
              <option value="all">Всі тварини</option>
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Учасники:
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, participantMode: 'all', selectedPlayers: [] })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: formData.participantMode === 'all' ? '3px solid #667eea' : '2px solid #ddd',
                background: formData.participantMode === 'all' ? '#e7f0ff' : 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Всі учні
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, participantMode: 'selected' })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: formData.participantMode === 'selected' ? '3px solid #667eea' : '2px solid #ddd',
                background: formData.participantMode === 'selected' ? '#e7f0ff' : 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Обрані учні
            </button>
          </div>

          {formData.participantMode === 'selected' && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '10px'
            }}>
              {availablePlayers.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center' }}>
                  Поки що немає учнів
                </p>
              ) : (
                availablePlayers.map(player => (
                  <label
                    key={player}
                    style={{
                      display: 'block',
                      padding: '8px',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      background: formData.selectedPlayers.includes(player) ? '#e7f0ff' : 'transparent'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedPlayers.includes(player)}
                      onChange={() => togglePlayer(player)}
                      style={{ marginRight: '10px' }}
                    />
                    {player}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              background: '#ddd',
              fontSize: '1.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            Скасувати
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Створення...' : 'Створити Сесію'}
          </button>
        </div>
      </form>
    </div>
  );
}
