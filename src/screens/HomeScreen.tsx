import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OBLIGATORY_PRAYER_IDS, type ObligatoryPrayerId } from '../types/prayer';
import { usePrayerLog } from '../hooks/usePrayerLog';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { formatDurationMs } from '../utils/formatDuration';

const PRAYER_LABELS: Record<ObligatoryPrayerId, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const NEXT_PRAYER_LABELS: Record<string, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

function fmtTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function HomeScreen() {
  const { calculationMethod, madhab } = useUserPreferences();
  const {
    prayerTimes,
    isLoadingLocation,
    locationError,
    permissionStatus,
    requestPermissionAndLocation,
    calendarDayKey,
    nextPrayer,
    msUntilNext,
    coordinates,
  } = usePrayerTimes({ calculationMethod, madhab });

  const { todayLog, streak, setCompleted } = usePrayerLog();

  const nextLabel =
    nextPrayer != null
      ? NEXT_PRAYER_LABELS[nextPrayer.id] ?? nextPrayer.id
      : null;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Prayer times</Text>
        <Text style={styles.sub}>
          {calendarDayKey}
          {coordinates != null
            ? ` · ${coordinates.latitude.toFixed(2)}°, ${coordinates.longitude.toFixed(2)}°`
            : ''}
          {permissionStatus ? ` · ${permissionStatus}` : ''}
        </Text>

        {nextPrayer != null && msUntilNext != null && (
          <View style={styles.nextBox}>
            <Text style={styles.nextLabel}>Next prayer</Text>
            <Text style={styles.nextName}>{nextLabel}</Text>
            <Text style={styles.nextAt}>{fmtTime(nextPrayer.at)}</Text>
            <Text style={styles.nextCountdown}>
              in {formatDurationMs(msUntilNext)}
            </Text>
          </View>
        )}

        <View style={styles.streakBox}>
          <Text style={styles.streakLabel}>Streak</Text>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakHint}>
            Days in a row with all five prayers marked complete.
          </Text>
        </View>

        {isLoadingLocation && (
          <Text style={styles.muted}>Getting location…</Text>
        )}
        {locationError && (
          <Text style={styles.error}>{locationError.message}</Text>
        )}
        {permissionStatus === 'denied' && !isLoadingLocation && (
          <Pressable style={styles.button} onPress={requestPermissionAndLocation}>
            <Text style={styles.buttonText}>Retry location permission</Text>
          </Pressable>
        )}

        {prayerTimes && (
          <View style={styles.card}>
            <Row label="Fajr" time={fmtTime(prayerTimes.fajr)} />
            <Row label="Sunrise" time={fmtTime(prayerTimes.sunrise)} />
            <Row label="Dhuhr" time={fmtTime(prayerTimes.dhuhr)} />
            <Row label="Asr" time={fmtTime(prayerTimes.asr)} />
            <Row label="Maghrib" time={fmtTime(prayerTimes.maghrib)} />
            <Row label="Isha" time={fmtTime(prayerTimes.isha)} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Today's completion</Text>
        {OBLIGATORY_PRAYER_IDS.map((id) => (
          <Pressable
            key={id}
            style={[styles.rowBtn, todayLog[id] && styles.rowBtnOn]}
            onPress={() => setCompleted(id, !todayLog[id])}
          >
            <Text style={styles.rowBtnText}>
              {PRAYER_LABELS[id]} {todayLog[id] ? '✓' : ''}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Row({ label, time }: { label: string; time: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e8eef5',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#8b9aad',
    marginBottom: 20,
  },
  nextBox: {
    backgroundColor: '#1e2a3d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d4a6a',
  },
  nextLabel: {
    fontSize: 12,
    color: '#8b9aad',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nextName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#a8d4ff',
    marginTop: 4,
  },
  nextAt: {
    fontSize: 15,
    color: '#c5d0de',
    marginTop: 4,
  },
  nextCountdown: {
    fontSize: 14,
    color: '#7dd3c0',
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  streakBox: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  streakLabel: {
    fontSize: 13,
    color: '#8b9aad',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#7dd3c0',
    marginTop: 4,
  },
  streakHint: {
    fontSize: 12,
    color: '#6b7c90',
    marginTop: 8,
  },
  muted: {
    color: '#8b9aad',
    marginBottom: 8,
  },
  error: {
    color: '#f0a4a4',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2d3d52',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  buttonText: {
    color: '#e8eef5',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    color: '#c5d0de',
  },
  rowTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8eef5',
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#e8eef5',
    marginBottom: 10,
  },
  rowBtn: {
    backgroundColor: '#1a2332',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d3d52',
  },
  rowBtnOn: {
    borderColor: '#4a9078',
    backgroundColor: '#152620',
  },
  rowBtnText: {
    color: '#e8eef5',
    fontSize: 16,
  },
});
