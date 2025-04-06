import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const STORY_DURATION = 5000; // 5 seconds per story

export default function StoryViewer() {
  const insets = useSafeAreaInsets();
  const { name, image } = useLocalSearchParams<{ name: string; image: string }>();
  const [currentTime, setCurrentTime] = useState(0);
  
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: STORY_DURATION,
    }, (finished) => {
      if (finished) {
        runOnJS(router.back)();
      }
    });
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.9, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 }, () => {
        runOnJS(router.back)();
      });
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progress, progressStyle]} />
        </View>
        
        <View style={styles.userInfo}>
          <Image
            source={{ uri: image }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{name}</Text>
        </View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handlePress}
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.Image
        source={{ uri: image }}
        style={[styles.storyImage, imageStyle]}
        resizeMode="cover"
      />

      <View style={styles.footer}>
        <View style={styles.messageInput}>
          <Text style={styles.messagePlaceholder}>Your message</Text>
        </View>
        <TouchableOpacity style={styles.sendButton}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2000&auto=format&fit=crop' }}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 40,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
  },
  storyImage: {
    width,
    height,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
  },
  messagePlaceholder: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF4B6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});