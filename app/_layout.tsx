import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Enhanced neon theme
export const theme = {
  // Base dark colors for contrast
  background: '#0A0A0F', // Darker background for better neon contrast
  surface: '#12121A',
  surfaceLight: '#1A1A24',
  surfaceDark: '#080810',
  
  // Primary neon colors
  neonPink: '#FF2E9F',
  neonBlue: '#00E5FF',
  neonPurple: '#B537F2',
  neonGreen: '#3DFFA3',
  
  // Text colors with neon glow
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3CC',
  textMuted: '#666680',
  
  // Gradient combinations
  gradientStart: '#FF2E9F',
  gradientMiddle: '#B537F2',
  gradientEnd: '#00E5FF',
  
  // Status colors with neon variants
  success: '#3DFFA3',
  error: '#FF3366',
  warning: '#FFD60A',
  
  // Overlay colors
  overlay: 'rgba(10, 10, 15, 0.75)',
  overlayLight: 'rgba(10, 10, 15, 0.5)',
  
  // Border colors with subtle glow
  border: '#1F1F2C',
  borderLight: '#2A2A3A',
  
  // Glow effects
  glowPink: '#FF2E9F',
  glowBlue: '#00E5FF',
  glowPurple: '#B537F2',
  glowGreen: '#3DFFA3',
};

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="story-viewer" 
          options={{ 
            presentation: 'fullScreenModal',
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="filter-modal" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="video-call" 
          options={{ 
            presentation: 'fullScreenModal',
            animation: 'fade',
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}