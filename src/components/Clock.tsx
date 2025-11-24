import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time in Ukrainian format (24-hour)
  const formattedTime = time.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      background: 'var(--theme-gradient-primary)',
      borderRadius: '12px',
      padding: '8px 14px',
      color: 'white',
      fontSize: '1em',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}>
      <span>🕐</span>
      <span>{formattedTime}</span>
    </div>
  );
}
