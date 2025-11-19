import { colors, spacing, borderRadius, shadows } from '../../styles/tokens';

/**
 * Reusable Card Component
 *
 * Usage examples:
 *
 * <Card>
 *   Simple card content
 * </Card>
 *
 * <Card gradient header="Заголовок">
 *   Card with gradient header
 * </Card>
 *
 * <Card padding="xl" shadow="lg">
 *   Card with custom padding and shadow
 * </Card>
 */

export default function Card({
  children,
  header,
  footer,
  gradient = false,
  padding = 'lg',
  shadow = 'md',
  hoverable = false,
  onClick,
  className = '',
  style = {},
  headerStyle = {},
  bodyStyle = {},
  footerStyle = {},
}) {
  const cardStyle = {
    background: colors.white,
    borderRadius: borderRadius.lg,
    boxShadow: shadows[shadow] || shadows.md,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const defaultHeaderStyle = {
    padding: spacing[padding] || spacing.lg,
    ...(gradient ? {
      background: colors.primaryGradient,
      color: colors.white,
    } : {
      borderBottom: `2px solid ${colors.gray100}`,
      color: colors.primary,
    }),
    fontWeight: 'bold',
    fontSize: '1.3em',
    ...headerStyle,
  };

  const defaultBodyStyle = {
    padding: spacing[padding] || spacing.lg,
    ...bodyStyle,
  };

  const defaultFooterStyle = {
    padding: spacing[padding] || spacing.lg,
    borderTop: `1px solid ${colors.gray100}`,
    background: colors.gray100,
    ...footerStyle,
  };

  const handleMouseEnter = (e) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = shadows.lg;
    }
  };

  const handleMouseLeave = (e) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = shadows[shadow] || shadows.md;
    }
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {header && (
        <div style={defaultHeaderStyle}>
          {header}
        </div>
      )}

      <div style={defaultBodyStyle}>
        {children}
      </div>

      {footer && (
        <div style={defaultFooterStyle}>
          {footer}
        </div>
      )}
    </div>
  );
}

// Stat Card - for dashboard statistics
export function StatCard({ title, value, icon, color = colors.primary, change }) {
  return (
    <Card padding="lg" shadow="md" hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.9em', color: colors.gray500, marginBottom: spacing.xs }}>
            {title}
          </div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: colors.textPrimary }}>
            {value}
          </div>
          {change && (
            <div style={{
              fontSize: '0.85em',
              color: change > 0 ? colors.success : colors.error,
              marginTop: spacing.xs,
            }}>
              <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`}></i> {Math.abs(change)}%
            </div>
          )}
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: borderRadius.circle,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8em',
          color: color,
        }}>
          <i className={`fas ${icon}`}></i>
        </div>
      </div>
    </Card>
  );
}
