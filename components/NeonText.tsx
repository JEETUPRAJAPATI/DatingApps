import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';

interface NeonTextProps {
  text: string;
  color: string;
  size?: number;
  style?: TextStyle;
  glowIntensity?: number;
  pulseEnabled?: boolean;
}

const NeonText: React.FC<NeonTextProps> = ({ 
  text, 
  color, 
  size = 24,
  style,
  glowIntensity = 8, // Increased glow intensity
  pulseEnabled = true
}) => {
  const glowOpacity = useSharedValue(0.8);

  React.useEffect(() => {
    if (pulseEnabled) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withDelay(200, withTiming(0.8, { duration: 1500 }))
        ),
        -1,
        true
      );
    }
  }, [pulseEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text
        style={[
          styles.text,
          {
            color,
            fontSize: size,
            textShadowColor: color,
            textShadowRadius: glowIntensity,
            textShadowOffset: { width: 0, height: 0 },
          },
          style,
        ]}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700', // Increased weight for better glow effect
  },
});

export default NeonText;