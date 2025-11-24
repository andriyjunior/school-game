import { ReactNode } from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}

const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  danger: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)'
};

export default function ActionButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  fullWidth = false
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#ccc' : gradients[variant],
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        fontSize: '1.3em',
        borderRadius: '15px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.3s'
      }}
    >
      {children}
    </button>
  );
}
