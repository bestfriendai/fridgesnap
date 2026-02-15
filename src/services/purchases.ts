// RevenueCat Service Stub
// In production, configure with your RevenueCat API keys

import { Platform } from 'react-native';

export const PRODUCT_IDS = {
  monthly: 'fridgesnap_monthly',
  annual: 'fridgesnap_annual',
};

export const ENTITLEMENT_ID = 'fridgesnap_premium';

export const API_KEYS = {
  ios: 'YOUR_IOS_API_KEY',
  android: 'YOUR_ANDROID_API_KEY',
};

export const checkPremiumStatus = async (): Promise<boolean> => {
  return false;
};

export const getPackages = async () => {
  return [];
};

export const purchasePackage = async (packageId: string): Promise<boolean> => {
  console.log('Purchase initiated for:', packageId);
  return true;
};

export const restorePurchases = async (): Promise<boolean> => {
  return false;
};

export const configureRevenueCat = () => {
  console.log('RevenueCat configured (stub)');
};

/* 
 * REVENUECAT SETUP:
 * 1. npm install react-native-purchases
 * 2. Create account at revenuecat.com
 * 3. Create products in App Store Connect
 * 4. Configure in RevenueCat dashboard
 * 5. Replace API_KEYS above with your keys
 */
