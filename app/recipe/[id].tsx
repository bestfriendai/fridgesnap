import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore } from '../../src/store/fridgeStore';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { savedRecipes, recentRecipes, addSavedRecipe, removeSavedRecipe } = useFridgeStore();

  const recipe =
    recentRecipes.find((r) => r.id === id) ??
    savedRecipes.find((r) => r.id === id);
  
  if (!recipe) {
    return (
      <View style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Recipe not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        
        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <Text style={styles.metaLabel}>Prep</Text>
            <Text style={styles.metaValue}>{recipe.prepTime} min</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🍳</Text>
            <Text style={styles.metaLabel}>Cook</Text>
            <Text style={styles.metaValue}>{recipe.cookTime} min</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>👥</Text>
            <Text style={styles.metaLabel}>Serves</Text>
            <Text style={styles.metaValue}>{recipe.servings}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📊</Text>
            <Text style={styles.metaLabel}>Level</Text>
            <Text style={styles.metaValue}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
      
      {/* Ingredients Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Instructions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsList}>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Total Time */}
      <View style={styles.totalTimeCard}>
        <Text style={styles.totalTimeIcon}>⏰</Text>
        <Text style={styles.totalTimeLabel}>Total Time</Text>
        <Text style={styles.totalTimeValue}>{totalTime} minutes</Text>
      </View>
      
      {/* Premium CTA */}
      <TouchableOpacity 
        style={styles.premiumCTA}
        onPress={() => router.push('/paywall')}
      >
        <Text style={styles.premiumCTAText}>
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
    backgroundColor: colors.backgroundSecondary,
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backArrow: {
    fontSize: 28,
    color: colors.black,
    fontWeight: '300',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
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
    color: colors.black,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.body,
    color: colors.gray600,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
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
    color: colors.gray500,
  },
  metaValue: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.black,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
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
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  ingredientText: {
    fontSize: fontSize.body,
    color: colors.black,
    flex: 1,
    textTransform: 'capitalize',
  },
  instructionsList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  instructionNumberText: {
    fontSize: fontSize.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.black,
    lineHeight: 22,
  },
  totalTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
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
    color: colors.gray600,
    marginRight: spacing.sm,
  },
  totalTimeValue: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    color: colors.primary,
  },
  premiumCTA: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  premiumCTAText: {
    fontSize: fontSize.caption,
    color: colors.primary,
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
    color: colors.black,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.white,
  },
});
