import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Button, ErrorAlert } from './common';
import { colors, spacing, borderRadius, gap } from '../styles/tokens';

/**
 * PlayerNameModal - Migrated to new design system
 *
 * Before: 340 lines with inline styles
 * After: ~180 lines using design system components
 * Benefits: Consistent, maintainable, smaller bundle size
 */

export default function PlayerNameModal({ onSubmit }) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [errors, setErrors] = useState({ name: false, class: false });

  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      class: !selectedClass
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.class) {
      return;
    }

    onSubmit(name.trim(), selectedClass);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!name.trim()) {
        setErrors(prev => ({ ...prev, name: true }));
      } else if (selectedClass) {
        handleSubmit();
      }
    }
  };

  const classGroups = [
    { label: 'Початкова школа', classes: [1, 2, 3, 4], color: colors.elementary },
    { label: 'Середня школа', classes: [5, 6, 7, 8, 9], color: colors.middle },
    { label: 'Старша школа', classes: [10, 11], color: colors.high }
  ];

  return (
    <Modal isOpen={true} size="md" closeOnOverlayClick={false} closeOnEscape={false}>
      <ModalHeader
        title="Класна Робота"
        subtitle="Освітня платформа для учнів 1-11 класів"
        icon="fa-graduation-cap"
        gradient
      />

      <ModalBody>
        {/* Name Input */}
        <Input
          label="Як тебе звати?"
          icon="fa-user"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors(prev => ({ ...prev, name: false }));
          }}
          onKeyPress={handleKeyPress}
          placeholder="Введи своє ім'я та прізвище..."
          error={errors.name ? "Будь ласка, введі своє ім'я" : null}
          autoFocus
        />

        {/* Class Selection */}
        <div style={{ marginBottom: spacing.lg }}>
          <label style={{
            display: 'flex',
            marginBottom: spacing.md,
            fontSize: '1.1em',
            fontWeight: '600',
            color: colors.textPrimary,
            alignItems: 'center',
            gap: spacing.xs
          }}>
            <i className="fas fa-school" style={{ color: colors.primary }}></i>
            В якому ти класі?
          </label>

          {classGroups.map((group, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: spacing.md }}>
              <p style={{
                fontSize: '0.85em',
                color: colors.gray500,
                marginBottom: spacing.sm,
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {group.label}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                gap: gap.sm
              }}>
                {group.classes.map(classNum => (
                  <button
                    key={classNum}
                    onClick={() => {
                      setSelectedClass(classNum);
                      setErrors(prev => ({ ...prev, class: false }));
                    }}
                    style={{
                      padding: '18px 10px',
                      fontSize: '1.3em',
                      fontWeight: 'bold',
                      border: `3px solid ${selectedClass === classNum ? group.color : colors.gray200}`,
                      background: selectedClass === classNum
                        ? `linear-gradient(135deg, ${group.color}15, ${group.color}25)`
                        : colors.white,
                      color: selectedClass === classNum ? group.color : colors.gray600,
                      borderRadius: borderRadius.md,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: selectedClass === classNum ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedClass === classNum
                        ? `0 4px 12px ${group.color}40`
                        : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedClass !== classNum) {
                        e.target.style.borderColor = group.color;
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedClass !== classNum) {
                        e.target.style.borderColor = colors.gray200;
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {classNum}
                    {selectedClass === classNum && (
                      <div style={{ fontSize: '0.5em', marginTop: '2px' }}>
                        <i className="fas fa-check-circle"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {errors.class && (
            <ErrorAlert>
              Будь ласка, вибери свій клас
            </ErrorAlert>
          )}
        </div>

        {/* Submit Button */}
        <Button
          variant="primary"
          icon="fa-arrow-right"
          iconPosition="right"
          fullWidth
          disabled={!name.trim() || !selectedClass}
          onClick={handleSubmit}
        >
          {(name.trim() && selectedClass) ? 'Продовжити' : 'Заповни всі поля'}
        </Button>

        {/* Help Text */}
        <p style={{
          marginTop: spacing.md,
          textAlign: 'center',
          fontSize: '0.85em',
          color: colors.gray400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.xs
        }}>
          <i className="fas fa-info-circle"></i>
          Натисни Enter для швидкого продовження
        </p>
      </ModalBody>
    </Modal>
  );
}
