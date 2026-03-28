import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Qibla, Coordinates } from 'adhan';
import { Colors } from '../theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  useDerivedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

interface QiblaCompassProps {
  latitude: number;
  longitude: number;
}

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
  mass: 0.5,
};

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ latitude, longitude }) => {
  const [qiblaDir, setQiblaDir] = useState(0);
  const heading = useSharedValue(0);

  useEffect(() => {
    // Calculate Qibla direction from current coordinates
    const coords = new Coordinates(latitude, longitude);
    const direction = Qibla(coords);
    setQiblaDir(direction);

    _subscribe();
    return () => _unsubscribe();
  }, [latitude, longitude]);

  const _subscribe = () => {
    Magnetometer.setUpdateInterval(50); // 20Hz for smooth updates
    Magnetometer.addListener((data) => {
      let angle = 0;
      let { x, y } = data;
      if (Math.atan2(y, x) >= 0) {
        angle = Math.atan2(y, x) * (180 / Math.PI);
      } else {
        angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
      }
      heading.value = Math.round(angle);
    });
  };

  const _unsubscribe = () => {
    Magnetometer.removeAllListeners();
  };

  // Dial rotation animated style
  const dialStyle = useAnimatedStyle(() => {
    const rotation = -heading.value;
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  // Qibla needle rotation animated style
  const qiblaStyle = useAnimatedStyle(() => {
    const qiblaRotation = (qiblaDir - heading.value + 360) % 360;
    return {
      transform: [{ rotate: `${qiblaRotation}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.compassContainer}>
        {/* Compass Dial */}
        <Animated.View style={[styles.dialWrapper, dialStyle]}>
          <Image 
            source={require('../../assets/illustrations/compass_dial.png')} 
            style={styles.dial}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Qibla Indicator (Kaaba Icon or Needle) */}
        <Animated.View style={[styles.qiblaWrapper, qiblaStyle]}>
          <View style={styles.kaabaPointer}>
            <View style={styles.kaabaIcon}>
              <View style={styles.kaabaBox} />
            </View>
          </View>
        </Animated.View>

        {/* Static Center Point */}
        <View style={styles.centerPoint} />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.degrees}>QIBLA DIRECTION</Text>
        <Text style={styles.label}>Use your phone as a guide</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  compassContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialWrapper: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  dial: {
    width: 200,
    height: 200,
    opacity: 0.8,
  },
  qiblaWrapper: {
    width: 200,
    height: 200,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  kaabaPointer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  kaabaIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#D4AF37', // Gold trim
    borderRadius: 6,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  kaabaBox: {
    width: '100%',
    height: '25%',
    backgroundColor: '#D4AF37',
    position: 'absolute',
    top: '15%',
  },
  centerPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  info: {
    marginTop: 30,
    alignItems: 'center',
  },
  degrees: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
    opacity: 0.7,
  },
});
