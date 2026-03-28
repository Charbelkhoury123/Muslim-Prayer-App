import React, { useState, useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

export const WelcomeScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [menstruates, setMenstruates] = useState<'yes' | 'no'>('no');

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(14)).current;
  const fieldsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, friction: 7, tension: 100 }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 380, delay: 200, useNativeDriver: true }),
      Animated.timing(textY, { toValue: 0, duration: 380, delay: 200, useNativeDriver: true }),
      Animated.timing(fieldsOpacity, { toValue: 1, duration: 350, delay: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSelectLang = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={5} onContinue={onContinue}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Brand mark */}
        <Animated.View style={[styles.brandArea, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.moonCircle}>
            <Ionicons name="moon" size={38} color={Colors.white} />
          </View>
          <Text style={styles.bismillah}>بسم الله الرحمن الرحيم</Text>
        </Animated.View>

        {/* Headline */}
        <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }] }}>
          <Text style={styles.title}>{t('onboarding.welcome')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
        </Animated.View>

        {/* Fields */}
        <Animated.View style={{ opacity: fieldsOpacity }}>
          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>{t('settings.language')}</Text>
          <View style={styles.pillRow}>
            {LANGUAGES.map(lang => {
              const active = selectedLang === lang.code;
              return (
                <Pressable
                  key={lang.code}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => handleSelectLang(lang.code)}
                >
                  {active && <Ionicons name="checkmark-circle" size={15} color={Colors.white} style={styles.checkIcon} />}
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{lang.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>
            Do you menstruate?{'  '}
            <Text style={styles.fieldNote}>for hayd exception</Text>
          </Text>
          <View style={styles.pillRow}>
            {(['yes', 'no'] as const).map(v => {
              const active = menstruates === v;
              return (
                <Pressable
                  key={v}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setMenstruates(v)}
                >
                  {active && <Ionicons name="checkmark-circle" size={15} color={Colors.white} style={styles.checkIcon} />}
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {v === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 4,
    paddingBottom: 24,
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  moonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  bismillah: {
    fontSize: 18,
    color: Colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    color: Colors.primary,
    marginBottom: 10,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 28,
  },
  fieldLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  fieldNote: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'none',
    fontFamily: Fonts.regular,
    letterSpacing: 0,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
  },
  pill: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.inactive,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkIcon: {
    marginRight: 2,
  },
  pillText: {
    fontSize: 15,
    color: Colors.text,
    fontFamily: Fonts.semibold,
  },
  pillTextActive: {
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
});
