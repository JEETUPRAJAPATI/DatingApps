import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, ShoppingBag, Mic as Mic2, Cog as Yoga, UtensilsCrossed, Tent as Tennis, FileWarning as Running, Waves, Palette, Mountain, Wine, Gamepad, Music } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';

const INTERESTS = [
  { id: 'photography', icon: Camera, label: 'Photography' },
  { id: 'shopping', icon: ShoppingBag, label: 'Shopping' },
  { id: 'karaoke', icon: Mic2, label: 'Karaoke' },
  { id: 'yoga', icon: Yoga, label: 'Yoga' },
  { id: 'cooking', icon: UtensilsCrossed, label: 'Cooking' },
  { id: 'tennis', icon: Tennis, label: 'Tennis' },
  { id: 'running', icon: Running, label: 'Run' },
  { id: 'swimming', icon: Waves, label: 'Swimming' },
  { id: 'art', icon: Palette, label: 'Art' },
  { id: 'traveling', icon: Mountain, label: 'Traveling' },
  { id: 'drinks', icon: Wine, label: 'Drink' },
  { id: 'gaming', icon: Gamepad, label: 'Video games' },
  { id: 'music', icon: Music, label: 'Music' },
];

export default function InterestsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      router.push('/search-friends');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/search-friends')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <NeonText 
        text="Your interests"
        color={theme.neonPink}
        size={32}
        style={styles.title}
      />
      
      <Text style={styles.subtitle}>
        Select a few of your interests and let everyone know what you're passionate about.
      </Text>

      <ScrollView 
        style={styles.interestsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.interestsGrid}>
          {INTERESTS.map(interest => {
            const Icon = interest.icon;
            const isSelected = selectedInterests.includes(interest.id);
            
            return (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestButton,
                  isSelected && styles.interestButtonSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Icon
                  size={24}
                  color={isSelected ? theme.textPrimary : theme.neonPink}
                />
                <Text style={[
                  styles.interestText,
                  isSelected && styles.interestTextSelected,
                ]}>
                  {interest.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Card>
      </ScrollView>

      <GradientButton
        text="Continue"
        onPress={handleContinue}
        disabled={selectedInterests.length === 0}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 30,
    lineHeight: 24,
  },
  interestsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
  },
  interestButtonSelected: {
    backgroundColor: theme.neonPink,
    borderColor: theme.neonPink,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  interestText: {
    fontSize: 16,
    color: theme.textPrimary,
  },
  interestTextSelected: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 'auto',
  },
});