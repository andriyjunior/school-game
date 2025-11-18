import { useState, useEffect } from 'react';
import { buggyCodeExamples } from '../../../data/csContent';

export default function DebugGame({ onBack, onShowHelp, updateScore }) {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [questionIndex]);

  const loadQuestion = () => {
    if (questionIndex >= buggyCodeExamples.length) {
      return;
    }
    const question = buggyCodeExamples[questionIndex];
    setCurrentQuestion(question);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleOptionSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const checkAnswer = () => {
    if (!selectedOption) {
      alert('Будь ласка, обери відповідь!');
      return;
    }

    const correct = selectedOption === currentQuestion.bug;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = 20;
      setScore(score + points);
      updateScore(points);
    }
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= buggyCodeExamples.length) {
      alert(`Гра завершена! Твій рахунок: ${score + (isCorrect ? 20 : 0)}`);
      onBack();
      return;
    }
    setQuestionIndex(questionIndex + 1);
  };

  if (!currentQuestion) {
    return <div className="game-screen active">Завантаження...</div>;
  }

  // Generate options
  const options = [
    currentQuestion.bug,
    'Код написаний правильно',
    'Пропущена крапка з комою',
    'Невірне ім\'я змінної'
  ];

  // Remove duplicates and shuffle
  const uniqueOptions = [...new Set(options)].sort(() => Math.random() - 0.5);

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('debug')}>❓ Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        🐛 Детектив Багів
      </h2>

      <div className="debug-container">
        <h3 style={{ textAlign: 'center', color: '#667eea' }}>
          Завдання: {currentQuestion.title}
        </h3>
        <p style={{ textAlign: 'center', fontSize: '1.1em', color: '#666', margin: '15px 0' }}>
          Прочитай код і знайди помилку (або переконайся, що її немає):
        </p>

        {/* Code Display */}
        <div className="code-display">
          {currentQuestion.code.split('\n').map((line, index) => (
            <div
              key={index}
              className={`code-line ${index === currentQuestion.bugLine ? 'highlight' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Options */}
        <div className="bug-options">
          {uniqueOptions.map((option, index) => {
            let className = 'bug-option';
            if (selectedOption === option) {
              if (showResult) {
                className += option === currentQuestion.bug ? ' selected correct' : ' selected wrong';
              } else {
                className += ' selected';
              }
            } else if (showResult && option === currentQuestion.bug) {
              className += ' correct';
            }

            return (
              <button
                key={index}
                className={className}
                onClick={() => handleOptionSelect(option)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Message */}
        {showResult && (
          <div className="message" style={{
            color: isCorrect ? '#28a745' : '#dc3545',
            fontSize: '1.3em'
          }}>
            {isCorrect ? 'Правильно! Молодець!' : 'Невірно! Спробуй ще раз наступного разу.'}
            <div style={{
              marginTop: '15px',
              fontSize: '0.9em',
              background: '#f0f4ff',
              padding: '15px',
              borderRadius: '10px',
              color: '#667eea'
            }}>
              💡 {currentQuestion.explanation}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          {!showResult ? (
            <button className="next-btn" onClick={checkAnswer}>
              Перевірити
            </button>
          ) : (
            <button className="next-btn" onClick={nextQuestion}>
              {questionIndex + 1 >= buggyCodeExamples.length ? 'Завершити' : 'Далі →'}
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ textAlign: 'center', fontSize: '1.1em', color: '#666' }}>
          Питання {questionIndex + 1} з {buggyCodeExamples.length}
        </div>
      </div>
    </div>
  );
}
