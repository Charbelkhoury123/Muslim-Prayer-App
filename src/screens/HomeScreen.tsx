import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { OBLIGATORY_PRAYER_IDS, type ObligatoryPrayerId } from '../types/prayer';
import { usePrayerLog } from '../hooks/usePrayerLog';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { getPrayerTimesForDate, getNextPrayerBrief } from '../utils/prayerEngine';
import { formatDurationMs } from '../utils/formatDuration';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QiblaCompass } from '../components/QiblaCompass';
import { scheduleAthanNotifications } from '../utils/notifications';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useAppBlocking } from '../hooks/useAppBlocking';
import { FocusOverlay } from '../components/FocusOverlay';
import { JournalFormScreen } from './JournalFormScreen';
import { StreakCard } from '../components/StreakCard';

/**
 * Format date to local time string (e.g. 5:45 AM)
 */
function fmtTime(d: Date | null) {
  if (!d) return '--:--';
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HomeScreen() {
  const { t } = useTranslation();
  const { coordinates, calculationMethod, madhab, notificationsEnabled } = useAppStore();
  const [showCompass, setShowCompass] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showJournal, setShowJournal] = useState(false);
  const [journalPrayer, setJournalPrayer] = useState<{ id: string, label: string } | null>(null);

  const prayerTimes = coordinates 
    ? getPrayerTimesForDate(new Date(), coordinates, calculationMethod, madhab)
    : null;

  const nextPrayer = prayerTimes ? getNextPrayerBrief(prayerTimes, now) : null;
  const msUntilNext = nextPrayer?.at 
    ? Math.max(0, nextPrayer.at.getTime() - now.getTime()) 
    : null;

  const { todayLog, setCompleted } = usePrayerLog();
  const activeFocus = useAppBlocking();

  const handleMissed = () => {
    if (activeFocus) {
      setJournalPrayer({ id: activeFocus.id, label: activeFocus.label });
      setShowJournal(true);
    }
  };

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync notifications when basic settings change
  useEffect(() => {
    if (notificationsEnabled && prayerTimes) {
      // Cast is needed because our types are slightly differently structured than legacy ones
      scheduleAthanNotifications(prayerTimes as any);
    }
  }, [notificationsEnabled, prayerTimes]);

  const handleToggle = (id: ObligatoryPrayerId, current: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompleted(id, !current);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>aqimo</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowCompass(!showCompass)} style={styles.headerIconButton}>
            <Ionicons name={showCompass ? "compass" : "compass-outline"} size={24} color={Colors.primary} />
          </Pressable>
          <Ionicons name="share-outline" size={24} color={Colors.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Qibla Compass Panel */}
        {showCompass && coordinates && (
          <Animated.View 
            entering={FadeInUp.duration(600)}
            style={styles.compassSection}
          >
            <QiblaCompass latitude={coordinates.latitude} longitude={coordinates.longitude} />
          </Animated.View>
        )}

        {/* Streak & Rewards Card */}
        <Animated.View entering={FadeInUp.delay(50)}>
           <StreakCard />
        </Animated.View>

        {/* Next Prayer Countdown Card */}
        {nextPrayer != null && (
          <Animated.View 
            entering={FadeInUp.delay(100).duration(600)}
            style={styles.nextBox}
          >
            <View style={styles.nextTextContent}>
              <Text style={styles.nextName}>{t(`prayer.${nextPrayer.id}`)}</Text>
              <Text style={styles.nextCountdown}>{t('prayer.blockingApps')}</Text>
              <Text style={styles.nextCountdownTime}>
                 {msUntilNext != null ? formatDurationMs(msUntilNext) : '--'}
              </Text>
              <Text style={styles.nextAt}>{fmtTime(nextPrayer.at)}</Text>
            </View>
            <View style={styles.nextIllustration}>
              <Ionicons name="lock-closed" size={40} color={Colors.white} opacity={0.3} />
            </View>
          </Animated.View>
        )}

        {/* Quote/Ayah */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.quoteCard}
        >
          <Text style={styles.quoteText}>
            "Establish prayer for my remembrance."
          </Text>
          <Text style={styles.quoteSource}>— Qur'an 20:14</Text>
        </Animated.View>

        {/* Daily Prayer List */}
        <View style={styles.prayerList}>
          {prayerTimes && OBLIGATORY_PRAYER_IDS.map((id, index) => {
             const isCompleted = todayLog[id];
             const time = id === 'fajr' ? prayerTimes.fajr : 
                          id === 'dhuhr' ? prayerTimes.dhuhr :
                          id === 'asr' ? prayerTimes.asr :
                          id === 'maghrib' ? prayerTimes.maghrib :
                          prayerTimes.isha;
             
             return (
               <Animated.View 
                 key={id}
                 entering={FadeInUp.delay(300 + index * 100).duration(600)}
                 layout={Layout.springify()}
               >
                 <Pressable
                   style={[styles.prayerRow, isCompleted && styles.prayerRowActive]}
                   onPress={() => handleToggle(id, isCompleted)}
                 >
                   <View style={styles.prayerRowLeft}>
                      <View style={[styles.checkCircle, isCompleted && styles.checkCircleActive]}>
                         {isCompleted && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                      </View>
                      <View>
                        <Text style={[styles.prayerName, isCompleted && styles.prayerTextActive]}>
                           {t(`prayer.${id}`)}
                        </Text>
                        <Text style={[styles.prayerStatus, isCompleted && styles.prayerTextActive]}>
                           {isCompleted ? 'Completed' : fmtTime(time)}
                        </Text>
                      </View>
                   </View>
                   <Text style={[styles.arabicLabel, isCompleted && styles.prayerTextActive]}>
                      {t(`prayer.${id}`)} {/* Use t for Arabic translation instead of inline */}
                   </Text>
                 </Pressable>
               </Animated.View>
             );
          })}
        </View>

        {!coordinates && (
           <Text style={styles.muted}>Please set your location in Settings to see prayer times.</Text>
        )}
      </ScrollView>

      {/* Full-screen focus overlay if a prayer session is active */}
      {activeFocus && !showJournal && (
        <FocusOverlay 
          prayerName={activeFocus.label}
          msRemaining={activeFocus.msRemaining}
          onComplete={() => handleToggle(activeFocus.id as ObligatoryPrayerId, false)}
          onMissed={handleMissed}
        />
      )}

      {/* Journal Reflection Screen */}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconButton: {
    padding: 4,
  },
  compassSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  nextBox: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  nextTextContent: {
    flex: 1,
  },
  nextName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  nextCountdown: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.7,
    marginTop: 4,
  },
  nextCountdownTime: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 4,
  },
  nextAt: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.6,
    marginTop: 8,
  },
  nextIllustration: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteCard: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: Colors.text,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 26,
  },
  quoteSource: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
  },
  prayerList: {
    gap: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  prayerRowActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  prayerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: Colors.white,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  prayerStatus: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
  prayerTextActive: {
    color: Colors.white,
  },
  arabicLabel: {
    fontSize: 24,
    color: Colors.primary,
    opacity: 0.2,
    fontWeight: '400',
  },
  muted: {
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
