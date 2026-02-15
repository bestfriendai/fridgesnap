# FridgeSnap — Setup Guide

## Prerequisites

- Node.js 18+
- Expo CLI
- Xcode (macOS for iOS)
- Android Studio (for Android)
- Apple Developer Account ($99/yr)
- Google Play Console ($25)

---

## Quick Start

```bash
cd builds/fridgesnap
npm install
npx expo start
```

### Running

```bash
npx expo start --ios    # iOS
npx expo start --android # Android
```

---

## RevenueCat Setup

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Create project: "FridgeSnap"
3. Add products in App Store Connect & Google Play:
   - Monthly: $4.99
   - Annual: $29.99
4. Configure in RevenueCat dashboard
5. Update `src/services/purchases.ts` with API keys

---

## App Store Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create app:
   - **Name**: FridgeSnap
   - **Bundle ID**: com.fridgesnap.app
   - **Platform**: iOS

### Required Info

- Category: Food & Drink
- Content Rating: 4+
- Privacy Policy URL
- Screenshots (iPhone 6.7" + iPad Pro 12.9")

---

## EAS Build

```bash
# Install EAS
npm install -g eas-cli
eas login

# Build iOS
eas build -p ios --profile production

# Build Android
eas build -p android --profile production
```

---

## Submission Checklist

- [ ] RevenueCat products configured
- [ ] API keys added
- [ ] Bundle ID matches
- [ ] App icon (1024x1024)
- [ ] Screenshots
- [ ] Privacy policy
- [ ] TestFlight build passes

---

## Troubleshooting

**Missing icon**: Add `assets/icon.png` (1024x1024)

**RevenueCat issues**: Verify API keys and product IDs match

**Build fails**: Run `npx expo start --clear`

---

## Support

- Expo: https://docs.expo.dev
- RevenueCat: https://docs.revenuecat.com
