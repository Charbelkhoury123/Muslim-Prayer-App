import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../../theme';
import { ProgressBar } from './ProgressBar';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onContinue,
  onBack,
  continueLabel = 'Continue',
}) => {
  console.log('OnboardingLayout: Rendering step', currentStep);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.headerButton}>
          {onBack && <Ionicons name="arrow-back" size={24} color={Colors.primary} />}
        </Pressable>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <View style={styles.headerButton}>
          <Ionicons name="moon" size={24} color="#C9970A" />
        </View>
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.footer}>
        <Pressable onPress={onContinue} style={styles.button}>
          <Text style={styles.buttonText}>{continueLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 60,
  },
  headerButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
  },
});
