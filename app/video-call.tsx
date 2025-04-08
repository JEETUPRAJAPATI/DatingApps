import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Camera, Mic, MicOff, PhoneOff, Video, VideoOff, Brain, Heart, Flame, Star, Smile, ThumbsUp, X, Gamepad } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
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

const STAGES = [
  {
    id: 'icebreakers',
    name: 'Icebreakers',
    icon: Smile,
    color: theme.neonBlue,
    description: 'Fun, light questions to get to know each other',
    questions: [
      {
        question: "What's your idea of a perfect weekend?",
        options: ["Adventure outdoors", "Relaxing at home", "City exploration", "Social gatherings"]
      },
      {
        question: "Which superpower would you choose?",
        options: ["Invisibility", "Flying", "Time travel", "Mind reading"]
      },
      {
        question: "What's your go-to karaoke song?",
        options: ["Pop hits", "Rock classics", "Love ballads", "I don't sing"]
      }
    ]
  },
  {
    id: 'values',
    name: 'Values & Lifestyle',
    icon: Brain,
    color: theme.neonPurple,
    description: 'Understanding what matters to you',
    questions: [
      {
        question: "What's most important in life to you?",
        options: ["Family", "Career", "Personal growth", "Making a difference"]
      },
      {
        question: "How do you prefer to spend your free time?",
        options: ["Learning new skills", "Being with friends", "Solo activities", "Creative pursuits"]
      },
      {
        question: "What's your approach to health and wellness?",
        options: ["Very conscious", "Balanced lifestyle", "Working on it", "Live in the moment"]
      }
    ]
  },
  {
    id: 'memories',
    name: 'Feelings & Memories',
    icon: Heart,
    color: theme.neonPink,
    description: 'Sharing meaningful experiences',
    questions: [
      {
        question: "What's your happiest childhood memory?",
        options: ["Family vacations", "School achievements", "Special celebrations", "Everyday moments"]
      },
      {
        question: "What makes you feel most alive?",
        options: ["Nature adventures", "Creative expression", "Helping others", "Achieving goals"]
      },
      {
        question: "What's your biggest dream?",
        options: ["World travel", "Career success", "Finding true love", "Making an impact"]
      }
    ]
  },
  {
    id: 'attraction',
    name: 'Flirting & Attraction',
    icon: Flame,
    color: theme.neonGreen,
    description: 'Exploring chemistry and connection',
    questions: [
      {
        question: "What catches your attention first?",
        options: ["Smile", "Eyes", "Voice", "Energy"]
      },
      {
        question: "Your ideal first date would be?",
        options: ["Coffee chat", "Active adventure", "Romantic dinner", "Cultural event"]
      },
      {
        question: "What's your love language?",
        options: ["Physical touch", "Quality time", "Words of affirmation", "Acts of service"]
      }
    ]
  },
  {
    id: 'intimacy',
    name: 'Emotional Intimacy',
    icon: Star,
    color: theme.neonBlue,
    description: 'Building deeper connections',
    questions: [
      {
        question: "What makes you feel most vulnerable?",
        options: ["Opening up", "Being judged", "Uncertainty", "Past experiences"]
      },
      {
        question: "How do you handle conflicts?",
        options: ["Direct communication", "Need space first", "Seek compromise", "Avoid confrontation"]
      },
      {
        question: "What's your biggest fear in relationships?",
        options: ["Loss of independence", "Being hurt", "Not being enough", "Growing apart"]
      }
    ]
  }
];

export default function VideoCallScreen() {
  const insets = useSafeAreaInsets();
  const { name, image, startGame } = useLocalSearchParams<{ 
    name: string; 
    image: string;
    startGame?: string;
  }>();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [partnerAnswer, setPartnerAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [stageScores, setStageScores] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const gameScale = useSharedValue(1);
  const scoreScale = useSharedValue(1);

  useEffect(() => {
    if (startGame === 'true') {
      handleStartGame();
    }
  }, [startGame]);

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
            if (selectedAnswer === null) {
              handleAnswer(Math.floor(Math.random() * 4));
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, currentQuestion, selectedAnswer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    router.back();
  };

  const handleStartGame = () => {
    setIsGameActive(true);
    setTimer(30);
    setCurrentStage(0);
    setCurrentQuestion(0);
    setScore(0);
    setStageScores([]);
    setShowSummary(false);
    gameScale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    
    // Simulate partner's answer
    setTimeout(() => {
      const partnerIndex = Math.floor(Math.random() * 4);
      setPartnerAnswer(partnerIndex);
      
      // Calculate score based on matching answers
      const questionScore = index === partnerIndex ? 20 : 10;
      const newScore = score + questionScore;
      setScore(newScore);
      scoreScale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );

      // Move to next question or stage
      setTimeout(() => {
        if (currentQuestion < STAGES[currentStage].questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setPartnerAnswer(null);
          setTimer(30);
        } else {
          setStageScores(prev => [...prev, newScore]);
          if (currentStage < STAGES.length - 1) {
            setCurrentStage(prev => prev + 1);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setPartnerAnswer(null);
            setTimer(30);
          } else {
            setShowSummary(true);
          }
        }
      }, 2000);
    }, 1000);
  };

  const gameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: gameScale.value }],
  }));

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const renderGameContent = () => {
    if (showSummary) {
      return (
        <Animated.View 
          style={[styles.summaryContainer, gameStyle]}
          entering={FadeIn}
        >
          <NeonText 
            text="Game Summary"
            color={theme.neonPink}
            size={24}
            style={styles.summaryTitle}
          />
          
          {STAGES.map((stage, index) => {
            const StageIcon = stage.icon;
            return (
              <View key={stage.id} style={styles.stageSummary}>
                <View style={styles.stageHeader}>
                  <StageIcon size={24} color={stage.color} />
                  <Text style={styles.stageName}>{stage.name}</Text>
                  <NeonText 
                    text={`${stageScores[index] || 0}%`}
                    color={stage.color}
                    size={18}
                  />
                </View>
                <View 
                  style={[
                    styles.stageProgress,
                    { backgroundColor: `${stage.color}20` }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.stageProgressFill,
                      { 
                        backgroundColor: stage.color,
                        width: `${stageScores[index] || 0}%` 
                      }
                    ]}
                  />
                </View>
              </View>
            );
          })}

          <View style={styles.summaryActions}>
            <TouchableOpacity
              style={[styles.summaryButton, { backgroundColor: theme.neonPink }]}
              onPress={() => router.push('/chat')}
            >
              <Text style={styles.summaryButtonText}>Continue in Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.summaryButton, { backgroundColor: theme.neonBlue }]}
              onPress={handleStartGame}
            >
              <Text style={styles.summaryButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    const currentStageData = STAGES[currentStage];
    const currentQuestionData = currentStageData.questions[currentQuestion];
    const StageIcon = currentStageData.icon;

    return (
      <Animated.View style={[styles.gameContainer, gameStyle]}>
        <View style={styles.gameHeader}>
          <StageIcon size={24} color={currentStageData.color} />
          <NeonText 
            text={currentStageData.name}
            color={currentStageData.color}
            size={18}
            style={styles.stageName}
          />
          <View style={styles.progressIndicator}>
            <Text style={styles.progressText}>
              {currentQuestion + 1}/{currentStageData.questions.length}
            </Text>
          </View>
        </View>

        <NeonGradient style={styles.timerContainer}>
          <NeonText text={`${timer}s`} color={theme.neonBlue} size={18} />
        </NeonGradient>

        <Card style={styles.questionContainer}>
          <NeonText 
            text={currentQuestionData.question}
            color={theme.neonPink}
            size={18}
            style={styles.questionText}
          />
          
          <View style={styles.optionsContainer}>
            {currentQuestionData.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isPartnerSelected = partnerAnswer === index;
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    isPartnerSelected && styles.partnerSelectedOption,
                    (isSelected && isPartnerSelected) && styles.matchedOption
                  ]}
                  onPress={() => !selectedAnswer && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={[
                    styles.optionText,
                    (isSelected || isPartnerSelected) && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                  
                  {isSelected && (
                    <View style={styles.playerIndicator}>
                      <Text style={styles.playerIndicatorText}>You</Text>
                    </View>
                  )}
                  
                  {isPartnerSelected && (
                    <View style={[
                      styles.playerIndicator,
                      styles.partnerIndicator
                    ]}>
                      <Text style={styles.playerIndicatorText}>{name}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Animated.View style={[styles.scoreContainer, scoreStyle]}>
          <NeonText 
            text={`Match Score: ${score}%`}
            color={theme.neonBlue}
            size={16}
          />
        </Animated.View>
      </Animated.View>
    );
  };

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
      </View>

      {isGameActive ? (
        renderGameContent()
      ) : (
        <TouchableOpacity
          style={styles.startGameButton}
          onPress={handleStartGame}
        >
          <NeonGradient style={styles.startGameContent}>
            <Gamepad size={24} color={theme.textPrimary} />
            <Text style={styles.startGameText}>Start Dating Game</Text>
          </NeonGradient>
        </TouchableOpacity>
      )}

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
  startGameButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -25 }],
    width: 200,
    height: 50,
  },
  startGameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: '100%',
    borderRadius: 25,
  },
  startGameText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  gameContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  stageName: {
    flex: 1,
    marginBottom: 0,
  },
  progressIndicator: {
    backgroundColor: theme.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '500',
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
  },
  partnerSelectedOption: {
    backgroundColor: theme.neonBlue,
    borderColor: theme.neonBlue,
  },
  matchedOption: {
    backgroundColor: theme.neonPurple,
    borderColor: theme.neonPurple,
  },
  optionText: {
    color: theme.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  playerIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.neonPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  partnerIndicator: {
    backgroundColor: theme.neonBlue,
    right: 'auto',
    left: -10,
  },
  playerIndicatorText: {
    color: theme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  scoreContainer: {
    position: 'absolute',
    top: -80,
    left: 20,
    backgroundColor: theme.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  summaryContainer: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    transform: [{ translateY: -200 }],
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  stageSummary: {
    marginBottom: 16,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  stageProgress: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stageProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  summaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryButtonText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
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
  },
  endCallButton: {
    backgroundColor: theme.error,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: theme.error,
  },
});