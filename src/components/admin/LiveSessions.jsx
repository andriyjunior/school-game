import { useState, useEffect } from 'react';
import { getAllLiveSessions } from '../../firebase/database';
import LiveSessionCreator from './LiveSessionCreator';
import LiveSessionMonitor from './LiveSessionMonitor';

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
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#667eea' }}>
          📡 Живі Сесії
        </h2>
        <button
          onClick={handleCreateSession}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ➕ Створити Нову Сесію
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
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
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: filterStatus === status ? '2px solid #667eea' : '2px solid #ddd',
                background: filterStatus === status ? '#e7f0ff' : 'white',
                color: filterStatus === status ? '#667eea' : '#666',
                fontWeight: filterStatus === status ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '0.95em'
              }}
            >
              {labels[status]} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2em' }}>⏳</div>
          <p>Завантаження...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: '#f8f9fa',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>📭</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            Немає активних сесій
          </h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            Створіть нову сесію, щоб почати моніторинг
          </p>
          <button
            onClick={handleCreateSession}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ➕ Створити Першу Сесію
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
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
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${colors.border}`,
                    background: `linear-gradient(135deg, ${colors.bg} 0%, #ffffff 100%)`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    opacity: session.status === 'completed' ? 0.85 : 1,
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#667eea',
                    fontSize: '1.2em',
                    flex: 1
                  }}>
                    {session.title}
                  </h3>
                  <div style={{
                    background: colors.badge,
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: 'bold'
                  }}>
                    {colors.badgeText}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '10px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: '#667eea',
                    color: 'white',
                    fontSize: '0.9em'
                  }}>
                    📝 Тест
                  </div>
                  <div style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: '#764ba2',
                    color: 'white',
                    fontSize: '0.9em'
                  }}>
                    {session.playerClass} клас
                  </div>
                  {session.category && session.category !== 'all' && (
                    <div style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: '#f5576c',
                      color: 'white',
                      fontSize: '0.9em'
                    }}>
                      {session.category}
                    </div>
                  )}
                </div>

                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #ddd'
                }}>
                  <div style={{ color: '#666', fontSize: '0.9em', marginBottom: '5px' }}>
                    Учасників: <strong>{participantsCount}</strong>
                    {isAll && <span style={{ color: '#667eea' }}> (Всі учні)</span>}
                  </div>
                  {!isAll && session.participants && (
                    <div style={{ color: '#999', fontSize: '0.85em' }}>
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
