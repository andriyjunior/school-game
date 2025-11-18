import { useState, useEffect } from 'react';
import { animals, getAnimalIcon, getAnimalsByCategory } from '../../../data/animals';

export default function MemoryGame({ onBack, onShowHelp, updateScore, category }) {
  // Filter animals by category
  const categoryAnimals = getAnimalsByCategory(category);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    if (categoryAnimals.length === 0) return;

    const selectedAnimals = categoryAnimals
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(6, categoryAnimals.length));

    const pairs = [];
    selectedAnimals.forEach(animal => {
      pairs.push({ ...animal, id: `${animal.name}-1` });
      pairs.push({ ...animal, id: `${animal.name}-2` });
    });

    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (isChecking || flippedIndices.includes(index) || matchedPairs.includes(cards[index].name)) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.name === secondCard.name) {
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, firstCard.name]);
          setFlippedIndices([]);
          setIsChecking(false);

          const points = 20;
          setScore(score + points);

          // Send result to parent with details for live session tracking
          updateScore(points, {
            question: `Знайди пару: ${firstCard.name}`,
            correct: true,
            matchedAnimal: firstCard.name
          });

          if (matchedPairs.length + 1 === 6) {
            setTimeout(() => {
              alert(`🎉 Вітаємо! Ти знайшов всі пари за ${moves + 1} ходів!`);
            }, 500);
          }
        }, 800);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsChecking(false);

          // Track wrong attempts for live session
          updateScore(0, {
            question: `Спроба знайти пару`,
            correct: false,
            attempted: `${firstCard.name} + ${secondCard.name}`
          });
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    initializeGame();
    setScore(0);
  };

  return (
    <div className="game-screen active">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
        <button className="help-btn" onClick={() => onShowHelp('memory')}>❓ Допомога</button>
      </div>

      <div className="score">Рахунок: {score}</div>
      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        🃏 Знайди Пару
      </h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '1.2em', color: '#666', marginBottom: '10px' }}>
          Ходів: {moves} | Знайдено пар: {matchedPairs.length}/6
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        maxWidth: '600px',
        margin: '0 auto 30px'
      }}>
        {cards.map((card, index) => {
          const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.name);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              style={{
                aspectRatio: '1',
                background: isFlipped
                  ? matchedPairs.includes(card.name)
                    ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                    : 'linear-gradient(135deg, #e7f0ff 0%, #d0e7ff 100%)'
                  : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '15px',
                cursor: isFlipped ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: isFlipped ? '0 4px 8px rgba(0,0,0,0.1)' : '0 6px 12px rgba(79,172,254,0.4)',
                border: matchedPairs.includes(card.name) ? '3px solid #28a745' : 'none'
              }}
            >
              {isFlipped ? (
                <div style={{ padding: '10px' }}>
                  <div
                    style={{ width: '100%', height: '60px' }}
                    dangerouslySetInnerHTML={{ __html: getAnimalIcon(card.name) }}
                  />
                  <div style={{
                    marginTop: '10px',
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center'
                  }}>
                    {card.name}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '3em' }}>❓</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={resetGame}
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
          🔄 Нова гра
        </button>
      </div>
    </div>
  );
}
