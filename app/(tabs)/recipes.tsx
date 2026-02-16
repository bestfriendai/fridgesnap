import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore, Recipe, generateRecipeSuggestions } from '../../src/store/fridgeStore';
import { fetchFeaturedRecipes, searchRecipes } from '../../src/services/recipes';

export default function RecipesScreen() {
  const router = useRouter();
  const { ingredients, addRecentRecipe } = useFridgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    let active = true;

    const loadSuggestions = async () => {
      const recipes = await generateRecipeSuggestions(ingredients);
      if (active) setSuggestedRecipes(recipes);
    };

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [ingredients]);

  useEffect(() => {
    let active = true;

    const loadRecipes = async () => {
      const recipes = searchQuery.trim()
        ? await searchRecipes(searchQuery)
        : await fetchFeaturedRecipes();

      if (active) setFeaturedRecipes(recipes);
    };

    loadRecipes();

    return () => {
      active = false;
    };
  }, [searchQuery]);
  
  const handleRecipePress = (recipe: Recipe) => {
    addRecentRecipe(recipe);
    router.push(`/recipe/${recipe.id}`);
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.subtitle}>Discover what you can make</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Suggested for You */}
      {suggestedRecipes.length > 0 && !searchQuery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          <Text style={styles.sectionSubtitle}>Based on your ingredients</Text>
          
          {suggestedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => handleRecipePress(recipe)}
            >
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDesc} numberOfLines={2}>{recipe.description}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={styles.recipeTime}>⏱️ {recipe.prepTime + recipe.cookTime} min</Text>
                  <Text style={styles.recipeDifficulty}>• {recipe.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.recipeArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* All Recipes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Recipes</Text>
        
        {featuredRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeCard}
            onPress={() => handleRecipePress(recipe)}
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
            <Text style={styles.recipeArrow}>›</Text>
          </TouchableOpacity>
        ))}
        
        {featuredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
        )}
      </View>
      
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    color: colors.black,
    ...shadows.sm,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.caption,
    color: colors.primary,
    marginBottom: spacing.md,
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
  recipeArrow: {
    fontSize: 24,
    color: colors.gray300,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
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
  },
});
