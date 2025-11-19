import { colors, spacing, fontSize, borderRadius } from '../../styles/tokens';

/**
 * Reusable Alert Component
 *
 * Replaces alert() calls with inline, styled alerts
 *
 * Usage examples:
 *
 * <Alert variant="success">
 *   Операція виконана успішно!
 * </Alert>
 *
 * <Alert variant="error" icon="fa-exclamation-triangle">
 *   Виникла помилка
 * </Alert>
 *
 * <Alert variant="info" onClose={() => setShowAlert(false)}>
 *   Інформаційне повідомлення
 * </Alert>
 */

export default function Alert({
  children,
  variant = 'info',
  icon,
  onClose,
  className = '',
  style = {},
}) {
  const variants = {
    success: {
      background: colors.successBg,
      color: colors.success,
      border: `2px solid ${colors.successBorder}`,
      defaultIcon: 'fa-check-circle',
    },
    error: {
      background: colors.errorBg,
      color: colors.error,
      border: `2px solid ${colors.errorBorder}`,
      defaultIcon: 'fa-exclamation-circle',
    },
    warning: {
      background: colors.warningBg,
      color: '#856404',
      border: `2px solid ${colors.warningBorder}`,
      defaultIcon: 'fa-exclamation-triangle',
    },
    info: {
      background: colors.infoBg,
      color: colors.info,
      border: `2px solid ${colors.infoBorder}`,
      defaultIcon: 'fa-info-circle',
    },
  };

  const variantStyle = variants[variant] || variants.info;
  const displayIcon = icon || variantStyle.defaultIcon;

  const alertStyle = {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    border: variantStyle.border,
    background: variantStyle.background,
    color: variantStyle.color,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    animation: 'slideIn 0.3s ease-out',
    ...style,
  };

  const iconStyle = {
    fontSize: fontSize.xl,
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    fontSize: fontSize.base,
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: variantStyle.color,
    cursor: 'pointer',
    fontSize: fontSize.lg,
    padding: spacing.xs,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.sm,
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s ease',
  };

  return (
    <div style={alertStyle} className={className} role="alert">
      <i className={`fas ${displayIcon}`} style={iconStyle}></i>
      <div style={contentStyle}>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Convenience components
export function SuccessAlert({ children, ...props }) {
  return <Alert variant="success" {...props}>{children}</Alert>;
}

export function ErrorAlert({ children, ...props }) {
  return <Alert variant="error" {...props}>{children}</Alert>;
}

export function WarningAlert({ children, ...props }) {
  return <Alert variant="warning" {...props}>{children}</Alert>;
}

export function InfoAlert({ children, ...props }) {
  return <Alert variant="info" {...props}>{children}</Alert>;
}
