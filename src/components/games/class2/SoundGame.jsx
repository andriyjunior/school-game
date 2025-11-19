import { useState, useEffect } from 'react';
import { animals, getAnimalIcon, getAnimalsByCategory } from '../../../data/animals';

export default function SoundGame({ onBack, onShowHelp, updateScore, category }) {
  // Filter animals by category
  const categoryAnimals = getAnimalsByCategory(category);
  const [score, setScore] = useState(0);
  const [currentSound, setCurrentSound] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    if (categoryAnimals.length === 0) return;

    const randomAnimal = categoryAnimals[Math.floor(Math.random() * categoryAnimals.length)];
    setCurrentSound(randomAnimal);

    const wrongAnimals = categoryAnimals
      .filter(a => a.name !== randomAnimal.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [randomAnimal, ...wrongAnimals]
      .sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleOptionSelect = (animal) => {
    if (showResult) return;
    setSelectedOption(animal);
  };

  const checkAnswer = () => {
    if (!selectedOption) {
      alert('Будь ласка, обери відповідь!');
      return;
    }

    const correct = selectedOption.name === currentSound.name;
    setIsCorrect(correct);
    setShowResult(true);

    const points = correct ? 15 : 0;
    setScore(score + points);

    // Send result to parent with details for live session tracking
    updateScore(points, {
      question: `Хто так говорить: "${currentSound.sound}"?`,
      correct: correct,
      selectedAnswer: selectedOption.name,
      correctAnswer: currentSound.name
    });

    setQuestionCount(questionCount + 1);
  };

  const nextQuestion = () => {
    loadNewQuestion();
  };

  if (!currentSound) {
    return <div className="game-screen active">Завантаження...</div>;
  }

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('sound')}><i className="fas fa-question-circle"></i> Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        <i className="fas fa-volume-up"></i> Хто як говорить?
      </h2>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '1.3em' }}>
            Хто так говорить?
          </h3>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '30px',
            borderRadius: '15px',
            fontSize: '2em',
            color: '#333',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            {currentSound.sound}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {options.map((animal, index) => {
            let style = {
              padding: '20px',
              borderRadius: '15px',
              border: '3px solid transparent',
              background: '#f8f9fa',
              cursor: showResult ? 'default' : 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s'
            };

            if (selectedOption?.name === animal.name) {
              if (showResult) {
                style.border = animal.name === currentSound.name ? '3px solid #28a745' : '3px solid #dc3545';
                style.background = animal.name === currentSound.name ? '#d4edda' : '#f8d7da';
              } else {
                style.border = '3px solid #667eea';
                style.background = '#e7f0ff';
              }
            } else if (showResult && animal.name === currentSound.name) {
              style.border = '3px solid #28a745';
              style.background = '#d4edda';
            }

            return (
              <div
                key={index}
                style={style}
                onClick={() => handleOptionSelect(animal)}
              >
                <div
                  style={{ width: '80px', height: '80px', margin: '0 auto 10px' }}
                  dangerouslySetInnerHTML={{ __html: getAnimalIcon(animal.name) }}
                />
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>
                  {animal.name}
                </div>
              </div>
            );
          })}
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
                <div><i className="fas fa-check-circle"></i> Правильно!</div>
                <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  {currentSound.name} каже: {currentSound.sound}
                </div>
              </>
            ) : (
              <>
                <div><i className="fas fa-times-circle"></i> Невірно!</div>
                <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
                  Так каже <strong>{currentSound.name}</strong>
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
              Наступне питання →
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
