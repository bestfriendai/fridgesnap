import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useThemeColors, useTheme, ThemeMode } from '../../src/contexts/ThemeContext';
import { useFridgeStore } from '../../src/store/fridgeStore';
import { restorePurchases } from '../../src/services/purchases';

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Nut-Free',
];

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: string }[] = [
  { label: 'Light', value: 'light', icon: '☀️' },
  { label: 'Dark', value: 'dark', icon: '🌙' },
  { label: 'System', value: 'system', icon: '📱' },
];

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { themeMode, setThemeMode } = useTheme();
  const { 
    dietaryRestrictions, 
    setDietaryRestrictions,
    excludedIngredients,
    addExcludedIngredient,
    removeExcludedIngredient,
    hasCompletedOnboarding,
    completeOnboarding,
    clearIngredients,
    isPremium,
    scanCount,
  } = useFridgeStore();
  
  const [newExcluded, setNewExcluded] = useState('');
  
  const toggleDietary = (diet: string) => {
    if (dietaryRestrictions.includes(diet)) {
      setDietaryRestrictions(dietaryRestrictions.filter((d) => d !== diet));
    } else {
      setDietaryRestrictions([...dietaryRestrictions, diet]);
    }
  };
  
  const handleAddExcluded = () => {
    if (!newExcluded.trim()) return;
    addExcludedIngredient(newExcluded.trim().toLowerCase());
    setNewExcluded('');
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your ingredients and saved recipes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearIngredients },
      ]
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>Appearance</Text>
        
        <View style={[styles.themeCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.themeLabel, { color: colors.text }]}>Theme</Text>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.gray100 },
                  themeMode === option.value && { backgroundColor: colors.primary },
                ]}
                onPress={() => setThemeMode(option.value)}
              >
                <Text style={styles.themeOptionIcon}>{option.icon}</Text>
                <Text style={[
                  styles.themeOptionText,
                  { color: colors.text },
                  themeMode === option.value && { color: '#FFFFFF', fontWeight: '600' },
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {/* Dietary Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>Dietary Preferences</Text>
        
        <View style={styles.dietaryGrid}>
          {DIETARY_OPTIONS.map((diet) => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.dietaryChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                dietaryRestrictions.includes(diet) && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => toggleDietary(diet)}
            >
              <Text style={[
                styles.dietaryText,
                { color: colors.gray700 },
                dietaryRestrictions.includes(diet) && styles.dietaryTextActive,
              ]}>
                {diet}
              </Text>
              {dietaryRestrictions.includes(diet) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Excluded Ingredients */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>Excluded Ingredients</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.gray500 }]}>
          Ingredients you want to avoid in recipes
        </Text>
        
        <View style={styles.excludedInput}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => {
                Alert.prompt(
                  'Add Excluded Ingredient',
                  'Enter ingredient name to exclude',
                  (value) => {
                    if (value) addExcludedIngredient(value.toLowerCase());
                  }
                );
              }}
            >
              <Text style={[styles.inputText, { color: colors.gray400 }]}>Tap to add ingredient</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {excludedIngredients.length > 0 && (
          <View style={styles.excludedList}>
            {excludedIngredients.map((ing) => (
              <TouchableOpacity
                key={ing}
                style={[styles.excludedChip, { backgroundColor: colors.error + '15' }]}
                onPress={() => removeExcludedIngredient(ing)}
              >
                <Text style={[styles.excludedText, { color: colors.error }]}>{ing}</Text>
                <Text style={[styles.excludedRemove, { color: colors.error }]}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>Premium</Text>
        
        {isPremium ? (
          <View style={[styles.premiumCard, { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.primary }, shadows.sm]}>
            <View style={[styles.premiumIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.premiumEmoji}>⚡</Text>
            </View>
            <View style={styles.premiumContent}>
              <Text style={[styles.premiumTitle, { color: colors.text }]}>Fridgio Pro Active</Text>
              <Text style={[styles.premiumDescription, { color: colors.gray500 }]}>
                You have unlimited access to all features
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.premiumCard, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push('/paywall')}
          >
            <View style={[styles.premiumIcon, { backgroundColor: colors.gray900 }]}>
              <Text style={styles.premiumEmoji}>⚡</Text>
            </View>
            <View style={styles.premiumContent}>
              <Text style={[styles.premiumTitle, { color: colors.text }]}>Unlock Premium</Text>
              <Text style={[styles.premiumDescription, { color: colors.gray500 }]}>
                {3 - scanCount > 0 
                  ? `${3 - scanCount} free scans left. Upgrade for unlimited.` 
                  : 'Upgrade for unlimited scans & AI recipes'}
              </Text>
            </View>
            <Text style={[styles.premiumArrow, { color: colors.gray300 }]}>›</Text>
          </TouchableOpacity>
        )}
        
        {!isPremium && (
          <TouchableOpacity 
            style={styles.restoreRow}
            onPress={async () => {
              const restored = await restorePurchases();
              if (restored) {
                Alert.alert('Restored!', 'Your premium access has been restored.');
              } else {
                Alert.alert('No Purchases Found', 'No previous purchases were found for this account.');
              }
            }}
          >
            <Text style={[styles.restoreText, { color: colors.gray500 }]}>Restore Purchases</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>About</Text>
        
        <View style={[styles.aboutCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.appName, { color: colors.text }]}>Fridgio</Text>
          <Text style={[styles.appVersion, { color: colors.gray500 }]}>Version 1.0.0</Text>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <TouchableOpacity style={styles.aboutRow} onPress={() => Linking.openURL('https://fridgio.app/privacy')}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.aboutArrow, { color: colors.gray300 }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow} onPress={() => Linking.openURL('https://fridgio.app/terms')}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.aboutArrow, { color: colors.gray300 }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={[styles.aboutText, { color: colors.text }]}>Send Feedback</Text>
            <Text style={[styles.aboutArrow, { color: colors.gray300 }]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>Data</Text>
        
        <TouchableOpacity 
          style={[styles.dangerButton, { backgroundColor: colors.error + '15' }]}
          onPress={handleClearData}
        >
          <Text style={[styles.dangerText, { color: colors.error }]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
      
      {/* Reset Onboarding */}
      {!hasCompletedOnboarding && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: colors.gray100 }]}
            onPress={completeOnboarding}
          >
            <Text style={[styles.resetText, { color: colors.gray500 }]}>Reset Onboarding (Debug)</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: fontSize.caption,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  themeCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  themeLabel: {
    fontSize: fontSize.body,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  themeOptionIcon: {
    fontSize: 16,
  },
  themeOptionText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dietaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  dietaryText: {
    fontSize: fontSize.caption,
    marginRight: spacing.xs,
  },
  dietaryTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  excludedInput: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  inputWrapper: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  input: {
    padding: spacing.md,
    alignItems: 'center',
  },
  inputText: {
    fontSize: fontSize.body,
  },
  excludedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  excludedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  excludedText: {
    fontSize: fontSize.caption,
    marginRight: spacing.sm,
  },
  excludedRemove: {
    fontSize: 10,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  premiumEmoji: {
    fontSize: 22,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  premiumDescription: {
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  premiumArrow: {
    fontSize: 24,
  },
  restoreRow: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  aboutCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  appName: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    textAlign: 'center',
  },
  appVersion: {
    fontSize: fontSize.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  aboutText: {
    fontSize: fontSize.body,
  },
  aboutArrow: {
    fontSize: 20,
  },
  dangerButton: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: fontSize.body,
    fontWeight: '600',
  },
  resetButton: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  resetText: {
    fontSize: fontSize.caption,
  },
});
