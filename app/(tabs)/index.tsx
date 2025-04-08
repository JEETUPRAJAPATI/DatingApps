import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { Heart, X, Star, MapPin, Briefcase } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.6;

const PROFILES = [
  {
    id: '1',
    name: 'Jessica Parker',
    age: 23,
    distance: '1 km',
    occupation: 'Professional model',
    location: 'Chicago, IL',
    bio: "My name is Jessica Parker and I enjoy meeting new people and finding ways to help them have an uplifting experience. I enjoy reading..",
    interests: ['Travelling', 'Books', 'Music', 'Dancing', 'Modeling'],
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Emma Watson',
    age: 24,
    distance: '3 km',
    occupation: 'Software Engineer',
    location: 'New York, NY',
    bio: "Tech enthusiast by day, adventurer by night. Looking for someone to share coding jokes and hiking trails with.",
    interests: ['Coding', 'Hiking', 'Photography', 'Travel', 'Coffee'],
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519419691348-3b3433c4c20e?q=80&w=2574&auto=format&fit=crop'
    ]
  }
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedView, setExpandedView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const currentProfile = PROFILES[currentIndex];

  const handleLike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentImageIndex(0);
      setExpandedView(false);
    }
  };

  const handleDislike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentImageIndex(0);
      setExpandedView(false);
    }
  };

  const handleSuperLike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentImageIndex(0);
      setExpandedView(false);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            { transform: [{ scale: imageScale }] }
          ]}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(newIndex);
            }}
          >
            {currentProfile.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.profileImage}
              />
            ))}
          </ScrollView>

          <View style={styles.imagePagination}>
            {currentProfile.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>

          <Animated.View
            style={[
              styles.profileInfo,
              { opacity: headerOpacity }
            ]}
          >
            <NeonText
              text={`${currentProfile.name}, ${currentProfile.age}`}
              color={theme.neonPink}
              size={24}
              style={styles.name}
            />
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.textSecondary} />
              <Text style={styles.location}>{currentProfile.location}</Text>
            </View>

            <View style={styles.occupationContainer}>
              <Briefcase size={16} color={theme.textSecondary} />
              <Text style={styles.occupation}>{currentProfile.occupation}</Text>
            </View>
          </Animated.View>
        </Animated.View>

        <Card style={styles.bioCard}>
          <Text style={styles.bioTitle}>About</Text>
          <Text style={styles.bioText}>{currentProfile.bio}</Text>
        </Card>

        <Card style={styles.interestsCard}>
          <Text style={styles.interestsTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {currentProfile.interests.map((interest, index) => (
              <NeonGradient 
                key={index}
                style={styles.interestTag}
                colors={[theme.neonPink, theme.neonPurple]}
              >
                <Text style={styles.interestText}>{interest}</Text>
              </NeonGradient>
            ))}
          </View>
        </Card>

        <View style={styles.spacer} />
      </Animated.ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={handleDislike}
        >
          <X size={32} color={theme.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}
        >
          <Star size={32} color={theme.neonBlue} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
        >
          <Heart size={32} color={theme.neonPink} fill={theme.neonPink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  cardContainer: {
    height: CARD_HEIGHT,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.surface,
  },
  profileImage: {
    width: width - 40,
    height: '100%',
    resizeMode: 'cover',
  },
  imagePagination: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.textSecondary,
    opacity: 0.5,
  },
  paginationDotActive: {
    backgroundColor: theme.neonPink,
    opacity: 1,
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
  },
  name: {
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.textSecondary,
  },
  occupationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occupation: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.textSecondary,
  },
  bioCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 24,
  },
  interestsCard: {
    marginHorizontal: 20,
    marginBottom: 100,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  spacer: {
    height: 100,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surfaceLight,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dislikeButton: {
    shadowColor: theme.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  likeButton: {
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  superLikeButton: {
    shadowColor: theme.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});