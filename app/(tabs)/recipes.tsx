import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useThemeColors } from '../../src/contexts/ThemeContext';
import { useFridgeStore, Recipe, generateRecipeSuggestions } from '../../src/store/fridgeStore';
import { fetchFeaturedRecipes, searchRecipes } from '../../src/services/recipes';

export default function RecipesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
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
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Recipes</Text>
        <Text style={[styles.subtitle, { color: colors.gray500 }]}>Discover what you can make</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }, shadows.sm]}
          placeholder="Search recipes..."
          placeholderTextColor={colors.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Suggested for You */}
      {suggestedRecipes.length > 0 && !searchQuery && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggested for You</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>Based on your ingredients</Text>
          
          {suggestedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={[styles.recipeCard, { backgroundColor: colors.card }, shadows.sm]}
              onPress={() => handleRecipePress(recipe)}
            >
              <View style={styles.recipeContent}>
                <Text style={[styles.recipeTitle, { color: colors.text }]}>{recipe.title}</Text>
                <Text style={[styles.recipeDesc, { color: colors.gray500 }]} numberOfLines={2}>{recipe.description}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={[styles.recipeTime, { color: colors.primary }]}>⏱️ {recipe.prepTime + recipe.cookTime} min</Text>
                  <Text style={[styles.recipeDifficulty, { color: colors.gray500 }]}>• {recipe.difficulty}</Text>
                </View>
              </View>
              <Text style={[styles.recipeArrow, { color: colors.gray300 }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* All Recipes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Recipes</Text>
        
        {featuredRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={[styles.recipeCard, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => handleRecipePress(recipe)}
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
            <Text style={[styles.recipeArrow, { color: colors.gray300 }]}>›</Text>
          </TouchableOpacity>
        ))}
        
        {featuredRecipes.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No recipes found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.gray500 }]}>Try a different search term</Text>
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInput: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.caption,
    marginBottom: spacing.md,
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
  recipeArrow: {
    fontSize: 24,
  },
  emptyState: {
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
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: fontSize.body,
  },
});
