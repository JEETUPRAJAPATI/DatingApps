import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
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
          <NeonText 
            text={name}
            color={theme.neonPink}
            size={16}
            style={styles.username}
          />
        </View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handlePress}
        >
          <X size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <Animated.Image
        source={{ uri: image }}
        style={[styles.storyImage, imageStyle]}
        resizeMode="cover"
      />

      <View style={styles.footer}>
        <Card style={styles.messageInput}>
          <Text style={styles.messagePlaceholder}>Your message</Text>
        </Card>
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
    backgroundColor: theme.background,
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
    backgroundColor: theme.surfaceLight,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: theme.neonPink,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
    borderWidth: 2,
    borderColor: theme.neonPink,
  },
  username: {
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 10,
    backgroundColor: theme.surfaceLight,
    borderWidth: 1,
    borderColor: theme.border,
  },
  messagePlaceholder: {
    color: theme.textSecondary,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.neonPink,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  sendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});