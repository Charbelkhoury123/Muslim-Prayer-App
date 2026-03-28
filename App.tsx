import { useState, useEffect, useRef } from 'react';
import './src/i18n';
import { initDB } from './src/storage/db';
initDB().catch(console.error);

import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import { OnboardingScreen } from './src/screens/onboarding/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { useAppStore } from './src/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { Colors, Fonts } from './src/theme';
import { JournalListScreen } from './src/screens/JournalListScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Tab = 'home' | 'journal' | 'settings';

const TABS = [
  { id: 'home' as Tab, labelKey: 'tab.times', icon: 'time-outline' as const, iconActive: 'time' as const },
  { id: 'journal' as Tab, labelKey: 'tab.journal', icon: 'book-outline' as const, iconActive: 'book' as const },
  { id: 'settings' as Tab, labelKey: 'tab.settings', icon: 'settings-outline' as const, iconActive: 'settings' as const },
];

const TAB_BOTTOM = Platform.OS === 'web' ? 34 : 28;

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const { hasOnboarded, setOnboarded } = useAppStore();
  const [tab, setTab] = useState<Tab>('home');
  const { t } = useTranslation();

  const tabScales = useRef<Record<Tab, Animated.Value>>({
    home: new Animated.Value(1),
    journal: new Animated.Value(1),
    settings: new Animated.Value(1),
  }).current;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  const handleTabPress = (tabId: Tab) => {
    const iconAnim = tabScales[tabId];
    Animated.sequence([
      Animated.spring(iconAnim, { toValue: 0.76, useNativeDriver: true, friction: 10 }),
      Animated.spring(iconAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 220 }),
    ]).start();

    if (tabId === tab) return;

    Animated.timing(fadeAnim, { toValue: 0, duration: 90, useNativeDriver: true }).start(() => {
      setTab(tabId);
      Animated.timing(fadeAnim, { toValue: 1, duration: 230, useNativeDriver: true }).start();
    });
  };

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
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {renderContent()}
      </Animated.View>

      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          {TABS.map(item => {
            const isActive = tab === item.id;
            return (
              <Pressable
                key={item.id}
                style={styles.tab}
                onPress={() => handleTabPress(item.id)}
              >
                <Animated.View
                  style={[
                    styles.tabIconWrap,
                    isActive && styles.tabIconWrapActive,
                    { transform: [{ scale: tabScales[item.id] }] },
                  ]}
                >
                  <Ionicons
                    name={isActive ? item.iconActive : item.icon}
                    size={22}
                    color={isActive ? Colors.white : Colors.textMuted}
                  />
                </Animated.View>
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
    color: Colors.textMuted,
    letterSpacing: 0.2,
    fontFamily: Fonts.semibold,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
});
