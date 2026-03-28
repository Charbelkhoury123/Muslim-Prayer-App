import React, { useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Colors, Fonts } from '../../theme';
import { OnboardingLayout } from '../../components/Onboarding/OnboardingLayout';
import * as Location from 'expo-location';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

const BULLETS = [
  { icon: 'time-outline' as const, text: 'Accurate prayer times for your city' },
  { icon: 'wifi-outline' as const, text: 'Calculated fully offline, no internet needed' },
  { icon: 'shield-checkmark-outline' as const, text: 'Never shared — stays on your device' },
];

export const LocationStep: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const { setLocation, coordinates } = useAppStore();
  const [loading, setLoading] = useState(false);

  const r1 = useRef(new Animated.Value(0)).current;
  const r2 = useRef(new Animated.Value(0)).current;
  const r3 = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ring = (anim: Animated.Value, initialDelay: number) => {
      const doLoop = () => {
        anim.setValue(0);
        Animated.timing(anim, { toValue: 1, duration: 1800, useNativeDriver: true }).start(({ finished }) => {
          if (finished) doLoop();
        });
      };
      const t = setTimeout(doLoop, initialDelay);
      return () => clearTimeout(t);
    };

    const c1 = ring(r1, 0);
    const c2 = ring(r2, 600);
    const c3 = ring(r3, 1200);

    Animated.timing(contentAnim, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }).start();

    return () => { c1(); c2(); c3(); r1.stopAnimation(); r2.stopAnimation(); r3.stopAnimation(); };
  }, []);

  useEffect(() => {
    if (coordinates) {
      Animated.spring(successAnim, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
    }
  }, [coordinates]);

  const requestGPS = async () => {
    setLoading(true);
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Permission denied', 'Location is required for prayer times. Enable it in your device settings.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      setTimeout(onContinue, 1200);
    } catch {
      Alert.alert('Error', 'Could not get your location. You can skip and set it later in Settings.');
    } finally {
      setLoading(false);
    }
  };

  const ringStyle = (anim: Animated.Value) => ({
    position: 'absolute' as const,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.35, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 2.2] }) }],
  });

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={5}
      onContinue={onContinue}
      onBack={onBack}
      continueLabel={coordinates ? 'Continue' : 'Skip for now'}
    >
      <Animated.View style={{ opacity: contentAnim }}>
        <Text style={styles.eyebrow}>YOUR LOCATION</Text>
        <Text style={styles.title}>Where are you praying from?</Text>
        <Text style={styles.subtitle}>
          To calculate prayer times accurately, we need your approximate location.
        </Text>
      </Animated.View>

      {/* Visual */}
      <View style={styles.visualArea}>
        <View style={styles.ringWrap}>
          <Animated.View style={ringStyle(r1)} />
          <Animated.View style={ringStyle(r2)} />
          <Animated.View style={ringStyle(r3)} />
          <View style={[styles.centerCircle, coordinates && styles.centerCircleSuccess]}>
            <Ionicons
              name={coordinates ? 'checkmark' : 'location'}
              size={34}
              color={Colors.white}
            />
          </View>
        </View>

        {coordinates && (
          <Animated.View style={[styles.coordBadge, { opacity: successAnim, transform: [{ scale: successAnim }] }]}>
            <Text style={styles.coordText}>
              {coordinates.latitude.toFixed(3)}, {coordinates.longitude.toFixed(3)}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bullets */}
      <View style={styles.bullets}>
        {BULLETS.map((b, i) => (
          <View key={i} style={styles.bullet}>
            <View style={styles.bulletIcon}>
              <Ionicons name={b.icon} size={16} color={Colors.primary} />
            </View>
            <Text style={styles.bulletText}>{b.text}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      {!coordinates && (
        <View style={styles.cta}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Colors.primary} />
              <Text style={styles.loadingText}>Getting your location…</Text>
            </View>
          ) : (
            <Button title="Use My Current Location" onPress={requestGPS} />
          )}
        </View>
      )}
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
    fontSize: 26,
    color: Colors.primary,
    lineHeight: 34,
    marginBottom: 10,
    fontFamily: Fonts.extrabold,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
    fontFamily: Fonts.regular,
    marginBottom: 4,
  },
  visualArea: {
    alignItems: 'center',
    marginVertical: 32,
  },
  ringWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  centerCircleSuccess: {
    backgroundColor: Colors.accentDark,
  },
  coordBadge: {
    marginTop: 18,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coordText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: Fonts.semibold,
  },
  bullets: {
    gap: 14,
    marginBottom: 24,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    fontFamily: Fonts.semibold,
  },
  cta: {
    marginTop: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.textMuted,
    fontFamily: Fonts.semibold,
  },
});
