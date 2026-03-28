import React, { useState, useEffect } from 'react';
import {
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('journal.title')}</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
             <Ionicons name="book-outline" size={48} color={Colors.inactive} />
             <Text style={styles.emptyTitle}>{t('journal.emptyTitle')}</Text>
             <Text style={styles.emptyText}>{t('journal.emptyDesc')}</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View 
            style={styles.entryCard}
          >
            <View style={styles.entryHeader}>
              <Text style={styles.entryPrayer}>{item.prayer_id.toUpperCase()}</Text>
              <Text style={styles.entryDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.entryText}>{item.reflection}</Text>
          </View>
        )}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textLight,
    marginTop: 8,
    lineHeight: 20,
    fontSize: 14,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primary,
    marginTop: 16,
  },
  entryCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  entryPrayer: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  entryDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  entryText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
});
