import { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import { OBLIGATORY_PRAYER_IDS, type ObligatoryPrayerId } from '../types/prayer';
import { usePrayerLog } from '../hooks/usePrayerLog';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { getPrayerTimesForDate, getNextPrayerBrief } from '../utils/prayerEngine';
import { formatDurationMs } from '../utils/formatDuration';
import { Colors, Fonts } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QiblaCompass } from '../components/QiblaCompass';
import { scheduleAthanNotifications } from '../utils/notifications';
import { useAppBlocking } from '../hooks/useAppBlocking';
import { FocusOverlay } from '../components/FocusOverlay';
import { JournalFormScreen } from './JournalFormScreen';
import { StreakCard } from '../components/StreakCard';

function fmtTime(d: Date | null) {
  if (!d) return '--:--';
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const ARABIC_NAMES: Record<string, string> = {
  fajr: 'الفجر',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

function getPrayerTimeById(prayerTimes: any, id: ObligatoryPrayerId): Date | null {
  if (!prayerTimes) return null;
  const map: Record<string, Date | null> = {
    fajr: prayerTimes.fajr ?? null,
    dhuhr: prayerTimes.dhuhr ?? null,
    asr: prayerTimes.asr ?? null,
    maghrib: prayerTimes.maghrib ?? null,
    isha: prayerTimes.isha ?? null,
  };
  return map[id] ?? null;
}

interface PrayerRowProps {
  id: ObligatoryPrayerId;
  isCompleted: boolean;
  time: Date | null;
  prayerName: string;
  onToggle: () => void;
}

function PrayerRow({ id, isCompleted, time, prayerName, onToggle }: PrayerRowProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 300 }),
    ]).start();
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.prayerRow, isCompleted && styles.prayerRowDone]}
        onPress={handlePress}
      >
        <View style={styles.prayerLeft}>
          <View style={[styles.checkCircle, isCompleted && styles.checkCircleDone]}>
            {isCompleted && <Ionicons name="checkmark" size={14} color={Colors.white} />}
          </View>
          <View>
            <Text style={[styles.prayerName, isCompleted && styles.textDone]}>{prayerName}</Text>
            <Text style={[styles.prayerTime, isCompleted && styles.timeDone]}>
              {isCompleted ? 'Prayed' : fmtTime(time)}
            </Text>
          </View>
        </View>
        <Text style={[styles.arabicName, isCompleted && styles.arabicDone]}>
          {ARABIC_NAMES[id]}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function HomeScreen() {
  const { t } = useTranslation();
  const { coordinates, calculationMethod, madhab, notificationsEnabled } = useAppStore();
  const [showCompass, setShowCompass] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showJournal, setShowJournal] = useState(false);
  const [journalPrayer, setJournalPrayer] = useState<{ id: string; label: string } | null>(null);

  const prayerTimes = coordinates
    ? getPrayerTimesForDate(new Date(), coordinates, calculationMethod, madhab)
    : null;

  const nextPrayer = prayerTimes ? getNextPrayerBrief(prayerTimes, now) : null;
  const msUntilNext = nextPrayer?.at ? Math.max(0, nextPrayer.at.getTime() - now.getTime()) : null;

  const { todayLog, setCompleted } = usePrayerLog();
  const activeFocus = useAppBlocking();
  const completedCount = OBLIGATORY_PRAYER_IDS.filter(id => todayLog[id]).length;

  // ── Entrance Animations ─────────────────────────────
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const rowAnims = useRef(OBLIGATORY_PRAYER_IDS.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entrance = Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.timing(cardsAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.stagger(
        75,
        rowAnims.map(anim =>
          Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 90 })
        )
      ),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.022, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ])
    );

    entrance.start(() => pulse.start());
    return () => {
      entrance.stop();
      pulse.stop();
    };
  }, []);
  // ────────────────────────────────────────────────────

  const handleMissed = () => {
    if (activeFocus) {
      setJournalPrayer({ id: activeFocus.id, label: activeFocus.label });
      setShowJournal(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (notificationsEnabled && prayerTimes) {
      scheduleAthanNotifications(prayerTimes as any);
    }
  }, [notificationsEnabled, prayerTimes]);

  const handleToggle = (id: ObligatoryPrayerId, current: boolean) => {
    setCompleted(id, !current);
  };

  const todayStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const headerPaddingTop = Platform.OS === 'web' ? 67 : 0;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { paddingTop: headerPaddingTop },
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View>
          <Text style={styles.arabicGreeting}>السلام عليكم</Text>
          <Text style={styles.dateStr}>{todayStr}</Text>
        </View>
        <Pressable
          onPress={() => setShowCompass(!showCompass)}
          style={[styles.compassBtn, showCompass && styles.compassBtnActive]}
        >
          <Ionicons
            name={showCompass ? 'compass' : 'compass-outline'}
            size={22}
            color={showCompass ? Colors.white : Colors.primary}
          />
        </Pressable>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Compass */}
        {showCompass && coordinates && (
          <View style={styles.compassCard}>
            <QiblaCompass latitude={coordinates.latitude} longitude={coordinates.longitude} />
          </View>
        )}

        {/* Streak + Next Prayer — animated as one group */}
        <Animated.View
          style={{
            opacity: cardsAnim,
            transform: [
              {
                translateY: cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <StreakCard />

          {nextPrayer != null && (
            <View style={styles.nextCard}>
              <View style={styles.nextLeft}>
                <Text style={styles.nextLabel}>NEXT PRAYER</Text>
                <Text style={styles.nextName}>{t(`prayer.${nextPrayer.id}`)}</Text>
                <Text style={styles.nextArabic}>{ARABIC_NAMES[nextPrayer.id] ?? ''}</Text>
                <View style={styles.nextTimeRow}>
                  <Ionicons name="time-outline" size={13} color="rgba(245,242,230,0.5)" />
                  <Text style={styles.nextAt}> {fmtTime(nextPrayer.at)}</Text>
                </View>
              </View>
              <View style={styles.nextRight}>
                <Text style={styles.nextIn}>in</Text>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Text style={styles.nextCountdown}>
                    {msUntilNext != null ? formatDurationMs(msUntilNext) : '--'}
                  </Text>
                </Animated.View>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Section header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's Prayers</Text>
          <View style={styles.progressRow}>
            {OBLIGATORY_PRAYER_IDS.map(id => (
              <View
                key={id}
                style={[styles.progressDot, todayLog[id] && styles.progressDotDone]}
              />
            ))}
            <Text style={styles.progressCount}>{completedCount}/5</Text>
          </View>
        </View>

        {/* Staggered prayer rows */}
        <View style={styles.prayerList}>
          {OBLIGATORY_PRAYER_IDS.map((id, index) => (
            <Animated.View
              key={id}
              style={{
                opacity: rowAnims[index],
                transform: [
                  {
                    translateY: rowAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [28, 0],
                    }),
                  },
                ],
              }}
            >
              <PrayerRow
                id={id}
                isCompleted={todayLog[id]}
                time={getPrayerTimeById(prayerTimes, id)}
                prayerName={t(`prayer.${id}`)}
                onToggle={() => handleToggle(id, todayLog[id])}
              />
            </Animated.View>
          ))}
        </View>

        {!coordinates && (
          <View style={styles.noLocationCard}>
            <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
            <Text style={styles.noLocationText}>
              Set your location in Settings to see prayer times.
            </Text>
          </View>
        )}

        {/* Quote */}
        <View style={styles.quoteSection}>
          <View style={styles.quoteMark}>
            <Text style={styles.quoteMarkText}>"</Text>
          </View>
          <Text style={styles.quoteText}>
            Establish prayer for my remembrance.
          </Text>
          <Text style={styles.quoteSource}>— Qur'an 20:14</Text>
        </View>
      </ScrollView>

      {activeFocus && !showJournal && (
        <FocusOverlay
          prayerName={activeFocus.label}
          msRemaining={activeFocus.msRemaining}
          onComplete={() => handleToggle(activeFocus.id as ObligatoryPrayerId, false)}
          onMissed={handleMissed}
        />
      )}

      {showJournal && journalPrayer && (
        <View style={StyleSheet.absoluteFill}>
          <JournalFormScreen
            prayerId={journalPrayer.id}
            prayerName={journalPrayer.label}
            onClose={() => setShowJournal(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  arabicGreeting: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateStr: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Fonts.semibold,
    marginTop: 3,
  },
  compassBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inactive,
  },
  compassBtnActive: {
    backgroundColor: Colors.primary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  compassCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  nextCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  nextLeft: {
    flex: 1,
  },
  nextLabel: {
    fontSize: 10,
    color: 'rgba(245,242,230,0.45)',
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: Fonts.extrabold,
  },
  nextName: {
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 36,
    fontFamily: Fonts.extrabold,
  },
  nextArabic: {
    fontSize: 20,
    color: 'rgba(245,242,230,0.35)',
    marginTop: 2,
    marginBottom: 10,
  },
  nextTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextAt: {
    fontSize: 13,
    color: 'rgba(245,242,230,0.5)',
    fontFamily: Fonts.semibold,
  },
  nextRight: {
    alignItems: 'flex-end',
  },
  nextIn: {
    fontSize: 12,
    color: 'rgba(245,242,230,0.4)',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: Fonts.semibold,
  },
  nextCountdown: {
    fontSize: 24,
    color: Colors.white,
    letterSpacing: -0.5,
    fontFamily: Fonts.extrabold,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.inactive,
  },
  progressDotDone: {
    backgroundColor: Colors.accentDark,
  },
  progressCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
    fontFamily: Fonts.semibold,
  },
  prayerList: {
    gap: 10,
    marginBottom: 32,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prayerRowDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  prayerName: {
    fontSize: 17,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  prayerTime: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: Fonts.semibold,
  },
  textDone: {
    color: Colors.white,
  },
  timeDone: {
    color: 'rgba(255,255,255,0.6)',
  },
  arabicName: {
    fontSize: 22,
    color: Colors.primary,
    opacity: 0.18,
  },
  arabicDone: {
    color: Colors.white,
    opacity: 0.35,
  },
  noLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceWarm,
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noLocationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
  quoteSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  quoteMark: {
    marginBottom: 2,
  },
  quoteMarkText: {
    fontSize: 52,
    color: Colors.accent,
    lineHeight: 44,
    opacity: 0.6,
    fontFamily: Fonts.extrabold,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Fonts.regular,
  },
  quoteSource: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 10,
    letterSpacing: 0.5,
    fontFamily: Fonts.semibold,
  },
});
