import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Video, Heart, X } from 'lucide-react-native';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const MATCHES = [
  {
    id: '1',
    name: 'Leilani',
    age: 19,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isNew: true
  },
  {
    id: '2',
    name: 'Annabelle',
    age: 20,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isNew: true
  },
  {
    id: '3',
    name: 'Reagan',
    age: 24,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isNew: true
  },
  {
    id: '4',
    name: 'Hadley',
    age: 25,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isNew: true
  },
  {
    id: '5',
    name: 'Sophie',
    age: 23,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isNew: false
  }
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState(MATCHES);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setMatches(prev => prev.map(match => 
      match.id === id ? { ...match, liked: true } : match
    ));
  };

  const handleDislike = (id: string) => {
    setMatches(prev => prev.map(match => 
      match.id === id ? { ...match, disliked: true } : match
    ));
  };

  const handleVideoCall = (match: typeof MATCHES[0]) => {
    router.push({
      pathname: '/video-call',
      params: {
        name: match.name,
        image: match.image
      }
    });
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = () => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

  const renderMatchCard = (match: typeof MATCHES[0]) => (
    <Animated.View 
      key={match.id}
      entering={FadeIn.delay(200)}
      exiting={FadeOut}
      style={[
        styles.card,
        match.liked && styles.cardLiked,
        match.disliked && styles.cardDisliked
      ]}
    >
      <NeonGradient style={styles.cardContainer}>
        <Image 
          source={{ 
            uri: imageErrors[match.id] ? getFallbackImage() : match.image 
          }}
          style={styles.cardImage}
          onError={() => handleImageError(match.id)}
        />
        <View style={styles.cardOverlay}>
          <NeonText 
            text={`${match.name}, ${match.age}`}
            color={theme.neonPink}
            size={16}
            style={styles.cardName}
          />
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.dislikeButton]}
              onPress={() => handleDislike(match.id)}
            >
              <X size={20} color={theme.error} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.likeButton]}
              onPress={() => handleLike(match.id)}
            >
              <Heart size={20} color={theme.textPrimary} fill={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.videoButton]}
              onPress={() => handleVideoCall(match)}
            >
              <Video size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </NeonGradient>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NeonText 
        text="Matches"
        color={theme.neonPink}
        size={32}
        style={styles.title}
      />
      <Text style={styles.subtitle}>
        This is a list of people who have liked you and your matches.
      </Text>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.grid}>
          {matches.filter(match => match.isNew).map(renderMatchCard)}
        </View>

        <Text style={styles.sectionTitle}>Yesterday</Text>
        <View style={styles.grid}>
          {matches.filter(match => !match.isNew).map(renderMatchCard)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 24,
  },
  content: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    padding: 2,
  },
  cardLiked: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  cardDisliked: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  cardName: {
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dislikeButton: {
    backgroundColor: theme.surface,
    shadowColor: theme.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    backgroundColor: theme.neonPink,
    borderColor: theme.neonPink,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  videoButton: {
    backgroundColor: theme.neonPurple,
    borderColor: theme.neonPurple,
    shadowColor: theme.neonPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});