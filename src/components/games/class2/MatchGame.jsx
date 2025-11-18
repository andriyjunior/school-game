import { useState, useEffect } from 'react';
import { animals, getAnimalIcon, getAnimalsByCategory } from '../../../data/animals';

export default function MatchGame({ onBack, onShowHelp, updateScore, category }) {
  // Filter animals by category
  const categoryAnimals = getAnimalsByCategory(category);
  const [score, setScore] = useState(0);
  const [gameAnimals, setGameAnimals] = useState([]);
  const [matchType, setMatchType] = useState('home');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(null);

  useEffect(() => {
    loadNewRound();
  }, []);

  const loadNewRound = () => {
    if (categoryAnimals.length === 0) return;

    const type = Math.random() > 0.5 ? 'home' : 'sound';
    setMatchType(type);

    const selected = categoryAnimals
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, categoryAnimals.length));

    setGameAnimals(selected);
    setSelectedAnimal(null);
    setSelectedMatch(null);
    setMatchedPairs([]);
    setWrongMatch(null);
  };

  const handleAnimalClick = (animal) => {
    if (matchedPairs.includes(animal.name)) return;

    setSelectedAnimal(animal);
    setWrongMatch(null);

    if (selectedMatch) {
      checkMatch(animal, selectedMatch);
    }
  };

  const handleMatchClick = (matchValue) => {
    setSelectedMatch(matchValue);
    setWrongMatch(null);

    if (selectedAnimal) {
      checkMatch(selectedAnimal, matchValue);
    }
  };

  const checkMatch = (animal, matchValue) => {
    const correctMatch = matchType === 'home' ? animal.home : animal.sound;
    const matchTypeLabel = matchType === 'home' ? 'Де живе' : 'Як говорить';

    if (matchValue === correctMatch) {
      setMatchedPairs([...matchedPairs, animal.name]);
      setSelectedAnimal(null);
      setSelectedMatch(null);

      const points = 20;
      setScore(score + points);

      // Send result to parent with details for live session tracking
      updateScore(points, {
        question: `${matchTypeLabel}: ${animal.name}`,
        correct: true,
        match: `${animal.name} → ${matchValue}`
      });

      if (matchedPairs.length + 1 === gameAnimals.length) {
        setTimeout(() => {
          alert('🎉 Вітаємо! Ти з\'єднав усі пари!');
          loadNewRound();
        }, 500);
      }
    } else {
      setWrongMatch({ animal: animal.name, match: matchValue });

      // Track wrong attempts for live session
      updateScore(0, {
        question: `${matchTypeLabel}: ${animal.name}`,
        correct: false,
        userMatch: matchValue,
        correctMatch: correctMatch
      });

      setTimeout(() => {
        setSelectedAnimal(null);
        setSelectedMatch(null);
        setWrongMatch(null);
      }, 1000);
    }
  };

  const isAnimalMatched = (animalName) => matchedPairs.includes(animalName);
  const isMatchMatched = (matchValue) => {
    return gameAnimals.some(animal => {
      const correctMatch = matchType === 'home' ? animal.home : animal.sound;
      return correctMatch === matchValue && matchedPairs.includes(animal.name);
    });
  };

  const matchValues = gameAnimals
    .map(animal => matchType === 'home' ? animal.home : animal.sound)
    .sort(() => Math.random() - 0.5);

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('match')}>❓ Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        🔗 З'єднай Слова
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          padding: '10px 30px',
          borderRadius: '10px',
          fontSize: '1.1em',
          fontWeight: 'bold'
        }}>
          {matchType === 'home' ? '🏠 З\'єднай тварин з їхніми домівками' : '🔊 З\'єднай тварин з їхніми звуками'}
        </div>
        <div style={{ marginTop: '10px', color: '#666' }}>
          З'єднано: {matchedPairs.length}/{gameAnimals.length}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        <div>
          <h3 style={{ textAlign: 'center', color: '#667eea', marginBottom: '15px' }}>
            Тварини
          </h3>
          {gameAnimals.map((animal, index) => {
            const isMatched = isAnimalMatched(animal.name);
            const isSelected = selectedAnimal?.name === animal.name;
            const isWrong = wrongMatch?.animal === animal.name;

            return (
              <div
                key={index}
                onClick={() => handleAnimalClick(animal)}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  background: isMatched
                    ? '#d4edda'
                    : isWrong
                      ? '#f8d7da'
                      : isSelected
                        ? '#e7f0ff'
                        : '#f8f9fa',
                  border: isMatched
                    ? '3px solid #28a745'
                    : isSelected
                      ? '3px solid #667eea'
                      : isWrong
                        ? '3px solid #dc3545'
                        : '3px solid transparent',
                  cursor: isMatched ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'all 0.3s',
                  opacity: isMatched ? 0.6 : 1
                }}
              >
                <div
                  style={{ width: '50px', height: '50px', flexShrink: 0 }}
                  dangerouslySetInnerHTML={{ __html: getAnimalIcon(animal.name) }}
                />
                <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#333' }}>
                  {animal.name}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h3 style={{ textAlign: 'center', color: '#667eea', marginBottom: '15px' }}>
            {matchType === 'home' ? 'Домівки' : 'Звуки'}
          </h3>
          {matchValues.map((matchValue, index) => {
            const isMatched = isMatchMatched(matchValue);
            const isSelected = selectedMatch === matchValue;
            const isWrong = wrongMatch?.match === matchValue;

            return (
              <div
                key={index}
                onClick={() => handleMatchClick(matchValue)}
                style={{
                  padding: '20px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  background: isMatched
                    ? '#d4edda'
                    : isWrong
                      ? '#f8d7da'
                      : isSelected
                        ? '#e7f0ff'
                        : '#f8f9fa',
                  border: isMatched
                    ? '3px solid #28a745'
                    : isSelected
                      ? '3px solid #667eea'
                      : isWrong
                        ? '3px solid #dc3545'
                        : '3px solid #ddd',
                  cursor: isMatched ? 'default' : 'pointer',
                  textAlign: 'center',
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  color: '#333',
                  transition: 'all 0.3s',
                  opacity: isMatched ? 0.6 : 1
                }}
              >
                {matchType === 'home' ? '🏠 ' : '🔊 '}{matchValue}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={loadNewRound}
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
          🔄 Новий раунд
        </button>
      </div>
    </div>
  );
}
