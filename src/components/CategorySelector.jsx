import { getAvailableCategories } from '../data/animals';

export default function CategorySelector({ onSelectCategory, onBack, gameName }) {
  const categories = getAvailableCategories();

  return (
    <div className="category-selector">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>

      <h2 style={{ textAlign: 'center', color: '#667eea', margin: '20px 0' }}>
        {gameName}
      </h2>

      <h3 style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Обери категорію:
      </h3>

      <div className="menu" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <button
          className="menu-btn"
          onClick={() => onSelectCategory('all')}
          style={{
            padding: '20px',
            fontSize: '1.3em',
            borderRadius: '15px',
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontWeight: 'bold'
          }}
        >
          🎯 Всі тварини
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            className="menu-btn"
            onClick={() => onSelectCategory(category.id)}
            style={{
              padding: '20px',
              fontSize: '1.3em',
              borderRadius: '15px',
              border: 'none',
              background: category.gradient,
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              fontWeight: 'bold'
            }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
