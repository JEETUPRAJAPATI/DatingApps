import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../app/_layout';

interface NeonGradientProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  colors?: string[];
  animated?: boolean;
  intensity?: number;
}

const NeonGradient: React.FC<NeonGradientProps> = ({
  style,
  children,
  colors = [theme.neonPink, theme.neonBlue],
  animated = true,
  intensity = 0.8,
}) => {
  const opacity = useSharedValue(intensity);

  React.useEffect(() => {
    if (animated) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(intensity, { duration: 2000 })
        ),
        -1,
        true
      );
    }
  }, [animated, intensity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    shadowColor: colors[0],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, style]}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
});

export default NeonGradient;