import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Heart, X, Star } from 'lucide-react-native';
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
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentProfile = PROFILES[currentIndex];

  const handleLike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setImageError(false);
    }
  };

  const handleDislike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setImageError(false);
    }
  };

  const handleSuperLike = () => {
    if (currentIndex < PROFILES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <NeonGradient style={styles.cardContainer}>
          <Image 
            source={{ 
              uri: imageError 
                ? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                : currentProfile.image 
            }}
            style={styles.profileImage}
            onError={handleImageError}
          />
          
          <View style={styles.profileInfo}>
            <NeonText
              text={`${currentProfile.name}, ${currentProfile.age}`}
              color={theme.neonPink}
              size={24}
              style={styles.name}
            />
            
            <Text style={styles.occupation}>{currentProfile.occupation}</Text>
            <Text style={styles.location}>{currentProfile.location}</Text>
          </View>
        </NeonGradient>

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
      </ScrollView>

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
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  occupation: {
    fontSize: 16,
    color: theme.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  bioCard: {
    marginHorizontal: 20,
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