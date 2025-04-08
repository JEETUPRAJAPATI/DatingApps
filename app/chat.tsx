import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Keyboard, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, MoveVertical as MoreVertical, Mic, Send, Camera, Image as ImageIcon, Phone, Video, Paperclip, Flag, Ban } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import Card from '../components/Card';
import NeonGradient from '../components/NeonGradient';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MESSAGES = [
  {
    id: '1',
    text: 'Hi Jake, how are you? I saw on the app that we\'ve crossed paths several times this week 😄',
    time: '2:55 PM',
    sender: 'them'
  },
  {
    id: '2',
    text: 'Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕',
    time: '3:02 PM',
    sender: 'me'
  },
  {
    id: '3',
    text: 'Sure, let\'s do it! 😊',
    time: '3:10 PM',
    sender: 'them'
  },
  {
    id: '4',
    text: 'Great I will write later the exact time and place. See you soon!',
    time: '3:12 PM',
    sender: 'me'
  }
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState(MESSAGES);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const translateY = useSharedValue(1000);
  const inputHeight = useSharedValue(56);
  const attachmentsHeight = useSharedValue(0);
  const moreOptionsScale = useSharedValue(0);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    translateY.value = 1000;
    attachmentsHeight.value = 0;
    moreOptionsScale.value = 0;
    
    requestAnimationFrame(() => {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 90
      });
    });
  }, []);

  const slideUpAnimation = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const attachmentsAnimation = useAnimatedStyle(() => ({
    height: attachmentsHeight.value,
    opacity: interpolate(
      attachmentsHeight.value,
      [0, 150],
      [0, 1],
      Extrapolate.CLAMP
    )
  }));

  const moreOptionsAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: moreOptionsScale.value }],
    opacity: moreOptionsScale.value
  }));

  const toggleAttachments = () => {
    const newHeight = showAttachments ? 0 : 150;
    attachmentsHeight.value = withSpring(newHeight, {
      damping: 15,
      stiffness: 90
    });
    setShowAttachments(!showAttachments);
  };

  const toggleMoreOptions = () => {
    moreOptionsScale.value = withSpring(showMoreOptions ? 0 : 1, {
      damping: 15,
      stiffness: 90
    });
    setShowMoreOptions(!showMoreOptions);
  };

  const handleReport = () => {
    Alert.alert(
      "Report User",
      "Are you sure you want to report this user? They will be blocked for 7 days.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Report & Block",
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              "User Reported",
              "This user has been reported and blocked for 7 days.",
              [{ text: "OK", onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    setIsSending(true);
    const newMessage = {
      id: String(Date.now()),
      text: message,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      sender: 'me'
    };

    setTimeout(() => {
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsSending(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleCall = (type: 'audio' | 'video') => {
    router.push({
      pathname: '/video-call',
      params: {
        name: 'Grace',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop'
      }
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { paddingTop: insets.top },
        slideUpAnimation
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <NeonGradient style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop' }}
              style={styles.profileImage}
            />
          </NeonGradient>
          <View>
            <NeonText 
              text="Grace"
              color={theme.neonPink}
              size={16}
              style={styles.profileName}
            />
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleCall('audio')}
          >
            <Phone size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleCall('video')}
          >
            <Video size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMoreOptions}>
            <MoreVertical size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.moreOptionsMenu, moreOptionsAnimation]}>
          <TouchableOpacity style={styles.moreOption} onPress={handleReport}>
            <Flag size={20} color={theme.error} />
            <Text style={[styles.moreOptionText, { color: theme.error }]}>Report & Block</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateHeader}>Today</Text>
        
        {chatMessages.map((msg) => (
          <Animated.View 
            key={msg.id}
            entering={withSpring({
              duration: 300,
              damping: 15,
              stiffness: 90
            })}
            style={[
              styles.messageWrapper,
              msg.sender === 'me' ? styles.myMessage : styles.theirMessage
            ]}
          >
            <NeonGradient 
              style={[
                styles.messageBubble,
                msg.sender === 'me' ? styles.myBubble : styles.theirBubble
              ]}
              colors={msg.sender === 'me' ? 
                [theme.neonPink, theme.neonPurple] : 
                [theme.surfaceLight, theme.surface]
              }
            >
              <Text style={[
                styles.messageText,
                msg.sender === 'me' ? styles.myMessageText : styles.theirMessageText
              ]}>
                {msg.text}
              </Text>
            </NeonGradient>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View style={[styles.attachmentsContainer, attachmentsAnimation]}>
        <View style={styles.attachmentsGrid}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Camera size={24} color={theme.neonPink} />
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <ImageIcon size={24} color={theme.neonPink} />
            <Text style={styles.attachmentText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <Mic size={24} color={theme.neonPink} />
            <Text style={styles.attachmentText}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <Paperclip size={24} color={theme.neonPink} />
            <Text style={styles.attachmentText}>Document</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={toggleAttachments}
        >
          <Paperclip 
            size={24} 
            color={theme.textSecondary}
            style={{ transform: [{ rotate: showAttachments ? '45deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { height: inputHeight.value }]}
          placeholder="Your message"
          placeholderTextColor={theme.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          onContentSizeChange={(e) => {
            inputHeight.value = Math.min(100, Math.max(56, e.nativeEvent.contentSize.height));
          }}
        />

        {message.trim() === '' ? (
          <TouchableOpacity 
            style={styles.micButton}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Mic size={24} color={theme.neonPink} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.sendButton, isSending && styles.sendingButton]}
            onPress={sendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <Animated.View style={styles.sendingIndicator} />
            ) : (
              <Send size={24} color={theme.neonPink} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    padding: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  profileName: {
    marginBottom: 4,
  },
  onlineStatus: {
    fontSize: 12,
    color: theme.neonPink,
  },
  moreOptionsMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  moreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  moreOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  dateHeader: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginBottom: 20,
  },
  messageWrapper: {
    marginBottom: 20,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 4,
  },
  myBubble: {
    backgroundColor: theme.neonPink,
  },
  theirBubble: {
    backgroundColor: theme.surfaceLight,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  myMessageText: {
    color: theme.textPrimary,
  },
  theirMessageText: {
    color: theme.textPrimary,
  },
  messageTime: {
    fontSize: 12,
    color: theme.textSecondary,
    alignSelf: 'flex-end',
  },
  attachmentsContainer: {
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    overflow: 'hidden',
  },
  attachmentsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  attachmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.surfaceLight,
  },
  attachmentText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: theme.surfaceLight,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    color: theme.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingButton: {
    opacity: 0.7,
  },
  sendingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.neonPink,
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});