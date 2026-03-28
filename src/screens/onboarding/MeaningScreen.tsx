import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';

export const MeaningScreen: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.timing(titleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(card1Anim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(card2Anim, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  const slideUp = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  return (
    <OnboardingLayout currentStep={2} totalSteps={5} onContinue={onContinue} onBack={onBack}>
      <Animated.View style={[styles.header, slideUp(titleAnim)]}>
        <Text style={styles.eyebrow}>THE NAME</Text>
        <Text style={styles.title}>Aqimo means "Establish the prayer."</Text>
      </Animated.View>

      <View style={styles.imageRow}>
        <Image
          source={require('../../../assets/illustrations/meaning.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <Animated.View style={[styles.card, slideUp(card1Anim)]}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardLabel}>Root verb</Text>
          <Text style={styles.cardNote}>from Classical Arabic</Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.arabicWord}>أَقَامَ</Text>
          <Text style={styles.transliteration}>aqāma — to establish</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.quoteCard, slideUp(card2Anim)]}>
        <View style={styles.quoteAccent} />
        <View style={styles.quoteBody}>
          <Text style={styles.arabicPhrase}>أَقِيمُوا الصَّلَاةَ</Text>
          <Text style={styles.quoteRoman}>aqīmū aṣ-ṣalāh</Text>
          <Text style={styles.quoteMeaning}>"Establish the prayer" — repeated throughout the Qur'an</Text>
        </View>
      </Animated.View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 26,
    color: Colors.primary,
    lineHeight: 34,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.4,
  },
  imageRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 110,
    height: 110,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardLeft: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.bold,
    marginBottom: 2,
  },
  cardNote: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  arabicWord: {
    fontSize: 30,
    color: Colors.primary,
    marginBottom: 2,
  },
  transliteration: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: Fonts.semibold,
  },
  quoteCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  quoteAccent: {
    width: 5,
    backgroundColor: Colors.gold,
  },
  quoteBody: {
    flex: 1,
    padding: 18,
  },
  arabicPhrase: {
    fontSize: 26,
    color: Colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  quoteRoman: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Fonts.semibold,
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteMeaning: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Fonts.regular,
    fontStyle: 'italic',
  },
});
