# 🎨 Design System - Класна Робота

Centralized design system for consistent UI/UX across the entire platform.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Design Tokens](#design-tokens)
- [Components](#components)
- [Migration Guide](#migration-guide)

---

## Quick Start

### Using Design Tokens

```javascript
import { colors, spacing, fontSize, borderRadius } from './styles/tokens';

// Instead of hardcoded values
<div style={{ color: '#667eea', padding: '20px' }}>

// Use tokens
<div style={{ color: colors.primary, padding: spacing.md }}>
```

### Using Button Component

```javascript
import { Button, BackButton, SubmitButton } from './components/common';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Продовжити
</Button>

// Back button (pre-configured)
<BackButton onClick={handleBack} />

// With icon
<Button variant="success" icon="fa-check" iconPosition="right">
  Зберегти
</Button>

// Loading state
<Button variant="primary" loading>
  Завантаження...
</Button>

// Full width
<Button variant="primary" fullWidth>
  Увійти
</Button>
```

---

## Design Tokens

Located in: `/src/styles/tokens.js`

### Colors

```javascript
// Brand colors
colors.primary           // #667eea
colors.primaryGradient   // linear-gradient(...)

// Semantic colors
colors.success          // #28a745
colors.error            // #dc3545
colors.warning          // #ffc107

// Game gradients
colors.gradientPink     // Pink gradient
colors.gradientBlue     // Blue gradient
colors.gradientGreen    // Green gradient

// School level colors
colors.elementary       // #4facfe (1-4 класи)
colors.middle           // #667eea (5-9 класи)
colors.high             // #f093fb (10-11 класи)
```

### Spacing

```javascript
spacing.xs    // 8px
spacing.sm    // 12px
spacing.md    // 20px
spacing.lg    // 30px
spacing.xl    // 40px

gap.sm       // 10px (for grid gaps)
gap.md       // 15px
gap.lg       // 20px
```

### Typography

```javascript
fontSize.xs      // 0.85em
fontSize.base    // 1em
fontSize.md      // 1.1em
fontSize.lg      // 1.2em
fontSize.xl      // 1.3em
fontSize.xxl     // 1.5em
fontSize.xxxl    // 1.8em
```

### Border Radius

```javascript
borderRadius.sm     // 8px
borderRadius.md     // 12px
borderRadius.lg     // 15px
borderRadius.xl     // 20px
borderRadius.pill   // 50px
borderRadius.circle // 50%
```

### Shadows

```javascript
shadows.sm          // Subtle shadow
shadows.md          // Medium shadow
shadows.lg          // Large shadow
shadows.button      // Button shadow
shadows.buttonHover // Button hover shadow
shadows.focus       // Focus ring
```

### Transitions

```javascript
transitions.fast    // 0.15s
transitions.medium  // 0.3s
transitions.slow    // 0.5s
```

---

## Components

### Button Component

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | Button style: `primary`, `success`, `error`, `neutral`, `back`, `outline`, `ghost`, `gradientPink`, etc. |
| `size` | string | `'md'` | Button size: `sm`, `md`, `lg` |
| `icon` | string | - | Font Awesome icon class (e.g., `'fa-check'`) |
| `iconPosition` | string | `'left'` | Icon position: `left`, `right` |
| `disabled` | boolean | `false` | Disable button |
| `loading` | boolean | `false` | Show loading spinner |
| `fullWidth` | boolean | `false` | Make button full width |
| `onClick` | function | - | Click handler |

**Examples:**

```javascript
// Basic variants
<Button variant="primary">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>
<Button variant="neutral">Neutral</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button icon="fa-save">Зберегти</Button>
<Button icon="fa-trash" variant="error">Видалити</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>

// Pre-configured buttons
<BackButton onClick={handleBack} />
<HelpButton onClick={showHelp} />
<SubmitButton loading={isSubmitting} />
```

---

## Migration Guide

### Before (Old Way)

```javascript
// Hardcoded values everywhere
<button
  onClick={handleClick}
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    fontSize: '1.2em',
    cursor: 'pointer'
  }}
>
  Продовжити
</button>
```

### After (New Way)

```javascript
// Using tokens
import { colors, spacing, fontSize, borderRadius } from '../styles/tokens';

<button
  onClick={handleClick}
  style={{
    background: colors.primaryGradient,
    color: colors.white,
    border: 'none',
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borderRadius.md,
    fontSize: fontSize.lg,
    cursor: 'pointer'
  }}
>
  Продовжити
</button>

// Or even better - use the Button component
<Button variant="primary" size="md" onClick={handleClick}>
  Продовжити
</Button>
```

### Step-by-Step Migration

1. **Import tokens at top of file:**
```javascript
import { colors, spacing, fontSize, borderRadius, shadows } from '../styles/tokens';
```

2. **Replace hardcoded colors:**
```javascript
// Before
color: '#667eea'

// After
color: colors.primary
```

3. **Replace hardcoded spacing:**
```javascript
// Before
padding: '20px'
margin: '30px'

// After
padding: spacing.md
margin: spacing.lg
```

4. **Replace hardcoded gradients:**
```javascript
// Before
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

// After
background: colors.primaryGradient
```

5. **Replace buttons with Button component:**
```javascript
// Before
<button className="back-btn" onClick={onBack}>← Назад</button>

// After
<BackButton onClick={onBack} />
```

---

## Benefits

✅ **Consistency** - All components use the same design values
✅ **Maintainability** - Change once, update everywhere
✅ **Developer Experience** - Autocomplete and type safety
✅ **Performance** - Smaller bundle size (reused values)
✅ **Theming** - Easy to add dark mode or custom themes

---

## Next Steps

Coming soon:
- [ ] Modal component
- [ ] Input component
- [ ] Card component
- [ ] Alert component
- [ ] Loading component

---

## Questions?

See examples in:
- `/src/components/common/Button.jsx`
- `/src/components/PlayerNameModal.jsx` (updated to use tokens)
