import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';

const ACTIVITIES = [
  {
    id: '1',
    name: 'You',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    hasStory: true
  },
  {
    id: '2',
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    hasStory: true
  },
  {
    id: '3',
    name: 'Sophia',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    hasStory: true
  },
  {
    id: '4',
    name: 'Olivia',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    hasStory: true
  }
];

const MESSAGES = [
  {
    id: '1',
    name: 'Emelie',
    message: 'Sticker 😍',
    time: '23 min',
    unread: 1,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    name: 'Abigail',
    message: 'Typing..',
    time: '27 min',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    name: 'Elizabeth',
    message: 'Ok, see you then.',
    time: '33 min',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '4',
    name: 'Penelope',
    message: 'You: Hey! What\'s up, long time..',
    time: '50 min',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleStoryPress = (activity: typeof ACTIVITIES[0]) => {
    router.push({
      pathname: '/story-viewer',
      params: {
        name: activity.name,
        image: activity.image
      }
    });
  };

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = () => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <NeonText 
          text="Messages"
          color={theme.neonPink}
          size={32}
          style={styles.title}
        />
        <TouchableOpacity>
          <Settings size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <Card style={styles.searchContainer}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Card>

      <Text style={styles.sectionTitle}>Stories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.activitiesContainer}
      >
        {ACTIVITIES.map((activity) => (
          <TouchableOpacity 
            key={activity.id} 
            style={styles.activityItem}
            onPress={() => handleStoryPress(activity)}
          >
            <NeonGradient 
              style={styles.activityImageContainer}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Image 
                source={{ 
                  uri: imageErrors[`story_${activity.id}`] 
                    ? getFallbackImage() 
                    : activity.image 
                }}
                style={styles.activityImage}
                onError={() => handleImageError(`story_${activity.id}`)}
              />
            </NeonGradient>
            <Text style={styles.activityName}>{activity.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Messages</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {MESSAGES.map((message) => (
          <TouchableOpacity 
            key={message.id} 
            style={styles.messageItem}
            onPress={() => router.push('/chat')}
          >
            <NeonGradient 
              style={styles.messageImageContainer}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Image 
                source={{ 
                  uri: imageErrors[`message_${message.id}`] 
                    ? getFallbackImage() 
                    : message.image 
                }}
                style={styles.messageImage}
                onError={() => handleImageError(`message_${message.id}`)}
              />
            </NeonGradient>
            
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <NeonText 
                  text={message.name}
                  color={theme.neonPink}
                  size={16}
                  style={styles.messageName}
                />
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={1}>
                {message.message}
              </Text>
            </View>
            
            {message.unread && (
              <NeonGradient 
                style={styles.unreadBadge}
                colors={[theme.neonPink, theme.neonPurple]}
              >
                <Text style={styles.unreadText}>{message.unread}</Text>
              </NeonGradient>
            )}
          </TouchableOpacity>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: theme.surfaceLight,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: theme.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.textPrimary,
  },
  activitiesContainer: {
    marginBottom: 24,
  },
  activityItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  activityImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
  },
  activityImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  activityName: {
    marginTop: 8,
    fontSize: 14,
    color: theme.textPrimary,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  messageImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    padding: 2,
  },
  messageImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    marginBottom: 0,
  },
  messageTime: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  messageText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: theme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});