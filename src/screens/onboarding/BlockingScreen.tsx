import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import { AppBlockingService } from '../../services/AppBlockingService';

export const BlockingScreen: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  return (
    <OnboardingLayout 
      currentStep={4} 
      totalSteps={5} 
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.container}>
        <Text 
          style={styles.title}
        >
          Aqimo blocks your apps at prayer time.
        </Text>

        <View 
          style={styles.illustrationContainer}
        >
          <Image 
            source={require('../../../assets/illustrations/blocking.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.description}>
            Your apps will be blocked until you confirm "I Prayed."
          </Text>
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
    marginBottom: 40,
    textAlign: 'left',
    width: '100%',
  },
  illustrationContainer: {
    width: '100%',
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    // Add shadow to image for mock feeling
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  description: {
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: '80%',
    fontWeight: '500',
  },
});
