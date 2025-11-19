import { useState, useEffect } from 'react';
import World1Linear from './World1Linear';

export default function AlgorithmAdventure({ onBack, onShowHelp, updateScore }) {
  const [currentWorld, setCurrentWorld] = useState(1);
  const [worldProgress, setWorldProgress] = useState({
    world1: { completed: false, stars: 0, levelsCompleted: 0 },
    world2: { completed: false, stars: 0, levelsCompleted: 0 },
    world3: { completed: false, stars: 0, levelsCompleted: 0 },
    world4: { completed: false, stars: 0, levelsCompleted: 0 },
    world5: { completed: false, stars: 0, levelsCompleted: 0 },
  });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(true);

  const avatars = [
    { id: 'robot', name: 'Робот', icon: 'fa-robot', color: '#4a90e2' },
    { id: 'astronaut', name: 'Космонавт', icon: 'fa-user-astronaut', color: '#e24a4a' },
    { id: 'explorer', name: 'Дослідник', icon: 'fa-compass', color: '#f39c12' },
    { id: 'wizard', name: 'Чарівник', icon: 'fa-hat-wizard', color: '#9b59b6' },
  ];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelection(false);
  };

  const handleWorldComplete = (worldNum, stars, levelsCompleted) => {
    setWorldProgress(prev => ({
      ...prev,
      [`world${worldNum}`]: { completed: true, stars, levelsCompleted }
    }));
  };

  const handleBackToMap = () => {
    setCurrentWorld(null);
  };

  // Avatar Selection Screen
  if (showAvatarSelection) {
    return (
      <div style={{
        minHeight: '500px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white',
        textAlign: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          ← Назад
        </button>

        <div style={{ fontSize: '3em', marginBottom: '20px' }}>
          <i className="fas fa-gamepad"></i>
        </div>
        <h1 style={{ marginBottom: '15px', fontSize: '2.5em' }}>Алгоритм Пригод</h1>
        <p style={{ fontSize: '1.2em', opacity: 0.9, marginBottom: '40px' }}>
          Вибери свого героя для подорожі!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {avatars.map(avatar => (
            <div
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar)}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = avatar.color;
                e.currentTarget.style.boxShadow = `0 10px 30px ${avatar.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '4em', marginBottom: '10px', color: avatar.color }}>
                <i className={`fas ${avatar.icon}`}></i>
              </div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: avatar.color }}>
                {avatar.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // World Map Screen
  if (!currentWorld) {
    return (
      <div style={{
        minHeight: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '40px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            ← Назад
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2em', color: selectedAvatar.color }}>
              <i className={`fas ${selectedAvatar.icon}`}></i>
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{selectedAvatar.name}</div>
          </div>
        </div>

        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em' }}>
          <i className="fas fa-map"></i> Карта Світів
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* World 1 */}
          <WorldCard
            worldNum={1}
            title="Світ Лінійних Команд"
            icon="fa-star"
            progress={worldProgress.world1}
            unlocked={true}
            onClick={() => setCurrentWorld(1)}
          />

          {/* World 2 - Locked for now */}
          <WorldCard
            worldNum={2}
            title="Світ Вибору"
            icon="fa-code-branch"
            progress={worldProgress.world2}
            unlocked={worldProgress.world1.completed}
            onClick={() => worldProgress.world1.completed && setCurrentWorld(2)}
          />

          {/* World 3 - Locked */}
          <WorldCard
            worldNum={3}
            title="Світ Циклів"
            icon="fa-sync"
            progress={worldProgress.world3}
            unlocked={worldProgress.world2.completed}
            onClick={() => worldProgress.world2.completed && setCurrentWorld(3)}
          />

          {/* World 4 - Locked */}
          <WorldCard
            worldNum={4}
            title="Світ Логіки"
            icon="fa-puzzle-piece"
            progress={worldProgress.world4}
            unlocked={worldProgress.world3.completed}
            onClick={() => worldProgress.world3.completed && setCurrentWorld(4)}
          />

          {/* World 5 - Locked */}
          <WorldCard
            worldNum={5}
            title="Фінальний Виклик"
            icon="fa-trophy"
            progress={worldProgress.world5}
            unlocked={worldProgress.world4.completed}
            onClick={() => worldProgress.world4.completed && setCurrentWorld(5)}
          />
        </div>
      </div>
    );
  }

  // Render Current World
  if (currentWorld === 1) {
    return (
      <World1Linear
        avatar={selectedAvatar}
        onBack={handleBackToMap}
        onComplete={(stars, levelsCompleted) => handleWorldComplete(1, stars, levelsCompleted)}
        updateScore={updateScore}
      />
    );
  }

  // Other worlds coming soon
  return (
    <div style={{
      minHeight: '500px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '40px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h2>Світ {currentWorld} - Скоро!</h2>
      <button
        onClick={handleBackToMap}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          borderRadius: '10px',
          border: 'none',
          background: 'white',
          color: '#667eea',
          cursor: 'pointer',
          fontSize: '1.1em',
          fontWeight: 'bold'
        }}
      >
        Назад до карти
      </button>
    </div>
  );
}

function WorldCard({ worldNum, title, icon, progress, unlocked, onClick }) {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <span key={i} style={{ fontSize: '1.5em', color: i < progress.stars ? '#ffd700' : '#ffffff40' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div
      onClick={unlocked ? onClick : null}
      style={{
        background: unlocked ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)',
        borderRadius: '15px',
        padding: '25px',
        cursor: unlocked ? 'pointer' : 'not-allowed',
        transition: 'all 0.3s',
        border: '2px solid rgba(255,255,255,0.2)',
        opacity: unlocked ? 1 : 0.6
      }}
      onMouseEnter={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
        }
      }}
      onMouseLeave={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        }
      }}
    >
      <div style={{ fontSize: '3em', marginBottom: '10px' }}>
        {unlocked ? <i className={`fas ${icon}`}></i> : <i className="fas fa-lock"></i>}
      </div>
      <h3 style={{ marginBottom: '10px', fontSize: '1.2em' }}>{title}</h3>
      {unlocked && (
        <>
          <div style={{ marginBottom: '10px' }}>{renderStars()}</div>
          {progress.completed && (
            <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
              <i className="fas fa-check"></i> Пройдено
            </div>
          )}
        </>
      )}
      {!unlocked && (
        <div style={{ fontSize: '0.9em', opacity: 0.7 }}>
          Заблоковано
        </div>
      )}
    </div>
  );
}
