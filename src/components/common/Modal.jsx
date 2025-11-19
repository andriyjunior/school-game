import { colors, spacing, borderRadius, shadows, zIndex, animations, keyframes } from '../../styles/tokens';

/**
 * Reusable Modal Component
 *
 * Usage examples:
 *
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <ModalHeader title="Заголовок" />
 *   <ModalBody>
 *     Контент модального вікна
 *   </ModalBody>
 *   <ModalFooter>
 *     <Button onClick={handleClose}>Закрити</Button>
 *   </ModalFooter>
 * </Modal>
 *
 * Or with gradient header:
 *
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   <ModalHeader
 *     title="Класна Робота"
 *     subtitle="Освітня платформа"
 *     icon="fa-graduation-cap"
 *     gradient
 *   />
 *   ...
 * </Modal>
 */

export default function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = false,
  className = '',
  style = {},
}) {
  if (!isOpen) return null;

  // Size configurations
  const sizes = {
    sm: { maxWidth: '500px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '900px' },
    xl: { maxWidth: '1200px' },
    full: { maxWidth: '95vw' },
  };

  const sizeStyle = sizes[size] || sizes.md;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: colors.overlayDark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    zIndex: zIndex.modal,
    animation: animations.fadeIn,
  };

  const contentStyle = {
    background: colors.white,
    borderRadius: borderRadius.xl,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: shadows.xxl,
    animation: animations.slideUp,
    position: 'relative',
    ...sizeStyle,
    ...style,
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleEscape = (e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose?.();
    }
  };

  // Add escape key listener
  React.useEffect(() => {
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} className={className}>
      <div style={contentStyle}>
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: spacing.md,
              right: spacing.md,
              background: 'transparent',
              border: 'none',
              fontSize: '1.5em',
              color: colors.gray500,
              cursor: 'pointer',
              padding: spacing.xs,
              borderRadius: borderRadius.circle,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = colors.gray100;
              e.target.style.color = colors.gray700;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = colors.gray500;
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
        {children}
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

// Modal Header Component
export function ModalHeader({
  title,
  subtitle,
  icon,
  gradient = false,
  onClose,
  children,
}) {
  const headerStyle = {
    padding: spacing.lg,
    borderRadius: `${borderRadius.xl} ${borderRadius.xl} 0 0`,
    textAlign: 'center',
    ...(gradient ? {
      background: colors.primaryGradient,
      color: colors.white,
    } : {
      borderBottom: `2px solid ${colors.gray100}`,
    }),
  };

  return (
    <div style={headerStyle}>
      {icon && (
        <div style={{ fontSize: '3em', marginBottom: spacing.sm }}>
          <i className={`fas ${icon}`}></i>
        </div>
      )}
      {title && (
        <h2 style={{
          margin: 0,
          fontSize: '1.8em',
          fontWeight: 'bold',
          color: gradient ? colors.white : colors.primary,
        }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{
          margin: `${spacing.sm} 0 0 0`,
          fontSize: '0.95em',
          opacity: 0.9,
          color: gradient ? colors.white : colors.gray600,
        }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

// Modal Body Component
export function ModalBody({ children, padding = 'lg' }) {
  const bodyStyle = {
    padding: spacing[padding] || spacing.lg,
  };

  return <div style={bodyStyle}>{children}</div>;
}

// Modal Footer Component
export function ModalFooter({
  children,
  align = 'right',
  gap = 'sm',
  padding = 'lg',
}) {
  const footerStyle = {
    padding: spacing[padding] || spacing.lg,
    borderTop: `1px solid ${colors.gray100}`,
    display: 'flex',
    justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
    gap: spacing[gap] || spacing.sm,
    flexWrap: 'wrap',
  };

  return <div style={footerStyle}>{children}</div>;
}

// Import React for useEffect
import React from 'react';
