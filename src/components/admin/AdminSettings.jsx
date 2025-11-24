import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../firebase/database';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    aiMessagesEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAI = async () => {
    setSaving(true);
    setMessage('');

    try {
      const newValue = !settings.aiMessagesEnabled;
      await updateSettings({ aiMessagesEnabled: newValue });
      setSettings({ ...settings, aiMessagesEnabled: newValue });
      setMessage(newValue ? 'AI повідомлення увімкнено' : 'AI повідомлення вимкнено');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Помилка збереження налаштувань');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2em', color: '#667eea' }}></i>
        <p style={{ marginTop: '10px', color: '#666' }}>Завантаження налаштувань...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{
        color: '#667eea',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <i className="fas fa-cog"></i>
        Налаштування
      </h2>

      {/* AI Messages Toggle */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-robot" style={{ color: '#667eea' }}></i>
              AI Персоналізовані повідомлення
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
              Використовувати OpenAI для генерації персоналізованих привітань,
              підбадьорень та похвал для учнів
            </p>
            <div style={{
              marginTop: '10px',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.85em',
              color: '#666'
            }}>
              <i className="fas fa-info-circle" style={{ marginRight: '5px' }}></i>
              Вартість: ~$0.05-0.50/місяць для школи (30 учнів)
            </div>
          </div>

          <div style={{ marginLeft: '20px' }}>
            <button
              onClick={handleToggleAI}
              disabled={saving}
              style={{
                width: '80px',
                height: '40px',
                borderRadius: '20px',
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                background: settings.aiMessagesEnabled
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e0e0e0',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '4px',
                left: settings.aiMessagesEnabled ? '44px' : '4px',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {saving ? (
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.8em', color: '#667eea' }}></i>
                ) : (
                  <i
                    className={`fas ${settings.aiMessagesEnabled ? 'fa-check' : 'fa-times'}`}
                    style={{
                      fontSize: '0.8em',
                      color: settings.aiMessagesEnabled ? '#667eea' : '#999'
                    }}
                  ></i>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div style={{
          marginTop: '15px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: settings.aiMessagesEnabled ? '#e8f5e9' : '#fff3e0',
          color: settings.aiMessagesEnabled ? '#2e7d32' : '#f57c00',
          fontSize: '0.9em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <i className={`fas ${settings.aiMessagesEnabled ? 'fa-check-circle' : 'fa-pause-circle'}`}></i>
          {settings.aiMessagesEnabled ? 'Увімкнено' : 'Вимкнено'}
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '10px',
          background: message.includes('Помилка') ? '#ffebee' : '#e8f5e9',
          color: message.includes('Помилка') ? '#c62828' : '#2e7d32',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <i className={`fas ${message.includes('Помилка') ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
          {message}
        </div>
      )}

      {/* API Key Info */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
          <i className="fas fa-key" style={{ marginRight: '8px', color: '#667eea' }}></i>
          API Ключ
        </h4>
        <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>
          OpenAI API ключ налаштовано через змінну середовища <code>VITE_OPENAI_API_KEY</code>
        </p>
      </div>
    </div>
  );
}
