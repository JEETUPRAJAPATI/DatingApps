import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';

type Gender = 'man' | 'woman' | 'other';

export default function GenderScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/interests');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/interests')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <NeonText 
        text="I am a"
        color={theme.neonPink}
        size={32}
        style={styles.title}
      />

      <View style={styles.options}>
        <Card>
          <TouchableOpacity
            style={[
              styles.option,
              selectedGender === 'woman' && styles.optionSelected,
            ]}
            onPress={() => setSelectedGender('woman')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'woman' && styles.optionTextSelected,
            ]}>Woman</Text>
            {selectedGender === 'woman' && (
              <Check size={24} color={theme.textPrimary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedGender === 'man' && styles.optionSelected,
            ]}
            onPress={() => setSelectedGender('man')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'man' && styles.optionTextSelected,
            ]}>Man</Text>
            {selectedGender === 'man' && (
              <Check size={24} color={theme.textPrimary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedGender === 'other' && styles.optionSelected,
              styles.lastOption,
            ]}
            onPress={() => setSelectedGender('other')}
          >
            <Text style={[
              styles.optionText,
              selectedGender === 'other' && styles.optionTextSelected,
            ]}>Choose another</Text>
            {selectedGender === 'other' && (
              <Check size={24} color={theme.textPrimary} />
            )}
          </TouchableOpacity>
        </Card>
      </View>

      <GradientButton
        text="Continue"
        onPress={handleContinue}
        disabled={!selectedGender}
        style={styles.continueButton}
        gradientColors={[theme.neonPink, theme.neonPurple]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  skipText: {
    color: theme.neonPink,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    marginBottom: 40,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionSelected: {
    backgroundColor: theme.surfaceLight,
  },
  optionText: {
    fontSize: 18,
    color: theme.textPrimary,
  },
  optionTextSelected: {
    color: theme.neonPink,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 'auto',
  },
});