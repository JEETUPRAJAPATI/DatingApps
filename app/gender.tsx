import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/interests')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>I am a</Text>

      <View style={styles.options}>
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
            <Check size={24} color="#fff" />
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
            <Check size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedGender === 'other' && styles.optionSelected,
          ]}
          onPress={() => setSelectedGender('other')}
        >
          <Text style={[
            styles.optionText,
            selectedGender === 'other' && styles.optionTextSelected,
          ]}>Choose another</Text>
          {selectedGender === 'other' && (
            <Check size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedGender && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedGender}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  skipText: {
    color: '#FF4B6A',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionSelected: {
    backgroundColor: '#FF4B6A',
    borderColor: '#FF4B6A',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  optionTextSelected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#FF4B6A',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
  },
  continueButtonDisabled: {
    backgroundColor: '#ffb3c1',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});