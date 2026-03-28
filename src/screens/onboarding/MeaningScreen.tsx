import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';

export const MeaningScreen: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  return (
    <OnboardingLayout 
      currentStep={2} 
      totalSteps={4} 
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.container}>
        <Text 
          style={styles.title}
        >
          Aqimo means "Establish the prayer."
        </Text>

        <View 
          style={styles.illustrationContainer}
        >
          <Image 
            source={require('../../../assets/illustrations/meaning.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View 
          style={styles.infoContainer}
        >
          <Text style={styles.label}>Aqimo comes from the verb:</Text>
          <Text style={styles.arabic}>أَقَامَ</Text>
          <Text style={styles.translation}>(to establish)</Text>
          
          <Text style={[styles.label, { marginTop: 20 }]}>appearing throughout the Qur'an:</Text>
          <Text style={styles.arabicLarge}>أَقِيمُوا الصَّلَاةَ</Text>
          <Text style={styles.translationSmall}>(aqīmū aṣ-ṣalāh)</Text>
          <Text style={styles.meaningText}>"Establish the prayer."</Text>
        </View>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
  illustrationContainer: {
    width: '100%',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: 140,
    height: 140,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  arabic: {
    fontSize: 36,
    color: Colors.primary,
    fontWeight: '400',
    marginVertical: 5,
  },
  arabicLarge: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '400',
    marginVertical: 5,
  },
  translation: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  translationSmall: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  meaningText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
