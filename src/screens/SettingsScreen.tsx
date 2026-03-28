import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView, Switch, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Madhab } from 'adhan';
import * as Haptics from 'expo-haptics';
import { AppPickerScreen } from './AppPickerScreen';
import { AboutScreen } from './AboutScreen';
import { Brand } from '../config/brand';

const CALC_METHODS = [
  'MuslimWorldLeague', 'Egyptian', 'Karachi', 'UmmAlQura', 'Dubai', 'MoonsightingCommittee', 'NorthAmerica', 'Kuwait', 'Qatar', 'Singapore', 'Tehran', 'Turkey'
] as const;

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const { 
    calculationMethod, setCalculationMethod,
    madhab, setMadhab,
    notificationsEnabled, setNotificationsEnabled,
    blockedAppIds,
    setOnboarded
  } = useAppStore();

  const handleToggleNotifications = (v: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(v);
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      t('settings.resetOnboarding'),
      'This will take you back to the welcome screen. Are you sure?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.done'), style: 'destructive', onPress: () => setOnboarded(false) },
      ]
    );
  };

  if (showAppPicker) {
    return <AppPickerScreen onBack={() => setShowAppPicker(false)} />;
  }

  if (showAbout) {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: Colors.background }}>
          <Pressable onPress={() => setShowAbout(false)} style={styles.backRow}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            <Text style={styles.backLabel}>{t('settings.title')}</Text>
          </Pressable>
        </SafeAreaView>
        <AboutScreen />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sub}>
          Calculation method and madhab are stored locally on your device to ensure privacy.
        </Text>

        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.card}>
          <Pressable style={styles.option} onPress={toggleLanguage}>
             <Text style={styles.optionText}>{i18n.language === 'en' ? 'English' : 'العربية'}</Text>
             <Ionicons name="language" size={20} color={Colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={styles.card}>
          <View style={styles.option}>
            <Text style={styles.optionText}>{t('settings.notifications')}</Text>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={notificationsEnabled ? Colors.accent : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.appBlocking')}</Text>
        <View style={styles.card}>
          <Pressable style={styles.option} onPress={() => setShowAppPicker(true)}>
            <View>
              <Text style={styles.optionText}>{t('settings.selectApps')}</Text>
              <Text style={styles.optionSub}>{blockedAppIds.length} apps selected</Text>
            </View>
            <Ionicons name="apps" size={20} color={Colors.primary} />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.calcMethod')}</Text>
        <View style={styles.card}>
          {CALC_METHODS.map((key, index) => (
            <Pressable
              key={key}
              style={[
                styles.option,
                calculationMethod === key && styles.optionSelected,
                index === CALC_METHODS.length - 1 && styles.lastOption,
              ]}
              onPress={() => setCalculationMethod(key as any)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionText, calculationMethod === key && styles.optionTextSelected]}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
              {calculationMethod === key && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('settings.madhab')}</Text>
        <View style={styles.card}>
          {[Madhab.Shafi, Madhab.Hanafi].map((key, index) => (
            <Pressable
              key={key}
              style={[
                styles.option,
                madhab === key && styles.optionSelected,
                index === 1 && styles.lastOption,
              ]}
              onPress={() => setMadhab(key)}
            >
              <Text style={[styles.optionText, madhab === key && styles.optionTextSelected]}>
                {key === Madhab.Shafi ? 'Shafi / standard' : 'Hanafi'}
              </Text>
              {madhab === key && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
            </Pressable>
          ))}
        </View>

        {/* About & Utilities */}
        <View style={styles.card}>
          <Pressable style={styles.option} onPress={() => setShowAbout(true)}>
            <Text style={styles.optionText}>{t('settings.about')}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </Pressable>

          <Pressable style={[styles.option, styles.lastOption]} onPress={handleResetOnboarding}>
            <Text style={[styles.optionText, { color: '#C0392B' }]}>{t('settings.resetOnboarding')}</Text>
            <Ionicons name="refresh" size={20} color="#C0392B" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{Brand.name} v{Brand.version}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sub: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  optionSelected: {
    backgroundColor: 'rgba(45, 90, 39, 0.05)',
  },
  firstOption: {
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
  },
  lastOption: {
    borderBottomWidth: 0,
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 16,
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  optionSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    opacity: 0.7,
  },
  optionContent: {
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    opacity: 0.5,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  backLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
});
