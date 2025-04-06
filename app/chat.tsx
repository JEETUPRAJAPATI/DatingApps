import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Keyboard, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, MoveVertical as MoreVertical, Mic, Send, Camera, Image as ImageIcon, Phone, Video, Paperclip } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const scrollViewRef = useRef(null);
  const translateY = useSharedValue(1000);
  const inputHeight = useSharedValue(56);
  const attachmentsHeight = useSharedValue(0);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Initialize animation values
    translateY.value = 1000;
    attachmentsHeight.value = 0;
    
    // Start the animation after a frame
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

  const toggleAttachments = () => {
    const newHeight = showAttachments ? 0 : 150;
    attachmentsHeight.value = withSpring(newHeight, {
      damping: 15,
      stiffness: 90
    });
    setShowAttachments(!showAttachments);
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

    // Simulate network delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      setIsSending(false);
      // Scroll to bottom after new message
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement audio recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement stop recording and send audio logic here
  };

  const handleCall = (type: 'audio' | 'video') => {
    // Implement call logic here
    console.log(`Starting ${type} call`);
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
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>Grace</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleCall('audio')}
          >
            <Phone size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleCall('video')}
          >
            <Video size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreVertical size={24} color="#000" />
          </TouchableOpacity>
        </View>
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
            <View 
              style={[
                styles.messageBubble,
                msg.sender === 'me' ? styles.myBubble : styles.theirBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                msg.sender === 'me' ? styles.myMessageText : styles.theirMessageText
              ]}>
                {msg.text}
              </Text>
            </View>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View style={[styles.attachmentsContainer, attachmentsAnimation]}>
        <View style={styles.attachmentsGrid}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Camera size={24} color="#FF4B6A" />
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <ImageIcon size={24} color="#FF4B6A" />
            <Text style={styles.attachmentText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <Mic size={24} color="#FF4B6A" />
            <Text style={styles.attachmentText}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentButton}>
            <Paperclip size={24} color="#FF4B6A" />
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
            color="#666"
            style={{ transform: [{ rotate: showAttachments ? '45deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { height: inputHeight.value }]}
          placeholder="Your message"
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
            <Mic size={24} color="#FF4B6A" />
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
              <Send size={24} color="#FF4B6A" />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#FF4B6A',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  dateHeader: {
    textAlign: 'center',
    color: '#999',
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
    backgroundColor: '#f0f0f0',
  },
  theirBubble: {
    backgroundColor: '#fff5f7',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  myMessageText: {
    color: '#000',
  },
  theirMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  attachmentsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
    backgroundColor: '#fff5f7',
  },
  attachmentText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff5f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff5f7',
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
    borderColor: '#FF4B6A',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});