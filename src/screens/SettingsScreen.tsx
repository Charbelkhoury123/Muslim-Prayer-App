import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Colors, Fonts } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { Madhab } from 'adhan';
import * as Haptics from 'expo-haptics';
import { AppPickerScreen } from './AppPickerScreen';
import { AboutScreen } from './AboutScreen';
import { Brand } from '../config/brand';

const CALC_METHODS = [
  'MuslimWorldLeague', 'Egyptian', 'Karachi', 'UmmAlQura', 'Dubai',
  'MoonsightingCommittee', 'NorthAmerica', 'Kuwait', 'Qatar', 'Singapore', 'Tehran', 'Turkey',
] as const;

function formatMethodName(key: string) {
  return key.replace(/([A-Z])/g, ' $1').trim();
}

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const {
    calculationMethod, setCalculationMethod,
    madhab, setMadhab,
    notificationsEnabled, setNotificationsEnabled,
    blockedAppIds,
    setOnboarded,
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
        { text: 'Reset', style: 'destructive', onPress: () => setOnboarded(false) },
      ]
    );
  };

  const headerPaddingTop = Platform.OS === 'web' ? 67 : 0;

  if (showAppPicker) return <AppPickerScreen onBack={() => setShowAppPicker(false)} />;

  if (showAbout) {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: Colors.background }}>
          <Pressable onPress={() => setShowAbout(false)} style={styles.backRow}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
            <Text style={styles.backLabel}>{t('settings.title')}</Text>
          </Pressable>
        </SafeAreaView>
        <AboutScreen />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.header, { paddingTop: headerPaddingTop }]}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
        <View style={styles.card}>
          <Pressable style={[styles.row, styles.lastRow]} onPress={toggleLanguage}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: '#E8F4F8' }]}>
                <Ionicons name="language" size={18} color="#3A7FBF" />
              </View>
              <Text style={styles.rowText}>{i18n.language === 'en' ? 'English' : 'العربية'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>{t('settings.notifications')}</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.lastRow]}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: '#FFF0E8' }]}>
                <Ionicons name="notifications" size={18} color="#E07840" />
              </View>
              <Text style={styles.rowText}>{t('settings.notifications')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.inactive, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('settings.appBlocking')}</Text>
        <View style={styles.card}>
          <Pressable style={[styles.row, styles.lastRow]} onPress={() => setShowAppPicker(true)}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: '#F0EEF8' }]}>
                <Ionicons name="apps" size={18} color="#7B5EA7" />
              </View>
              <View>
                <Text style={styles.rowText}>{t('settings.selectApps')}</Text>
                <Text style={styles.rowSub}>{blockedAppIds.length} apps selected</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>{t('settings.calcMethod')}</Text>
        <View style={styles.card}>
          {CALC_METHODS.map((key, index) => (
            <Pressable
              key={key}
              style={[styles.row, index === CALC_METHODS.length - 1 && styles.lastRow]}
              onPress={() => setCalculationMethod(key as any)}
            >
              <Text style={[styles.rowText, calculationMethod === key && styles.rowTextSelected]}>
                {formatMethodName(key)}
              </Text>
              {calculationMethod === key && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('settings.madhab')}</Text>
        <View style={styles.card}>
          {[Madhab.Shafi, Madhab.Hanafi].map((key, index) => (
            <Pressable
              key={key}
              style={[styles.row, index === 1 && styles.lastRow]}
              onPress={() => setMadhab(key)}
            >
              <Text style={[styles.rowText, madhab === key && styles.rowTextSelected]}>
                {key === Madhab.Shafi ? 'Shafi / Maliki / Hanbali' : 'Hanafi'}
              </Text>
              {madhab === key && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Pressable style={styles.row} onPress={() => setShowAbout(true)}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: '#EAF5ED' }]}>
                <Ionicons name="information-circle" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.rowText}>{t('settings.about')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </Pressable>
          <Pressable style={[styles.row, styles.lastRow]} onPress={handleResetOnboarding}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: '#FCEAEA' }]}>
                <Ionicons name="refresh" size={18} color={Colors.danger} />
              </View>
              <Text style={[styles.rowText, { color: Colors.danger }]}>
                {t('settings.resetOnboarding')}
              </Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footerText}>{Brand.name} v{Brand.version}</Text>
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
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.primary,
    letterSpacing: -0.3,
    fontFamily: Fonts.extrabold,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 1.4,
    marginBottom: 8,
    marginTop: 24,
    marginLeft: 4,
    textTransform: 'uppercase',
    fontFamily: Fonts.bold,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.semibold,
  },
  rowTextSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: Fonts.regular,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  backLabel: {
    fontSize: 17,
    color: Colors.primary,
    fontFamily: Fonts.bold,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.6,
    fontFamily: Fonts.semibold,
  },
});
