import { useState } from 'react';
import './src/i18n';
import { initDB } from './src/storage/db';

// Initialize SQLite database on startup
initDB().catch(console.error);
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useAppStore } from './src/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { Colors } from './src/theme';
import { JournalListScreen } from './src/screens/JournalListScreen';

type Tab = 'home' | 'journal' | 'settings';

export default function App() {
  const { hasOnboarded, setOnboarded } = useAppStore();
  const [tab, setTab] = useState<Tab>('home');
  const { t } = useTranslation();

  if (!hasOnboarded) {
    return (
      <View style={styles.rootOnboarding}>
        <OnboardingScreen onComplete={() => setOnboarded(true)} />
        <StatusBar style="dark" />
      </View>
    );
  }

  const renderContent = () => {
    switch (tab) {
      case 'home': return <HomeScreen />;
      case 'journal': return <JournalListScreen />;
      case 'settings': return <SettingsScreen />;
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, tab === 'home' && styles.tabActive]}
          onPress={() => setTab('home')}
        >
          <Ionicons 
            name={tab === 'home' ? "time" : "time-outline"} 
            size={24} 
            color={tab === 'home' ? Colors.white : Colors.textLight} 
          />
          <Text style={[styles.tabText, tab === 'home' && styles.tabTextActive]}>
            {t('tab.times')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, tab === 'journal' && styles.tabActive]}
          onPress={() => setTab('journal')}
        >
          <Ionicons 
            name={tab === 'journal' ? "book" : "book-outline"} 
            size={24} 
            color={tab === 'journal' ? Colors.white : Colors.textLight} 
          />
          <Text style={[styles.tabText, tab === 'journal' && styles.tabTextActive]}>
            {t('tab.journal')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, tab === 'settings' && styles.tabActive]}
          onPress={() => setTab('settings')}
        >
          <Ionicons 
            name={tab === 'settings' ? "settings" : "settings-outline"} 
            size={24} 
            color={tab === 'settings' ? Colors.white : Colors.textLight} 
          />
          <Text style={[styles.tabText, tab === 'settings' && styles.tabTextActive]}>
            {t('tab.settings')}
          </Text>
        </Pressable>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  rootOnboarding: {
    flex: 1,
    backgroundColor: '#F5F2E6',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 30, // For home indicator
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },
});
