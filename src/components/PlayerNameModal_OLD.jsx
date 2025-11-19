import { useState } from 'react';

export default function PlayerNameModal({ onSubmit }) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [errors, setErrors] = useState({ name: false, class: false });

  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      class: !selectedClass
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.class) {
      return;
    }

    onSubmit(name.trim(), selectedClass);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!name.trim()) {
        setErrors(prev => ({ ...prev, name: true }));
      } else if (selectedClass) {
        handleSubmit();
      }
    }
  };

  const classGroups = [
    { label: 'Початкова школа', classes: [1, 2, 3, 4], color: '#4facfe' },
    { label: 'Середня школа', classes: [5, 6, 7, 8, 9], color: '#667eea' },
    { label: 'Старша школа', classes: [10, 11], color: '#f093fb' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 10000,
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.4s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '20px 20px 0 0',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>
            Класна Робота
          </h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.95em', opacity: 0.9 }}>
            Освітня платформа для учнів 1-11 класів
          </p>
        </div>

        {/* Form Content */}
        <div style={{ padding: '30px' }}>
          {/* Name Input Section */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '1.1em',
              fontWeight: '600',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-user" style={{ color: '#667eea' }}></i>
              Як тебе звати?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors(prev => ({ ...prev, name: false }));
              }}
              onKeyUp={handleKeyPress}
              placeholder="Введи своє ім'я та прізвище..."
              autoFocus
              style={{
                width: '100%',
                padding: '15px 18px',
                fontSize: '1.1em',
                border: `2px solid ${errors.name ? '#dc3545' : '#e0e0e0'}`,
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                if (!errors.name) {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.name ? '#dc3545' : '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p style={{
                margin: '8px 0 0 0',
                color: '#dc3545',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fas fa-exclamation-circle"></i>
                Будь ласка, введи своє ім'я
              </p>
            )}
          </div>

          {/* Class Selection Section */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '15px',
              fontSize: '1.1em',
              fontWeight: '600',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-school" style={{ color: '#667eea' }}></i>
              В якому ти класі?
            </label>

            {classGroups.map((group, groupIndex) => (
              <div key={groupIndex} style={{ marginBottom: '20px' }}>
                <p style={{
                  fontSize: '0.85em',
                  color: '#666',
                  marginBottom: '10px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {group.label}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                  gap: '10px'
                }}>
                  {group.classes.map(classNum => (
                    <button
                      key={classNum}
                      onClick={() => {
                        setSelectedClass(classNum);
                        setErrors(prev => ({ ...prev, class: false }));
                      }}
                      style={{
                        padding: '18px 10px',
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                        border: `3px solid ${selectedClass === classNum ? group.color : '#e0e0e0'}`,
                        background: selectedClass === classNum
                          ? `linear-gradient(135deg, ${group.color}15, ${group.color}25)`
                          : 'white',
                        color: selectedClass === classNum ? group.color : '#666',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedClass === classNum ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: selectedClass === classNum
                          ? `0 4px 12px ${group.color}40`
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedClass !== classNum) {
                          e.target.style.borderColor = group.color;
                          e.target.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedClass !== classNum) {
                          e.target.style.borderColor = '#e0e0e0';
                          e.target.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      {classNum}
                      {selectedClass === classNum && (
                        <div style={{ fontSize: '0.5em', marginTop: '2px' }}>
                          <i className="fas fa-check-circle"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {errors.class && (
              <p style={{
                margin: '10px 0 0 0',
                color: '#dc3545',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fas fa-exclamation-circle"></i>
                Будь ласка, вибери свій клас
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              background: (name.trim() && selectedClass)
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: (name.trim() && selectedClass) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: (name.trim() && selectedClass)
                ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              if (name.trim() && selectedClass) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = (name.trim() && selectedClass)
                ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                : 'none';
            }}
          >
            {(name.trim() && selectedClass) ? (
              <>
                Продовжити
                <i className="fas fa-arrow-right"></i>
              </>
            ) : (
              <>
                Заповни всі поля
                <i className="fas fa-lock"></i>
              </>
            )}
          </button>

          {/* Help Text */}
          <p style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '0.85em',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}>
            <i className="fas fa-info-circle"></i>
            Натисни Enter для швидкого продовження
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
}
