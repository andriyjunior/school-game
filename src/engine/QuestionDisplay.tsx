import { ReactNode } from 'react';

interface QuestionDisplayProps {
  question: string;
  subtitle?: string;
  children?: ReactNode;
  color?: string;
}

export function QuestionDisplay({
  question,
  subtitle,
  children,
  color = '#667eea'
}: QuestionDisplayProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{
        textAlign: 'center',
        color,
        fontSize: '1.8em',
        marginBottom: subtitle ? '10px' : '25px'
      }}>
        {question}
      </h2>

      {subtitle && (
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '1.1em',
          marginBottom: '25px'
        }}>
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
