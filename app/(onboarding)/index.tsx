import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import NeonGradient from '../../components/NeonGradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Algorithm',
    description: 'Users going through a vetting process to ensure you never match with bots.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Matches',
    description: 'We match you with people that have a large array of similar interests.',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1287&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Premium',
    description: 'Sign up today and enjoy the first month of premium benefits on us.',
    image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=2564&auto=format&fit=crop'
  }
];

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<Animated.ScrollView>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const buttonScale = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      runOnJS(setCurrentIndex)(Math.round(event.contentOffset.x / width));
    },
  });

  const scrollToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    slidesRef.current?.scrollTo({
      x: nextIndex * width,
      animated: true
    });
  };

  useEffect(() => {
    autoScrollTimer.current = setInterval(scrollToNextSlide, 1000);
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    buttonScale.value = withSequence(
      withSpring(1.05),
      withSpring(1)
    );
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const Dots = () => {
    return (
      <View style={styles.dotContainer}>
        {slides.map((_, index) => {
          const dotStyle = useAnimatedStyle(() => {
            const input = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = interpolate(
              scrollX.value,
              input,
              [8, 16, 8],
              'clamp'
            );
            const opacity = interpolate(
              scrollX.value,
              input,
              [0.5, 1, 0.5],
              'clamp'
            );

            return {
              width: withSpring(dotWidth),
              opacity: withSpring(opacity),
            };
          });

          return (
            <Animated.View 
              key={index.toString()} 
              style={[
                styles.dot,
                dotStyle,
                { backgroundColor: index === currentIndex ? theme.neonPink : theme.textMuted }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.ScrollView
          ref={slidesRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onTouchStart={() => {
            if (autoScrollTimer.current) {
              clearInterval(autoScrollTimer.current);
            }
          }}
          onTouchEnd={() => {
            autoScrollTimer.current = setInterval(scrollToNextSlide, 1000);
          }}
          style={styles.scrollView}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <NeonGradient style={styles.cardContainer}>
                <Image
                  source={{ uri: slide.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </NeonGradient>
              <View style={styles.contentContainer}>
                <NeonText 
                  text={slide.title}
                  color={theme.neonPink}
                  size={32}
                  style={styles.title}
                />
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Dots />
        
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => router.push('/phone')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <NeonGradient 
              style={styles.buttonGradient}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Text style={styles.buttonText}>Create an account</Text>
            </NeonGradient>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/signin')}
            >
              <NeonText 
                text="Sign In"
                color={theme.neonBlue}
                size={16}
                style={styles.signInLink}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: '100%',
    alignItems: 'center',
    paddingTop: 60,
  },
  cardContainer: {
    width: width - 80,
    height: height * 0.45,
    borderRadius: 24,
    padding: 2,
    backgroundColor: theme.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: theme.background,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    gap: 20,
  },
  createAccountButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  signInText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  signInLink: {
    marginBottom: 0,
  },
});