import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, borderRadius, shadows } from '../src/theme';

const FEATURES = [
  { icon: '🤖', title: 'AI Recipe Generation', desc: 'Get custom recipes based on your exact ingredients' },
  { icon: '📊', title: 'Detailed Nutrition', desc: 'Calories, macros, and exact measurements' },
  { icon: '🛒', title: 'Smart Grocery Lists', desc: 'Auto-generate shopping lists from recipes' },
  { icon: '📅', title: 'Meal Planning', desc: 'Plan your week with auto-suggestions' },
  { icon: '✨', title: 'No Ads', desc: 'Clean, distraction-free experience' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  
  const handlePurchase = async () => {
    setLoading(true);
    // Simulate purchase
    setTimeout(() => {
      setLoading(false);
      alert('Premium activated! Welcome to the kitchen. 👨‍🍳');
      router.back();
    }, 1500);
  };
  
  const handleRestore = () => {
    alert('No previous purchases found.');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.gray900, colors.gray800]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.premiumBadge}>⚡ PREMIUM</Text>
          <Text style={styles.headerTitle}>Cook Like a Pro</Text>
          <Text style={styles.headerSubtitle}>
            Unlock AI-powered recipes and meal planning
          </Text>
        </LinearGradient>
        
        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Choose Your Plan</Text>
          
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Monthly</Text>
              {selectedPlan === 'monthly' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planPeriod}>per month</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.planCardAnnual,
              selectedPlan === 'annual' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('annual')}
          >
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>BEST VALUE</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Annual</Text>
              {selectedPlan === 'annual' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planPrice}>$29.99</Text>
            <Text style={styles.planPeriod}>per year (save 50%)</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
            onPress={handlePurchase}
            disabled={loading}
          >
            <Text style={styles.purchaseText}>
              {loading ? 'Processing...' : selectedPlan === 'annual' ? 'Start Free Trial' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
          
          <Text style={styles.terms}>
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            Subscription auto-renews unless cancelled.
          </Text>
        </View>
        
        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  premiumBadge: {
    fontSize: fontSize.caption,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  features: {
    padding: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.black,
  },
  featureDesc: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginTop: 2,
  },
  pricingSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  pricingTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  planCardAnnual: {
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  recommendedText: {
    fontSize: fontSize.caption2,
    fontWeight: '700',
    color: colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  planName: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.black,
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  planPrice: {
    fontSize: fontSize.title,
    fontWeight: '700',
    color: colors.black,
  },
  planPeriod: {
    fontSize: fontSize.caption,
    color: colors.gray500,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.white,
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  restoreText: {
    fontSize: fontSize.body,
    color: colors.gray500,
  },
  terms: {
    fontSize: fontSize.caption2,
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 18,
  },
});
