import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTests, deleteExistingTest } from '../../store/slices/testSlice';
import TestCreator from './TestCreator';
import AITestGenerator from './AITestGenerator';
import './TestList.css';

export default function TestList() {
  const dispatch = useDispatch();
  const { allTests, loading } = useSelector((state) => state.test);

  const [showCreator, setShowCreator] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [filterClass, setFilterClass] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTests());
  }, [dispatch]);

  const handleDelete = async (testId, testTitle) => {
    if (confirm(`Видалити тест "${testTitle}"? Це видалить всі пов'язані результати.`)) {
      try {
        await dispatch(deleteExistingTest(testId));
        alert('Тест видалено');
      } catch (error) {
        alert('Помилка видалення тесту');
      }
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setShowCreator(true);
  };

  const handleCloseCreator = () => {
    setShowCreator(false);
    setEditingTest(null);
  };

  const handleSuccess = () => {
    dispatch(fetchAllTests());
  };

  const handleAITestGenerated = (generatedTest) => {
    // Close AI generator and open test creator with pre-filled data
    setShowAIGenerator(false);
    setEditingTest(generatedTest);
    setShowCreator(true);
  };

  const filteredTests = filterClass
    ? allTests.filter((t) => t.playerClass === filterClass)
    : allTests;

  return (
    <div className="test-list-container">
      {/* Header */}
      <div className="test-list-header">
        <h2 className="test-list-title">📝 Власні Тести ({filteredTests.length})</h2>
        <div className="header-buttons">
          <button
            onClick={() => setShowAIGenerator(true)}
            className="ai-generator-btn"
          >
            🤖 Створити тест за допомогою ChatGPT
          </button>
          <button
            onClick={() => setShowCreator(true)}
            className="create-test-btn"
          >
            ➕ Створити новий тест
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="test-filter">
        <label className="filter-label">Фільтр за класом:</label>
        <button
          onClick={() => setFilterClass(null)}
          className={`filter-class-btn ${filterClass === null ? 'active' : ''}`}
        >
          Всі
        </button>
        <button
          onClick={() => setFilterClass(2)}
          className={`filter-class-btn ${filterClass === 2 ? 'active' : ''}`}
        >
          2 клас
        </button>
        <button
          onClick={() => setFilterClass(4)}
          className={`filter-class-btn ${filterClass === 4 ? 'active' : ''}`}
        >
          4 клас
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="test-loading">
          Завантаження тестів...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTests.length === 0 && (
        <div className="test-empty-state">
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">Ще немає тестів</h3>
          <p className="empty-description">Створіть свій перший тест, натиснувши кнопку вгорі</p>
        </div>
      )}

      {/* Tests Grid */}
      {!loading && filteredTests.length > 0 && (
        <div className="tests-grid">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className={`test-card ${test.isActive ? 'active' : ''}`}
            >
              {/* Status Badge */}
              <div className={`status-badge ${test.isActive ? 'active' : 'inactive'}`}>
                {test.isActive ? '✅ Активний' : '⏸️ Неактивний'}
              </div>

              {/* Test Info */}
              <div className="test-info">
                <h3 className="test-title">
                  {test.title}
                </h3>
                {test.description && (
                  <p className="test-description">
                    {test.description}
                  </p>
                )}
                <div className="test-meta">
                  <div>👤 Автор: {test.createdBy}</div>
                  <div>
                    🎓 Клас: {test.playerClass}
                  </div>
                  <div>
                    📋 Питань: {test.questions.length} | 🎯 Балів: {test.totalPoints}
                  </div>
                  {test.createdAt && (
                    <div style={{ marginTop: '5px', fontSize: '12px' }}>
                      🕒 Створено:{' '}
                      {new Date(test.createdAt?.seconds * 1000 || test.createdAt).toLocaleDateString('uk-UA')}
                    </div>
                  )}
                </div>
              </div>

              {/* Questions Preview */}
              <details className="test-questions-preview">
                <summary className="questions-summary">
                  🔍 Переглянути питання
                </summary>
                <div className="questions-list">
                  {test.questions.map((q, index) => (
                    <div
                      key={q.id}
                      className="question-item"
                    >
                      <div className="question-text">
                        {index + 1}. {q.question}
                      </div>
                      <div className="question-meta">
                        Тип:{' '}
                        {q.type === 'multiple-choice'
                          ? 'Вибір'
                          : q.type === 'true-false'
                          ? 'Так/Ні'
                          : 'Заповнення'}
                        {' | '}
                        {q.points} балів
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              {/* Actions */}
              <div className="test-actions">
                <button
                  onClick={() => handleEdit(test)}
                  className="edit-btn"
                >
                  ✏️ Редагувати
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.title)}
                  className="delete-btn"
                >
                  🗑️ Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Test Generator Modal */}
      {showAIGenerator && (
        <AITestGenerator
          onClose={() => setShowAIGenerator(false)}
          onTestGenerated={handleAITestGenerated}
        />
      )}

      {/* Test Creator Modal */}
      {showCreator && (
        <TestCreator
          existingTest={editingTest}
          onClose={handleCloseCreator}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
