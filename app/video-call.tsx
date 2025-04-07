import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Mic, MicOff, PhoneOff, RefreshCcw, Video, VideoOff, Brain, Heart, Flame, Star, Smile, ThumbsUp, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import NeonGradient from '../components/NeonGradient';
import Animated, { 
  FadeIn, 
  FadeOut, 
  withSpring, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const REACTIONS = [
  { icon: Heart, color: theme.neonPink, name: 'heart' },
  { icon: Star, color: theme.neonBlue, name: 'star' },
  { icon: Flame, color: theme.neonPurple, name: 'fire' },
  { icon: Smile, color: theme.neonGreen, name: 'smile' },
  { icon: ThumbsUp, color: theme.neonBlue, name: 'thumbsup' },
];

const QUESTIONS = [
  {
    question: "What's your ideal first date?",
    options: ["Coffee & Chat", "Adventure Activity", "Dinner & Movie", "Walk in the Park"]
  },
  {
    question: "Where do you see yourself in 5 years?",
    options: ["Traveling World", "Career Focused", "Starting Family", "Personal Growth"]
  },
  {
    question: "What's your love language?",
    options: ["Quality Time", "Physical Touch", "Acts of Service", "Words of Affirmation"]
  }
];

export default function VideoCallScreen() {
  const insets = useSafeAreaInsets();
  const { name, image } = useLocalSearchParams<{ name: string; image: string }>();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [reactions, setReactions] = useState<Array<{ id: number; type: string; position: number }>>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const reactionCount = useRef(0);
  const gameScale = useSharedValue(1);
  const scoreScale = useSharedValue(1);
  const [showReactionPanel, setShowReactionPanel] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isGameActive && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (currentQuestion < QUESTIONS.length - 1) {
              setCurrentQuestion(prev => prev + 1);
              return 30;
            } else {
              setIsGameActive(false);
              gameScale.value = withSequence(
                withTiming(1.2, { duration: 200 }),
                withTiming(0, { duration: 300 })
              );
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, currentQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    router.back();
  };

  const startGame = () => {
    setIsGameActive(true);
    setTimer(30);
    setCurrentQuestion(0);
    setScore(0);
    gameScale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );
  };

  const cancelGame = () => {
    setIsGameActive(false);
    gameScale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimer(30);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newScore = score + Math.floor(Math.random() * 20);
    setScore(newScore);
    scoreScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  const addReaction = (type: string) => {
    const id = reactionCount.current++;
    const position = Math.random() * (height * 0.5);
    setReactions(prev => [...prev, { id, type, position }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  const gameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: gameScale.value }],
  }));

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NeonGradient style={styles.videoContainer}>
        <Image source={{ uri: image }} style={styles.remoteVideo} />
      </NeonGradient>
      
      <Card style={styles.localVideoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop' }}
          style={styles.localVideo}
        />
      </Card>

      <View style={styles.callInfo}>
        <NeonText text={name} color={theme.neonPink} size={18} style={styles.name} />
        <Text style={styles.time}>{formatTime(callTime)}</Text>
        {isGameActive && (
          <Animated.View style={[styles.scoreContainer, scoreStyle]}>
            <NeonText text={`Match Score: ${score}`} color={theme.neonBlue} size={14} />
          </Animated.View>
        )}
      </View>

      {isGameActive ? (
        <Animated.View style={[styles.gameContainer, gameStyle]}>
          <TouchableOpacity 
            style={styles.cancelGameButton}
            onPress={cancelGame}
          >
            <X size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <NeonGradient style={styles.timerContainer}>
            <NeonText text={`${timer}s`} color={theme.neonBlue} size={18} />
          </NeonGradient>
          
          <Card style={styles.questionContainer}>
            <NeonText 
              text={QUESTIONS[currentQuestion].question}
              color={theme.neonPink}
              size={18}
              style={styles.questionText}
            />
            <View style={styles.optionsContainer}>
              {QUESTIONS[currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </Animated.View>
      ) : (
        <GradientButton
          text="Start Quiz Game"
          onPress={startGame}
          style={styles.startGameButton}
          gradientColors={[theme.neonPink, theme.neonPurple]}
        />
      )}

      <TouchableOpacity 
        style={styles.reactionsPanelButton}
        onPress={() => setShowReactionPanel(!showReactionPanel)}
      >
        <Heart size={24} color={theme.neonPink} />
      </TouchableOpacity>

      {showReactionPanel && (
        <Animated.View 
          style={styles.reactionsPanel}
          entering={FadeIn}
          exiting={FadeOut}
        >
          {REACTIONS.map((reaction, index) => (
            <TouchableOpacity
              key={reaction.name}
              style={styles.reactionButton}
              onPress={() => {
                addReaction(reaction.name);
                setShowReactionPanel(false);
              }}
            >
              <reaction.icon size={24} color={reaction.color} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {reactions.map(({ id, type, position }) => {
        const ReactionIcon = REACTIONS.find(r => r.name === type)?.icon;
        const reactionColor = REACTIONS.find(r => r.name === type)?.color;
        
        return (
          <Animated.View
            key={id}
            style={[
              styles.floatingReaction,
              { top: position }
            ]}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            {ReactionIcon && (
              <ReactionIcon size={32} color={reactionColor} />
            )}
          </Animated.View>
        );
      })}

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff size={24} color={theme.textPrimary} /> : <Mic size={24} color={theme.textPrimary} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <PhoneOff size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
          onPress={() => setCameraOff(!isCameraOff)}
        >
          {isCameraOff ? <VideoOff size={24} color={theme.textPrimary} /> : <Video size={24} color={theme.textPrimary} />}
        </TouchableOpacity>
      </View>

      <Card style={styles.connectionStatus}>
        <RefreshCcw size={16} color={theme.neonGreen} />
        <Text style={styles.connectionText}>Strong Connection</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: width * 0.3,
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  callInfo: {
    position: 'absolute',
    top: 120 + width * 0.3,
    right: 20,
    alignItems: 'flex-end',
  },
  name: {
    marginBottom: 4,
  },
  time: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  controlButtonActive: {
    backgroundColor: theme.neonPink,
    borderColor: theme.neonPink,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  endCallButton: {
    backgroundColor: theme.error,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: theme.error,
    shadowColor: theme.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  connectionStatus: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.surfaceLight,
  },
  connectionText: {
    color: theme.textPrimary,
    fontSize: 14,
  },
  startGameButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
  },
  gameContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
  },
  timerContainer: {
    position: 'absolute',
    top: -40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    backgroundColor: theme.surfaceLight,
  },
  questionText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    backgroundColor: theme.surface,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedOption: {
    backgroundColor: theme.neonPink,
    borderColor: theme.neonPink,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    color: theme.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  scoreContainer: {
    backgroundColor: theme.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  reactionsPanelButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  reactionsPanel: {
    position: 'absolute',
    right: 74,
    top: '50%',
    transform: [{ translateY: -110 }],
    backgroundColor: theme.surfaceLight,
    borderRadius: 22,
    padding: 10,
    flexDirection: 'column',
    gap: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  floatingReaction: {
    position: 'absolute',
    right: 80,
    transform: [{ translateY: -16 }],
  },
  cancelGameButton: {
    position: 'absolute',
    top: -40,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.error,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: theme.error,
    shadowColor: theme.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
});