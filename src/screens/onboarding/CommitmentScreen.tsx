import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import { Ionicons } from '@expo/vector-icons';

const BENEFITS = [
  { icon: 'flame' as const, color: Colors.gold, bg: Colors.goldLight, text: 'Build a daily prayer streak' },
  { icon: 'bar-chart' as const, color: '#3A7FBF', bg: '#E8F4F8', text: 'Track your consistency over time' },
  { icon: 'heart' as const, color: '#C9566A', bg: '#FDEEF1', text: 'Strengthen your relationship with Allah' },
];

export const CommitmentScreen: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;
  const benefitAnims = useRef(BENEFITS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(imageAnim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 80 }),
      ...benefitAnims.map((a, i) =>
        Animated.timing(a, { toValue: 1, duration: 350, delay: 240 + i * 80, useNativeDriver: true })
      ),
      Animated.timing(quoteAnim, { toValue: 1, duration: 380, delay: 540, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={5}
      onContinue={onContinue}
      onBack={onBack}
      continueLabel="Begin My Journey"
    >
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        }}
      >
        <Text style={styles.eyebrow}>YOU'RE READY</Text>
        <Text style={styles.title}>Make this commitment.{'\n'}Allah will reward you.</Text>
      </Animated.View>

      <Animated.View style={[styles.imageWrap, { opacity: imageAnim, transform: [{ scale: imageAnim }] }]}>
        <Image
          source={require('../../../assets/illustrations/commitment.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.benefits}>
        {BENEFITS.map((b, i) => (
          <Animated.View
            key={i}
            style={[
              styles.benefitRow,
              {
                opacity: benefitAnims[i],
                transform: [{ translateX: benefitAnims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
              },
            ]}
          >
            <View style={[styles.benefitIcon, { backgroundColor: b.bg }]}>
              <Ionicons name={b.icon} size={18} color={b.color} />
            </View>
            <Text style={styles.benefitText}>{b.text}</Text>
          </Animated.View>
        ))}
      </View>

      <Animated.View
        style={[
          styles.quoteBox,
          {
            opacity: quoteAnim,
            transform: [{ translateY: quoteAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          },
        ]}
      >
        <View style={styles.quoteBar} />
        <View style={styles.quoteContent}>
          <Text style={styles.quoteText}>
            "Indeed, prayer has been decreed upon the believers a decree of specified times."
          </Text>
          <Text style={styles.quoteRef}>— Qur'an 4:103</Text>
        </View>
      </Animated.View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 28,
    color: Colors.primary,
    lineHeight: 36,
    marginBottom: 16,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.4,
  },
  imageWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 160,
    height: 120,
  },
  benefits: {
    gap: 10,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.semibold,
    flex: 1,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quoteBar: {
    width: 4,
    backgroundColor: Colors.gold,
  },
  quoteContent: {
    flex: 1,
    padding: 14,
  },
  quoteText: {
    fontSize: 13,
    color: Colors.textLight,
    lineHeight: 20,
    fontStyle: 'italic',
    fontFamily: Fonts.regular,
    marginBottom: 6,
  },
  quoteRef: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Fonts.semibold,
  },
});
