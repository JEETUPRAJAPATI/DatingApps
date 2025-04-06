import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Video } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const MATCHES = [
  {
    id: '1',
    name: 'Leilani',
    age: 19,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
    isNew: true
  },
  {
    id: '2',
    name: 'Annabelle',
    age: 20,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2574&auto=format&fit=crop',
    isNew: true
  },
  {
    id: '3',
    name: 'Reagan',
    age: 24,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
    isNew: true
  },
  {
    id: '4',
    name: 'Hadley',
    age: 25,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
    isNew: true
  },
  {
    id: '5',
    name: 'Sophie',
    age: 23,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop',
    isNew: false
  },
  {
    id: '6',
    name: 'Isabella',
    age: 22,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2574&auto=format&fit=crop',
    isNew: false
  }
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState(MATCHES);

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Matches</Text>
      <Text style={styles.subtitle}>
        This is a list of people who have liked you and your matches.
      </Text>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.grid}>
          {matches.filter(match => match.isNew).map((match) => (
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
              <Image source={{ uri: match.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardName}>{match.name}, {match.age}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDislike(match.id)}
                  >
                    <Text style={styles.actionButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={() => handleLike(match.id)}
                  >
                    <Text style={styles.actionButtonText}>♥</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.videoButton]}
                    onPress={() => handleVideoCall(match)}
                  >
                    <Video size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Yesterday</Text>
        <View style={styles.grid}>
          {matches.filter(match => !match.isNew).map((match) => (
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
              <Image source={{ uri: match.image }} style={styles.cardImage} />
              <View style={styles.cardOverlay}>
                <Text style={styles.cardName}>{match.name}, {match.age}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDislike(match.id)}
                  >
                    <Text style={styles.actionButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={() => handleLike(match.id)}
                  >
                    <Text style={styles.actionButtonText}>♥</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.videoButton]}
                    onPress={() => handleVideoCall(match)}
                  >
                    <Video size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  content: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
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
    backgroundColor: '#f0f0f0',
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
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#FF4B6A',
  },
  videoButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    fontSize: 20,
    color: '#FF4B6A',
  },
});