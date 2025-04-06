import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Algorithm',
    description: 'Users going through a vetting process to ensure you never match with bots.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop'
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
    // Start auto-scrolling with 1-second interval
    autoScrollTimer.current = setInterval(scrollToNextSlide, 1000);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentIndex]);

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
                { backgroundColor: index === currentIndex ? '#FF4B6A' : '#FFD1D9' }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
            <View style={styles.cardContainer}>
              <Image
                source={{ uri: slide.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.bottomContainer}>
        <Dots />
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/phone')}
        >
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/signin')}
          style={styles.signInButton}
        >
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    height: height * 0.5,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FF4B6A',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  button: {
    backgroundColor: '#FF4B6A',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInButton: {
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
    color: '#666',
  },
  signInLink: {
    color: '#FF4B6A',
    fontWeight: '600',
  },
});