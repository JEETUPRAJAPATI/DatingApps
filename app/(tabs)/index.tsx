import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { ArrowLeft, SlidersHorizontal, MapPin, X, Heart, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.6;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollY = useSharedValue(0);

  const profiles = [
    {
      id: '1',
      name: 'Jessica Parker',
      age: 23,
      distance: '1 km',
      occupation: 'Professional model',
      location: 'Chicago, IL United States',
      bio: "My name is Jessica Parker and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading..",
      interests: ['Travelling', 'Books', 'Music', 'Dancing', 'Modeling'],
      gallery: [
        'https://images.unsplash.com/photo-1517805686688-47dd930554b2?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=2564&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop'
      ],
      image: 'https://images.unsplash.com/photo-1517805686688-47dd930554b2?q=80&w=2574&auto=format&fit=crop'
    }
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const profileContentStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [HEADER_HEIGHT, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const currentProfile = profiles[currentIndex];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => router.push('/filter-modal')}
        >
          <SlidersHorizontal size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <Animated.View style={[styles.headerImage, headerStyle]}>
          <Image 
            source={{ uri: currentProfile.image }}
            style={styles.backgroundImage}
          />
        </Animated.View>

        <AnimatedScrollView
          style={styles.scrollView}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: HEADER_HEIGHT }} />
          
          <Animated.View style={[styles.profileContent, profileContentStyle]}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
              <Text style={styles.occupation}>{currentProfile.occupation}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#666" />
                <Text style={styles.location}>{currentProfile.location}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{currentProfile.bio}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestsContainer}>
                {currentProfile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Gallery</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.gallery}>
                {currentProfile.gallery.map((photo, index) => (
                  <Image
                    key={index}
                    source={{ uri: photo }}
                    style={styles.galleryImage}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        </AnimatedScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]}>
            <X size={32} color="#FF4B6A" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
            <Heart size={32} color="#fff" fill="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]}>
            <Star size={32} color="#9B4BFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterButton: {
    padding: 8,
  },
  mainContainer: {
    flex: 1,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: HEADER_HEIGHT,
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  profileContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: height - HEADER_HEIGHT + 100,
  },
  profileInfo: {
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  occupation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: '#666',
  },
  seeAll: {
    fontSize: 14,
    color: '#FF4B6A',
    fontWeight: '600',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: (width - 56) / 3,
    height: (width - 56) / 3,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: '#fff',
  },
  likeButton: {
    backgroundColor: '#FF4B6A',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  superLikeButton: {
    backgroundColor: '#fff',
  },
});