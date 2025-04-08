import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Search, Settings, Phone, Video, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';

const MESSAGES = [
  {
    id: '1',
    name: 'Sophia Anderson',
    message: 'Would love to meet for coffee! ☕️',
    time: '2m',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
    online: true,
    premium: true,
    lastActive: 'now'
  },
  {
    id: '2',
    name: 'Emma Thompson',
    message: 'Thanks for the lovely evening! 🌟',
    time: '15m',
    unread: 1,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2574&auto=format&fit=crop',
    online: true,
    premium: false,
    lastActive: '2m ago'
  },
  {
    id: '3',
    name: 'Olivia Martinez',
    message: 'Looking forward to our video call tonight!',
    time: '1h',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2574&auto=format&fit=crop',
    online: false,
    premium: true,
    lastActive: '30m ago'
  },
  {
    id: '4',
    name: 'Isabella Wilson',
    message: 'That sounds perfect! See you there 😊',
    time: '2h',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop',
    online: false,
    premium: false,
    lastActive: '1h ago'
  }
];

const FILTERS = ['All Messages', 'Unread', 'Online', 'Premium'] as const;
type Filter = typeof FILTERS[number];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All Messages');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = () => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2574&auto=format&fit=crop';

  const filteredMessages = MESSAGES.filter(message => {
    if (searchQuery) {
      return message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             message.message.toLowerCase().includes(searchQuery.toLowerCase());
    }
    switch (selectedFilter) {
      case 'Unread':
        return message.unread > 0;
      case 'Online':
        return message.online;
      case 'Premium':
        return message.premium;
      default:
        return true;
    }
  });

  const handleVideoCall = (message: typeof MESSAGES[0]) => {
    router.push({
      pathname: '/video-call',
      params: {
        name: message.name,
        image: message.image
      }
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <NeonText 
            text="Messages"
            color={theme.neonPink}
            size={32}
            style={styles.title}
          />
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <Card style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Card>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.messagesList}>
        {filteredMessages.map((message) => (
          <TouchableOpacity 
            key={message.id}
            style={styles.messageItem}
            onPress={() => router.push('/chat')}
          >
            <View style={styles.messageLeft}>
              <NeonGradient 
                style={styles.avatarContainer}
                colors={[
                  message.online ? theme.neonPink : theme.textSecondary,
                  message.online ? theme.neonPurple : theme.textMuted
                ]}
              >
                <Image 
                  source={{ 
                    uri: imageErrors[message.id] ? getFallbackImage() : message.image 
                  }}
                  style={styles.avatar}
                  onError={() => handleImageError(message.id)}
                />
                {message.online && <View style={styles.onlineIndicator} />}
              </NeonGradient>

              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <View style={styles.nameContainer}>
                    <NeonText 
                      text={message.name}
                      color={theme.neonPink}
                      size={16}
                      style={styles.name}
                    />
                    {message.premium && (
                      <Star size={14} color={theme.neonBlue} fill={theme.neonBlue} />
                    )}
                  </View>
                  <Text style={styles.time}>{message.time}</Text>
                </View>
                <Text 
                  style={[
                    styles.messageText,
                    message.unread > 0 && styles.messageTextUnread
                  ]} 
                  numberOfLines={1}
                >
                  {message.message}
                </Text>
                <Text style={styles.lastActive}>
                  {message.online ? 'Online' : `Last active ${message.lastActive}`}
                </Text>
              </View>
            </View>

            <View style={styles.messageActions}>
              {message.online && (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.videoButton]}
                    onPress={() => handleVideoCall(message)}
                  >
                    <Video size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.callButton]}
                  >
                    <Phone size={18} color={theme.textPrimary} />
                  </TouchableOpacity>
                </>
              )}
              {message.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{message.unread}</Text>
                </View>
              )}
            </View>
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
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 0,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: theme.surfaceLight,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: theme.textPrimary,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.surfaceLight,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: theme.neonPink,
  },
  filterText: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  messageLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.neonGreen,
    borderWidth: 2,
    borderColor: theme.background,
  },
  messageContent: {
    flex: 1,
    marginRight: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    marginBottom: 0,
  },
  time: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  messageText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  messageTextUnread: {
    color: theme.textPrimary,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoButton: {
    backgroundColor: theme.neonPurple,
  },
  callButton: {
    backgroundColor: theme.neonBlue,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.neonPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: theme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});