import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore, Recipe, generateRecipeSuggestions } from '../../src/store/fridgeStore';

const ALL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Quick Stir Fry',
    description: 'A quick and easy stir fry using whatever vegetables you have',
    ingredients: ['vegetables', 'protein', 'soy sauce', 'oil'],
    instructions: [
      'Chop all vegetables into bite-sized pieces',
      'Heat oil in a wok or large pan over high heat',
      'Add protein and cook until browned',
      'Add vegetables and stir fry for 3-5 minutes',
      'Add soy sauce and toss to combine',
      'Serve over rice',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Simple Pasta',
    description: 'Classic pasta with your choice of sauce',
    ingredients: ['pasta', 'tomato sauce', 'cheese', 'garlic'],
    instructions: [
      'Cook pasta according to package directions',
      'In a pan, sauté garlic in olive oil',
      'Add tomato sauce and simmer',
      'Drain pasta and add to sauce',
      'Top with cheese and serve',
    ],
    prepTime: 5,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
  },
  {
    id: '3',
    title: 'Breakfast Scramble',
    description: 'Fluffy eggs with vegetables and cheese',
    ingredients: ['eggs', 'cheese', 'vegetables', 'butter'],
    instructions: [
      'Beat eggs in a bowl',
      'Melt butter in a non-stick pan',
      'Add vegetables and cook until soft',
      'Pour in eggs and scramble',
      'Add cheese and fold until melted',
      'Season with salt and pepper',
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: '4',
    title: 'Chicken Salad',
    description: 'Fresh and healthy chicken salad',
    ingredients: ['chicken', 'lettuce', 'tomato', 'cucumber', 'dressing'],
    instructions: [
      'Cook and slice chicken breast',
      'Wash and chop all vegetables',
      'Combine in a large bowl',
      'Add dressing and toss',
      'Serve immediately',
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: '5',
    title: 'Rice Bowl',
    description: 'Customizable rice bowl with toppings',
    ingredients: ['rice', 'protein', 'vegetables', 'sauce'],
    instructions: [
      'Cook rice according to package',
      'Prepare protein (chicken, beef, or tofu)',
      'Slice vegetables thinly',
      'Assemble bowl with rice base',
      'Add toppings and drizzle with sauce',
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy',
  },
  {
    id: '6',
    title: 'Omelette',
    description: 'Classic French omelette with fillings',
    ingredients: ['eggs', 'cheese', 'butter', 'herbs'],
    instructions: [
      'Beat eggs with salt and pepper',
      'Melt butter in a non-stick pan',
      'Pour in eggs and let set slightly',
      'Add cheese and fillings to one half',
      'Fold and serve',
    ],
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    difficulty: 'Easy',
  },
  {
    id: '7',
    title: 'Grilled Cheese',
    description: 'Ultimate comfort food sandwich',
    ingredients: ['bread', 'cheese', 'butter'],
    instructions: [
      'Butter one side of each bread slice',
      'Place cheese between bread (butter side out)',
      'Cook in pan over medium heat',
      'Flip when golden brown',
      'Cook until cheese melts',
    ],
    prepTime: 2,
    cookTime: 8,
    servings: 1,
    difficulty: 'Easy',
  },
  {
    id: '8',
    title: 'Garlic Bread',
    description: 'Crispy, buttery garlic bread',
    ingredients: ['bread', 'butter', 'garlic', 'herbs'],
    instructions: [
      'Mix softened butter with minced garlic',
      'Add herbs and mix',
      'Spread on bread slices',
      'Toast in oven at 375°F for 10 min',
      'Serve warm',
    ],
    prepTime: 5,
    cookTime: 10,
    servings: 4,
    difficulty: 'Easy',
  },
];

export default function RecipesScreen() {
  const router = useRouter();
  const { ingredients, addRecentRecipe } = useFridgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get suggested recipes based on ingredients
  const suggestedRecipes = generateRecipeSuggestions(ingredients);
  
  // Filter all recipes by search
  const filteredRecipes = ALL_RECIPES.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        
        {filteredRecipes.map((recipe) => (
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
        
        {filteredRecipes.length === 0 && (
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
