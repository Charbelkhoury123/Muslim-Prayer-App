import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  FlatList, 
  Pressable, 
  TextInput 
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/common/Button';
import * as Haptics from 'expo-haptics';

// Mock apps for demonstration
const MOCK_APPS = [
  { id: 'com.apple.mobilesafari', name: 'Safari', icon: 'globe' },
  { id: 'com.google.chrome', name: 'Chrome', icon: 'logo-chrome' },
  { id: 'com.instagram.android', name: 'Instagram', icon: 'logo-instagram' },
  { id: 'com.facebook.katana', name: 'Facebook', icon: 'logo-facebook' },
  { id: 'com.twitter.android', name: 'Twitter (X)', icon: 'logo-twitter' },
  { id: 'com.zhiliaoapp.musically', name: 'TikTok', icon: 'logo-tiktok' },
  { id: 'com.whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp' },
  { id: 'com.netflix.mediaclient', name: 'Netflix', icon: 'videocam' },
  { id: 'com.google.android.youtube', name: 'YouTube', icon: 'logo-youtube' },
];

export function AppPickerScreen({ onBack }: { onBack: () => void }) {
  const { blockedAppIds, setBlockedAppIds } = useAppStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set(blockedAppIds));

  const filteredApps = MOCK_APPS.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleApp = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleSave = () => {
    setBlockedAppIds(Array.from(selected));
    onBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Select Apps</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search apps..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList 
        data={filteredApps}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selected.has(item.id);
          return (
            <Pressable 
              style={[styles.appRow, isSelected && styles.appRowSelected]}
              onPress={() => toggleApp(item.id)}
            >
              <View style={styles.appIcon}>
                <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.appName}>{item.name}</Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                {isSelected && <Ionicons name="checkmark" size={16} color={Colors.white} />}
              </View>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <Button title={`Save (${selected.size} Selected)`} onPress={handleSave} />
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  appRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(45, 90, 39, 0.05)',
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
