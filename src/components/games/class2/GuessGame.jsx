import { useState, useEffect } from 'react';
import { animals, getAnimalIcon, getAnimalsByCategory } from '../../../data/animals';

export default function GuessGame({ onBack, onShowHelp, updateScore, category }) {
  // Filter animals by category
  const categoryAnimals = getAnimalsByCategory(category);
  const [score, setScore] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    if (categoryAnimals.length === 0) return;

    const randomAnimal = categoryAnimals[Math.floor(Math.random() * categoryAnimals.length)];
    setCurrentAnimal(randomAnimal);

    const wrongAnimals = categoryAnimals
      .filter(a => a.name !== randomAnimal.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [randomAnimal, ...wrongAnimals]
      .sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setSelectedOption(null);
    setShowResult(false);
    setHintIndex(0);
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

    const correct = selectedOption.name === currentAnimal.name;
    setIsCorrect(correct);
    setShowResult(true);

    const points = correct ? 15 : 0;
    setScore(score + points);

    // Send result to parent with details for live session tracking
    updateScore(points, {
      question: `Вгадай тварину: ${currentAnimal.hint}`,
      correct: correct,
      selectedAnswer: selectedOption.name,
      correctAnswer: currentAnimal.name
    });
  };

  const nextQuestion = () => {
    loadNewQuestion();
  };

  const showHint = () => {
    if (hintIndex < 2) {
      setHintIndex(hintIndex + 1);
    }
  };

  if (!currentAnimal) {
    return <div className="game-screen active">Завантаження...</div>;
  }

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('guess')}><i className="fas fa-question-circle"></i> Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        <i className="fas fa-magic"></i> Вгадай Тварину
      </h2>

      <div className="guess-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          color: 'white'
        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5em' }}>
            Підказки:
          </h3>
          <div style={{ fontSize: '1.2em', lineHeight: '1.8' }}>
            <div><i className="fas fa-lightbulb"></i> {currentAnimal.hint}</div>
            {hintIndex >= 1 && <div><i className="fas fa-home"></i> Живе в: {currentAnimal.home}</div>}
            {hintIndex >= 2 && <div><i className="fas fa-volume-up"></i> Каже: {currentAnimal.sound}</div>}
          </div>

          {!showResult && hintIndex < 2 && (
            <button
              onClick={showHint}
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                marginTop: '20px',
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              <i className="fas fa-gift"></i> Показати ще підказку
            </button>
          )}
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
              transition: 'all 0.3s',
              fontSize: '1.2em'
            };

            if (selectedOption?.name === animal.name) {
              if (showResult) {
                style.border = animal.name === currentAnimal.name ? '3px solid #28a745' : '3px solid #dc3545';
                style.background = animal.name === currentAnimal.name ? '#d4edda' : '#f8d7da';
              } else {
                style.border = '3px solid #667eea';
                style.background = '#e7f0ff';
              }
            } else if (showResult && animal.name === currentAnimal.name) {
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
                <div style={{ fontWeight: 'bold', color: '#333' }}>{animal.name}</div>
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
              <><i className="fas fa-check-circle"></i> Правильно! Молодець!</>
            ) : (
              <><i className="fas fa-times-circle"></i> Невірно! Це була {currentAnimal.name}</>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          {!showResult ? (
            <button
              className="next-btn"
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
              className="next-btn"
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
      </div>
    </div>
  );
}
