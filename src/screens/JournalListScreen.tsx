import { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme';
import { getJournalEntries, type JournalEntry } from '../storage/db';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const PRAYER_COLORS: Record<string, string> = {
  fajr: '#6B9FD4',
  dhuhr: '#C9970A',
  asr: '#D4784A',
  maghrib: '#C9566A',
  isha: '#7B5EA7',
};

const PRAYER_LABELS: Record<string, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function JournalEntryCard({ item }: { item: JournalEntry }) {
  const color = PRAYER_COLORS[item.prayer_id] ?? Colors.secondary;
  const label = PRAYER_LABELS[item.prayer_id] ?? item.prayer_id;
  const relDate = formatRelativeDate(item.timestamp);
  const timeStr = new Date(item.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={[styles.prayerBadge, { backgroundColor: color + '22' }]}>
            <Text style={[styles.prayerBadgeText, { color }]}>{label}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateRelative}>{relDate}</Text>
            <Text style={styles.dateTime}>{timeStr}</Text>
          </View>
        </View>
        <Text style={styles.reflectionText}>{item.reflection}</Text>
      </View>
    </View>
  );
}

export function JournalListScreen() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getJournalEntries();
      setEntries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const headerPaddingTop = Platform.OS === 'web' ? 67 : 0;

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <View>
          <Text style={styles.headerTitle}>{t('journal.title')}</Text>
          <Text style={styles.headerSub}>
            {entries.length} {entries.length === 1 ? 'reflection' : 'reflections'}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="book" size={20} color={Colors.primary} />
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="book-outline" size={32} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>{t('journal.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('journal.emptyDesc')}</Text>
          </View>
        }
        renderItem={({ item }) => <JournalEntryCard item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  prayerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  prayerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dateBlock: {
    alignItems: 'flex-end',
  },
  dateRelative: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
  },
  dateTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  reflectionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 23,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    lineHeight: 20,
    fontSize: 14,
  },
});
