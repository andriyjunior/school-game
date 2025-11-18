import { useState } from 'react';

export default function PlayerNameModal({ onSubmit }) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('name');
      return;
    }
    if (!selectedClass) {
      alert('Будь ласка, вибери свій клас!');
      return;
    }
    onSubmit(name, selectedClass);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.trim() && selectedClass) {
      handleSubmit();
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <h2>Вітаємо в Навчальних Іграх!</h2>
        <p>Як тебе звати?</p>
        <input
          type="text"
          className="name-input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          onKeyUp={handleKeyPress}
          placeholder={error === 'name' ? "Будь ласка, введи своє ім'я" : "Введи своє ім'я..."}
          style={{ borderColor: error === 'name' ? '#dc3545' : '#667eea' }}
          autoFocus
        />

        <p className="class-label">В якому ти класі?</p>
        <div className="class-selector">
          {[2, 3, 4, 5, 6, 7, 8, 9].map(classNum => (
            <button
              key={classNum}
              className={`class-btn ${selectedClass === classNum ? 'selected' : ''}`}
              onClick={() => setSelectedClass(classNum)}
            >
              {classNum}
            </button>
          ))}
        </div>

        <button className="start-btn" onClick={handleSubmit}>
          Почати гру
        </button>
      </div>
    </div>
  );
}
