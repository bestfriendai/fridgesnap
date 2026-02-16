import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useThemeColors, useTheme } from '../src/contexts/ThemeContext';

function RootLayoutInner() {
  const colors = useThemeColors();
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            presentation: 'fullScreenModal',
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="paywall" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="recipe/[id]" 
          options={{ 
            presentation: 'card',
            animation: 'slide_from_right',
          }} 
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
