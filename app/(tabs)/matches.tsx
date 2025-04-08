import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Video, Heart, Star, MapPin, Gamepad, MessageCircle } from 'lucide-react-native';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const MATCHES = [
  {
    id: '1',
    name: 'Sophia Anderson',
    age: 24,
    distance: '2 km away',
    compatibility: 95,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
    online: true,
    lastActive: 'now',
    bio: 'Adventure seeker and coffee enthusiast. Let\'s explore the city together!',
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
    gameScore: 92
  },
  {
    id: '2',
    name: 'Emma Thompson',
    age: 26,
    distance: '5 km away',
    compatibility: 88,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
    online: true,
    lastActive: '2m ago',
    bio: 'Art director by day, musician by night. Looking for someone to share creative vibes with.',
    interests: ['Art', 'Music', 'Design', 'Concerts'],
    gameScore: 85
  },
  {
    id: '3',
    name: 'Olivia Martinez',
    age: 23,
    distance: '3 km away',
    compatibility: 91,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
    online: false,
    lastActive: '15m ago',
    bio: 'Foodie and yoga enthusiast. Always up for trying new restaurants!',
    interests: ['Food', 'Yoga', 'Cooking', 'Wellness'],
    gameScore: 78
  }
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'all' | 'online'>('all');

  const filteredMatches = selectedTab === 'online' 
    ? MATCHES.filter(match => match.online)
    : MATCHES;

  const handleVideoCall = (match: typeof MATCHES[0]) => {
    router.push({
      pathname: '/video-call',
      params: {
        name: match.name,
        image: match.image
      }
    });
  };

  const handleStartGame = (match: typeof MATCHES[0]) => {
    router.push({
      pathname: '/video-call',
      params: {
        name: match.name,
        image: match.image,
        startGame: true
      }
    });
  };

  const handleMessage = (match: typeof MATCHES[0]) => {
    router.push('/chat');
  };

  const renderMatchCard = (match: typeof MATCHES[0]) => (
    <Animated.View
      key={match.id}
      entering={FadeIn.delay(200)}
      exiting={FadeOut}
      style={styles.card}
    >
      <NeonGradient style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Image 
            source={{ uri: match.image }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <NeonText 
                text={match.name}
                color={theme.neonPink}
                size={18}
                style={styles.name}
              />
              <View style={styles.ageContainer}>
                <Text style={styles.age}>{match.age}</Text>
              </View>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color={theme.textSecondary} />
              <Text style={styles.distance}>{match.distance}</Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={[styles.onlineIndicator, match.online && styles.onlineIndicatorActive]} />
              <Text style={styles.lastActive}>
                {match.online ? 'Online' : `Last active ${match.lastActive}`}
              </Text>
            </View>
          </View>

          <View style={styles.compatibilityScore}>
            <Heart size={16} color={theme.neonPink} fill={theme.neonPink} />
            <Text style={styles.compatibilityText}>{match.compatibility}%</Text>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bio} numberOfLines={2}>{match.bio}</Text>
        </View>

        <View style={styles.interestsContainer}>
          {match.interests.map((interest, index) => (
            <NeonGradient 
              key={index}
              style={styles.interestTag}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Text style={styles.interestText}>{interest}</Text>
            </NeonGradient>
          ))}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleMessage(match)}
          >
            <MessageCircle size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.videoButton]}
            onPress={() => handleVideoCall(match)}
          >
            <Video size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.gameButton]}
            onPress={() => handleStartGame(match)}
          >
            <View style={styles.gameScoreContainer}>
              <Gamepad size={20} color={theme.textPrimary} />
              <Text style={styles.gameScore}>{match.gameScore}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </NeonGradient>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <NeonText 
          text="Matches"
          color={theme.neonPink}
          size={32}
          style={styles.title}
        />
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
              All Matches
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'online' && styles.tabActive]}
            onPress={() => setSelectedTab('online')}
          >
            <Text style={[styles.tabText, selectedTab === 'online' && styles.tabTextActive]}>
              Online Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {filteredMatches.map(renderMatchCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.surfaceLight,
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabActive: {
    backgroundColor: theme.neonPink,
  },
  tabText: {
    textAlign: 'center',
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardContainer: {
    padding: 16,
    backgroundColor: theme.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    marginRight: 8,
    marginBottom: 0,
  },
  ageContainer: {
    backgroundColor: theme.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  age: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distance: {
    marginLeft: 4,
    color: theme.textSecondary,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.textSecondary,
    marginRight: 6,
  },
  onlineIndicatorActive: {
    backgroundColor: theme.neonGreen,
  },
  lastActive: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  compatibilityScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.neonPink}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  compatibilityText: {
    color: theme.neonPink,
    fontSize: 14,
    fontWeight: '600',
  },
  bioContainer: {
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    color: theme.textPrimary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surfaceLight,
    borderWidth: 1,
    borderColor: theme.border,
  },
  messageButton: {
    backgroundColor: theme.neonPink,
    borderColor: theme.neonPink,
  },
  videoButton: {
    backgroundColor: theme.neonPurple,
    borderColor: theme.neonPurple,
  },
  gameButton: {
    backgroundColor: theme.neonBlue,
    borderColor: theme.neonBlue,
  },
  gameScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameScore: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});