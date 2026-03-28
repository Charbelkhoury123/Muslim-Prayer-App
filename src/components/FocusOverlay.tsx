import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { QiblaCompass } from './QiblaCompass';
import { useAppStore } from '../store/useAppStore';

interface FocusOverlayProps {
  prayerName: string;
  msRemaining: number;
  onComplete: () => void;
  onMissed: () => void;
}

export const FocusOverlay: React.FC<FocusOverlayProps> = ({ 
  prayerName, 
  onComplete,
  onMissed
}) => {
  const { t } = useTranslation();
  const { coordinates } = useAppStore();

  return (
    <Modal transparent animationType="none" visible>
       <View style={styles.overlay}>
         <BlurView intensity={95} tint="dark" style={StyleSheet.absoluteFill} />
         
         <SafeAreaView style={styles.content}>
           <ScrollView 
             contentContainerStyle={styles.scrollContent}
             showsVerticalScrollIndicator={false}
           >
             <Animated.View 
               entering={FadeIn.duration(800)} 
               style={styles.inner}
             >
               <View style={styles.iconContainer}>
                 <Ionicons name="notifications-outline" size={40} color={Colors.accent} />
               </View>
               
               <Text style={styles.title}>{t('prayer.timeToPray')}</Text>
               <Text style={styles.subtitle}>
                 It is now time for {prayerName}. Establish your connection.
               </Text>
               
               {coordinates && (
                 <View style={styles.compassContainer}>
                    <QiblaCompass latitude={coordinates.latitude} longitude={coordinates.longitude} />
                 </View>
               )}

               <View style={styles.divider} />
               
               <Text style={styles.quote}>
                 "Establish prayer for my remembrance."
               </Text>
               <Text style={styles.quoteSource}>— Surah Taha 20:14</Text>

               <View style={styles.footer}>
                 <Animated.View entering={SlideInDown.delay(300)} style={styles.buttonWrapper}>
                   <Pressable 
                     style={styles.button} 
                     onPress={onComplete}
                   >
                     <Text style={styles.buttonText}>{t('prayer.iPrayed')}</Text>
                   </Pressable>

                   <Pressable 
                     style={styles.secondaryButton} 
                     onPress={onMissed}
                   >
                     <Text style={styles.secondaryButtonText}>{t('prayer.iMissed')}</Text>
                   </Pressable>
                 </Animated.View>
                 
                 <Text style={styles.muted}>
                   {t('prayer.blockingApps')} is currently active.
                   {'\n'}Unlocks only after confirmation.
                 </Text>
               </View>
             </Animated.View>
           </ScrollView>
         </SafeAreaView>
       </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F5F2E6',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(245,242,230,0.5)',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  compassContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  divider: {
    width: 30,
    height: 2,
    backgroundColor: Colors.accent,
    marginBottom: 40,
    opacity: 0.5,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#F5F2E6',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.8,
  },
  quoteSource: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  footer: {
    width: '100%',
    marginTop: 60,
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  secondaryButton: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(245,242,230,0.2)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(245,242,230,0.6)',
  },
  muted: {
    fontSize: 12,
    color: 'rgba(245,242,230,0.3)',
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 18,
  },
});
