import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Search, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ACTIVITIES = [
  {
    id: '1',
    name: 'You',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop',
    hasStory: true
  },
  {
    id: '2',
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
    hasStory: true
  },
  {
    id: '3',
    name: 'Ava',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop',
    hasStory: false
  },
  {
    id: '4',
    name: 'Sophia',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
    hasStory: true
  },
  {
    id: '5',
    name: 'Annabelle',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2574&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Abigail',
    message: 'Typing..',
    time: '27 min',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Elizabeth',
    message: 'Ok, see you then.',
    time: '33 min',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Penelope',
    message: 'You: Hey! What\'s up, long time..',
    time: '50 min',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop'
  }
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const handleStoryPress = (activity: typeof ACTIVITIES[0]) => {
    router.push({
      pathname: '/story-viewer',
      params: {
        name: activity.name,
        image: activity.image
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <Settings size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Activities</Text>
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
            <View style={[
              styles.activityImageContainer,
              activity.hasStory && styles.activityImageContainerWithStory
            ]}>
              <Image source={{ uri: activity.image }} style={styles.activityImage} />
              {activity.name === 'You' && (
                <View style={styles.addStoryButton}>
                  <Text style={styles.addStoryPlus}>+</Text>
                </View>
              )}
            </View>
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
            <View style={styles.messageImageContainer}>
              <Image source={{ uri: message.image }} style={styles.messageImage} />
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageName}>{message.name}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={1}>
                {message.message}
              </Text>
            </View>
            {message.unread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{message.unread}</Text>
              </View>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
    backgroundColor: '#fff',
  },
  activityImageContainerWithStory: {
    borderWidth: 2,
    borderColor: '#FF4B6A',
  },
  activityImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4B6A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addStoryPlus: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -2,
  },
  activityName: {
    marginTop: 8,
    fontSize: 14,
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
    borderWidth: 2,
    borderColor: '#FF4B6A',
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
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 14,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#FF4B6A',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});