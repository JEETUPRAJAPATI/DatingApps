import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Mic, MicOff, PhoneOff, RefreshCcw, Video, VideoOff, Brain, Heart, Flame, Star, Smile, ThumbsUp, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  { icon: Heart, color: '#FF4B6A', name: 'heart' },
  { icon: Star, color: '#FFD700', name: 'star' },
  { icon: Flame, color: '#FF4500', name: 'fire' },
  { icon: Smile, color: '#4CAF50', name: 'smile' },
  { icon: ThumbsUp, color: '#2196F3', name: 'thumbsup' },
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
      <Image source={{ uri: image }} style={styles.remoteVideo} />
      
      <View style={styles.localVideoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop' }}
          style={styles.localVideo}
        />
      </View>

      <View style={styles.callInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{formatTime(callTime)}</Text>
        {isGameActive && (
          <Animated.View style={[styles.scoreContainer, scoreStyle]}>
            <Text style={styles.scoreText}>Match Score: {score}</Text>
          </Animated.View>
        )}
      </View>

      {isGameActive ? (
        <Animated.View style={[styles.gameContainer, gameStyle]}>
          <TouchableOpacity 
            style={styles.cancelGameButton}
            onPress={cancelGame}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timer}s</Text>
          </View>
          
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{QUESTIONS[currentQuestion].question}</Text>
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
                  <Animated.Text 
                    style={[
                      styles.optionText,
                      selectedAnswer === index && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </Animated.Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity 
          style={styles.startGameButton}
          onPress={startGame}
        >
          <Brain size={24} color="#fff" />
          <Text style={styles.startGameText}>Start Quiz Game</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.reactionsPanelButton}
        onPress={() => setShowReactionPanel(!showReactionPanel)}
      >
        <Heart size={24} color="#FF4B6A" />
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
          {isMuted ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <PhoneOff size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
          onPress={() => setCameraOff(!isCameraOff)}
        >
          {isCameraOff ? <VideoOff size={24} color="#fff" /> : <Video size={24} color="#fff" />}
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={styles.connectionStatus}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <RefreshCcw size={16} color="#fff" />
        <Text style={styles.connectionText}>Strong Connection</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: width * 0.3,
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
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
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  time: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#FF4B6A',
  },
  endCallButton: {
    backgroundColor: '#FF4B6A',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  connectionStatus: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  connectionText: {
    color: '#fff',
    fontSize: 14,
  },
  startGameButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  gameContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 20,
  },
  timerContainer: {
    position: 'absolute',
    top: -40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4B6A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  questionContainer: {
    alignItems: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
  },
  selectedOption: {
    backgroundColor: '#8B5CF6',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  scoreContainer: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
  },
  scoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reactionsPanelButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionsPanel: {
    position: 'absolute',
    right: 74,
    top: '50%',
    transform: [{ translateY: -110 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 22,
    padding: 10,
    flexDirection: 'column',
    gap: 10,
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#FF4B6A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});