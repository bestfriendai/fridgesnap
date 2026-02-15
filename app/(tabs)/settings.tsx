import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore } from '../../src/store/fridgeStore';

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

export default function SettingsScreen() {
  const { 
    dietaryRestrictions, 
    setDietaryRestrictions,
    excludedIngredients,
    addExcludedIngredient,
    removeExcludedIngredient,
    hasCompletedOnboarding,
    completeOnboarding,
    clearIngredients,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      {/* Dietary Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        
        <View style={styles.dietaryGrid}>
          {DIETARY_OPTIONS.map((diet) => (
            <TouchableOpacity
              key={diet}
              style={[
                styles.dietaryChip,
                dietaryRestrictions.includes(diet) && styles.dietaryChipActive,
              ]}
              onPress={() => toggleDietary(diet)}
            >
              <Text style={[
                styles.dietaryText,
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
        <Text style={styles.sectionTitle}>Excluded Ingredients</Text>
        <Text style={styles.sectionSubtitle}>
          Ingredients you want to avoid in recipes
        </Text>
        
        <View style={styles.excludedInput}>
          <View style={styles.inputWrapper}>
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
              <Text style={styles.inputText}>Tap to add ingredient</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {excludedIngredients.length > 0 && (
          <View style={styles.excludedList}>
            {excludedIngredients.map((ing) => (
              <TouchableOpacity
                key={ing}
                style={styles.excludedChip}
                onPress={() => removeExcludedIngredient(ing)}
              >
                <Text style={styles.excludedText}>{ing}</Text>
                <Text style={styles.excludedRemove}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      {/* Premium Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium</Text>
        
        <TouchableOpacity 
          style={styles.premiumCard}
          onPress={() => router.push('/paywall')}
        >
          <View style={styles.premiumIcon}>
            <Text style={styles.premiumEmoji}>⚡</Text>
          </View>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Unlock Premium</Text>
            <Text style={styles.premiumDescription}>
              AI-powered recipes, meal planning, grocery lists & more
            </Text>
          </View>
          <Text style={styles.premiumArrow}>›</Text>
        </TouchableOpacity>
      </View>
      
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>FridgeSnap</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Privacy Policy</Text>
            <Text style={styles.aboutArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Terms of Service</Text>
            <Text style={styles.aboutArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutRow}>
            <Text style={styles.aboutText}>Send Feedback</Text>
            <Text style={styles.aboutArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleClearData}
        >
          <Text style={styles.dangerText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
      
      {/* Reset Onboarding */}
      {!hasCompletedOnboarding && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={completeOnboarding}
          >
            <Text style={styles.resetText}>Reset Onboarding (Debug)</Text>
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
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
    color: colors.black,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.caption,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dietaryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dietaryText: {
    fontSize: fontSize.caption,
    color: colors.gray700,
    marginRight: spacing.xs,
  },
  dietaryTextActive: {
    color: colors.white,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
  },
  excludedInput: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  inputWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    padding: spacing.md,
    alignItems: 'center',
  },
  inputText: {
    fontSize: fontSize.body,
    color: colors.gray400,
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
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  excludedText: {
    fontSize: fontSize.caption,
    color: colors.error,
    marginRight: spacing.sm,
  },
  excludedRemove: {
    fontSize: 10,
    color: colors.error,
  },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray900,
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
    color: colors.black,
  },
  premiumDescription: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginTop: 2,
  },
  premiumArrow: {
    fontSize: 24,
    color: colors.gray300,
  },
  aboutCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  appName: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    color: colors.black,
  },
  aboutArrow: {
    fontSize: 20,
    color: colors.gray300,
  },
  dangerButton: {
    backgroundColor: colors.error + '15',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.error,
  },
  resetButton: {
    backgroundColor: colors.gray100,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  resetText: {
    fontSize: fontSize.caption,
    color: colors.gray500,
  },
});
