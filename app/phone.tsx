import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ArrowLeft, Search, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

const DEFAULT_COUNTRIES: Country[] = [
  { name: 'United States', dial_code: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dial_code: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', dial_code: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', dial_code: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', dial_code: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dial_code: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Italy', dial_code: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Spain', dial_code: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Japan', dial_code: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'China', dial_code: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'India', dial_code: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'Brazil', dial_code: '+55', code: 'BR', flag: '🇧🇷' },
];

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRIES[0]);
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);
  const searchBarHeight = useSharedValue(0);

  useEffect(() => {
    if (isCountryModalVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
      searchBarHeight.value = withTiming(56, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withSpring(height);
      searchBarHeight.value = withTiming(0, { duration: 300 });
    }
  }, [isCountryModalVisible]);

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dial_code.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryModalVisible(false);
  };

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      router.push({
        pathname: '/verify',
        params: {
          phone: `${selectedCountry.dial_code}${phoneNumber}`,
        },
      });
    }
  };

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: interpolate(
      opacity.value,
      [0, 0.1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const searchBarStyle = useAnimatedStyle(() => ({
    height: searchBarHeight.value,
    opacity: interpolate(
      searchBarHeight.value,
      [0, 56],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <NeonText 
        text="My mobile"
        color={theme.neonPink}
        size={32}
        style={styles.title}
      />

      <Text style={styles.description}>
        Please enter your valid phone number. We will send you a 4-digit code to verify your account.
      </Text>

      <Card style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setIsCountryModalVisible(true)}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
          <ChevronDown size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </Card>

      <GradientButton
        text="Continue"
        onPress={handleContinue}
        disabled={phoneNumber.length < 10}
        style={styles.button}
        gradientColors={[theme.neonPink, theme.neonPurple]}
      />

      <Modal
        visible={isCountryModalVisible}
        transparent
        animationType="none"
      >
        <Animated.View style={[styles.modalOverlay, overlayStyle]}>
          <TouchableOpacity 
            style={styles.dismissArea}
            onPress={() => setIsCountryModalVisible(false)}
          />
          <Animated.View style={[styles.modalContainer, modalStyle]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsCountryModalVisible(false)}
                style={styles.closeButton}
              >
                <ArrowLeft size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              <NeonText 
                text="Select Country"
                color={theme.neonBlue}
                size={20}
                style={styles.modalTitle}
              />
            </View>

            <Animated.View style={[styles.searchContainer, searchBarStyle]}>
              <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country name or code"
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                clearButtonMode="while-editing"
              />
            </Animated.View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.neonPink} />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => setCountries(DEFAULT_COUNTRIES)}
                >
                  <RefreshCw size={20} color={theme.textPrimary} />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      selectedCountry.code === item.code && styles.selectedCountryItem
                    ]}
                    onPress={() => handleCountrySelect(item)}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <View style={styles.countryInfo}>
                      <Text style={styles.countryName}>{item.name}</Text>
                      <Text style={styles.countryDialCode}>{item.dial_code}</Text>
                    </View>
                    {selectedCountry.code === item.code && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    padding: 0,
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.surfaceLight,
    borderRightWidth: 1,
    borderRightColor: theme.border,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 4,
    color: theme.textPrimary,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: theme.textPrimary,
    backgroundColor: theme.surface,
  },
  button: {
    marginTop: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
  },
  dismissArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  closeButton: {
    marginRight: 15,
  },
  modalTitle: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    backgroundColor: theme.surfaceLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: theme.textPrimary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: theme.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.neonPink,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  retryButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectedCountryItem: {
    backgroundColor: theme.surfaceLight,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  countryDialCode: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.neonPink,
    marginRight: 15,
  },
});