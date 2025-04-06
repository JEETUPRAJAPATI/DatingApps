import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ArrowLeft, Search, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const FETCH_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  const [retryCount, setRetryCount] = useState(0);

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

  const fetchCountries = async (retry = 0) => {
    try {
      setLoading(true);
      setError(null);
      setRetryCount(retry);

      const response = await fetchWithTimeout('https://restcountries.com/v3.1/all', FETCH_TIMEOUT);
      const data = await response.json();
      
      const formattedCountries = data
        .filter((country: any) => country.idd?.root)
        .map((country: any) => ({
          name: country.name.common,
          dial_code: country.idd.root + (country.idd.suffixes?.[0] || ''),
          code: country.cca2,
          flag: country.flag
        }))
        .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

      setCountries(formattedCountries);
      setError(null);
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      if (retry < MAX_RETRIES) {
        await delay(RETRY_DELAY);
        return fetchCountries(retry + 1);
      }
      
      setError('Failed to load countries. Please try again.');
      // Fallback to default countries if API fails
      setCountries(DEFAULT_COUNTRIES);
    } finally {
      setLoading(false);
    }
  };

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
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>My mobile</Text>
      <Text style={styles.description}>
        Please enter your valid phone number. We will send you a 4-digit code to verify your account.
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => {
            setIsCountryModalVisible(true);
            if (countries.length === DEFAULT_COUNTRIES.length) {
              fetchCountries();
            }
          }}
        >
          <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
          <ChevronDown size={20} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]}
        disabled={phoneNumber.length < 10}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

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
                <ArrowLeft size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Country</Text>
            </View>

            <Animated.View style={[styles.searchContainer, searchBarStyle]}>
              <Search size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search country name or code"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                clearButtonMode="while-editing"
              />
            </Animated.View>

            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF4B6A" />
                {retryCount > 0 && (
                  <Text style={styles.retryText}>
                    Retrying... ({retryCount}/{MAX_RETRIES})
                  </Text>
                )}
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => fetchCountries()}
                >
                  <RefreshCw size={20} color="#fff" />
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
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 4,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF4B6A',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ffb3c1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dismissArea: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    marginRight: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
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
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4B6A',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4B6A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCountryItem: {
    backgroundColor: '#fff5f7',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B6A',
    marginRight: 15,
  },
});