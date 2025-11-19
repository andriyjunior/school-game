import { useState, useEffect } from 'react';
import { subscribeLiveSession, endLiveSession, deleteLiveSession } from '../../firebase/database';
import { getTestById } from '../../firebase/testDatabase';

export default function LiveSessionMonitor({ sessionId, onClose }) {
  const [sessionData, setSessionData] = useState(null);
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeLiveSession(sessionId, (data) => {
      setSessionData(data);
      setLoading(false);

      // Load test data if we have a testId
      if (data?.testId) {
        getTestById(data.testId)
          .then(test => setTestData(test))
          .catch(err => console.error('Error loading test:', err));
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleEndSession = async () => {
    if (confirm('Завершити цю сесію?')) {
      try {
        await endLiveSession(sessionId);
        alert('Сесію завершено!');
      } catch (error) {
        console.error('Error ending session:', error);
        alert('Помилка завершення сесії');
      }
    }
  };

  const handleDeleteSession = async () => {
    if (confirm('Видалити цю сесію? Це не можна буде відмінити.')) {
      try {
        await deleteLiveSession(sessionId);
        alert('Сесію видалено!');
        onClose();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Помилка видалення сесії');
      }
    }
  };

  // Convert percentage to Ukrainian 12-point scale
  const getUkrainianGrade = (percentage) => {
    if (percentage >= 100) return 12;
    if (percentage >= 90) return 11;
    if (percentage >= 82) return 10;
    if (percentage >= 75) return 9;
    if (percentage >= 67) return 8;
    if (percentage >= 60) return 7;
    if (percentage >= 53) return 6;
    if (percentage >= 46) return 5;
    if (percentage >= 39) return 4;
    if (percentage >= 25) return 3;
    if (percentage >= 12) return 2;
    return 1;
  };

  // Get grade color
  const getGradeColor = (grade) => {
    if (grade >= 10) return '#28a745'; // Green for excellent
    if (grade >= 7) return '#ffc107'; // Yellow for good
    if (grade >= 4) return '#ff9800'; // Orange for satisfactory
    return '#dc3545'; // Red for poor
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2em' }}>⏳</div>
        <p>Завантаження...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2em' }}>❌</div>
        <p>Сесію не знайдено</p>
        <button onClick={onClose} style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          background: '#667eea',
          color: 'white',
          cursor: 'pointer'
        }}>
          Повернутися
        </button>
      </div>
    );
  }

  const results = sessionData.results || {};
  const playerNames = Object.keys(results);
  const isActive = sessionData.status === 'active';

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#667eea', margin: 0 }}>
          {sessionData.title}
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#ddd',
            cursor: 'pointer'
          }}
        >
          ✕ Закрити
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '15px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Статус</div>
          <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginTop: '5px' }}>
            {isActive ? '🟢 Активна' : '⚫ Завершена'}
          </div>
        </div>

        <div style={{
          padding: '15px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Клас</div>
          <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginTop: '5px' }}>
            {sessionData.playerClass}
          </div>
        </div>

        <div style={{
          padding: '15px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white'
        }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Учасників</div>
          <div style={{ fontSize: '1.3em', fontWeight: 'bold', marginTop: '5px' }}>
            {playerNames.length}
          </div>
        </div>
      </div>

      {sessionData.participants && sessionData.participants.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Призначено для:
          </div>
          <div>
            {sessionData.participants[0] === 'all' ? (
              <span style={{ color: '#667eea', fontWeight: 'bold' }}>Всі учні</span>
            ) : (
              sessionData.participants.join(', ')
            )}
          </div>
        </div>
      )}

      {/* Ukrainian Grades Summary Table */}
      {playerNames.length > 0 && testData && (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>
            🎓 Оцінки (12-бальна система):
          </h3>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '2px solid #e0e0e0',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>№</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Учень</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Балів</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>%</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Оцінка (12-бальна)</th>
                </tr>
              </thead>
              <tbody>
                {playerNames
                  .map(playerName => {
                    const playerResult = results[playerName];
                    const score = playerResult.score || 0;
                    const maxScore = testData.questions.reduce((sum, q) => sum + (q.points || 1), 0);
                    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                    const ukrainianGrade = getUkrainianGrade(percentage);

                    return {
                      name: playerName,
                      score,
                      percentage,
                      ukrainianGrade
                    };
                  })
                  .sort((a, b) => b.score - a.score) // Sort by score descending
                  .map((player, index) => (
                    <tr
                      key={player.name}
                      style={{
                        borderBottom: '1px solid #e0e0e0',
                        background: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}
                    >
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#666' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>
                        👤 {player.name}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#667eea' }}>
                        {player.score}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                        {player.percentage}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '8px 20px',
                          borderRadius: '25px',
                          background: getGradeColor(player.ukrainianGrade),
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.1em',
                          minWidth: '50px'
                        }}>
                          {player.ukrainianGrade}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: '15px', color: '#333' }}>
        📊 Результати в реальному часі:
      </h3>

      {playerNames.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '10px',
          color: '#666'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>⏳</div>
          <p>Очікування на учнів...</p>
          <p style={{ fontSize: '0.9em' }}>
            Результати з'являться, коли учні почнуть тест
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {playerNames.map(playerName => {
            const playerResult = results[playerName];
            const answersCount = playerResult.answers?.length || 0;
            const score = playerResult.score || 0;

            return (
              <div
                key={playerName}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #ddd',
                  background: '#fff',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>
                    👤 {playerName}
                  </div>
                  <div style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {score} балів
                  </div>
                </div>

                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                  Відповідей: {answersCount}
                </div>

                {playerResult.answers && playerResult.answers.length > 0 && (
                  <div style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    marginTop: '10px',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    {playerResult.answers.map((answer, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px',
                          marginBottom: '5px',
                          borderRadius: '5px',
                          background: answer.correct ? '#d4edda' : '#f8d7da',
                          border: answer.correct ? '1px solid #28a745' : '1px solid #dc3545',
                          fontSize: '0.9em'
                        }}
                      >
                        <span>{answer.correct ? '✅' : '❌'}</span>
                        <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                          {answer.question || 'Питання'}
                        </span>
                        {answer.points && (
                          <span style={{ float: 'right', color: '#667eea', fontWeight: 'bold' }}>
                            +{answer.points}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
        {isActive && (
          <button
            onClick={handleEndSession}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ⏹️ Завершити Сесію
          </button>
        )}
        <button
          onClick={handleDeleteSession}
          style={{
            flex: 1,
            padding: '15px',
            borderRadius: '10px',
            border: 'none',
            background: '#dc3545',
            color: 'white',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🗑️ Видалити Сесію
        </button>
      </div>
    </div>
  );
}
