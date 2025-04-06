import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import { LinearGradient } from 'expo-linear-gradient';
import NeonText from '../components/NeonText';
import NeonGradient from '../components/NeonGradient';
import GradientButton from '../components/GradientButton';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <NeonGradient style={styles.logoContainer}>
          <NeonText 
            text="Heart2get"
            color={theme.neonPink}
            size={36}
            style={styles.logoText}
          />
          <Text style={styles.tagline}>Find your perfect match</Text>
        </NeonGradient>
        
        <NeonText 
          text="Sign up to continue"
          color={theme.neonBlue}
          size={24}
          style={styles.title}
        />

        <GradientButton
          text="Continue with email"
          onPress={() => router.push('/phone')}
          style={styles.emailButton}
          gradientColors={[theme.neonPink, theme.neonPurple]}
        />

        <TouchableOpacity 
          style={styles.phoneButton}
          onPress={() => router.push('/phone')}
        >
          <Text style={styles.phoneButtonText}>Use phone number</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={{ uri: 'https://www.apple.com/favicon.ico' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={{ uri: 'https://www.facebook.com/favicon.ico' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsText}>Terms of use</Text>
          <Text style={styles.privacyText}>Privacy Policy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    borderRadius: 20,
  },
  logoText: {
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  title: {
    marginBottom: 40,
  },
  emailButton: {
    width: '100%',
    marginBottom: 16,
  },
  phoneButton: {
    backgroundColor: theme.surface,
    width: '100%',
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 30,
  },
  phoneButtonText: {
    color: theme.textPrimary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    marginHorizontal: 10,
    color: theme.textSecondary,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  termsText: {
    color: theme.textSecondary,
  },
  privacyText: {
    color: theme.textSecondary,
  },
});