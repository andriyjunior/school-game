import { colors, spacing, fontSize, borderRadius, shadows, transitions } from '../../styles/tokens';

/**
 * Reusable Input Component
 *
 * Usage examples:
 *
 * <Input
 *   label="Ім'я"
 *   placeholder="Введіть ім'я..."
 *   value={name}
 *   onChange={(e) => setName(e.target.value)}
 * />
 *
 * <Input
 *   label="Email"
 *   type="email"
 *   icon="fa-envelope"
 *   error="Невірний email"
 * />
 *
 * <Input
 *   label="Пароль"
 *   type="password"
 *   success
 *   helperText="Пароль надійний"
 * />
 */

export default function Input({
  type = 'text',
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  onKeyPress,
  placeholder,
  disabled = false,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  autoFocus = false,
  fullWidth = true,
  required = false,
  className = '',
  style = {},
  inputStyle = {},
  ...props
}) {
  const getBorderColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    return colors.gray200;
  };

  const containerStyle = {
    marginBottom: spacing.md,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: 600,
    color: colors.textPrimary,
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputBaseStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: fontSize.md,
    border: `2px solid ${getBorderColor()}`,
    borderRadius: borderRadius.md,
    outline: 'none',
    transition: transitions.input,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: disabled ? colors.gray100 : colors.white,
    color: disabled ? colors.gray500 : colors.textPrimary,
    cursor: disabled ? 'not-allowed' : 'text',
    ...(icon && iconPosition === 'left' && { paddingLeft: '45px' }),
    ...(icon && iconPosition === 'right' && { paddingRight: '45px' }),
    ...inputStyle,
  };

  const iconStyle = {
    position: 'absolute',
    ...(iconPosition === 'left' ? { left: spacing.md } : { right: spacing.md }),
    color: error ? colors.error : success ? colors.success : colors.primary,
    fontSize: fontSize.lg,
    pointerEvents: 'none',
  };

  const helperStyle = {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: error ? colors.error : success ? colors.success : colors.gray500,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const handleFocus = (e) => {
    if (!error && !disabled) {
      e.target.style.borderColor = colors.primary;
      e.target.style.boxShadow = shadows.focus;
    }
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = getBorderColor();
    e.target.style.boxShadow = 'none';
    onBlur?.(e);
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <div style={inputContainerStyle}>
        {icon && iconPosition === 'left' && (
          <i className={`fas ${icon}`} style={iconStyle}></i>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          style={inputBaseStyle}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <i className={`fas ${icon}`} style={iconStyle}></i>
        )}
      </div>

      {(error || success || helperText) && (
        <div style={helperStyle}>
          {error && <i className="fas fa-exclamation-circle"></i>}
          {success && <i className="fas fa-check-circle"></i>}
          {error || helperText}
        </div>
      )}
    </div>
  );
}

// Textarea Component (variant of Input)
export function Textarea({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled = false,
  error,
  success,
  helperText,
  rows = 4,
  fullWidth = true,
  required = false,
  className = '',
  style = {},
  textareaStyle = {},
  ...props
}) {
  const getBorderColor = () => {
    if (error) return colors.error;
    if (success) return colors.success;
    return colors.gray200;
  };

  const containerStyle = {
    marginBottom: spacing.md,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: spacing.sm,
    fontSize: fontSize.md,
    fontWeight: 600,
    color: colors.textPrimary,
  };

  const textareaBaseStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: fontSize.md,
    border: `2px solid ${getBorderColor()}`,
    borderRadius: borderRadius.md,
    outline: 'none',
    transition: transitions.input,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    backgroundColor: disabled ? colors.gray100 : colors.white,
    color: disabled ? colors.gray500 : colors.textPrimary,
    cursor: disabled ? 'not-allowed' : 'text',
    resize: 'vertical',
    minHeight: `${rows * 24}px`,
    ...textareaStyle,
  };

  const helperStyle = {
    marginTop: spacing.xs,
    fontSize: fontSize.xs,
    color: error ? colors.error : success ? colors.success : colors.gray500,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  };

  const handleFocus = (e) => {
    if (!error && !disabled) {
      e.target.style.borderColor = colors.primary;
      e.target.style.boxShadow = shadows.focus;
    }
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = getBorderColor();
    e.target.style.boxShadow = 'none';
    onBlur?.(e);
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: colors.error, marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        style={textareaBaseStyle}
        {...props}
      />

      {(error || success || helperText) && (
        <div style={helperStyle}>
          {error && <i className="fas fa-exclamation-circle"></i>}
          {success && <i className="fas fa-check-circle"></i>}
          {error || helperText}
        </div>
      )}
    </div>
  );
}
