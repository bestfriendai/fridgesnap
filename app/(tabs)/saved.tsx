import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore } from '../../src/store/fridgeStore';

export default function SavedScreen() {
  const router = useRouter();
  const { savedRecipes, removeSavedRecipe } = useFridgeStore();
  
  const handleRecipePress = (id: string) => {
    router.push(`/recipe/${id}`);
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Saved Recipes</Text>
        <Text style={styles.subtitle}>Your favorite recipes saved for later</Text>
      </View>
      
      {/* Saved Recipes List */}
      {savedRecipes.length > 0 ? (
        <View style={styles.section}>
          {savedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => handleRecipePress(recipe.id)}
            >
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDesc} numberOfLines={2}>{recipe.description}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={styles.recipeTime}>⏱️ {recipe.prepTime + recipe.cookTime} min</Text>
                  <Text style={styles.recipeDifficulty}>• {recipe.difficulty}</Text>
                  <Text style={styles.recipeServings}>• {recipe.servings} servings</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.unsaveButton}
                onPress={() => removeSavedRecipe(recipe.id)}
              >
                <Text style={styles.unsaveIcon}>❤️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptySubtitle}>
            Save recipes you love by tapping the heart icon
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/recipes')}
          >
            <Text style={styles.browseButtonText}>Browse Recipes</Text>
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
  subtitle: {
    fontSize: fontSize.body,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  recipeContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  recipeDesc: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeTime: {
    fontSize: fontSize.caption,
    color: colors.primary,
    fontWeight: '500',
  },
  recipeDifficulty: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginLeft: spacing.sm,
  },
  recipeServings: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginLeft: spacing.sm,
  },
  unsaveButton: {
    padding: spacing.sm,
  },
  unsaveIcon: {
    fontSize: 24,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  browseButtonText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.white,
  },
});
