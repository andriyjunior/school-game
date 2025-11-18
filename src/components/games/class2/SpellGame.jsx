import { useState, useEffect } from 'react';
import { animals, getAnimalIcon, getAnimalsByCategory } from '../../../data/animals';

export default function SpellGame({ onBack, onShowHelp, updateScore, category }) {
  // Filter animals by category
  const categoryAnimals = getAnimalsByCategory(category);
  const [score, setScore] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    if (categoryAnimals.length === 0) return;

    const randomAnimal = categoryAnimals[Math.floor(Math.random() * categoryAnimals.length)];
    setCurrentAnimal(randomAnimal);
    setUserInput('');
    setShowResult(false);
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    if (!userInput.trim()) {
      alert('Будь ласка, напиши слово!');
      return;
    }

    const correct = userInput.trim().toLowerCase() === currentAnimal.name.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    const points = correct ? 25 : 0;
    setScore(score + points);

    // Send result to parent with details for live session tracking
    updateScore(points, {
      question: `Напиши слово: ${currentAnimal.icon}`,
      correct: correct,
      userAnswer: userInput.trim(),
      correctAnswer: currentAnimal.name
    });

    setQuestionCount(questionCount + 1);
  };

  const nextQuestion = () => {
    loadNewQuestion();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer();
    }
  };

  if (!currentAnimal) {
    return <div className="game-screen active">Завантаження...</div>;
  }

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('spell')}>❓ Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        ✏️ Напиши Слово
      </h2>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div
            style={{ width: '150px', height: '150px', margin: '0 auto 20px' }}
            dangerouslySetInnerHTML={{ __html: getAnimalIcon(currentAnimal.name) }}
          />
          <div style={{ color: 'white', fontSize: '1.2em', marginBottom: '10px' }}>
            💬 {currentAnimal.sound}
          </div>
          <div style={{ color: 'white', fontSize: '1.1em', opacity: 0.9 }}>
            {currentAnimal.hint}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>
            Як називається ця тварина?
          </h3>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="Напиши назву тварини..."
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.3em',
              border: '3px solid #667eea',
              borderRadius: '10px',
              textAlign: 'center',
              outline: 'none',
              background: showResult
                ? isCorrect ? '#d4edda' : '#f8d7da'
                : 'white'
            }}
            autoFocus
          />
        </div>

        {showResult && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            borderRadius: '15px',
            background: isCorrect ? '#d4edda' : '#f8d7da',
            color: isCorrect ? '#155724' : '#721c24',
            fontSize: '1.3em',
            marginBottom: '20px'
          }}>
            {isCorrect ? (
              <>
                <div>🎉 Правильно!</div>
                <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  Ти правильно написав: <strong>{currentAnimal.name}</strong>
                </div>
              </>
            ) : (
              <>
                <div>😔 Невірно!</div>
                <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  Правильна відповідь: <strong>{currentAnimal.name}</strong>
                </div>
                <div style={{ fontSize: '0.8em', marginTop: '5px', opacity: 0.8 }}>
                  Ти написав: {userInput}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          {!showResult ? (
            <button
              onClick={checkAnswer}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '10px',
                fontSize: '1.2em',
                cursor: 'pointer'
              }}
            >
              Перевірити
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '10px',
                fontSize: '1.2em',
                cursor: 'pointer'
              }}
            >
              Наступне слово →
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '1.1em' }}>
          Питання: {questionCount + 1}
        </div>
      </div>
    </div>
  );
}
