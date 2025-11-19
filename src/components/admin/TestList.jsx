import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTests, deleteExistingTest } from '../../store/slices/testSlice';
import TestCreator from './TestCreator';
import AITestGenerator from './AITestGenerator';

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
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ color: '#667eea', margin: 0 }}>📝 Власні Тести ({filteredTests.length})</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowAIGenerator(true)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🤖 Створити тест за допомогою ChatGPT
          </button>
          <button
            onClick={() => setShowCreator(true)}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ➕ Створити новий тест
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Фільтр за класом:</label>
        <button
          onClick={() => setFilterClass(null)}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            background: filterClass === null ? '#667eea' : '#e0e0e0',
            color: filterClass === null ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Всі
        </button>
        <button
          onClick={() => setFilterClass(2)}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            background: filterClass === 2 ? '#667eea' : '#e0e0e0',
            color: filterClass === 2 ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          2 клас
        </button>
        <button
          onClick={() => setFilterClass(4)}
          style={{
            padding: '8px 16px',
            background: filterClass === 4 ? '#667eea' : '#e0e0e0',
            color: filterClass === 4 ? 'white' : '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          4 клас
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Завантаження тестів...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTests.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            background: '#f8f9fa',
            borderRadius: '12px',
          }}
        >
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>📝</div>
          <h3 style={{ color: '#666' }}>Ще немає тестів</h3>
          <p style={{ color: '#999' }}>Створіть свій перший тест, натиснувши кнопку вгорі</p>
        </div>
      )}

      {/* Tests Grid */}
      {!loading && filteredTests.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredTests.map((test) => (
            <div
              key={test.id}
              style={{
                background: 'white',
                border: test.isActive ? '2px solid #28a745' : '2px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              {/* Status Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '4px 12px',
                  background: test.isActive ? '#28a745' : '#6c757d',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                }}
              >
                {test.isActive ? '✅ Активний' : '⏸️ Неактивний'}
              </div>

              {/* Test Info */}
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#333', marginBottom: '8px', paddingRight: '100px' }}>
                  {test.title}
                </h3>
                {test.description && (
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    {test.description}
                  </p>
                )}
                <div style={{ fontSize: '13px', color: '#888' }}>
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
              <details style={{ marginBottom: '15px' }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '10px',
                  }}
                >
                  🔍 Переглянути питання
                </summary>
                <div style={{ paddingLeft: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                  {test.questions.map((q, index) => (
                    <div
                      key={q.id}
                      style={{
                        padding: '8px',
                        marginBottom: '8px',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {index + 1}. {q.question}
                      </div>
                      <div style={{ color: '#666', marginTop: '3px' }}>
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(test)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ✏️ Редагувати
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.title)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
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
