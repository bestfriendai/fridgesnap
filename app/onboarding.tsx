import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, borderRadius } from '../src/theme';
import { useFridgeStore } from '../src/store/fridgeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ONBOARDING_SCREENS = [
  {
    emoji: '📷',
    title: 'Snap Your Fridge',
    description: 'Take a photo of what\'s in your fridge and our AI instantly identifies every ingredient.',
  },
  {
    emoji: '🤖',
    title: 'AI Recipe Ideas',
    description: 'Get personalized recipe suggestions based on exactly what you have on hand. No more food waste!',
  },
  {
    emoji: '🍳',
    title: 'Cook & Enjoy',
    description: 'Follow easy step-by-step recipes and turn your ingredients into restaurant-quality meals.',
  },
  {
    emoji: '⚡',
    title: 'Go Pro — Free for 3 Days',
    description: 'Unlock unlimited scans, AI recipes, meal planning, and smart grocery lists. Join 10,000+ home chefs!',
    isPremiumPitch: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useFridgeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  };
  
  const handleNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      animateTransition(() => setCurrentIndex(currentIndex + 1));
    } else {
      // Last screen — complete onboarding
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleStartTrial = () => {
    completeOnboarding();
    router.replace('/(tabs)');
    // Small delay so tabs mount first
    setTimeout(() => router.push('/paywall'), 300);
  };
  
  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };
  
  const screen = ONBOARDING_SCREENS[currentIndex];
  const isLastScreen = currentIndex === ONBOARDING_SCREENS.length - 1;
  const isPremiumScreen = screen.isPremiumPitch;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isPremiumScreen ? ['#111827', '#1F2937'] : [colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        {!isLastScreen && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.emoji}>{screen.emoji}</Text>
          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.description}>{screen.description}</Text>
          
          {isPremiumScreen && (
            <View style={styles.premiumFeatures}>
              {['Unlimited fridge scans', 'AI-powered recipes', 'Meal planning', 'Smart grocery lists'].map((f, i) => (
                <View key={i} style={styles.premiumFeatureRow}>
                  <Text style={styles.premiumCheck}>✓</Text>
                  <Text style={styles.premiumFeatureText}>{f}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
        
        <View style={styles.pagination}>
          {ONBOARDING_SCREENS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.dotActive]}
            />
          ))}
        </View>
        
        {isPremiumScreen ? (
          <View style={styles.premiumButtons}>
            <TouchableOpacity style={styles.trialButton} onPress={handleStartTrial}>
              <Text style={styles.trialButtonText}>Start Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notNowButton} onPress={handleSkip}>
              <Text style={styles.notNowText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentIndex === ONBOARDING_SCREENS.length - 2 ? 'Almost Done' : 'Next'}
            </Text>
          </TouchableOpacity>
        )}
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
  premiumFeatures: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    paddingHorizontal: spacing.lg,
  },
  premiumFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  premiumCheck: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginRight: spacing.md,
  },
  premiumFeatureText: {
    fontSize: fontSize.bodyLarge,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
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
  premiumButtons: {
    gap: spacing.sm,
  },
  trialButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  trialButtonText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    color: colors.white,
  },
  notNowButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  notNowText: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
});
