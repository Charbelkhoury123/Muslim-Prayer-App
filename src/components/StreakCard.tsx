import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentStreak } from '../storage/prayerLog';
import { useTranslation } from 'react-i18next';

export function StreakCard() {
  const { t } = useTranslation();
  const streak = getCurrentStreak();
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : streak + 10;
  const progress = Math.min((streak / nextMilestone) * 100, 100);
  const remaining = nextMilestone - streak;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? t('streak.day') : t('streak.days')}
          </Text>
        </View>
        <View style={[styles.flameContainer, streak > 0 && styles.flameActive]}>
          <Ionicons name="flame" size={40} color={streak > 0 ? Colors.accent : Colors.inactive} />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {t('streak.milestone', { remaining, target: nextMilestone })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakInfo: {
     flex: 1,
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.primary,
  },
  streakLabel: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '700',
    letterSpacing: 1,
  },
  flameContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inactive,
  },
  flameActive: {
    backgroundColor: 'rgba(164, 195, 178, 0.2)',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  progressContainer: {
    width: '100%',
  },
  progressBg: {
    height: 8,
    backgroundColor: Colors.inactive,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
});
