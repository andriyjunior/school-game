import { useState } from 'react';
import useTheme from '../hooks/useTheme';

export default function ThemeSwitcher() {
  const { themeName, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--theme-gradient-primary)',
          border: 'none',
          borderRadius: '12px',
          padding: '8px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'white',
          fontSize: '0.9em',
          fontWeight: 'bold',
          boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s'
        }}
      >
        <span style={{ fontSize: '1.2em' }}>🎨</span>
        <span>Тема</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998
            }}
          />

          {/* Theme options */}
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              marginBottom: '8px',
              background: 'white',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              zIndex: 999,
              minWidth: '140px'
            }}
          >
            {availableThemes.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  changeTheme(t.key);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: themeName === t.key
                    ? 'var(--theme-gradient-primary)'
                    : 'transparent',
                  color: themeName === t.key ? 'white' : 'var(--theme-text)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.95em',
                  fontWeight: themeName === t.key ? 'bold' : 'normal',
                  transition: 'all 0.2s',
                  marginBottom: '4px'
                }}
              >
                <span style={{ fontSize: '1.3em' }}>{t.emoji}</span>
                <span>{t.name}</span>
                {themeName === t.key && (
                  <span style={{ marginLeft: 'auto' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
