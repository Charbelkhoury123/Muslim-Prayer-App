import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  CALCULATION_METHOD_KEYS,
  CALCULATION_METHOD_LABELS,
  MADHAB_LABELS,
  type MadhabKey,
} from '../storage/userPreferences';
import { Madhab } from 'adhan';
import { useUserPreferences } from '../hooks/useUserPreferences';

const MADHAB_OPTIONS: MadhabKey[] = [Madhab.Shafi, Madhab.Hanafi];

export function SettingsScreen() {
  const { calculationMethod, madhab, setCalculationMethod, setMadhab } =
    useUserPreferences();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Prayer settings</Text>
        <Text style={styles.sub}>
          Calculation method and madhab are stored on this device.
        </Text>

        <Text style={styles.sectionTitle}>Calculation method</Text>
        {CALCULATION_METHOD_KEYS.map((key) => (
          <Pressable
            key={key}
            style={[
              styles.option,
              calculationMethod === key && styles.optionSelected,
            ]}
            onPress={() => setCalculationMethod(key)}
          >
            <Text style={styles.optionText}>{CALCULATION_METHOD_LABELS[key]}</Text>
            {calculationMethod === key && (
              <Text style={styles.check}>✓</Text>
            )}
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Madhab (Asr)</Text>
        {MADHAB_OPTIONS.map((key) => (
          <Pressable
            key={key}
            style={[styles.option, madhab === key && styles.optionSelected]}
            onPress={() => setMadhab(key)}
          >
            <Text style={styles.optionText}>{MADHAB_LABELS[key]}</Text>
            {madhab === key && <Text style={styles.check}>✓</Text>}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e8eef5',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#8b9aad',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#a8b8cc',
    marginBottom: 10,
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a2332',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2d3d52',
  },
  optionSelected: {
    borderColor: '#4a7a9e',
    backgroundColor: '#152028',
  },
  optionText: {
    color: '#e8eef5',
    fontSize: 15,
    flex: 1,
    paddingRight: 12,
  },
  check: {
    color: '#7dd3c0',
    fontSize: 18,
    fontWeight: '700',
  },
});
