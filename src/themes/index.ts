export interface Theme {
  name: string;
  emoji: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    success: string;
    danger: string;
    warning: string;
    background: string;
    backgroundGradient: string;
    cardBg: string;
    text: string;
    textMuted: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    button1: string;
    button2: string;
    button3: string;
    button4: string;
  };
}

export const themes: Record<string, Theme> = {
  candy: {
    name: 'Цукерка',
    emoji: '🍬',
    colors: {
      primary: '#ff6b9d',
      primaryDark: '#c44569',
      secondary: '#feca57',
      accent: '#ff9ff3',
      success: '#00d2d3',
      danger: '#ff6b6b',
      warning: '#feca57',
      background: '#fff0f5',
      backgroundGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      cardBg: '#ffffff',
      text: '#2d3436',
      textMuted: '#636e72',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
      secondary: 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)',
      success: 'linear-gradient(135deg, #00d2d3 0%, #0abde3 100%)',
      danger: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
      button1: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)',
      button2: 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)',
      button3: 'linear-gradient(135deg, #00d2d3 0%, #0abde3 100%)',
      button4: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
    },
  },
  ocean: {
    name: 'Океан',
    emoji: '🌊',
    colors: {
      primary: '#0984e3',
      primaryDark: '#0652DD',
      secondary: '#00cec9',
      accent: '#81ecec',
      success: '#00b894',
      danger: '#d63031',
      warning: '#fdcb6e',
      background: '#f0f9ff',
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBg: '#ffffff',
      text: '#2d3436',
      textMuted: '#636e72',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      danger: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)',
      button1: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
      button2: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      button3: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
      button4: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
    },
  },
  jungle: {
    name: 'Джунглі',
    emoji: '🌴',
    colors: {
      primary: '#00b894',
      primaryDark: '#009432',
      secondary: '#fdcb6e',
      accent: '#55efc4',
      success: '#00cec9',
      danger: '#e17055',
      warning: '#ffeaa7',
      background: '#f0fff4',
      backgroundGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      cardBg: '#ffffff',
      text: '#2d3436',
      textMuted: '#636e72',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      secondary: 'linear-gradient(135deg, #fdcb6e 0%, #f9ca24 100%)',
      success: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
      danger: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
      button1: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
      button2: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
      button3: 'linear-gradient(135deg, #81ecec 0%, #00cec9 100%)',
      button4: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)',
    },
  },
};

export const defaultTheme = 'ocean';

export function getTheme(themeName: string): Theme {
  return themes[themeName] || themes[defaultTheme];
}

export function getThemeNames(): string[] {
  return Object.keys(themes);
}
