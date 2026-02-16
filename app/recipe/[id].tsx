import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { useFridgeStore } from '../../src/store/fridgeStore';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { savedRecipes, recentRecipes, addSavedRecipe, removeSavedRecipe } = useFridgeStore();

  const recipe =
    recentRecipes.find((r) => r.id === id) ??
    savedRecipes.find((r) => r.id === id);
  
  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.errorState}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Recipe not found</Text>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const isSaved = savedRecipes.some((r) => r.id === recipe.id);
  
  const handleSave = () => {
    if (isSaved) {
      removeSavedRecipe(recipe.id);
    } else {
      addSavedRecipe(recipe);
    }
  };
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButtonLarge, { backgroundColor: colors.card }, shadows.sm]} onPress={() => router.back()}>
          <Text style={[styles.backArrow, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.card }, shadows.sm]} onPress={handleSave}>
          <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
        <Text style={[styles.description, { color: colors.gray600 }]}>{recipe.description}</Text>
        
        {/* Meta Info */}
        <View style={[styles.metaRow, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={[styles.metaLabel, { color: colors.gray500 }]}>Prep</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{recipe.prepTime} min</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🍳</Text>
            <Text style={[styles.metaLabel, { color: colors.gray500 }]}>Cook</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{recipe.cookTime} min</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>👥</Text>
            <Text style={[styles.metaLabel, { color: colors.gray500 }]}>Serves</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{recipe.servings}</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📊</Text>
            <Text style={[styles.metaLabel, { color: colors.gray500 }]}>Level</Text>
            <Text style={[styles.metaValue, { color: colors.text }]}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
      
      {/* Ingredients Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
        <View style={[styles.ingredientsList, { backgroundColor: colors.card }, shadows.sm]}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={[styles.ingredientBullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.ingredientText, { color: colors.text }]}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Instructions Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
        <View style={[styles.instructionsList, { backgroundColor: colors.card }, shadows.sm]}>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={[styles.instructionNumber, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.instructionNumberText, { color: colors.primary }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.instructionText, { color: colors.text }]}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Total Time */}
      <View style={[styles.totalTimeCard, { backgroundColor: colors.primary + '10' }]}>
        <Text style={styles.totalTimeIcon}>⏰</Text>
        <Text style={[styles.totalTimeLabel, { color: colors.gray600 }]}>Total Time</Text>
        <Text style={[styles.totalTimeValue, { color: colors.primary }]}>{totalTime} minutes</Text>
      </View>
      
      {/* Premium CTA */}
      <TouchableOpacity 
        style={styles.premiumCTA}
        onPress={() => router.push('/paywall')}
      >
        <Text style={[styles.premiumCTAText, { color: colors.primary }]}>
          🔗 Get full AI-powered recipe with exact measurements
        </Text>
      </TouchableOpacity>
      
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButtonLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    fontSize: 20,
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.body,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  metaLabel: {
    fontSize: fontSize.caption2,
  },
  metaValue: {
    fontSize: fontSize.body,
    fontWeight: '600',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    marginVertical: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  ingredientsList: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ingredientBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  ingredientText: {
    fontSize: fontSize.body,
    flex: 1,
    textTransform: 'capitalize',
  },
  instructionsList: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  instructionNumberText: {
    fontSize: fontSize.caption,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: fontSize.body,
    lineHeight: 22,
  },
  totalTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  totalTimeIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  totalTimeLabel: {
    fontSize: fontSize.body,
    marginRight: spacing.sm,
  },
  totalTimeValue: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
  },
  premiumCTA: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  premiumCTAText: {
    fontSize: fontSize.caption,
    textDecorationLine: 'underline',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSize.title,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  backButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
