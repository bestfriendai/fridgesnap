import type { Recipe } from '../store/fridgeStore';

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

const apiKey = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

interface SpoonacularIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image?: string;
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  image?: string;
  imageType?: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl?: string;
  summary?: string;
  instructions?: string;
  analyzedInstructions?: {
    steps: { number: number; step: string }[];
  }[];
  extendedIngredients?: SpoonacularIngredient[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
}

const mapSpoonacularToRecipe = (spRecipe: SpoonacularRecipe): Recipe => {
  const ingredients = spRecipe.extendedIngredients?.map(
    (ing) => `${ing.amount.toFixed(1)} ${ing.unit} ${ing.name}`.trim()
  ) ?? [];

  const instructions = spRecipe.analyzedInstructions?.[0]?.steps?.map(
    (step) => step.step
  ) ?? (spRecipe.instructions?.split(/\r?\n/).filter(Boolean) ?? ['Follow standard preparation steps.']);

  const difficulty = spRecipe.readyInMinutes < 30 ? 'Easy' : spRecipe.readyInMinutes < 60 ? 'Medium' : 'Hard';

  return {
    id: spRecipe.id.toString(),
    title: spRecipe.title,
    description: spRecipe.summary?.replace(/<[^>]*>/g, '') ?? `${spRecipe.servings} servings`,
    ingredients,
    instructions,
    prepTime: 10,
    cookTime: spRecipe.readyInMinutes - 10,
    servings: spRecipe.servings,
    difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
    image: spRecipe.image,
  };
};

export const fetchRecipesByIngredients = async (
  ingredients: { name: string }[],
  limit = 8
): Promise<Recipe[]> => {
  if (!apiKey) {
    console.warn('Spoonacular API key not configured');
    return [];
  }

  const ingredientList = ingredients.map((i) => i.name.trim().toLowerCase()).slice(0, 5).join(',');

  if (!ingredientList) return [];

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${encodeURIComponent(ingredientList)}&number=${limit}&ranking=2`
    );

    if (!response.ok) {
      console.error('Spoonacular API error:', response.status);
      return [];
    }

    const recipes = await response.json();

    if (!Array.isArray(recipes) || recipes.length === 0) {
      return [];
    }

    return recipes.map(mapSpoonacularToRecipe);
  } catch (error) {
    console.error('Error fetching recipes from Spoonacular:', error);
    return [];
  }
};

export const searchRecipes = async (query: string, limit = 20): Promise<Recipe[]> => {
  if (!apiKey) {
    console.warn('Spoonacular API key not configured');
    return [];
  }

  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${apiKey}&query=${encodeURIComponent(cleanQuery)}&number=${limit}&addRecipeInformation=true`
    );

    if (!response.ok) {
      console.error('Spoonacular API error:', response.status);
      return [];
    }

    const data = await response.json();
    const recipes = data.results ?? [];

    return recipes.map(mapSpoonacularToRecipe);
  } catch (error) {
    console.error('Error searching recipes from Spoonacular:', error);
    return [];
  }
};

export const fetchRecipeDetails = async (id: string): Promise<Recipe | null> => {
  if (!apiKey) {
    console.warn('Spoonacular API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=false`
    );

    if (!response.ok) {
      console.error('Spoonacular API error:', response.status);
      return null;
    }

    const recipe = await response.json();
    return mapSpoonacularToRecipe(recipe);
  } catch (error) {
    console.error('Error fetching recipe details from Spoonacular:', error);
    return null;
  }
};

export const fetchFeaturedRecipes = async (limit = 12): Promise<Recipe[]> => {
  if (!apiKey) {
    console.warn('Spoonacular API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${apiKey}&number=${limit}`
    );

    if (!response.ok) {
      console.error('Spoonacular API error:', response.status);
      return [];
    }

    const data = await response.json();
    const recipes = data.recipes ?? [];

    return recipes.map(mapSpoonacularToRecipe);
  } catch (error) {
    console.error('Error fetching featured recipes from Spoonacular:', error);
    return [];
  }
};
