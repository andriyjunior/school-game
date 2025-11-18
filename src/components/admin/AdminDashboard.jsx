import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getAnalytics, getAllSessions, getPlayerStats } from '../../firebase/database';
import LiveSessions from './LiveSessions';
import './AdminDashboard.css';

function AdminDashboard() {
  const [view, setView] = useState('liveSessions'); // overview, sessions, players, analytics, liveSessions
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading admin data...');
      const [analyticsData, sessionsData] = await Promise.all([
        getAnalytics(),
        getAllSessions({ limit: 100 })
      ]);
      console.log('Analytics data:', analyticsData);
      console.log('Sessions data:', sessionsData);
      setAnalytics(analyticsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert(`Помилка завантаження даних: ${error.message}\n\nПереконайтеся, що:\n1. Ви увійшли як адміністратор\n2. Firestore налаштовано правильно\n3. Правила безпеки дозволяють читання`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleExportCSV = () => {
    // Convert sessions to CSV
    const headers = ['Player Name', 'Class', 'Start Time', 'Total Score', 'Max Streak', 'Achievements'];
    const rows = sessions.map(s => [
      s.playerName,
      s.playerClass,
      s.startTime?.toDate?.()?.toLocaleString() || 'N/A',
      s.totalScore || 0,
      s.maxStreak || 0,
      (s.achievementsUnlocked || []).join('; ')
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sessions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter sessions
  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.playerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || s.playerClass === parseInt(filterClass);
    return matchesSearch && matchesClass;
  });

  // Get unique player names
  const uniquePlayers = [...new Set(sessions.map(s => s.playerName))];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <h2>⏳ Завантаження даних...</h2>
          <p>Це може зайняти кілька секунд. Якщо завантаження триває довго, перевірте консоль браузера (F12) для помилок.</p>
        </div>
      </div>
    );
  }

  // Check if there's no data
  if (sessions.length === 0) {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>📊 Адмін-панель</h1>
          <button onClick={handleLogout} className="logout-button">
            Вийти 🚪
          </button>
        </header>
        <div className="no-data" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>📭 Немає даних</h2>
          <p>Поки що ніхто не грав в ігри.</p>
          <p>Щоб побачити дані, учні повинні:</p>
          <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
            <li>Зайти на головну сторінку</li>
            <li>Ввести своє ім'я та клас</li>
            <li>Зіграти в ігри</li>
          </ol>
          <button onClick={loadData} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1em' }}>
            🔄 Оновити
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>📊 Адмін-панель</h1>
        <button onClick={handleLogout} className="logout-button">
          Вийти 🚪
        </button>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button
          className={view === 'liveSessions' ? 'active' : ''}
          onClick={() => setView('liveSessions')}
        >
          📡 Живі Сесії
        </button>
        <button
          className={view === 'overview' ? 'active' : ''}
          onClick={() => setView('overview')}
        >
          📈 Огляд
        </button>
        <button
          className={view === 'sessions' ? 'active' : ''}
          onClick={() => setView('sessions')}
        >
          🎮 Сесії
        </button>
        <button
          className={view === 'players' ? 'active' : ''}
          onClick={() => setView('players')}
        >
          👥 Учні
        </button>
        <button
          className={view === 'analytics' ? 'active' : ''}
          onClick={() => setView('analytics')}
        >
          📊 Аналітика
        </button>
      </nav>

      {/* Content */}
      <div className="admin-content">
        {view === 'liveSessions' && (
          <LiveSessions />
        )}

        {view === 'overview' && analytics && (
          <OverviewView analytics={analytics} onRefresh={loadData} />
        )}

        {view === 'sessions' && (
          <SessionsView
            sessions={filteredSessions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            onExport={handleExportCSV}
          />
        )}

        {view === 'players' && (
          <PlayersView players={uniquePlayers} sessions={sessions} />
        )}

        {view === 'analytics' && analytics && (
          <AnalyticsView analytics={analytics} sessions={sessions} />
        )}
      </div>
    </div>
  );
}

// Overview View Component
function OverviewView({ analytics, onRefresh }) {
  return (
    <div className="overview-view">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{analytics.totalPlayers}</div>
          <div className="stat-label">Всього учнів</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-value">{analytics.totalSessions}</div>
          <div className="stat-label">Всього сесій</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{analytics.totalGames}</div>
          <div className="stat-label">Зіграно ігор</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{analytics.averageScore}</div>
          <div className="stat-label">Середній бал</div>
        </div>
      </div>

      <button onClick={onRefresh} className="refresh-button">
        🔄 Оновити дані
      </button>

      <h3>Останні сесії</h3>
      <div className="recent-sessions">
        {analytics.recentSessions.map(session => (
          <div key={session.id} className="session-card-mini">
            <strong>{session.playerName}</strong> ({session.playerClass} клас)
            <br />
            Бали: {session.totalScore || 0} | Серія: {session.maxStreak || 0}
          </div>
        ))}
      </div>
    </div>
  );
}

// Sessions View Component
function SessionsView({ sessions, searchTerm, setSearchTerm, filterClass, setFilterClass, onExport }) {
  return (
    <div className="sessions-view">
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Пошук за іменем..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="filter-select"
        >
          <option value="all">Всі класи</option>
          <option value="2">2 клас</option>
          <option value="4">4 клас</option>
        </select>

        <button onClick={onExport} className="export-button">
          📥 Експорт CSV
        </button>
      </div>

      <div className="sessions-table">
        <table>
          <thead>
            <tr>
              <th>Ім'я</th>
              <th>Клас</th>
              <th>Час початку</th>
              <th>Бали</th>
              <th>Серія</th>
              <th>Досягнення</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td>{session.playerName}</td>
                <td>{session.playerClass}</td>
                <td>{session.startTime?.toDate?.()?.toLocaleString() || 'N/A'}</td>
                <td>{session.totalScore || 0}</td>
                <td>{session.maxStreak || 0}</td>
                <td>{(session.achievementsUnlocked || []).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Players View Component
function PlayersView({ players, sessions }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  const handlePlayerClick = async (playerName) => {
    setSelectedPlayer(playerName);
    try {
      const stats = await getPlayerStats(playerName);
      setPlayerStats(stats);
    } catch (error) {
      console.error('Error loading player stats:', error);
    }
  };

  return (
    <div className="players-view">
      <div className="players-list">
        <h3>Список учнів ({players.length})</h3>
        {players.map(player => (
          <button
            key={player}
            className={`player-item ${selectedPlayer === player ? 'active' : ''}`}
            onClick={() => handlePlayerClick(player)}
          >
            👤 {player}
          </button>
        ))}
      </div>

      <div className="player-details">
        {playerStats ? (
          <>
            <h3>📊 Статистика: {playerStats.playerName}</h3>
            <div className="player-stats">
              <p><strong>Всього сесій:</strong> {playerStats.totalSessions}</p>
              <p><strong>Загальний бал:</strong> {playerStats.totalScore}</p>
              <p><strong>Середній бал:</strong> {playerStats.averageScore}</p>
              <p><strong>Макс серія:</strong> {playerStats.maxStreak}</p>
              <p><strong>Досягнення:</strong> {playerStats.achievements.length}</p>
            </div>

            <h4>Останні сесії</h4>
            <div className="player-sessions">
              {playerStats.recentSessions.map(session => (
                <div key={session.id} className="session-card">
                  <p>🕐 {session.startTime?.toDate?.()?.toLocaleString()}</p>
                  <p>⭐ Бали: {session.totalScore || 0}</p>
                  <p>🔥 Серія: {session.maxStreak || 0}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-selection">
            Оберіть учня зі списку
          </div>
        )}
      </div>
    </div>
  );
}

// Analytics View Component
function AnalyticsView({ analytics, sessions }) {
  return (
    <div className="analytics-view">
      <h3>📊 Розподіл за іграми</h3>
      <div className="chart">
        {Object.entries(analytics.gameTypeCounts).map(([game, count]) => (
          <div key={game} className="bar">
            <div className="bar-label">{game}</div>
            <div className="bar-fill" style={{ width: `${(count / analytics.totalGames) * 100}%` }}>
              {count}
            </div>
          </div>
        ))}
      </div>

      <h3>📊 Розподіл за класами</h3>
      <div className="chart">
        {Object.entries(analytics.classCounts).map(([cls, count]) => (
          <div key={cls} className="bar">
            <div className="bar-label">{cls} клас</div>
            <div className="bar-fill" style={{ width: `${(count / analytics.totalSessions) * 100}%` }}>
              {count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
