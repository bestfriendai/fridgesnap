// RevenueCat Service Stub
// In production, configure with your RevenueCat API keys

import { Platform } from 'react-native';
import { useFridgeStore } from '../store/fridgeStore';

export const PRODUCT_IDS = {
  weekly: 'fridgio_weekly',
  monthly: 'fridgio_monthly',
  annual: 'fridgio_annual',
};

export const ENTITLEMENT_ID = 'fridgio_premium';

export const API_KEYS = {
  ios: 'YOUR_IOS_API_KEY',
  android: 'YOUR_ANDROID_API_KEY',
};

export type PlanKey = 'weekly' | 'monthly' | 'annual';

export interface PlanInfo {
  id: string;
  title: string;
  price: string;
  priceValue: number;
  pricePerWeek: string;
  period: string;
  trial: boolean;
  trialDays?: number;
  savings?: string;
  badge?: string;
}

export const PLANS: Record<PlanKey, PlanInfo> = {
  weekly: {
    id: PRODUCT_IDS.weekly,
    title: 'Weekly',
    price: '$4.99',
    priceValue: 4.99,
    pricePerWeek: '$4.99',
    period: 'week',
    trial: false,
  },
  monthly: {
    id: PRODUCT_IDS.monthly,
    title: 'Monthly',
    price: '$9.99',
    priceValue: 9.99,
    pricePerWeek: '$2.50',
    period: 'month',
    trial: false,
    savings: '50%',
    badge: 'POPULAR',
  },
  annual: {
    id: PRODUCT_IDS.annual,
    title: 'Annual',
    price: '$39.99',
    priceValue: 39.99,
    pricePerWeek: '$0.77',
    period: 'year',
    trial: true,
    trialDays: 3,
    savings: '85%',
    badge: 'BEST VALUE',
  },
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    return useFridgeStore.getState().isPremium;
  } catch {
    return false;
  }
};

export const getPackages = async (): Promise<PlanInfo[]> => {
  // In production, fetch from RevenueCat
  return [PLANS.weekly, PLANS.monthly, PLANS.annual];
};

export const purchasePackage = async (planKey: PlanKey): Promise<boolean> => {
  console.log('Purchase initiated for:', planKey);

  const plan = PLANS[planKey];
  if (!plan) {
    throw new Error(`Unknown plan: ${planKey}`);
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate successful purchase
  useFridgeStore.getState().setPremium(true);

  return true;
};

export const restorePurchases = async (): Promise<boolean> => {
  console.log('Restoring purchases...');

  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // In production: check RevenueCat for active entitlements
    // const customerInfo = await Purchases.restorePurchases();
    // const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    const hadPreviousPurchase = false;

    if (hadPreviousPurchase) {
      useFridgeStore.getState().setPremium(true);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
};

export const configureRevenueCat = () => {
  console.log('RevenueCat configured (stub)');
  // In production:
  // const apiKey = Platform.OS === 'ios' ? API_KEYS.ios : API_KEYS.android;
  // await Purchases.configure({ apiKey });
};

/* 
 * REVENUECAT SETUP:
 * 1. npm install react-native-purchases
 * 2. Create account at revenuecat.com
 * 3. Create products in App Store Connect:
 *    - fridgio_weekly: $4.99/week auto-renewable
 *    - fridgio_monthly: $9.99/month auto-renewable
 *    - fridgio_annual: $39.99/year auto-renewable with 3-day free trial
 * 4. Configure in RevenueCat dashboard
 * 5. Replace API_KEYS above with your keys
 */
