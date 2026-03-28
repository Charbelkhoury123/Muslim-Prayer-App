import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentStreak } from '../storage/prayerLog';
import { useTranslation } from 'react-i18next';

export function StreakCard() {
  const { t } = useTranslation();
  const streak = getCurrentStreak();
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : streak + 10;
  const targetProgress = Math.min(streak / nextMilestone, 1);
  const remaining = nextMilestone - streak;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(300);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 1000,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const fillWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  const isActive = streak > 0;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.streakBlock}>
          <Text style={styles.streakNum}>{streak}</Text>
          <View style={styles.streakLabelRow}>
            <Text style={styles.streakLabel}>
              {streak === 1 ? 'DAY' : 'DAYS'}
            </Text>
            <Text style={styles.streakSub}> streak</Text>
          </View>
        </View>
        <View style={[styles.flameBadge, isActive && styles.flameBadgeActive]}>
          <Ionicons
            name="flame"
            size={28}
            color={isActive ? Colors.gold : Colors.inactive}
          />
          {isActive && (
            <Text style={styles.flameStreak}>{streak}</Text>
          )}
        </View>
      </View>

      <View
        style={styles.progressBg}
        onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
      </View>

      <Text style={styles.milestoneText}>
        {remaining} {remaining === 1 ? 'day' : 'days'} to {nextMilestone}-day milestone
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  streakBlock: {
    gap: 2,
  },
  streakNum: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
    lineHeight: 48,
  },
  streakLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
  },
  streakSub: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  flameBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameBadgeActive: {
    backgroundColor: Colors.goldLight,
  },
  flameStreak: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: 3,
    overflow: 'hidden',
  },
  progressBg: {
    height: 6,
    backgroundColor: Colors.inactive,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentDark,
    borderRadius: 3,
  },
  milestoneText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
