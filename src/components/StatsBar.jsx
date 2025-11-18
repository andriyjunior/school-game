export default function StatsBar({ totalScore, streak }) {
  return (
    <div className="stats-bar" style={{ display: 'flex' }}>
      <div className="stat-item">
        <div className="stat-label">Всього балів</div>
        <div className="stat-value">{totalScore}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Серія</div>
        <div className="stat-value">{streak}</div>
      </div>
      <div className="stat-item">
        <div className="stat-label">Значки</div>
        <div className="stat-value">0/10</div>
      </div>
    </div>
  );
}
