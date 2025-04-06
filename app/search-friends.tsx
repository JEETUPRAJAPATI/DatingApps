import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import NeonGradient from '../components/NeonGradient';

export default function SearchFriendsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <NeonGradient style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1620428268482-cf1851a36764?q=80&w=2609&auto=format&fit=crop' }}
            style={styles.illustration}
          />
        </NeonGradient>
        
        <NeonText 
          text="Search friend's"
          color={theme.neonPink}
          size={32}
          style={styles.title}
        />

        <Text style={styles.subtitle}>
          You can find friends from your contact lists to connected
        </Text>

        <GradientButton
          text="Access to a contact list"
          onPress={() => router.push('/notifications')}
          style={styles.button}
          gradientColors={[theme.neonPink, theme.neonPurple]}
        />
      </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 40,
    padding: 2,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    marginTop: 'auto',
  },
});