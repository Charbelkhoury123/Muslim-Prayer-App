import React, { useState, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { MeaningScreen } from './MeaningScreen';
import { LocationStep } from './LocationStep';
import { BlockingScreen } from './BlockingScreen';
import { CommitmentScreen } from './CommitmentScreen';
import { useAppStore } from '../../store/useAppStore';

export const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { setOnboarded } = useAppStore();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const transitionTo = (newStep: number, direction: 'forward' | 'back') => {
    const outX = direction === 'forward' ? -36 : 36;
    const inX = direction === 'forward' ? 36 : -36;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: outX, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      slideAnim.setValue(inX);
      setStep(newStep);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 230, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 230, useNativeDriver: true }),
      ]).start();
    });
  };

  const next = () => {
    if (step < 5) transitionTo(step + 1, 'forward');
    else {
      setOnboarded(true);
      onComplete();
    }
  };

  const back = () => {
    if (step > 1) transitionTo(step - 1, 'back');
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <WelcomeScreen onContinue={next} />;
      case 2: return <MeaningScreen onContinue={next} onBack={back} />;
      case 3: return <LocationStep onContinue={next} onBack={back} />;
      case 4: return <BlockingScreen onContinue={next} onBack={back} />;
      case 5: return <CommitmentScreen onContinue={next} onBack={back} />;
      default: return <WelcomeScreen onContinue={next} />;
    }
  };

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        {renderStep()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
