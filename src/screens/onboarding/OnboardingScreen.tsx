import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { MeaningScreen } from './MeaningScreen';
import { LocationStep } from './LocationStep';
import { BlockingScreen } from './BlockingScreen';
import { CommitmentScreen } from './CommitmentScreen';
import { useAppStore } from '../../store/useAppStore';

export const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { setOnboarded } = useAppStore();

  const next = () => {
    if (step < 5) setStep(step + 1);
    else {
       setOnboarded(true);
       onComplete();
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  switch (step) {
    case 1:
      return <WelcomeScreen onContinue={next} />;
    case 2:
      return <MeaningScreen onContinue={next} onBack={back} />;
    case 3:
      return <LocationStep onContinue={next} onBack={back} />;
    case 4:
      return <BlockingScreen onContinue={next} onBack={back} />;
    case 5:
      return <CommitmentScreen onContinue={next} onBack={back} />;
    default:
      return <WelcomeScreen onContinue={next} />;
  }
};
