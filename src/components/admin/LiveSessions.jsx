import { useState, useEffect } from 'react';
import { getAllLiveSessions } from '../../firebase/database';
import LiveSessionCreator from './LiveSessionCreator';
import LiveSessionMonitor from './LiveSessionMonitor';
import './LiveSessions.css';

export default function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'create', 'monitor'
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed', 'paused'

  useEffect(() => {
    loadSessions();
    // Refresh sessions every 30 seconds (reduced from 5s to save database reads)
    const interval = setInterval(loadSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      console.log('Loading all live sessions...');
      const data = await getAllLiveSessions();
      console.log('Loaded all live sessions:', data);
      setSessions(data);
    } catch (error) {
      console.error('Error loading live sessions:', error);
      alert('Помилка завантаження сесій: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    setView('create');
  };

  const handleSessionCreated = (sessionId) => {
    setView('monitor');
    setSelectedSessionId(sessionId);
    loadSessions();
  };

  const handleMonitorSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setView('monitor');
  };

  const handleCloseMonitor = () => {
    setView('list');
    setSelectedSessionId(null);
    loadSessions();
  };

  const handleCancelCreate = () => {
    setView('list');
  };

  if (view === 'create') {
    return (
      <LiveSessionCreator
        onSessionCreated={handleSessionCreated}
        onCancel={handleCancelCreate}
      />
    );
  }

  if (view === 'monitor' && selectedSessionId) {
    return (
      <LiveSessionMonitor
        sessionId={selectedSessionId}
        onClose={handleCloseMonitor}
      />
    );
  }

  return (
    <div className="live-sessions-container">
      <div className="live-sessions-header">
        <h2 className="live-sessions-title">
          📡 Живі Сесії
        </h2>
        <button
          onClick={handleCreateSession}
          className="create-session-btn"
        >
          ➕ Створити Нову Сесію
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {['all', 'active', 'completed', 'paused'].map(status => {
          const count = status === 'all'
            ? sessions.length
            : sessions.filter(s => s.status === status).length;
          const labels = {
            all: 'Всі',
            active: 'Активні',
            completed: 'Завершені',
            paused: 'Призупинені'
          };

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
            >
              {labels[status]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <p>Завантаження...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3 className="empty-title">
            Немає активних сесій
          </h3>
          <p className="empty-description">
            Створіть нову сесію, щоб почати моніторинг
          </p>
          <button
            onClick={handleCreateSession}
            className="create-session-btn"
          >
            ➕ Створити Першу Сесію
          </button>
        </div>
      ) : (
        <div className="sessions-grid">
          {sessions
            .filter(session => filterStatus === 'all' || session.status === filterStatus)
            .map(session => {
              const participantsCount = Object.keys(session.results || {}).length;
              const isAll = session.participants && session.participants[0] === 'all';

              const statusColors = {
                active: { bg: '#e7f0ff', border: '#667eea', badge: '#28a745', badgeText: '✓ Активна' },
                completed: { bg: '#f8f9fa', border: '#6c757d', badge: '#6c757d', badgeText: '✓ Завершена' },
                paused: { bg: '#fff3cd', border: '#ffc107', badge: '#ff9800', badgeText: '⏸ Призупинена' }
              };

              const colors = statusColors[session.status] || statusColors.active;

              return (
                <div
                  key={session.id}
                  onClick={() => handleMonitorSession(session.id)}
                  className="session-card"
                  style={{
                    borderColor: colors.border,
                    background: `linear-gradient(135deg, ${colors.bg} 0%, #ffffff 100%)`,
                    opacity: session.status === 'completed' ? 0.85 : 1
                  }}
                >
                  <div className="session-header">
                    <h3 className="session-title">
                      {session.title}
                    </h3>
                    <div className="status-badge" style={{ background: colors.badge }}>
                      {colors.badgeText}
                    </div>
                  </div>

                  <div className="session-tags">
                    <div className="session-tag" style={{ background: '#667eea' }}>
                      📝 Тест
                    </div>
                    <div className="session-tag" style={{ background: '#764ba2' }}>
                      {session.playerClass} клас
                    </div>
                    {session.category && session.category !== 'all' && (
                      <div className="session-tag" style={{ background: '#f5576c' }}>
                        {session.category}
                      </div>
                    )}
                  </div>

                  <div className="session-info">
                    <div className="session-participants">
                      Учасників: <strong>{participantsCount}</strong>
                      {isAll && <span style={{ color: '#667eea' }}> (Всі учні)</span>}
                    </div>
                    {!isAll && session.participants && (
                      <div className="session-assigned">
                        Призначено: {session.participants.length} учн{session.participants.length === 1 ? 'я' : 'ів'}
                      </div>
                    )}
                  </div>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
}
