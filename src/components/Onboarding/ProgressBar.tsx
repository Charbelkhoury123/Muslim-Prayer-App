import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../theme';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index < currentStep && styles.stepCompleted,
            index === currentStep && styles.stepActive,
            index === 0 && styles.firstStep,
            index === totalSteps - 1 && styles.lastStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    width: 120, // Adjusted width to match image
    backgroundColor: Colors.inactive,
    borderRadius: 2,
    overflow: 'hidden',
  },
  step: {
    flex: 1,
    height: '100%',
  },
  stepCompleted: {
    backgroundColor: Colors.primary,
  },
  stepActive: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  firstStep: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  lastStep: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
