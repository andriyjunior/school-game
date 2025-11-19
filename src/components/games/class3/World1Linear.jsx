import { useState, useEffect } from 'react';

export default function World1Linear({ avatar, onBack, onComplete, updateScore }) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [programBlocks, setProgramBlocks] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
  const [characterDir, setCharacterDir] = useState('right'); // right, left, up, down
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [stars, setStars] = useState(3);

  const levels = [
    {
      id: 1,
      title: 'Перший Крок',
      description: 'Допоможи герою дійти до зірки! Використай команди руху.',
      grid: 5,
      start: { x: 0, y: 2 },
      goal: { x: 4, y: 2 },
      obstacles: [],
      optimalMoves: 4,
      availableBlocks: ['moveForward'],
    },
    {
      id: 2,
      title: 'Повороти',
      description: 'Тепер потрібно повертати! Поверни і рухайся.',
      grid: 5,
      start: { x: 0, y: 0 },
      goal: { x: 4, y: 4 },
      obstacles: [],
      optimalMoves: 8,
      availableBlocks: ['moveForward', 'turnRight', 'turnLeft'],
    },
    {
      id: 3,
      title: 'Перешкоди',
      description: 'Обійди перешкоди, щоб дістатись до цілі!',
      grid: 6,
      start: { x: 0, y: 0 },
      goal: { x: 5, y: 5 },
      obstacles: [
        { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
        { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }
      ],
      optimalMoves: 14,
      availableBlocks: ['moveForward', 'turnRight', 'turnLeft'],
    },
    {
      id: 4,
      title: 'Складний Шлях',
      description: 'Пройди лабіринт найкоротшим шляхом!',
      grid: 7,
      start: { x: 0, y: 3 },
      goal: { x: 6, y: 3 },
      obstacles: [
        { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 4 }, { x: 1, y: 5 },
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 },
        { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 },
        { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 4 }, { x: 5, y: 5 },
      ],
      optimalMoves: 18,
      availableBlocks: ['moveForward', 'turnRight', 'turnLeft'],
    },
    {
      id: 5,
      title: 'Фінальний Рівень',
      description: 'Останній виклик! Збери всі зірки по дорозі!',
      grid: 8,
      start: { x: 0, y: 0 },
      goal: { x: 7, y: 7 },
      collectibles: [
        { x: 3, y: 0 }, { x: 7, y: 3 }, { x: 3, y: 7 }
      ],
      obstacles: [
        { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
        { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 },
        { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 },
        { x: 5, y: 5 }, { x: 5, y: 6 }
      ],
      optimalMoves: 24,
      availableBlocks: ['moveForward', 'turnRight', 'turnLeft'],
    }
  ];

  const level = levels[currentLevel];
  const [collected, setCollected] = useState([]);

  useEffect(() => {
    // Reset character position when level changes
    setCharacterPos(level.start);
    setCharacterDir('right');
    setProgramBlocks([]);
    setLevelCompleted(false);
    setCollected([]);
    setStars(3);
  }, [currentLevel]);

  const blockTypes = {
    moveForward: {
      name: 'Крок Вперед',
      icon: 'fa-arrow-up',
      color: '#4CAF50',
      action: () => {
        const directions = {
          right: { x: 1, y: 0 },
          left: { x: -1, y: 0 },
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 }
        };
        const delta = directions[characterDir];
        const newPos = { x: characterPos.x + delta.x, y: characterPos.y + delta.y };

        // Check bounds
        if (newPos.x < 0 || newPos.x >= level.grid || newPos.y < 0 || newPos.y >= level.grid) {
          return false;
        }

        // Check obstacles
        const hitObstacle = level.obstacles?.some(obs => obs.x === newPos.x && obs.y === newPos.y);
        if (hitObstacle) return false;

        setCharacterPos(newPos);

        // Check collectibles
        if (level.collectibles) {
          const collectedItem = level.collectibles.find(c => c.x === newPos.x && c.y === newPos.y);
          if (collectedItem && !collected.some(c => c.x === collectedItem.x && c.y === collectedItem.y)) {
            setCollected(prev => [...prev, collectedItem]);
          }
        }

        return true;
      }
    },
    turnRight: {
      name: 'Поворот →',
      icon: 'fa-redo',
      color: '#2196F3',
      action: () => {
        const turns = { right: 'down', down: 'left', left: 'up', up: 'right' };
        setCharacterDir(turns[characterDir]);
        return true;
      }
    },
    turnLeft: {
      name: 'Поворот ←',
      icon: 'fa-undo',
      color: '#FF9800',
      action: () => {
        const turns = { right: 'up', up: 'left', left: 'down', down: 'right' };
        setCharacterDir(turns[characterDir]);
        return true;
      }
    }
  };

  const addBlock = (blockType) => {
    setProgramBlocks([...programBlocks, blockType]);
  };

  const removeBlock = (index) => {
    setProgramBlocks(programBlocks.filter((_, i) => i !== index));
  };

  const clearProgram = () => {
    setProgramBlocks([]);
    setCharacterPos(level.start);
    setCharacterDir('right');
    setCollected([]);
  };

  const runProgram = async () => {
    setIsRunning(true);
    setCharacterPos(level.start);
    setCharacterDir('right');
    setCollected([]);

    let currentPos = { ...level.start };
    let currentDir = 'right';
    let currentCollected = [];

    for (let i = 0; i < programBlocks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const blockType = blockTypes[programBlocks[i]];

      // Execute with temp state
      let tempPos = { ...currentPos };
      let tempDir = currentDir;

      if (programBlocks[i] === 'moveForward') {
        const directions = {
          right: { x: 1, y: 0 },
          left: { x: -1, y: 0 },
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 }
        };
        const delta = directions[tempDir];
        tempPos = { x: tempPos.x + delta.x, y: tempPos.y + delta.y };

        // Check bounds and obstacles
        if (tempPos.x < 0 || tempPos.x >= level.grid || tempPos.y < 0 || tempPos.y >= level.grid) {
          setIsRunning(false);
          alert('Вийшов за межі поля!');
          clearProgram();
          return;
        }

        const hitObstacle = level.obstacles?.some(obs => obs.x === tempPos.x && obs.y === tempPos.y);
        if (hitObstacle) {
          setIsRunning(false);
          alert('Зіткнувся з перешкодою!');
          clearProgram();
          return;
        }

        currentPos = tempPos;
        setCharacterPos(tempPos);

        // Check collectibles
        if (level.collectibles) {
          const collectedItem = level.collectibles.find(c => c.x === tempPos.x && c.y === tempPos.y);
          if (collectedItem && !currentCollected.some(c => c.x === collectedItem.x && c.y === collectedItem.y)) {
            currentCollected.push(collectedItem);
            setCollected([...currentCollected]);
          }
        }
      } else if (programBlocks[i] === 'turnRight') {
        const turns = { right: 'down', down: 'left', left: 'up', up: 'right' };
        tempDir = turns[tempDir];
        currentDir = tempDir;
        setCharacterDir(tempDir);
      } else if (programBlocks[i] === 'turnLeft') {
        const turns = { right: 'up', up: 'left', left: 'down', down: 'right' };
        tempDir = turns[tempDir];
        currentDir = tempDir;
        setCharacterDir(tempDir);
      }
    }

    setIsRunning(false);

    // Check if reached goal
    if (currentPos.x === level.goal.x && currentPos.y === level.goal.y) {
      // Check if all collectibles were collected (if any)
      if (level.collectibles && currentCollected.length !== level.collectibles.length) {
        alert('Майже! Але не зібрав всі зірки!');
        return;
      }

      // Calculate stars based on efficiency
      let earnedStars = 3;
      if (programBlocks.length > level.optimalMoves * 1.5) earnedStars = 1;
      else if (programBlocks.length > level.optimalMoves * 1.2) earnedStars = 2;

      setStars(earnedStars);
      setLevelCompleted(true);

      // Update score
      await updateScore(earnedStars * 10, {
        game: 'algorithm-adventure',
        level: currentLevel + 1,
        stars: earnedStars
      });
    } else {
      alert('Не дістався до цілі! Спробуй ще раз!');
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      // Completed all levels
      const totalStars = stars; // In real version, sum all level stars
      onComplete(totalStars, levels.length);
    }
  };

  const getDirectionArrow = () => {
    const arrows = { right: '→', left: '←', up: '↑', down: '↓' };
    return arrows[characterDir];
  };

  return (
    <div style={{
      minHeight: '700px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '30px',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          ← Карта Світів
        </button>

        <div style={{ fontSize: '2em', color: avatar.color }}>
          <i className={`fas ${avatar.icon}`}></i>
        </div>

        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
          Рівень {currentLevel + 1}/{levels.length}
        </div>
      </div>

      {!levelCompleted ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left side - Grid */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '20px' }}>
              <h2 style={{ marginBottom: '10px' }}>{level.title}</h2>
              <p style={{ marginBottom: '20px', opacity: 0.9 }}>{level.description}</p>

              {/* Game Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${level.grid}, 1fr)`,
                gap: '3px',
                background: 'rgba(0,0,0,0.2)',
                padding: '10px',
                borderRadius: '10px',
                aspectRatio: '1/1'
              }}>
                {Array.from({ length: level.grid * level.grid }).map((_, index) => {
                  const x = index % level.grid;
                  const y = Math.floor(index / level.grid);
                  const isCharacter = characterPos.x === x && characterPos.y === y;
                  const isGoal = level.goal.x === x && level.goal.y === y;
                  const isObstacle = level.obstacles?.some(obs => obs.x === x && obs.y === y);
                  const isCollectible = level.collectibles?.some(c => c.x === x && c.y === y);
                  const isCollected = collected.some(c => c.x === x && c.y === y);

                  return (
                    <div
                      key={index}
                      style={{
                        background: isObstacle ? '#555' : isGoal ? '#FFD700' : 'rgba(255,255,255,0.9)',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                      }}
                    >
                      {isCharacter && (
                        <span style={{ color: avatar.color }}>
                          <i className={`fas ${avatar.icon}`}></i>
                          <span style={{ fontSize: '0.6em' }}>{getDirectionArrow()}</span>
                        </span>
                      )}
                      {isGoal && !isCharacter && <i className="fas fa-bullseye" style={{ color: '#FFD700' }}></i>}
                      {isObstacle && <i className="fas fa-cube" style={{ color: '#666' }}></i>}
                      {isCollectible && !isCollected && !isCharacter && <i className="fas fa-star" style={{ color: '#FFD700' }}></i>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side - Programming */}
          <div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}><i className="fas fa-box"></i> Доступні Команди</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {level.availableBlocks.map(blockType => (
                  <button
                    key={blockType}
                    onClick={() => addBlock(blockType)}
                    disabled={isRunning}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: blockTypes[blockType].color,
                      color: 'white',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      fontSize: '1em',
                      fontWeight: 'bold',
                      opacity: isRunning ? 0.5 : 1
                    }}
                  >
                    <i className={`fas ${blockTypes[blockType].icon}`}></i> {blockTypes[blockType].name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>⚙️ Твоя Програма ({programBlocks.length} команд)</h3>
              <div style={{
                minHeight: '200px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                {programBlocks.length === 0 ? (
                  <div style={{ textAlign: 'center', opacity: 0.6, paddingTop: '80px' }}>
                    Додай команди тут
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {programBlocks.map((blockType, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '10px 15px',
                          borderRadius: '8px',
                          background: blockTypes[blockType].color,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>
                          {index + 1}. <i className={`fas ${blockTypes[blockType].icon}`}></i> {blockTypes[blockType].name}
                        </span>
                        <button
                          onClick={() => removeBlock(index)}
                          disabled={isRunning}
                          style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            padding: '5px 10px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={runProgram}
                  disabled={isRunning || programBlocks.length === 0}
                  style={{
                    flex: 1,
                    padding: '15px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isRunning || programBlocks.length === 0 ? '#666' : '#28a745',
                    color: 'white',
                    cursor: isRunning || programBlocks.length === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1.1em',
                    fontWeight: 'bold'
                  }}
                >
                  {isRunning ? '▶️ Виконується...' : '▶️ Запустити'}
                </button>
                <button
                  onClick={clearProgram}
                  disabled={isRunning}
                  style={{
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#dc3545',
                    color: 'white',
                    cursor: isRunning ? 'not-allowed' : 'pointer',
                    fontSize: '1.1em',
                    fontWeight: 'bold'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Level Complete Screen */
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px'
        }}>
          <div style={{ fontSize: '5em', marginBottom: '20px', color: '#FFD700' }}>
            <i className="fas fa-trophy"></i>
          </div>
          <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>Рівень Пройдено!</h1>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ color: i < stars ? '#FFD700' : '#ffffff40' }}>★</span>
            ))}
          </div>
          <p style={{ fontSize: '1.3em', marginBottom: '30px' }}>
            {stars === 3 && 'Ідеально! Ти справжній програміст!'}
            {stars === 2 && 'Чудова робота! Можна ще краще!'}
            {stars === 1 && 'Молодець! Спробуй оптимізувати код!'}
          </p>
          {programBlocks.length > level.optimalMoves && (
            <p style={{ fontSize: '1em', opacity: 0.8, marginBottom: '20px' }}>
              <i className="fas fa-lightbulb"></i> Підказка: Можна розв'язати за {level.optimalMoves} команд
            </p>
          )}
          <button
            onClick={nextLevel}
            style={{
              padding: '20px 40px',
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#333',
              cursor: 'pointer',
              fontSize: '1.3em',
              fontWeight: 'bold',
              boxShadow: '0 5px 20px rgba(255, 215, 0, 0.4)'
            }}
          >
            {currentLevel < levels.length - 1 ? (
              <><i className="fas fa-arrow-right"></i> Наступний Рівень</>
            ) : (
              <><i className="fas fa-trophy"></i> Завершити Світ</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
