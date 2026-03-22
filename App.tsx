import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'home' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable
          style={[styles.tab, tab === 'home' && styles.tabActive]}
          onPress={() => setTab('home')}
        >
          <Text style={[styles.tabText, tab === 'home' && styles.tabTextActive]}>
            Times
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'settings' && styles.tabActive]}
          onPress={() => setTab('settings')}
        >
          <Text
            style={[styles.tabText, tab === 'settings' && styles.tabTextActive]}
          >
            Settings
          </Text>
        </Pressable>
      </View>

      {tab === 'home' ? <HomeScreen /> : <SettingsScreen />}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f1419',
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1a2332',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3d52',
  },
  tabActive: {
    borderColor: '#4a7a9e',
    backgroundColor: '#152028',
  },
  tabText: {
    color: '#8b9aad',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#e8eef5',
  },
});
