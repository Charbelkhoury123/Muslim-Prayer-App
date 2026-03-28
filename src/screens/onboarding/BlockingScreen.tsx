import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
  {
    icon: 'lock-closed' as const,
    color: '#7B5EA7',
    bg: '#F0EEF8',
    title: 'Apps blocked at prayer time',
    desc: 'Distracting apps pause when your prayer window opens.',
  },
  {
    icon: 'checkmark-circle' as const,
    color: Colors.primary,
    bg: Colors.inactive,
    title: 'One tap to confirm',
    desc: 'Say "I prayed" and your apps unlock instantly.',
  },
  {
    icon: 'book-outline' as const,
    color: '#C9970A',
    bg: '#FEF9E7',
    title: 'Journal your experience',
    desc: 'Reflect on each prayer and build a spiritual record.',
  },
];

export const BlockingScreen: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const featureAnims = useRef(FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(imageAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.stagger(
        90,
        featureAnims.map(a => Animated.timing(a, { toValue: 1, duration: 300, useNativeDriver: true }))
      ),
    ]).start();
  }, []);

  return (
    <OnboardingLayout currentStep={4} totalSteps={5} onContinue={onContinue} onBack={onBack}>
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}
      >
        <Text style={styles.eyebrow}>HOW IT WORKS</Text>
        <Text style={styles.title}>Stay present{'\n'}during prayer.</Text>
      </Animated.View>

      <Animated.View style={[styles.imageWrap, { opacity: imageAnim }]}>
        <Image
          source={require('../../../assets/illustrations/blocking.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <Animated.View
            key={i}
            style={[
              styles.featureRow,
              {
                opacity: featureAnims[i],
                transform: [{ translateX: featureAnims[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
              },
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
              <Ionicons name={f.icon} size={18} color={f.color} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
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
    fontSize: 30,
    color: Colors.primary,
    lineHeight: 38,
    marginBottom: 20,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.5,
  },
  imageWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 180,
    height: 140,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },
});
