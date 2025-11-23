import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createNewTest, updateExistingTest } from '../../store/slices/testSlice';
import { auth } from '../../firebase/config';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Button, Card, Alert, ErrorAlert, SuccessAlert } from '../common';
import { colors, spacing, fontSize, borderRadius, gap } from '../../styles/tokens';

export default function TestCreator({ existingTest, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });

  // Test metadata
  const [title, setTitle] = useState(existingTest?.title || '');
  const [description, setDescription] = useState(existingTest?.description || '');
  const [playerClass, setPlayerClass] = useState(existingTest?.playerClass || 1);
  const [createdBy, setCreatedBy] = useState(existingTest?.createdBy || '');
  const [isActive, setIsActive] = useState(existingTest?.isActive ?? true);

  // Timer settings
  const [timerEnabled, setTimerEnabled] = useState(existingTest?.timerEnabled ?? false);
  const [timeLimit, setTimeLimit] = useState(existingTest?.timeLimit || 15);

  // Auto-fill author from current user
  useEffect(() => {
    if (!existingTest && auth.currentUser) {
      setCreatedBy(auth.currentUser.email || auth.currentUser.displayName || '');
    }
  }, [existingTest]);

  // Questions
  const [questions, setQuestions] = useState(existingTest?.questions || []);

  // Current question being added/edited
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '0',
    points: 10,
    explanation: '',
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage({ type: '', message: '' }), 5000);
  };

  const addOrUpdateQuestion = () => {
    if (!currentQuestion.question.trim()) {
      showAlert('error', 'Питання не може бути порожнім');
      return;
    }

    if (currentQuestion.type === 'multiple-choice') {
      const filledOptions = currentQuestion.options.filter((opt) => opt.trim());
      if (filledOptions.length < 2) {
        showAlert('error', 'Додайте принаймні 2 варіанти відповідей');
        return;
      }
    }

    const questionToAdd = {
      id: currentQuestion.id || `q_${Date.now()}`,
      type: currentQuestion.type,
      question: currentQuestion.question,
      options: currentQuestion.type === 'multiple-choice' ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: parseInt(currentQuestion.points) || 10,
      explanation: currentQuestion.explanation,
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = questionToAdd;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
      showAlert('success', 'Питання оновлено');
    } else {
      setQuestions([...questions, questionToAdd]);
      showAlert('success', 'Питання додано');
    }

    // Reset form
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '0',
      points: 10,
      explanation: '',
    });
  };

  const editQuestion = (index) => {
    const q = questions[index];
    setCurrentQuestion({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options || ['', '', '', ''],
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation || '',
    });
    setEditingIndex(index);
  };

  const deleteQuestion = (index) => {
    if (confirm('Видалити це питання?')) {
      setQuestions(questions.filter((_, i) => i !== index));
      showAlert('success', 'Питання видалено');
    }
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  const handleSaveTest = async () => {
    if (!title.trim()) {
      showAlert('error', 'Введіть назву тесту');
      return;
    }

    if (!createdBy.trim()) {
      showAlert('error', "Введіть ваше ім'я");
      return;
    }

    if (questions.length === 0) {
      showAlert('error', 'Додайте хоча б одне питання');
      return;
    }

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const testData = {
      title,
      description,
      playerClass: parseInt(playerClass),
      questions,
      totalPoints,
      createdBy,
      isActive,
      timerEnabled,
      timeLimit: timerEnabled ? parseInt(timeLimit) : null,
    };

    setSaving(true);
    try {
      if (existingTest && existingTest.id) {
        await dispatch(updateExistingTest({ testId: existingTest.id, updates: testData }));
      } else {
        await dispatch(createNewTest(testData));
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving test:', error);
      showAlert('error', 'Помилка збереження тесту');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" closeOnOverlayClick={false}>
      <ModalHeader
        title={existingTest ? 'Редагувати тест' : 'Створити новий тест'}
        icon="fa-clipboard-list"
        gradient
        onClose={onClose}
      />

      <ModalBody padding="lg">
        {alertMessage.message && (
          alertMessage.type === 'error' ? (
            <ErrorAlert onClose={() => setAlertMessage({ type: '', message: '' })}>
              {alertMessage.message}
            </ErrorAlert>
          ) : (
            <SuccessAlert onClose={() => setAlertMessage({ type: '', message: '' })}>
              {alertMessage.message}
            </SuccessAlert>
          )
        )}

        {/* Test Metadata */}
        <Card
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <i className="fas fa-info-circle"></i>
              <span>Інформація про тест</span>
            </div>
          }
          gradient
          padding="lg"
          style={{ marginBottom: spacing.lg }}
        >
          <Input
            label="Назва тесту"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Наприклад: Тест з математики"
            icon="fa-heading"
            required
            style={{ marginBottom: spacing.md }}
          />

          <Textarea
            label="Опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Короткий опис тесту..."
            rows={2}
            style={{ marginBottom: spacing.md }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: gap.md, marginBottom: spacing.md }}>
            <div>
              <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
                Клас *
              </label>
              <select
                value={playerClass}
                onChange={(e) => setPlayerClass(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  fontSize: fontSize.base,
                  borderRadius: borderRadius.md,
                  border: `2px solid ${colors.gray200}`,
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((cls) => (
                  <option key={cls} value={cls}>{cls} клас</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <Input
                label="Автор"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="Ваше ім'я"
                icon="fa-user"
                required
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: spacing.md }}>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ marginRight: spacing.xs, width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: fontSize.base }}>Активний (може бути призначений до сесій)</span>
          </label>

          {/* Timer Settings */}
          <div style={{
            padding: spacing.md,
            background: timerEnabled ? colors.warningBg : colors.gray100,
            borderRadius: borderRadius.md,
            border: timerEnabled ? `2px solid ${colors.warning}` : `2px solid ${colors.gray200}`
          }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: timerEnabled ? spacing.sm : 0 }}>
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                style={{ marginRight: spacing.xs, width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: fontSize.base, fontWeight: 'bold' }}>
                <i className="fas fa-clock" style={{ marginRight: spacing.xs }}></i>
                Увімкнути таймер
              </span>
            </label>

            {timerEnabled && (
              <div style={{ marginTop: spacing.sm }}>
                <label style={{ display: 'block', marginBottom: spacing.xs, fontSize: fontSize.sm, color: colors.gray600 }}>
                  Час на виконання тесту (хвилини)
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: spacing.sm,
                    fontSize: fontSize.base,
                    borderRadius: borderRadius.md,
                    border: `2px solid ${colors.warning}`,
                    background: colors.white,
                  }}
                >
                  <option value={5}>5 хвилин</option>
                  <option value={10}>10 хвилин</option>
                  <option value={15}>15 хвилин</option>
                  <option value={20}>20 хвилин</option>
                  <option value={30}>30 хвилин</option>
                  <option value={45}>45 хвилин</option>
                  <option value={60}>60 хвилин (1 година)</option>
                  <option value={90}>90 хвилин</option>
                </select>
                <small style={{ display: 'block', marginTop: spacing.xs, color: colors.gray500, fontSize: fontSize.sm }}>
                  <i className="fas fa-info-circle" style={{ marginRight: spacing.xs }}></i>
                  Тест автоматично завершиться, коли час вичерпається
                </small>
              </div>
            )}
          </div>
        </Card>

        {/* Add/Edit Question */}
        <Card
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <i className={`fas ${editingIndex !== null ? 'fa-edit' : 'fa-plus-circle'}`}></i>
              <span>{editingIndex !== null ? 'Редагувати питання' : 'Додати питання'}</span>
            </div>
          }
          padding="lg"
          style={{ marginBottom: spacing.lg, background: colors.infoBg }}
        >
          <div style={{ marginBottom: spacing.md }}>
            <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
              Тип питання
            </label>
            <select
              value={currentQuestion.type}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  type: e.target.value,
                  options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : [],
                  correctAnswer: e.target.value === 'true-false' ? 'true' : '0',
                })
              }
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: fontSize.base,
                borderRadius: borderRadius.md,
                border: `2px solid ${colors.gray200}`,
              }}
            >
              <option value="multiple-choice">Множинний вибір (4 варіанти)</option>
              <option value="true-false">Так/Ні</option>
              <option value="fill-blank">Заповнити пропуск</option>
            </select>
          </div>

          <Input
            label="Питання"
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            placeholder="Введіть питання..."
            icon="fa-question-circle"
            required
            style={{ marginBottom: spacing.md }}
          />

          {/* Multiple Choice Options */}
          {currentQuestion.type === 'multiple-choice' && (
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
                Варіанти відповідей
              </label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: spacing.xs, gap: spacing.xs }}>
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={currentQuestion.correctAnswer === index.toString()}
                    onChange={() =>
                      setCurrentQuestion({ ...currentQuestion, correctAnswer: index.toString() })
                    }
                    style={{ cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                    placeholder={`Варіант ${index + 1}`}
                    style={{
                      flex: 1,
                      padding: spacing.sm,
                      fontSize: fontSize.base,
                      borderRadius: borderRadius.md,
                      border: `2px solid ${colors.gray200}`,
                    }}
                  />
                </div>
              ))}
              <small style={{ color: colors.gray500, fontSize: fontSize.sm }}>
                Оберіть правильну відповідь радіо-кнопкою
              </small>
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === 'true-false' && (
            <div style={{ marginBottom: spacing.md }}>
              <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
                Правильна відповідь
              </label>
              <div>
                <label style={{ marginRight: spacing.md, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="true-false"
                    checked={currentQuestion.correctAnswer === 'true'}
                    onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'true' })}
                    style={{ marginRight: spacing.xs, cursor: 'pointer' }}
                  />
                  Так
                </label>
                <label style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="true-false"
                    checked={currentQuestion.correctAnswer === 'false'}
                    onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: 'false' })}
                    style={{ marginRight: spacing.xs, cursor: 'pointer' }}
                  />
                  Ні
                </label>
              </div>
            </div>
          )}

          {/* Fill Blank */}
          {currentQuestion.type === 'fill-blank' && (
            <div style={{ marginBottom: spacing.md }}>
              <Input
                label="Правильна відповідь"
                value={currentQuestion.correctAnswer}
                onChange={(e) =>
                  setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })
                }
                placeholder="Введіть правильну відповідь..."
                icon="fa-check"
                required
                helperText="Відповідь має точно збігатися (без урахування регістру)"
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: gap.md, marginBottom: spacing.md }}>
            <Input
              label="Бали"
              type="number"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: e.target.value })}
              min="1"
              icon="fa-star"
            />

            <Input
              label="Пояснення (опціонально)"
              value={currentQuestion.explanation}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })
              }
              placeholder="Пояснення відповіді..."
              icon="fa-lightbulb"
            />
          </div>

          <div style={{ display: 'flex', gap: gap.sm }}>
            <Button
              variant="primary"
              icon={editingIndex !== null ? 'fa-check' : 'fa-plus'}
              onClick={addOrUpdateQuestion}
            >
              {editingIndex !== null ? 'Оновити питання' : 'Додати питання'}
            </Button>

            {editingIndex !== null && (
              <Button
                variant="neutral"
                icon="fa-times"
                onClick={() => {
                  setCurrentQuestion({
                    type: 'multiple-choice',
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: '0',
                    points: 10,
                    explanation: '',
                  });
                  setEditingIndex(null);
                }}
              >
                Скасувати
              </Button>
            )}
          </div>
        </Card>

        {/* Questions List */}
        {questions.length > 0 && (
          <Card
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <i className="fas fa-list-ol"></i>
                  <span>Питання ({questions.length})</span>
                </div>
                <span style={{ fontSize: fontSize.base, fontWeight: 'normal' }}>
                  Всього балів: {questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
            }
            gradient
            padding="md"
          >
            {questions.map((q, index) => (
              <div
                key={q.id}
                style={{
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  background: colors.white,
                  border: `2px solid ${colors.gray200}`,
                  borderRadius: borderRadius.md,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: spacing.xs, color: colors.gray700, fontSize: fontSize.md }}>
                      {index + 1}. {q.question} <span style={{ color: colors.primary }}>({q.points} балів)</span>
                    </div>
                    <div style={{ fontSize: fontSize.sm, color: colors.gray500, marginBottom: spacing.xs }}>
                      Тип: {q.type === 'multiple-choice' ? 'Множинний вибір' : q.type === 'true-false' ? 'Так/Ні' : 'Заповнити пропуск'}
                    </div>
                    {q.type === 'multiple-choice' && q.options && (
                      <div style={{ fontSize: fontSize.sm, color: colors.gray600 }}>
                        {q.options.map((opt, i) => (
                          <div key={i} style={{ marginLeft: spacing.sm }}>
                            {i === parseInt(q.correctAnswer) ? (
                              <i className="fas fa-check-circle" style={{ color: colors.success, marginRight: spacing.xs }}></i>
                            ) : (
                              <i className="far fa-circle" style={{ color: colors.gray400, marginRight: spacing.xs }}></i>
                            )}
                            {opt || '(порожньо)'}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'true-false' && (
                      <div style={{ fontSize: fontSize.sm, color: colors.gray600 }}>
                        Правильна відповідь: {q.correctAnswer === 'true' ? 'Так' : 'Ні'}
                      </div>
                    )}
                    {q.type === 'fill-blank' && (
                      <div style={{ fontSize: fontSize.sm, color: colors.gray600 }}>
                        Правильна відповідь: {q.correctAnswer}
                      </div>
                    )}
                    {q.explanation && (
                      <div style={{ fontSize: fontSize.sm, color: colors.gray500, marginTop: spacing.xs, fontStyle: 'italic' }}>
                        <i className="fas fa-lightbulb" style={{ marginRight: spacing.xs }}></i>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: spacing.xs, marginLeft: spacing.sm }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      icon="fa-arrow-up"
                      style={{ minWidth: '40px' }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === questions.length - 1}
                      icon="fa-arrow-down"
                      style={{ minWidth: '40px' }}
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => editQuestion(index)}
                      icon="fa-edit"
                      style={{ minWidth: '40px' }}
                    />
                    <Button
                      size="sm"
                      variant="error"
                      onClick={() => deleteQuestion(index)}
                      icon="fa-trash"
                      style={{ minWidth: '40px' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </ModalBody>

      <ModalFooter align="right" gap="md">
        <Button variant="neutral" onClick={onClose} icon="fa-times">
          Скасувати
        </Button>
        <Button
          variant="success"
          onClick={handleSaveTest}
          loading={saving}
          disabled={saving}
          icon="fa-save"
        >
          {existingTest ? 'Зберегти зміни' : 'Створити тест'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
