import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Colors } from '../theme';
import { Button } from '../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { saveJournalEntry } from '../storage/db';
import { formatLocalDateKey } from '../utils/date';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface JournalFormScreenProps {
  prayerId: string;
  prayerName: string;
  onClose: () => void;
}

export function JournalFormScreen({ prayerId, prayerName, onClose }: JournalFormScreenProps) {
  const { t } = useTranslation();
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!reflection.trim()) {
      Alert.alert(t('common.error'), 'Please write a few words about why you missed this prayer.');
      return;
    }

    setLoading(true);
    try {
      await saveJournalEntry({
        prayer_id: prayerId,
        date: formatLocalDateKey(new Date()),
        reflection: reflection.trim(),
        timestamp: Date.now(),
      });
      onClose();
    } catch (error) {
      Alert.alert(t('common.error'), 'Could not save your journal entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="journal" size={32} color={Colors.white} />
          </View>
          <Text style={styles.title}>{t('journal.reflectOn', { name: prayerName })}</Text>
          <Text style={styles.subtitle}>{t('journal.reflectPrompt')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('journal.placeholder')}
            placeholderTextColor={Colors.textLight}
            multiline
            value={reflection}
            onChangeText={setReflection}
            autoFocus
          />
        </Animated.View>

        <View style={styles.footer}>
          <Button 
            title={loading ? t('common.loading') : t('journal.saveReflection')} 
            onPress={handleSave} 
            disabled={loading}
          />
          <Button 
            title={t('common.cancel')} 
            onPress={onClose} 
            variant="outline"
            style={{ marginTop: 12 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  footer: {
    paddingVertical: 30,
  },
});
