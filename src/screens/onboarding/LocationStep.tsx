import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import { Colors } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import * as Location from 'expo-location';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export const LocationStep: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const { setLocation, coordinates } = useAppStore();
  const [loading, setLoading] = useState(false);

  const requestGPS = async () => {
    setLoading(true);
    try {
      // First check if permissions were already granted
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      // Only request if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission denied', 
          'Location is required for the compass and offline prayer times. Please enable it in your phone settings for Expo Go.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // Automatic proceed on success
      setTimeout(onContinue, 1000);
    } catch (error) {
       Alert.alert('Error', 'Could not get your location. Please check your GPS or skip for now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout 
      currentStep={3} 
      totalSteps={5} 
      onContinue={onContinue} // Button is now always clickable to avoid being stuck
      onBack={onBack}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text style={styles.title}>Where are you?</Text>
          <Text style={styles.subtitle}>
            To calculate prayer times accurately and offline, we need your location.
          </Text>
        </View>

        <View style={styles.illustration}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={48} color={Colors.white} />
          </View>
        </View>

        {coordinates ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
            <Text style={styles.successText}>Location received: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}</Text>
          </View>
        ) : (
          <View style={styles.actions}>
            <Button 
              title={loading ? "Getting location..." : "Use My Current Location"} 
              onPress={requestGPS} 
              disabled={loading}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.disclaimer}>
               We never share your location data. Calculation is done entirely on your device.
               {'\n\n'}You can skip this and add it later in Settings.
            </Text>
          </View>
        )}
      </ScrollView>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
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
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    marginBottom: 30,
  },
  illustration: {
    marginVertical: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 90, 39, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  successText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
