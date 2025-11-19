import { colors, spacing, fontSize, borderRadius, shadows, transitions } from '../../styles/tokens';

/**
 * Reusable Button Component
 *
 * Usage examples:
 *
 * <Button variant="primary" onClick={handleClick}>
 *   Продовжити
 * </Button>
 *
 * <Button variant="back" size="sm" icon="fa-arrow-left">
 *   Назад
 * </Button>
 *
 * <Button variant="success" disabled loading>
 *   Завантаження...
 * </Button>
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) {
  // Variant styles
  const variants = {
    primary: {
      background: colors.primaryGradient,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.button,
      hoverShadow: shadows.buttonHover,
    },
    success: {
      background: colors.success,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
    error: {
      background: colors.error,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
    neutral: {
      background: colors.neutral,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.sm,
      hoverShadow: shadows.md,
    },
    back: {
      background: colors.neutral,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.sm,
      hoverShadow: shadows.md,
    },
    outline: {
      background: 'transparent',
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
      boxShadow: 'none',
      hoverShadow: shadows.sm,
    },
    ghost: {
      background: 'transparent',
      color: colors.primary,
      border: 'none',
      boxShadow: 'none',
      hoverShadow: 'none',
    },
    // Game gradients
    gradientPink: {
      background: colors.gradientPink,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
    gradientBlue: {
      background: colors.gradientBlue,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
    gradientGreen: {
      background: colors.gradientGreen,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
    gradientYellow: {
      background: colors.gradientYellow,
      color: colors.white,
      border: 'none',
      boxShadow: shadows.md,
      hoverShadow: shadows.lg,
    },
  };

  // Size styles
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: fontSize.base,
      height: '36px',
    },
    md: {
      padding: '12px 25px',
      fontSize: fontSize.md,
      height: '48px',
    },
    lg: {
      padding: '15px 40px',
      fontSize: fontSize.xl,
      height: '56px',
    },
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    fontWeight: 600,
    borderRadius: borderRadius.md,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: transitions.button,
    fontFamily: 'inherit',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    textDecoration: 'none',
    userSelect: 'none',
    ...variantStyle,
    ...sizeStyle,
    ...style,
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading && variantStyle.hoverShadow) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = variantStyle.hoverShadow;
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = variantStyle.boxShadow || 'none';
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
      className={className}
      style={baseStyle}
      {...props}
    >
      {loading && (
        <i className="fas fa-spinner fa-spin"></i>
      )}

      {!loading && icon && iconPosition === 'left' && (
        <i className={`fas ${icon}`}></i>
      )}

      {children}

      {!loading && icon && iconPosition === 'right' && (
        <i className={`fas ${icon}`}></i>
      )}
    </button>
  );
}

// Convenience components for common button types
export function BackButton({ children = 'Назад', onClick, ...props }) {
  return (
    <Button
      variant="back"
      icon="fa-arrow-left"
      iconPosition="left"
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export function HelpButton({ children = 'Допомога', onClick, ...props }) {
  return (
    <Button
      variant="outline"
      icon="fa-question-circle"
      iconPosition="left"
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export function SubmitButton({ children = 'Продовжити', loading, ...props }) {
  return (
    <Button
      variant="primary"
      icon="fa-arrow-right"
      iconPosition="right"
      loading={loading}
      {...props}
    >
      {children}
    </Button>
  );
}
