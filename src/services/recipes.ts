import type { Ingredient, Recipe } from '../store/fridgeStore';
import { fetchRecipesByIngredients as fetchSpoonacular, searchRecipes as searchSpoonacular, fetchFeaturedRecipes as featuredSpoonacular } from './spoonacular';

const useSpoonacular = !!process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

type MealDbMeal = {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strInstructions?: string;
  strMealThumb?: string;
  [key: string]: string | undefined;
};

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const splitInstructions = (instructions?: string): string[] => {
  if (!instructions) return ['Follow the standard preparation steps for this recipe.'];

  const steps = instructions
    .split(/\r?\n|\.(?=\s+[A-Z])/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.endsWith('.') ? line : `${line}.`));

  return steps.length > 0 ? steps : [instructions.trim()];
};

const mapMealToRecipe = (meal: MealDbMeal): Recipe => {
  const ingredients: string[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (!ingredient) continue;
    ingredients.push(measure ? `${measure} ${ingredient}`.trim() : ingredient);
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: meal.strCategory
      ? `${meal.strCategory} recipe from TheMealDB`
      : 'Recipe sourced from TheMealDB',
    ingredients,
    instructions: splitInstructions(meal.strInstructions),
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    difficulty: 'Easy',
    image: meal.strMealThumb,
  };
};

const fetchMealDetails = async (mealId: string): Promise<MealDbMeal | null> => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(mealId)}`);
  if (!response.ok) return null;
  const json = await response.json();
  return (json?.meals?.[0] as MealDbMeal | undefined) ?? null;
};

const fetchMealDbRecipes = async (
  ingredients: Ingredient[],
  limit = 8
): Promise<Recipe[]> => {
  const ingredientNames = [...new Set(ingredients.map((i) => i.name.trim().toLowerCase()).filter(Boolean))].slice(0, 4);
  if (ingredientNames.length === 0) return [];

  const lists = await Promise.all(
    ingredientNames.map(async (name) => {
      const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(name)}`);
      if (!response.ok) return [] as MealDbMeal[];
      const json = await response.json();
      return (json?.meals as MealDbMeal[] | null) ?? [];
    })
  );

  const mealIds = [...new Set(lists.flat().map((m) => m.idMeal))].slice(0, limit);
  const detailedMeals = await Promise.all(mealIds.map(fetchMealDetails));

  return detailedMeals.filter(Boolean).map((meal) => mapMealToRecipe(meal as MealDbMeal));
};

const searchMealDb = async (query: string, limit = 20): Promise<Recipe[]> => {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(cleanQuery)}`);
  if (!response.ok) return [];

  const json = await response.json();
  const meals = (json?.meals as MealDbMeal[] | null) ?? [];
  return meals.slice(0, limit).map(mapMealToRecipe);
};

const fetchMealDbFeatured = async (limit = 12): Promise<Recipe[]> => {
  const response = await fetch(`${BASE_URL}/search.php?f=c`);
  if (!response.ok) return [];

  const json = await response.json();
  const meals = (json?.meals as MealDbMeal[] | null) ?? [];
  return meals.slice(0, limit).map(mapMealToRecipe);
};

export const fetchRecipesByIngredients = async (
  ingredients: Ingredient[],
  limit = 8
): Promise<Recipe[]> => {
  if (useSpoonacular) {
    return fetchSpoonacular(ingredients, limit);
  }
  return fetchMealDbRecipes(ingredients, limit);
};

export const searchRecipes = async (query: string, limit = 20): Promise<Recipe[]> => {
  if (useSpoonacular) {
    return searchSpoonacular(query, limit);
  }
  return searchMealDb(query, limit);
};

export const fetchFeaturedRecipes = async (limit = 12): Promise<Recipe[]> => {
  if (useSpoonacular) {
    return featuredSpoonacular(limit);
  }
  return fetchMealDbFeatured(limit);
};
