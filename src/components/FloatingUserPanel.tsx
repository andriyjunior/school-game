import { useState } from 'react';

interface FloatingUserPanelProps {
  playerName: string;
  playerClass: number;
  totalScore: number;
  streak: number;
  onLogout: () => void;
}

export default function FloatingUserPanel({
  playerName,
  playerClass,
  totalScore,
  streak,
  onLogout
}: FloatingUserPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating compact bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '25px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          color: 'white',
          fontSize: '0.9em'
        }}
      >
        <span style={{ fontSize: '1.2em' }}>👤</span>
        <span style={{ fontWeight: 'bold' }}>⭐ {totalScore}</span>
        {streak > 0 && <span>🔥 {streak}</span>}
        <i
          className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}
          style={{ fontSize: '0.8em', opacity: 0.8 }}
        />
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsExpanded(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              top: '60px',
              right: '15px',
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              minWidth: '280px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              zIndex: 1001,
              animation: 'slideIn 0.2s ease'
            }}
          >
            {/* User info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5em'
              }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#333' }}>
                  {playerName}
                </div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>
                  {playerClass} клас
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>⭐</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.3em', color: '#667eea' }}>
                  {totalScore}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>Балів</div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>🔥</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.3em', color: '#f5576c' }}>
                  {streak}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>Серія</div>
              </div>
            </div>

            {/* Achievements preview */}
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '15px'
            }}>
              <div style={{
                fontSize: '0.9em',
                color: '#666',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                🏆 Досягнення
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {totalScore >= 100 && <span title="Перші 100 балів">🌟</span>}
                {totalScore >= 500 && <span title="500 балів">⭐</span>}
                {totalScore >= 1000 && <span title="1000 балів">🏅</span>}
                {streak >= 3 && <span title="Серія 3+">🔥</span>}
                {streak >= 5 && <span title="Серія 5+">💪</span>}
                {streak >= 10 && <span title="Серія 10+">🚀</span>}
                {totalScore < 100 && streak < 3 && (
                  <span style={{ color: '#999', fontSize: '0.9em' }}>
                    Грай щоб отримати!
                  </span>
                )}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                if (confirm('Вийти з акаунту? Ваші результати збережені.')) {
                  onLogout();
                  setIsExpanded(false);
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '2px solid #e0e0e0',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#666',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-sign-out-alt" />
              Вийти
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
