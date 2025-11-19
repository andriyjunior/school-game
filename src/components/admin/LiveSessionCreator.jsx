import { useState, useEffect } from 'react';
import { createLiveSession, getAllSessions } from '../../firebase/database';
import { getAllTests } from '../../firebase/testDatabase';
import { Card, Input, Button, ErrorAlert, WarningAlert } from '../common';
import { colors, spacing, fontSize, borderRadius, gap } from '../../styles/tokens';

export default function LiveSessionCreator({ onSessionCreated, onCancel }) {
  const [formData, setFormData] = useState({
    testId: '',
    playerClass: 2,
    participantMode: 'all',
    selectedPlayers: [],
    title: ''
  });

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const sessions = await getAllSessions({ limit: 100 });
        const playerNames = [...new Set(sessions.map(s => s.playerName))].filter(Boolean);
        setAvailablePlayers(playerNames);
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };

    loadPlayers();
  }, []);

  useEffect(() => {
    const loadTests = async () => {
      setLoadingTests(true);
      try {
        console.log('Loading tests for class:', formData.playerClass);
        const tests = await getAllTests(formData.playerClass);
        console.log('Loaded tests:', tests);
        const activeTests = tests.filter(test => test.isActive);
        console.log('Active tests:', activeTests);
        setAvailableTests(activeTests);
      } catch (error) {
        console.error('Error loading tests:', error);
        setAvailableTests([]);
      } finally {
        setLoadingTests(false);
      }
    };

    loadTests();
  }, [formData.playerClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.testId) {
      setError('Будь ласка, оберіть тест!');
      return;
    }

    if (!formData.title.trim()) {
      setError('Будь ласка, введіть назву сесії!');
      return;
    }

    if (formData.participantMode === 'selected' && formData.selectedPlayers.length === 0) {
      setError('Будь ласка, оберіть хоча б одного учня!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const sessionData = {
        title: formData.title,
        testId: formData.testId,
        playerClass: formData.playerClass,
        participants: formData.participantMode === 'all' ? ['all'] : formData.selectedPlayers
      };

      console.log('Creating live session with data:', sessionData);
      const sessionId = await createLiveSession(sessionData);
      console.log('Live session created successfully! ID:', sessionId);
      onSessionCreated(sessionId);
    } catch (error) {
      console.error('Error creating live session:', error);
      setError('Помилка створення сесії: ' + error.message + '\n\nПеревірте консоль браузера (F12) для деталей.');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (playerName) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(playerName)
        ? prev.selectedPlayers.filter(p => p !== playerName)
        : [...prev.selectedPlayers, playerName]
    }));
  };

  return (
    <Card
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          <i className="fas fa-plus-circle"></i>
          <span>Створити Нову Сесію</span>
        </div>
      }
      gradient
      padding="lg"
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <ErrorAlert onClose={() => setError('')} style={{ marginBottom: spacing.md }}>
            {error}
          </ErrorAlert>
        )}

        <Input
          label="Назва сесії"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Наприклад: Контрольна робота 2 клас"
          icon="fa-heading"
          required
          style={{ marginBottom: spacing.md }}
        />

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
            Клас *
          </label>
          <select
            value={formData.playerClass}
            onChange={(e) => setFormData({ ...formData, playerClass: parseInt(e.target.value), testId: '' })}
            style={{
              width: '100%',
              padding: spacing.sm,
              fontSize: fontSize.base,
              borderRadius: borderRadius.md,
              border: `2px solid ${colors.gray200}`,
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((cls) => (
              <option key={cls} value={cls}>{cls} клас</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
            Тест *
          </label>
          <select
            value={formData.testId}
            onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
            disabled={loadingTests}
            style={{
              width: '100%',
              padding: spacing.sm,
              fontSize: fontSize.base,
              borderRadius: borderRadius.md,
              border: `2px solid ${colors.gray200}`,
              opacity: loadingTests ? 0.6 : 1,
              cursor: loadingTests ? 'not-allowed' : 'pointer',
            }}
          >
            <option value="">{loadingTests ? 'Завантаження тестів...' : 'Оберіть тест...'}</option>
            {availableTests.map(test => (
              <option key={test.id} value={test.id}>
                {test.title} ({test.questions?.length || 0} питань, {test.totalPoints} балів)
              </option>
            ))}
          </select>
          {!loadingTests && availableTests.length === 0 && (
            <WarningAlert style={{ marginTop: spacing.sm }}>
              Немає доступних тестів для {formData.playerClass} класу.
              <br />
              Створіть тест спочатку на вкладці "Тести".
            </WarningAlert>
          )}
        </div>

        <div style={{ marginBottom: spacing.md }}>
          <label style={{ display: 'block', marginBottom: spacing.xs, fontWeight: 'bold', fontSize: fontSize.base }}>
            Учасники *
          </label>
          <div style={{ display: 'flex', gap: gap.sm, marginBottom: spacing.sm }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, participantMode: 'all', selectedPlayers: [] })}
              style={{
                flex: 1,
                padding: spacing.sm,
                borderRadius: borderRadius.md,
                border: formData.participantMode === 'all' ? `3px solid ${colors.primary}` : `2px solid ${colors.gray200}`,
                background: formData.participantMode === 'all' ? colors.primaryBg : colors.white,
                cursor: 'pointer',
                fontWeight: formData.participantMode === 'all' ? 'bold' : 'normal',
                fontSize: fontSize.base,
              }}
            >
              <i className="fas fa-users" style={{ marginRight: spacing.xs }}></i>
              Всі учні
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, participantMode: 'selected' })}
              style={{
                flex: 1,
                padding: spacing.sm,
                borderRadius: borderRadius.md,
                border: formData.participantMode === 'selected' ? `3px solid ${colors.primary}` : `2px solid ${colors.gray200}`,
                background: formData.participantMode === 'selected' ? colors.primaryBg : colors.white,
                cursor: 'pointer',
                fontWeight: formData.participantMode === 'selected' ? 'bold' : 'normal',
                fontSize: fontSize.base,
              }}
            >
              <i className="fas fa-user-check" style={{ marginRight: spacing.xs }}></i>
              Обрані учні
            </button>
          </div>

          {formData.participantMode === 'selected' && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: `2px solid ${colors.gray200}`,
              borderRadius: borderRadius.md,
              padding: spacing.sm,
              background: colors.gray50,
            }}>
              {availablePlayers.length === 0 ? (
                <p style={{ color: colors.gray500, textAlign: 'center', fontSize: fontSize.sm, margin: 0 }}>
                  <i className="fas fa-info-circle" style={{ marginRight: spacing.xs }}></i>
                  Поки що немає учнів
                </p>
              ) : (
                availablePlayers.map(player => (
                  <label
                    key={player}
                    style={{
                      display: 'block',
                      padding: spacing.xs,
                      cursor: 'pointer',
                      borderRadius: borderRadius.sm,
                      background: formData.selectedPlayers.includes(player) ? colors.primaryBg : 'transparent',
                      marginBottom: spacing.xs,
                      fontSize: fontSize.base,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedPlayers.includes(player)}
                      onChange={() => togglePlayer(player)}
                      style={{ marginRight: spacing.sm, cursor: 'pointer' }}
                    />
                    {player}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: gap.md, marginTop: spacing.lg }}>
          <Button
            type="button"
            variant="neutral"
            onClick={onCancel}
            disabled={loading}
            icon="fa-times"
            style={{ flex: 1 }}
          >
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
            icon="fa-plus-circle"
            style={{ flex: 1 }}
          >
            {loading ? 'Створення...' : 'Створити Сесію'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
