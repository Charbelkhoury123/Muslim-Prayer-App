import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { Colors } from '../theme';
import { Brand } from '../config/brand';
import { Ionicons } from '@expo/vector-icons';

export function AboutScreen() {
  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Brand Identity */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="moon" size={40} color={Colors.white} />
          </View>
          <Text style={styles.brandName}>{Brand.name}</Text>
          <Text style={styles.brandTagline}>{Brand.tagline}</Text>
          <Text style={styles.brandArabic}>{Brand.arabicName}</Text>
        </View>

        {/* Mission */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            {Brand.name} exists to help Muslims stay consistent with their daily prayers by reducing digital
            distractions. We believe that when the phone goes silent, the soul speaks louder.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>
          <View style={styles.step}>
            <View style={styles.stepIcon}><Ionicons name="location" size={20} color={Colors.primary} /></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Location-based times</Text>
              <Text style={styles.stepDesc}>Calculates prayer times offline using your GPS coordinates.</Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepIcon}><Ionicons name="lock-closed" size={20} color={Colors.primary} /></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Automatic app blocking</Text>
              <Text style={styles.stepDesc}>Selected apps are blocked during prayer windows until you confirm.</Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepIcon}><Ionicons name="journal" size={20} color={Colors.primary} /></View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Reflection journal</Text>
              <Text style={styles.stepDesc}>Missed a prayer? Record a reflection to build awareness.</Text>
            </View>
          </View>
        </View>

        {/* Links */}
        <View style={styles.linksCard}>
          <Pressable style={styles.linkRow} onPress={() => openLink(`mailto:${Brand.supportEmail}`)}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <Text style={styles.linkText}>Contact Support</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </Pressable>

          <Pressable style={styles.linkRow} onPress={() => openLink(Brand.privacyUrl)}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </Pressable>

          <Pressable style={[styles.linkRow, styles.linkRowLast]} onPress={() => openLink(Brand.termsUrl)}>
            <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>v{Brand.version}</Text>
          <Text style={styles.copyright}>{Brand.copyright}</Text>
          <Text style={styles.developer}>{Brand.developer}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brandSection: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 6,
  },
  brandArabic: {
    fontSize: 28,
    color: Colors.primary,
    marginTop: 12,
    opacity: 0.3,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    opacity: 0.8,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  linksCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    gap: 14,
  },
  linkRowLast: {
    borderBottomWidth: 0,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
    opacity: 0.5,
  },
  copyright: {
    fontSize: 12,
    color: Colors.textLight,
    opacity: 0.4,
    marginTop: 4,
  },
  developer: {
    fontSize: 12,
    color: Colors.textLight,
    opacity: 0.3,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
