import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'ar', native: 'العربية' },
];

export const WelcomeScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [menstruates, setMenstruates] = useState<'yes' | 'no'>('no');

  const handleSelectLang = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={5} onContinue={onContinue}>
      <View style={styles.container}>
        <Animated.Text entering={FadeInDown.duration(600)} style={styles.title}>
          {t('onboarding.welcome')}
        </Animated.Text>

        <Animated.Text entering={FadeInDown.delay(100).duration(600)} style={styles.subtitle}>
          {t('onboarding.subtitle')}
        </Animated.Text>

        {/* Language Selection */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>{t('settings.language')}</Text>
          <View style={styles.row}>
            {LANGUAGES.map(lang => (
              <Pressable
                key={lang.code}
                style={[styles.pill, selectedLang === lang.code && styles.pillSelected]}
                onPress={() => handleSelectLang(lang.code)}
              >
                <Text style={[styles.pillText, selectedLang === lang.code && styles.pillTextSelected]}>
                  {lang.native}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Menstruation Question */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.inputGroup}>
          <Text style={styles.label}>
            Do you menstruate?{' '}
            <Text style={styles.labelSub}>(required for hayḍ exception)</Text>
          </Text>
          <View style={styles.row}>
            <Pressable
              style={[styles.pill, menstruates === 'yes' && styles.pillSelected]}
              onPress={() => setMenstruates('yes')}
            >
              <Text style={[styles.pillText, menstruates === 'yes' && styles.pillTextSelected]}>Yes</Text>
            </Pressable>
            <Pressable
              style={[styles.pill, menstruates === 'no' && styles.pillSelected]}
              onPress={() => setMenstruates('no')}
            >
              <Text style={[styles.pillText, menstruates === 'no' && styles.pillTextSelected]}>No</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 10,
  },
  labelSub: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '400',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inactive,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  pillTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});
