# FridgeSnap API Keys Guide

This document details all API keys and environment variables required to run FridgeSnap.

## Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# ============================================
# REQUIRED API KEYS
# ============================================

# OpenAI API - Used for AI-powered ingredient detection from photos
# Get your key at: https://platform.openai.com/api-keys
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# ============================================
# OPTIONAL API KEYS (Premium Features)
# ============================================

# Spoonacular API - Enhanced recipe search with more options
# Get your key at: https://spoonacular.com/food-api/console#profile
# Free tier: 150 requests/day
EXPO_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# RevenueCat API - For in-app subscriptions (optional)
# Get your key at: https://www.revenuecat.com
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_api_key_here
```

## API Details

### 1. OpenAI API Key (REQUIRED)

**Purpose**: AI-powered ingredient detection from fridge photos

**Signup URL**: https://platform.openai.com/api-keys

**Pricing**:
- Pay-as-you-go pricing
- GPT-4o mini: $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- Image input: $0.00225 per image (for 1024x1024)
- Very cheap for ingredient detection use case (~$0.01 per scan)

**Setup**:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (it won't be shown again)
4. Add to your `.env` file

**Notes**:
- This is the ONLY required API key for basic functionality
- Without this key, users can still add ingredients manually
- The app will prompt users when the key is missing

---

### 2. Spoonacular API Key (OPTIONAL)

**Purpose**: Enhanced recipe search with nutritional info, meal planning, and more

**Signup URL**: https://spoonacular.com/food-api/console#profile

**Pricing**:
| Tier | Price | Requests/Day | Features |
|------|-------|--------------|----------|
| Free | $0 | 150 | Basic recipe search |
| Basic | $4/month | 500 | Recipe details, nutrition |
| Pro | $9/month | 2500 | Meal planning, grocery lists |
| Pro Plus | $19/month | 15000 | All features, priority support |

**Setup**:
1. Go to https://spoonacular.com/food-api/console#profile
2. Click "Create New API Key"
3. Copy the key
4. Add to your `.env` file

**Notes**:
- Without this key, the app uses TheMealDB (free, no key required)
- TheMealDB provides basic recipes but less accurate ingredient matching

---

### 3. RevenueCat API Key (OPTIONAL)

**Purpose**: In-app subscriptions and premium features

**Signup URL**: https://www.revenuecat.com

**Pricing**:
- Free up to $10k ARR
- 0.5% of revenue for $10k-$1M ARR
- Contact sales for higher volumes

**Setup**:
1. Create account at https://www.revenuecat.com
2. Create a new project "FridgeSnap"
3. Go to Project Settings → API Keys
4. Copy your SDK API key
5. Add to your `.env` file

**Notes**:
- Without this key, premium features are disabled
- Paywall UI is functional but purchases won't work

---

## Example .env File

```bash
# OpenAI - Required for ingredient detection
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Spoonacular - Optional, for enhanced recipes
EXPO_PUBLIC_SPOONACULAR_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# RevenueCat - Optional, for subscriptions
EXPO_PUBLIC_REVENUECAT_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | Yes | OpenAI API key for ingredient detection |
| `EXPO_PUBLIC_SPOONACULAR_API_KEY` | No | Spoonacular API for enhanced recipes |
| `EXPO_PUBLIC_REVENUECAT_API_KEY` | No | RevenueCat for in-app purchases |

## Troubleshooting

### "API Key Required" Alert
- Make sure `EXPO_PUBLIC_OPENAI_API_KEY` is set in your `.env` file
- Restart the expo server after adding keys: `npx expo start --clear`

### Build Errors
- Ensure all API keys are properly set before building
- Use `npx expo start --clear` to clear cache after env changes

### API Rate Limits
- OpenAI: Check your usage at https://platform.openai.com/usage
- Spoonacular: Check your quota at https://spoonacular.com/food-api/console

## Security Notes

- Never commit API keys to version control
- The `.env` file is already in `.gitignore`
- Use environment-specific keys for production
- Rotate keys periodically
