import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentStreak } from '../storage/prayerLog';
import { useTranslation } from 'react-i18next';

export function StreakCard() {
  const { t } = useTranslation();
  const streak = getCurrentStreak();
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : streak + 10;
  const targetProgress = Math.min(streak / nextMilestone, 1);
  const remaining = nextMilestone - streak;
  const isActive = streak > 0;

  const progressAnim = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(300);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 1100,
      delay: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  const fillWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.streakBlock}>
          <Text style={styles.streakNum}>{streak}</Text>
          <View style={styles.streakLabelRow}>
            <Text style={styles.streakDaysLabel}>{streak === 1 ? 'DAY' : 'DAYS'}</Text>
            <Text style={styles.streakSub}> streak</Text>
          </View>
        </View>

        <View style={[styles.flameBadge, isActive && styles.flameBadgeActive]}>
          <Ionicons
            name="flame"
            size={26}
            color={isActive ? Colors.gold : Colors.textMuted}
          />
          {isActive && (
            <Text style={styles.flameCt}>{streak}</Text>
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
    marginBottom: 18,
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
    fontSize: 46,
    color: Colors.primary,
    letterSpacing: -2,
    lineHeight: 50,
    fontFamily: Fonts.extrabold,
  },
  streakLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakDaysLabel: {
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 2.5,
    fontFamily: Fonts.extrabold,
  },
  streakSub: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: Fonts.semibold,
  },
  flameBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameBadgeActive: {
    backgroundColor: Colors.goldLight,
  },
  flameCt: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 9,
    color: Colors.gold,
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: 3,
    overflow: 'hidden',
    fontFamily: Fonts.extrabold,
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
    fontFamily: Fonts.semibold,
  },
});
