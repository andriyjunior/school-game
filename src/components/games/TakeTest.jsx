import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startTestAttempt,
  recordAnswer,
  completeTestAttempt,
  submitTestAttempt,
  resetCurrentTest,
} from '../../store/slices/testSlice';

export default function TakeTest({ onBack, onShowHelp, updateScore }) {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const { currentTest, currentAttempt } = useSelector((state) => state.test);
  const liveSession = useSelector((state) => state.liveSession);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Check if live session is completed and force show results
  useEffect(() => {
    const isLiveSession = liveSession.activeLiveSession !== null;
    const isSessionCompleted = liveSession.activeLiveSession?.status === 'completed';

    if (isLiveSession && isSessionCompleted && currentAttempt && !testCompleted) {
      // Session ended, show results even if test wasn't fully completed
      setTestCompleted(true);
    }
  }, [liveSession.activeLiveSession, currentAttempt, testCompleted]);

  useEffect(() => {
    // Start test attempt if not already started
    if (currentTest && !currentAttempt) {
      dispatch(
        startTestAttempt({
          testId: currentTest.id,
          testTitle: currentTest.title,
          playerName: player.name,
          sessionId: player.sessionId || 'no-session',
        })
      );
    }
  }, [currentTest, currentAttempt, dispatch, player]);

  if (!currentTest) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '4em', marginBottom: '20px' }}>❌</div>
        <h2>Тест не знайдено</h2>
        <button onClick={onBack} className="btn-primary">
          Назад
        </button>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;

  const handleAnswer = (answer) => {
    if (isAnswered) return; // Prevent answering twice

    setUserAnswer(answer);
    let isCorrect = false;

    // Check correctness based on question type
    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'true-false') {
      isCorrect = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'fill-blank') {
      isCorrect =
        answer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    }

    const pointsEarned = isCorrect ? currentQuestion.points : 0;

    // Record the answer in Redux
    dispatch(
      recordAnswer({
        questionId: currentQuestion.id,
        userAnswer: answer,
        isCorrect,
        pointsEarned,
      })
    );

    // Update score in game state
    updateScore(pointsEarned, {
      question: currentQuestion.question,
      correct: isCorrect,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
    });

    setIsAnswered(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      // Test completed
      dispatch(completeTestAttempt());
      if (currentAttempt) {
        dispatch(submitTestAttempt(currentAttempt));
      }
      setTestCompleted(true);
    }
  };

  const handleFinish = () => {
    dispatch(resetCurrentTest());
    onBack();
  };

  // Test completion screen
  if (testCompleted && currentAttempt) {
    const isLiveSession = liveSession.activeLiveSession !== null;
    const isSessionCompleted = liveSession.activeLiveSession?.status === 'completed';
    const wasFullyCompleted = currentQuestionIndex >= currentTest.questions.length - 1;

    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '5em', marginBottom: '20px' }}>
          {isSessionCompleted && !wasFullyCompleted ? '⏱️' : '🎉'}
        </div>
        <h1 style={{ color: isSessionCompleted && !wasFullyCompleted ? '#ff9800' : '#28a745', marginBottom: '10px' }}>
          {isSessionCompleted && !wasFullyCompleted ? 'Сесію завершено!' : 'Тест завершено!'}
        </h1>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>{currentTest.title}</h2>
        {isLiveSession && (
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: isSessionCompleted ? '#fff3cd' : '#e7f0ff',
              borderRadius: '20px',
              color: isSessionCompleted ? '#856404' : '#667eea',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '20px',
              border: `2px solid ${isSessionCompleted ? '#ffc107' : '#667eea'}`,
            }}
          >
            {isSessionCompleted ? '⏱️ Сесія закрита адміністратором' : '📡 Сесія в реальному часі'}: {liveSession.activeLiveSession.title}
          </div>
        )}
        {isSessionCompleted && !wasFullyCompleted && (
          <p style={{ color: '#856404', marginBottom: '20px', fontSize: '1.1em' }}>
            Вчитель завершив сесію. Ось ваші результати:
          </p>
        )}

        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            marginBottom: '30px',
            maxWidth: '500px',
            margin: '0 auto 30px',
          }}
        >
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>
            {currentAttempt.percentage}%
          </div>
          <div style={{ fontSize: '1.5em', marginBottom: '20px' }}>
            {currentAttempt.totalScore} / {currentAttempt.maxScore} балів
          </div>
          <div style={{ fontSize: '1.2em' }}>
            Правильних відповідей: {currentAttempt.answers.filter((a) => a.isCorrect).length} /{' '}
            {currentTest.questions.length}
          </div>
        </div>

        {/* Grade Message */}
        <div style={{ fontSize: '1.3em', color: '#666', marginBottom: '30px' }}>
          {currentAttempt.percentage >= 90
            ? '🌟 Відмінно! Ти справжній експерт!'
            : currentAttempt.percentage >= 75
            ? '👏 Дуже добре! Продовжуй в тому ж дусі!'
            : currentAttempt.percentage >= 60
            ? '👍 Добре! Ти на правильному шляху!'
            : currentAttempt.percentage >= 50
            ? '💪 Непогано! Ще трохи практики!'
            : '📚 Потрібно ще попрацювати. Не здавайся!'}
        </div>

        {/* Detailed Results */}
        <details
          style={{
            maxWidth: '600px',
            margin: '0 auto 30px',
            textAlign: 'left',
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <summary
            style={{
              fontWeight: 'bold',
              fontSize: '1.2em',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            📊 Детальні результати
          </summary>
          {currentTest.questions.map((q, index) => {
            const answer = currentAttempt.answers.find((a) => a.questionId === q.id);
            return (
              <div
                key={q.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  background: 'white',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${answer?.isCorrect ? '#28a745' : '#dc3545'}`,
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
                  {index + 1}. {q.question}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <div>
                    {answer?.isCorrect ? '✅' : '❌'} Твоя відповідь:{' '}
                    {q.type === 'multiple-choice' && q.options
                      ? q.options[parseInt(answer?.userAnswer || '0')]
                      : answer?.userAnswer}
                  </div>
                  {!answer?.isCorrect && (
                    <div style={{ color: '#28a745', marginTop: '5px' }}>
                      ✓ Правильна відповідь:{' '}
                      {q.type === 'multiple-choice' && q.options
                        ? q.options[parseInt(q.correctAnswer)]
                        : q.type === 'true-false'
                        ? q.correctAnswer === 'true'
                          ? 'Так'
                          : 'Ні'
                        : q.correctAnswer}
                    </div>
                  )}
                  {q.explanation && (
                    <div
                      style={{ marginTop: '8px', fontStyle: 'italic', color: '#888', fontSize: '13px' }}
                    >
                      💡 {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </details>

        <button
          onClick={handleFinish}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isLiveSession ? '🏠 На головну' : '🏠 Повернутись'}
        </button>
      </div>
    );
  }

  // Taking the test
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <button onClick={onBack} className="back-btn">
          ← Назад
        </button>
        <h2 style={{ color: '#667eea', textAlign: 'center', marginTop: '10px' }}>
          {currentTest.title}
        </h2>
        {currentTest.description && (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            {currentTest.description}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          <span>
            Питання {currentQuestionIndex + 1} з {currentTest.questions.length}
          </span>
          <span>{currentAttempt?.totalScore || 0} балів</span>
        </div>
        <div
          style={{
            height: '10px',
            background: '#e0e0e0',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          background: 'white',
          border: '2px solid #667eea',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '1.3em' }}>
          {currentQuestion.question}
        </h3>

        <div style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
          {currentQuestion.points} балів
        </div>

        {/* Multiple Choice */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div style={{ display: 'grid', gap: '12px' }}>
            {currentQuestion.options.map((option, index) => {
              if (!option.trim()) return null;
              const indexStr = index.toString();
              const isSelected = userAnswer === indexStr;
              const isCorrect = currentQuestion.correctAnswer === indexStr;
              const showResult = isAnswered;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(indexStr)}
                  disabled={isAnswered}
                  style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    textAlign: 'left',
                    background: showResult
                      ? isCorrect
                        ? '#d4edda'
                        : isSelected
                        ? '#f8d7da'
                        : 'white'
                      : isSelected
                      ? '#e3f2fd'
                      : 'white',
                    color: '#333',
                    border: showResult
                      ? isCorrect
                        ? '2px solid #28a745'
                        : isSelected
                        ? '2px solid #dc3545'
                        : '2px solid #ddd'
                      : isSelected
                      ? '2px solid #667eea'
                      : '2px solid #ddd',
                    borderRadius: '10px',
                    cursor: isAnswered ? 'not-allowed' : 'pointer',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {showResult && isCorrect && '✅ '}
                  {showResult && isSelected && !isCorrect && '❌ '}
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {currentQuestion.type === 'true-false' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {['true', 'false'].map((value) => {
              const isSelected = userAnswer === value;
              const isCorrect = currentQuestion.correctAnswer === value;
              const showResult = isAnswered;

              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  disabled={isAnswered}
                  style={{
                    padding: '20px',
                    fontSize: '18px',
                    background: showResult
                      ? isCorrect
                        ? '#d4edda'
                        : isSelected
                        ? '#f8d7da'
                        : 'white'
                      : isSelected
                      ? '#e3f2fd'
                      : 'white',
                    color: '#333',
                    border: showResult
                      ? isCorrect
                        ? '3px solid #28a745'
                        : isSelected
                        ? '3px solid #dc3545'
                        : '2px solid #ddd'
                      : isSelected
                      ? '3px solid #667eea'
                      : '2px solid #ddd',
                    borderRadius: '12px',
                    cursor: isAnswered ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {showResult && isCorrect && '✅ '}
                  {showResult && isSelected && !isCorrect && '❌ '}
                  {value === 'true' ? 'Так ✓' : 'Ні ✗'}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentQuestion.type === 'fill-blank' && (
          <div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Введіть відповідь..."
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                border: isAnswered
                  ? userAnswer.trim().toLowerCase() ===
                    currentQuestion.correctAnswer.trim().toLowerCase()
                    ? '3px solid #28a745'
                    : '3px solid #dc3545'
                  : '2px solid #ddd',
                borderRadius: '10px',
                marginBottom: '15px',
                background: isAnswered ? '#f8f9fa' : 'white',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAnswered && userAnswer.trim()) {
                  handleAnswer(userAnswer);
                }
              }}
            />
            {!isAnswered && (
              <button
                onClick={() => handleAnswer(userAnswer)}
                disabled={!userAnswer.trim()}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  background: userAnswer.trim() ? '#667eea' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                }}
              >
                Відповісти
              </button>
            )}
            {isAnswered &&
              userAnswer.trim().toLowerCase() !==
                currentQuestion.correctAnswer.trim().toLowerCase() && (
                <div
                  style={{
                    marginTop: '15px',
                    padding: '12px',
                    background: '#d4edda',
                    border: '2px solid #28a745',
                    borderRadius: '8px',
                    color: '#155724',
                  }}
                >
                  ✅ Правильна відповідь: <strong>{currentQuestion.correctAnswer}</strong>
                </div>
              )}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              background: '#fff8e1',
              border: '2px solid #ffc107',
              borderRadius: '10px',
              fontSize: '15px',
              color: '#856404',
            }}
          >
            <strong>💡 Пояснення:</strong> {currentQuestion.explanation}
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <button
              onClick={handleNext}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {currentQuestionIndex < currentTest.questions.length - 1
                ? 'Наступне питання →'
                : 'Завершити тест 🎉'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
