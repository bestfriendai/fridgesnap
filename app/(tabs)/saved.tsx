import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { useFridgeStore } from '../../src/store/fridgeStore';

export default function SavedScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { savedRecipes, removeSavedRecipe } = useFridgeStore();
  
  const handleRecipePress = (id: string) => {
    router.push(`/recipe/${id}`);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Saved Recipes</Text>
        <Text style={[styles.subtitle, { color: colors.gray500 }]}>Your favorite recipes saved for later</Text>
      </View>
      
      {/* Saved Recipes List */}
      {savedRecipes.length > 0 ? (
        <View style={styles.section}>
          {savedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeCard, { backgroundColor: colors.card }, shadows.sm]}
              onPress={() => handleRecipePress(recipe.id)}
            >
              <View style={styles.recipeContent}>
                <Text style={[styles.recipeTitle, { color: colors.text }]}>{recipe.title}</Text>
                <Text style={[styles.recipeDesc, { color: colors.gray500 }]} numberOfLines={2}>{recipe.description}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={[styles.recipeTime, { color: colors.primary }]}>⏱️ {recipe.prepTime + recipe.cookTime} min</Text>
                  <Text style={[styles.recipeDifficulty, { color: colors.gray500 }]}>• {recipe.difficulty}</Text>
                  <Text style={[styles.recipeServings, { color: colors.gray500 }]}>• {recipe.servings} servings</Text>
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
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved recipes yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray500 }]}>
            Save recipes you love by tapping the heart icon
          </Text>
          <TouchableOpacity 
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
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
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.body,
    marginTop: spacing.xs,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  recipeContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  recipeDesc: {
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeTime: {
    fontSize: fontSize.caption,
    fontWeight: '500',
  },
  recipeDifficulty: {
    fontSize: fontSize.caption,
    marginLeft: spacing.sm,
  },
  recipeServings: {
    fontSize: fontSize.caption,
    marginLeft: spacing.sm,
  },
  unsaveButton: {
    padding: spacing.sm,
  },
  unsaveIcon: {
    fontSize: 24,
  },
  emptyState: {
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
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  browseButton: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  browseButtonText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
