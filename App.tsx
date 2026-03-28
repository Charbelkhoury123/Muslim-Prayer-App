import { useState } from 'react';
import './src/i18n';
import { initDB } from './src/storage/db';
initDB().catch(console.error);

import { Pressable, Platform, StyleSheet, Text, View } from 'react-native';
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

interface TabItem {
  id: Tab;
  labelKey: string;
  icon: string;
  iconActive: string;
}

const TABS: TabItem[] = [
  { id: 'home', labelKey: 'tab.times', icon: 'time-outline', iconActive: 'time' },
  { id: 'journal', labelKey: 'tab.journal', icon: 'book-outline', iconActive: 'book' },
  { id: 'settings', labelKey: 'tab.settings', icon: 'settings-outline', iconActive: 'settings' },
];

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
      <View style={styles.content}>{renderContent()}</View>

      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {TABS.map(item => {
            const isActive = tab === item.id;
            return (
              <Pressable
                key={item.id}
                style={styles.tab}
                onPress={() => setTab(item.id)}
              >
                <View style={[styles.tabIconWrap, isActive && styles.tabIconWrapActive]}>
                  <Ionicons
                    name={(isActive ? item.iconActive : item.icon) as any}
                    size={22}
                    color={isActive ? Colors.white : Colors.textMuted}
                  />
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {t(item.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const TAB_BOTTOM = Platform.OS === 'web' ? 34 : 28;

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
  tabBarWrapper: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: TAB_BOTTOM,
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabIconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
