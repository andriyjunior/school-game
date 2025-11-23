import { useState } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Button, Card, ErrorAlert, InfoAlert } from '../common';
import { colors, spacing, fontSize, borderRadius, gap } from '../../styles/tokens';

export default function AITestGenerator({ onClose, onTestGenerated }) {
  const [subject, setSubject] = useState('computer-science');
  const [playerClass, setPlayerClass] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const subjects = [
    { value: 'computer-science', label: 'Інформатика / Computer Science' },
    { value: 'math', label: 'Математика' },
    { value: 'ukrainian', label: 'Українська мова' },
    { value: 'english', label: 'Англійська мова' },
    { value: 'science', label: 'Природознавство' },
    { value: 'reading', label: 'Читання' },
    { value: 'custom', label: 'Інший предмет (вкажіть в промпті)' },
  ];

  const subjectDescriptions = {
    'computer-science': 'основи програмування, алгоритми, комп\'ютерна грамотність',
    'math': 'арифметика, геометрія, логічні задачі',
    'ukrainian': 'граматика, правопис, читання',
    'english': 'vocabulary, grammar, reading comprehension',
    'science': 'природа, тварини, рослини, явища',
    'reading': 'розуміння тексту, аналіз, словниковий запас',
    'custom': 'будь-який предмет за вашим вибором',
  };

  const handleGenerate = async () => {
    if (!customPrompt.trim()) {
      setError('Будь ласка, введіть опис тесту');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const corsProxy = 'https://corsproxy.io/?';
      const apiUrl = 'https://api.openai.com/v1/chat/completions';

      const response = await axios.post(
        corsProxy + encodeURIComponent(apiUrl),
        {
          model: 'gpt-4o',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: generatePrompt(),
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedText = response.data.choices[0].message.content;

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Не вдалося розпізнати згенерований тест');
      }

      const testData = JSON.parse(jsonMatch[0]);

      if (!testData.title || !testData.questions || !Array.isArray(testData.questions)) {
        throw new Error('Невірний формат тесту');
      }

      testData.questions = testData.questions.map((q, index) => ({
        ...q,
        id: `q_${Date.now()}_${index}`,
      }));

      testData.totalPoints = testData.questions.reduce((sum, q) => sum + q.points, 0);
      testData.playerClass = parseInt(playerClass);

      onTestGenerated(testData);
    } catch (err) {
      console.error('Error generating test:', err);
      if (err.response) {
        setError(`Помилка API: ${err.response.status} - ${err.response.data?.error?.message || err.message}`);
      } else if (err.request) {
        setError(`Помилка з'єднання: Не вдалося підключитися до API. Можлива CORS помилка.`);
      } else {
        setError(`Помилка генерації тесту: ${err.message}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  const generatePrompt = () => {
    const subjectInfo = subject !== 'custom' ? subjects.find((s) => s.value === subject)?.label : '';
    const ageInfo = `${playerClass} клас (${6 + playerClass}-${7 + playerClass} років)`;

    return `Ти - експерт у створенні освітніх тестів для початкової школи.

Створи тест з наступними параметрами:
- Предмет: ${subjectInfo || 'за описом нижче'}
- Вік учнів: ${ageInfo}
- Опис тесту: ${customPrompt}

ВАЖЛИВО: Тест має бути українською мовою і підходити для дітей ${ageInfo}.

Використовуй різні типи питань:
1. "multiple-choice" - питання з 4 варіантами відповідей (correctAnswer - індекс від 0 до 3)
2. "true-false" - питання так/ні (correctAnswer - "true" або "false")

Поверни ТІЛЬКИ JSON об'єкт в такому форматі (без додаткового тексту):

{
  "title": "Назва тесту",
  "description": "Короткий опис тесту (1-2 речення)",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "Текст питання?",
      "options": ["Варіант 1", "Варіант 2", "Варіант 3", "Варіант 4"],
      "correctAnswer": "0",
      "points": 10,
      "explanation": "Пояснення чому це правильна відповідь"
    },
    {
      "type": "true-false",
      "question": "Текст питання?",
      "correctAnswer": "true",
      "points": 5,
      "explanation": "Пояснення"
    }
  ]
}

Створи РІВНО ${questionCount} питань різної складності. Переконайся що:
- Питання цікаві та зрозумілі для дітей
- Є різні типи питань
- Пояснення допомагають учням зрозуміти матеріал
- Бали розподілені за складністю (легкі 5 балів, середні 10 балів, складні 15 балів)`;
  };

  return (
    <Modal isOpen={true} onClose={!generating ? onClose : undefined} size="md" closeOnOverlayClick={!generating}>
      <ModalHeader
        title="Створити тест за допомогою ChatGPT"
        subtitle="ChatGPT (GPT-4o) згенерує тест на основі ваших параметрів. Ви зможете його відредагувати перед збереженням."
        icon="fa-robot"
        gradient
        onClose={!generating ? onClose : undefined}
      />

      <ModalBody padding="lg">
        <div style={{ display: 'grid', gap: gap.md }}>
          {/* Subject Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
              Предмет *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={generating}
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: fontSize.base,
                borderRadius: borderRadius.md,
                border: `2px solid ${colors.gray200}`,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.gray500 }}>
              {subjectDescriptions[subject]}
            </div>
          </div>

          {/* Class Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
              Клас *
            </label>
            <select
              value={playerClass}
              onChange={(e) => setPlayerClass(parseInt(e.target.value))}
              disabled={generating}
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: fontSize.base,
                borderRadius: borderRadius.md,
                border: `2px solid ${colors.gray200}`,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((cls) => (
                <option key={cls} value={cls}>
                  {cls} клас ({6 + cls}-{7 + cls} років)
                </option>
              ))}
            </select>
          </div>

          {/* Question Count Selection */}
          <div>
            <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
              Кількість питань *
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              disabled={generating}
              style={{
                width: '100%',
                padding: spacing.sm,
                fontSize: fontSize.base,
                borderRadius: borderRadius.md,
                border: `2px solid ${colors.gray200}`,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
            >
              {[5, 10, 15, 20, 25, 30].map((count) => (
                <option key={count} value={count}>
                  {count} питань
                </option>
              ))}
            </select>
            <div style={{ marginTop: spacing.xs, fontSize: fontSize.sm, color: colors.gray500 }}>
              Більше питань = довший час генерації
            </div>
          </div>

          {/* Custom Prompt */}
          <Textarea
            label="Опис тесту"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Наприклад: 'Створи тест про алгоритми сортування для початківців' або 'Тест про тварин України з цікавими фактами'"
            rows={5}
            disabled={generating}
            required
            helperText="Опишіть тему, складність та особливі вимоги до тесту"
          />

          {/* Error Message */}
          {error && (
            <ErrorAlert onClose={() => setError('')}>
              {error}
            </ErrorAlert>
          )}

          {/* Generating Status */}
          {generating && (
            <Card padding="lg" style={{ background: colors.infoBg, border: `2px solid ${colors.info}`, textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2em',
                  marginBottom: spacing.sm,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              >
                <i className="fas fa-robot"></i>
              </div>
              <div style={{ fontWeight: 'bold', color: colors.info, marginBottom: spacing.xs, fontSize: fontSize.md }}>
                ChatGPT генерує тест...
              </div>
              <div style={{ fontSize: fontSize.sm, color: colors.gray600 }}>
                Це може зайняти 10-30 секунд. Будь ласка, зачекайте.
              </div>
            </Card>
          )}

          {/* Info Box */}
          <InfoAlert>
            <div style={{ fontWeight: 'bold', marginBottom: spacing.xs }}>
              <i className="fas fa-lightbulb" style={{ marginRight: spacing.xs }}></i>
              Підказки для кращих результатів:
            </div>
            <ul style={{ margin: 0, paddingLeft: spacing.md, fontSize: fontSize.sm }}>
              <li>Чітко опишіть тему та бажану кількість питань</li>
              <li>Вкажіть рівень складності (легкий, середній, складний)</li>
              <li>Можете вказати конкретні теми для питань</li>
              <li>Згенерований тест можна буде відредагувати перед збереженням</li>
            </ul>
          </InfoAlert>
        </div>
      </ModalBody>

      <ModalFooter align="right" gap="md">
        <Button
          variant="neutral"
          onClick={onClose}
          disabled={generating}
          icon="fa-times"
        >
          Скасувати
        </Button>
        <Button
          variant="success"
          onClick={handleGenerate}
          disabled={generating || !customPrompt.trim()}
          loading={generating}
          icon="fa-magic"
        >
          {generating ? 'Генерація...' : 'Згенерувати тест'}
        </Button>
      </ModalFooter>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Modal>
  );
}
