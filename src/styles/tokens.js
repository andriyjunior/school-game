/**
 * Design Tokens for Класна Робота
 *
 * Single source of truth for all design values.
 * Import and use these tokens instead of hardcoded values.
 *
 * Usage:
 * import { colors, spacing, fontSize } from '../styles/tokens';
 *
 * style={{ color: colors.primary, padding: spacing.lg }}
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Brand Colors
  primary: '#667eea',
  primaryDark: '#764ba2',
  primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

  // Game Gradients (for different game types)
  gradientPink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',     // Guess Game
  gradientBlue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',     // Memory Game
  gradientGreen: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',    // Spell Game
  gradientYellow: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',   // Match Game
  gradientDark: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',     // Sound Game
  gradientOrange: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',   // Additional
  gradientWarm: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',     // Additional
  gradientCool: 'linear-gradient(135deg, #22c1c3 0%, #fdbb2d 100%)',     // Additional

  // School Level Colors (for class grouping)
  elementary: '#4facfe',    // Початкова школа (1-4)
  middle: '#667eea',        // Середня школа (5-9)
  high: '#f093fb',          // Старша школа (10-11)

  // Semantic Colors
  success: '#28a745',
  successBg: '#d4edda',
  successBorder: '#c3e6cb',

  error: '#dc3545',
  errorBg: '#f8d7da',
  errorBorder: '#f5c6cb',

  warning: '#ffc107',
  warningBg: '#fff8e1',
  warningBorder: '#ffe082',

  info: '#667eea',
  infoBg: '#e7f0ff',
  infoBorder: '#d1e0ff',

  // Neutral Colors
  neutral: '#6c757d',
  neutralLight: '#f8f9fa',

  // Gray Scale
  gray100: '#f8f9fa',
  gray200: '#e0e0e0',
  gray300: '#ddd',
  gray400: '#ccc',
  gray500: '#999',
  gray600: '#666',
  gray700: '#333',
  gray800: '#212529',

  // Base Colors
  white: '#ffffff',
  black: '#000000',

  // Overlay
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  overlayMedium: 'rgba(0, 0, 0, 0.7)',
  overlayDark: 'rgba(0, 0, 0, 0.75)',

  // Text Colors
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  textLight: '#ffffff',
};

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '20px',
  lg: '30px',
  xl: '40px',
  xxl: '60px',
};

// Grid gaps
export const gap = {
  xs: '5px',
  sm: '10px',
  md: '15px',
  lg: '20px',
  xl: '30px',
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const fontSize = {
  xs: '0.85em',      // 13.6px (base 16px)
  sm: '0.9em',       // 14.4px
  base: '1em',       // 16px
  md: '1.1em',       // 17.6px
  lg: '1.2em',       // 19.2px
  xl: '1.3em',       // 20.8px
  xxl: '1.5em',      // 24px
  xxxl: '1.8em',     // 28.8px
  huge: '2em',       // 32px
};

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '8px',
  md: '12px',
  lg: '15px',
  xl: '20px',
  xxl: '30px',
  pill: '50px',
  circle: '50%',
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0 6px 12px rgba(0, 0, 0, 0.15)',
  xl: '0 10px 20px rgba(0, 0, 0, 0.2)',
  xxl: '0 20px 60px rgba(0, 0, 0, 0.3)',

  // Specific shadows
  button: '0 4px 15px rgba(102, 126, 234, 0.4)',
  buttonHover: '0 6px 20px rgba(102, 126, 234, 0.5)',
  card: '0 3px 10px rgba(0, 0, 0, 0.1)',

  // Focus shadow (for inputs)
  focus: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  focusError: '0 0 0 3px rgba(220, 53, 69, 0.1)',
};

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '0.15s ease',
  medium: '0.3s ease',
  slow: '0.5s ease',

  // Specific transitions
  button: 'all 0.3s ease',
  input: 'all 0.3s ease',
  transform: 'transform 0.3s ease',
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 1,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 1000,
  modal: 1001,
  helpModal: 2000,
  toast: 3000,
  critical: 10000,
};

// ============================================================================
// BREAKPOINTS (for responsive design)
// ============================================================================

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Media query helpers
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
};

// ============================================================================
// LAYOUT
// ============================================================================

export const layout = {
  containerMaxWidth: '1200px',
  modalMaxWidth: '600px',
  modalMaxWidthLg: '900px',
  modalMaxWidthSm: '500px',

  inputHeight: '48px',
  buttonHeight: '48px',
  buttonHeightSm: '36px',
  buttonHeightLg: '56px',
};

// ============================================================================
// BORDERS
// ============================================================================

export const borders = {
  thin: '1px solid',
  medium: '2px solid',
  thick: '3px solid',

  // Common border combinations
  default: `2px solid ${colors.gray200}`,
  primary: `2px solid ${colors.primary}`,
  success: `2px solid ${colors.success}`,
  error: `2px solid ${colors.error}`,
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  slideUp: 'slideUp 0.4s ease-out',
  pulse: 'pulse 1.5s ease-in-out infinite',
};

// CSS keyframes (use in <style> tags)
export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color with opacity
 * @param {string} color - Hex color
 * @param {number} opacity - Opacity (0-1)
 */
export const withOpacity = (color, opacity) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Create a gradient from color1 to color2
 */
export const createGradient = (color1, color2, angle = 135) => {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all as default for convenience
export default {
  colors,
  spacing,
  gap,
  fontSize,
  fontWeight,
  lineHeight,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  media,
  layout,
  borders,
  animations,
  keyframes,
  withOpacity,
  createGradient,
};
