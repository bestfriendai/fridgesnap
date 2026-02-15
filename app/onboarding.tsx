import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, borderRadius } from '../src/theme';
import { useFridgeStore } from '../src/store/fridgeStore';

const ONBOARDING_SCREENS = [
  {
    emoji: '📷',
    title: 'Snap Your Fridge',
    description: 'Take a photo of what\'s in your fridge or add ingredients manually.',
  },
  {
    emoji: '🤖',
    title: 'AI Recipe Ideas',
    description: 'Get personalized recipe suggestions based on what you have on hand.',
  },
  {
    emoji: '🍳',
    title: 'Cook & Enjoy',
    description: 'Follow easy recipes to turn your ingredients into delicious meals.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useFridgeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };
  
  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };
  
  const screen = ONBOARDING_SCREENS[currentIndex];
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.emoji}>{screen.emoji}</Text>
          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.description}>{screen.description}</Text>
        </View>
        
        <View style={styles.pagination}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex === ONBOARDING_SCREENS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  skipButton: {
    alignSelf: 'flex-end',
  },
  skipText: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.bodyLarge,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  nextText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.primary,
  },
});
