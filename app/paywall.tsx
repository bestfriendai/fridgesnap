import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Animated, Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, fontSize, borderRadius, shadows } from '../src/theme';
import { useThemeColors } from '../src/contexts/ThemeContext';
import { purchasePackage, restorePurchases } from '../src/services/purchases';
import { useFridgeStore } from '../src/store/fridgeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURES = [
  { icon: '📷', title: 'Unlimited Fridge Scans', desc: 'Scan as many times as you want — no limits' },
  { icon: '🤖', title: 'AI Recipe Generation', desc: 'Get custom recipes based on your exact ingredients' },
  { icon: '📊', title: 'Detailed Nutrition', desc: 'Calories, macros, and exact measurements' },
  { icon: '🛒', title: 'Smart Grocery Lists', desc: 'Auto-generate shopping lists from recipes' },
  { icon: '📅', title: 'Meal Planning', desc: 'Plan your week with auto-suggestions' },
  { icon: '✨', title: 'No Ads', desc: 'Clean, distraction-free experience' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { isPremium } = useFridgeStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Pulse CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Shimmer effect
    Animated.loop(
      Animated.timing(shimmerAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
    ).start();
  }, []);
  
  const handlePurchase = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const success = await purchasePackage(selectedPlan);
      if (success) {
        router.back();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        router.back();
      } else {
        alert('No previous purchases found.');
      }
    } catch (error) {
      alert('Could not restore purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If already premium, show confirmation
  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }]}>
        <Text style={{ fontSize: 64, marginBottom: spacing.lg }}>🎉</Text>
        <Text style={{ fontSize: fontSize.title, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, textAlign: 'center' }}>
          You're Premium!
        </Text>
        <Text style={{ fontSize: fontSize.body, color: colors.gray500, textAlign: 'center', marginBottom: spacing.xl }}>
          You have access to all features. Enjoy cooking!
        </Text>
        <TouchableOpacity
          style={[styles.purchaseButton, { paddingHorizontal: spacing.xxxl }]}
          onPress={() => router.back()}
        >
          <Text style={styles.purchaseText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <LinearGradient
          colors={['#111827', '#1F2937', '#111827']}
          style={styles.header}
        >
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
            <Text style={styles.crownEmoji}>👨‍🍳</Text>
            <View style={styles.premiumBadgeContainer}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.premiumBadgeGradient}
              >
                <Text style={styles.premiumBadge}>⚡ FRIDGIO PRO</Text>
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>Unlock Your{'\n'}Kitchen Superpower</Text>
            <Text style={styles.headerSubtitle}>
              AI-powered recipes, unlimited scans & meal planning
            </Text>
            
            {/* Social proof */}
            <View style={styles.socialProof}>
              <Text style={styles.socialProofStars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.socialProofText}>Join 10,000+ home chefs</Text>
            </View>
          </Animated.View>
        </LinearGradient>
        
        {/* Features */}
        <View style={[styles.features, { backgroundColor: colors.background }]}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={index}
              style={[styles.featureRow, { backgroundColor: colors.backgroundSecondary },
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.15)) }],
                },
              ]}
            >
              <View style={[styles.featureIconBg, { backgroundColor: colors.card }, shadows.sm]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.gray500 }]}>{feature.desc}</Text>
              </View>
              <Text style={[styles.featureCheck, { color: colors.primary }]}>✓</Text>
            </Animated.View>
          ))}
        </View>
        
        {/* Pricing */}
        <View style={[styles.pricingSection, { backgroundColor: colors.background }]}>
          {/* Annual Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              { backgroundColor: colors.card, borderColor: colors.gray200 },
              selectedPlan === 'annual' && { borderColor: colors.primary, backgroundColor: colors.primary + '08' },
            ]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.8}
          >
            <View style={[styles.bestValueBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
            <View style={[styles.trialBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.trialBadgeText}>3-DAY FREE TRIAL</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={[styles.planRadio, { borderColor: colors.gray300 }]}>
                {selectedPlan === 'annual' && <View style={[styles.planRadioInner, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: colors.text }]}>Annual</Text>
                <Text style={[styles.planSaving, { color: colors.primary }]}>Save 50% — just $2.50/mo</Text>
              </View>
              <View style={styles.planPriceBox}>
                <Text style={[styles.planPrice, { color: colors.text }]}>$29.99</Text>
                <Text style={[styles.planPeriod, { color: colors.gray500 }]}>/year</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              { backgroundColor: colors.card, borderColor: colors.gray200 },
              selectedPlan === 'monthly' && { borderColor: colors.primary, backgroundColor: colors.primary + '08' },
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <View style={[styles.planRadio, { borderColor: colors.gray300 }]}>
                {selectedPlan === 'monthly' && <View style={[styles.planRadioInner, { backgroundColor: colors.primary }]} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: colors.text }]}>Monthly</Text>
                <Text style={[styles.planSaving, { color: colors.primary }]}>Cancel anytime</Text>
              </View>
              <View style={styles.planPriceBox}>
                <Text style={[styles.planPrice, { color: colors.text }]}>$4.99</Text>
                <Text style={[styles.planPeriod, { color: colors.gray500 }]}>/month</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* CTA */}
        <View style={styles.buttonSection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
              onPress={handlePurchase}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.purchaseGradient}
              >
                <Text style={styles.purchaseText}>
                  {loading
                    ? 'Processing...'
                    : selectedPlan === 'annual'
                    ? 'Start Your Free Trial'
                    : 'Subscribe Now — $4.99/mo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {selectedPlan === 'annual' && (
            <Text style={[styles.trialNote, { color: colors.gray500 }]}>
              Try free for 3 days, then $29.99/year. Cancel anytime.
            </Text>
          )}
          
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={[styles.restoreText, { color: colors.gray500 }]}>Restore Purchases</Text>
          </TouchableOpacity>
          
          {/* Guarantee */}
          <View style={styles.guarantee}>
            <Text style={styles.guaranteeIcon}>🔒</Text>
            <Text style={[styles.guaranteeText, { color: colors.gray400 }]}>Secured by App Store. Cancel anytime.</Text>
          </View>
          
          {/* Terms & Privacy */}
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => Linking.openURL('https://fridgio.app/terms')}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.legalSeparator, { color: colors.gray300 }]}>•</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://fridgio.app/privacy')}>
              <Text style={[styles.legalLink, { color: colors.primary }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.terms, { color: colors.gray400 }]}>
            Subscription auto-renews unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </View>
        
        <View style={{ height: spacing.xxxl + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  crownEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  premiumBadgeContainer: {
    marginBottom: spacing.md,
  },
  premiumBadgeGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  premiumBadge: {
    fontSize: fontSize.caption,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  socialProof: {
    marginTop: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  socialProofStars: {
    fontSize: 14,
    marginBottom: 2,
  },
  socialProofText: {
    fontSize: fontSize.caption,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  features: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  featureIconBg: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: fontSize.caption,
    marginTop: 1,
  },
  featureCheck: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  pricingSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  planCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2.5,
    position: 'relative',
    overflow: 'visible',
  },
  planCardSelected: {
    // handled inline
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    left: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  bestValueText: {
    fontSize: fontSize.caption2,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  trialBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  trialBadgeText: {
    fontSize: fontSize.caption2,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  planSaving: {
    fontSize: fontSize.caption,
    fontWeight: '500',
    marginTop: 2,
  },
  planPriceBox: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: fontSize.title,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: fontSize.caption,
    marginTop: -2,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  purchaseButton: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  purchaseText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  trialNote: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: fontSize.body,
    fontWeight: '500',
  },
  guarantee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guaranteeIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  guaranteeText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  legalLink: {
    fontSize: fontSize.caption,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: fontSize.caption,
    marginHorizontal: spacing.sm,
  },
  terms: {
    fontSize: fontSize.caption2,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.lg,
  },
});
