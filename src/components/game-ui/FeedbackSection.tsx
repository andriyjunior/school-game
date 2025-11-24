import { ReactNode } from 'react';

interface FeedbackSectionProps {
  isCorrect: boolean;
  points?: number;
  streak?: number;
  explanation: string;
  onNext: () => void;
  nextButtonText?: string;
  children?: ReactNode;
}

export default function FeedbackSection({
  isCorrect,
  points,
  streak = 0,
  explanation,
  onNext,
  nextButtonText = '➡️ Наступне завдання',
  children
}: FeedbackSectionProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: '12px' }}>
      <div style={{ fontSize: '3em', marginBottom: '8px', animation: 'bounce 1s ease' }}>
        {isCorrect ? '🎉' : '😔'}
      </div>
      <div style={{
        fontSize: '1.6em',
        fontWeight: 'bold',
        color: isCorrect ? '#28a745' : '#dc3545',
        marginBottom: '6px'
      }}>
        {isCorrect ? 'Правильно!' : 'Спробуй ще!'}
      </div>

      {isCorrect && points && (
        <div style={{ fontSize: '1.1em', color: 'var(--theme-primary)', marginBottom: '12px' }}>
          +{points} балів! {streak > 1 && `🔥 Серія: ${streak}`}
        </div>
      )}

      {children}

      {/* Explanation */}
      <div style={{
        background: isCorrect ? '#d4edda' : '#f8d7da',
        border: `2px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
        borderRadius: '12px',
        padding: '10px',
        marginBottom: '12px',
        maxWidth: '500px',
        margin: '0 auto 12px'
      }}>
        <div style={{
          color: isCorrect ? '#155724' : '#721c24',
          fontSize: '1em'
        }}>
          💡 {explanation}
        </div>
      </div>

      <button
        onClick={onNext}
        style={{
          background: 'var(--theme-gradient-success)',
          color: 'white',
          border: 'none',
          padding: '10px 30px',
          fontSize: '1.2em',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        {nextButtonText}
      </button>
    </div>
  );
}
