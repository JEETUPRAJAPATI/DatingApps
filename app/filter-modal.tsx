import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  runOnJS,
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';

type Gender = 'Girls' | 'Boys' | 'Both';

export default function FilterModal() {
  const insets = useSafeAreaInsets();
  const [selectedGender, setSelectedGender] = useState<Gender>('Girls');
  const [distance, setDistance] = useState(40);
  const [ageRange, setAgeRange] = useState({ min: 20, max: 28 });
  
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Initialize animation values
    translateY.value = 1000;
    opacity.value = 0;

    // Start animations after a frame
    requestAnimationFrame(() => {
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
    });
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const hideModal = () => {
    opacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.ease,
    });
    translateY.value = withSpring(1000, {
      damping: 15,
      stiffness: 90,
    }, () => {
      runOnJS(router.back)();
    });
  };

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable style={styles.dismissArea} onPress={hideModal} />
      <Animated.View 
        style={[
          styles.modalContainer,
          { paddingBottom: insets.bottom },
          modalStyle
        ]}
      >
        <View style={styles.handle} />
        
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={hideModal}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Interested in</Text>
        <View style={styles.genderSelector}>
          {(['Girls', 'Boys', 'Both'] as Gender[]).map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderOption,
                selectedGender === gender && styles.genderOptionSelected
              ]}
              onPress={() => setSelectedGender(gender)}
            >
              <Text style={[
                styles.genderText,
                selectedGender === gender && styles.genderTextSelected
              ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationText}>Chicago, USA</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Distance</Text>
        <View style={styles.sliderContainer}>
          <Animated.View style={styles.sliderTrack}>
            <Animated.View 
              style={[
                styles.sliderFill,
                { width: `${(distance / 100) * 100}%` }
              ]}
            />
          </Animated.View>
          <Text style={styles.distanceText}>{distance}km</Text>
        </View>

        <Text style={styles.sectionTitle}>Age</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.ageSliderTrack}>
            <View style={[
              styles.ageSliderFill,
              {
                left: `${((ageRange.min - 18) / (50 - 18)) * 100}%`,
                right: `${100 - ((ageRange.max - 18) / (50 - 18)) * 100}%`
              }
            ]} />
          </View>
          <Text style={styles.ageText}>{ageRange.min}-{ageRange.max}</Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={hideModal}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
    padding: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  clearText: {
    color: '#FF4B6A',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  genderSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    padding: 4,
    marginBottom: 30,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26,
  },
  genderOptionSelected: {
    backgroundColor: '#FF4B6A',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  locationText: {
    fontSize: 16,
  },
  sliderContainer: {
    marginBottom: 30,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  sliderFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FF4B6A',
    borderRadius: 2,
  },
  distanceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  ageSliderTrack: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  ageSliderFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FF4B6A',
    borderRadius: 2,
  },
  ageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  continueButton: {
    backgroundColor: '#FF4B6A',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});