import { helpContent } from '../data/helpContent';

export default function HelpModal({ gameType, onClose }) {
  const help = helpContent[gameType];

  if (!help) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Add event listener for ESC key
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  return (
    <div className="modal help-modal" style={{ display: 'flex' }}>
      <div className="help-modal-content">
        <button className="help-close-btn" onClick={onClose}>✕</button>
        <h2>{help.title}</h2>
        <div
          className="help-content"
          dangerouslySetInnerHTML={{ __html: help.content }}
        />
        <button className="start-btn" onClick={onClose}>Зрозуміло!</button>
      </div>
    </div>
  );
}
