# FridgeSnap 🥬

Snap a photo of your fridge and get AI-powered recipe suggestions based on what you have.

## Features

- 📷 **Photo or Manual Add** - Snap ingredients or add manually
- 🤖 **AI Recipes** - Get suggestions based on what you have
- ❤️ **Save Favorites** - Keep recipes for later
- 👥 **Dietary Preferences** - Set vegetarian, vegan, gluten-free, etc.
- ⚡ **Premium** - Detailed nutrition, meal planning, grocery lists

## Tech Stack

- Expo SDK 54
- Expo Router
- Zustand
- AsyncStorage
- RevenueCat

## Getting Started

```bash
cd builds/fridgesnap
npm install
npx expo start
```

See [SETUP.md](./SETUP.md) for full instructions.

## Privacy

All data stored locally. No account required.

## API Configuration

This app uses **OpenAI** for AI-powered recipe suggestions.

### Required .env Variables

```bash
# OpenAI API (for recipe generation)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# RevenueCat (for subscriptions - optional for basic functionality)
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key
```

### Getting API Keys

1. **OpenAI API Key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new secret key
   - Add payment method (pay-as-you-go pricing)

2. **RevenueCat** (optional, for premium):
   - Go to [RevenueCat](https://www.revenuecat.com)
   - Create project and get API key
   - Configure products in App Store Connect / Google Play Console

### Type Check & Build

```bash
# Install dependencies
npm install

# Type check
npx tsc --noEmit

# Start development server
npx expo start

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## License

MIT
