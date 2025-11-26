import { ReactNode } from 'react';

interface OptionGridProps<T = string> {
  options: T[];
  onSelect: (option: T, index: number) => void;
  disabled?: boolean;
  columns?: number;
  renderOption?: (option: T, index: number) => ReactNode;
  gradient?: string;
  buttonStyle?: React.CSSProperties;
}

export function OptionGrid<T = string>({
  options,
  onSelect,
  disabled = false,
  columns = 2,
  renderOption,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  buttonStyle
}: OptionGridProps<T>) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '12px',
      maxWidth: '400px',
      margin: '0 auto',
      width: '100%'
    }}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => !disabled && onSelect(option, index)}
          disabled={disabled}
          style={{
            background: gradient,
            color: 'white',
            border: 'none',
            padding: '20px',
            fontSize: '2em',
            borderRadius: '15px',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            minHeight: '80px',
            opacity: disabled ? 0.7 : 1,
            ...buttonStyle
          }}
        >
          {renderOption ? renderOption(option, index) : String(option)}
        </button>
      ))}
    </div>
  );
}
