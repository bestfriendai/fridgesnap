import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRecipesByIngredients as fetchFromSpoonacular } from '../services/spoonacular';
import { fetchRecipesByIngredients as fetchFromMealDb, searchRecipes as searchMealDb, fetchFeaturedRecipes as featuredMealDb } from '../services/recipes';

const useSpoonacular = !!process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  addedAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image?: string;
}

interface FridgeState {
  // Ingredients
  ingredients: Ingredient[];
  
  // Recipes
  savedRecipes: Recipe[];
  recentRecipes: Recipe[];
  
  // User preferences
  dietaryRestrictions: string[];
  excludedIngredients: string[];
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  
  // Actions
  addIngredient: (name: string, category: string) => void;
  removeIngredient: (id: string) => void;
  clearIngredients: () => void;
  addSavedRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (id: string) => void;
  addRecentRecipe: (recipe: Recipe) => void;
  setDietaryRestrictions: (restrictions: string[]) => void;
  addExcludedIngredient: (ingredient: string) => void;
  removeExcludedIngredient: (ingredient: string) => void;
  completeOnboarding: () => void;
}

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set, get) => ({
      ingredients: [],
      savedRecipes: [],
      recentRecipes: [],
      dietaryRestrictions: [],
      excludedIngredients: [],
      hasCompletedOnboarding: false,
      
      addIngredient: (name, category) => {
        const ingredient: Ingredient = {
          id: Date.now().toString(),
          name,
          category,
          addedAt: new Date().toISOString(),
        };
        set((state) => ({
          ingredients: [...state.ingredients, ingredient],
        }));
      },
      
      removeIngredient: (id) => {
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i.id !== id),
        }));
      },
      
      clearIngredients: () => set({ ingredients: [] }),
      
      addSavedRecipe: (recipe) => {
        set((state) => ({
          savedRecipes: [...state.savedRecipes.filter((r) => r.id !== recipe.id), recipe],
        }));
      },
      
      removeSavedRecipe: (id) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== id),
        }));
      },
      
      addRecentRecipe: (recipe) => {
        const { recentRecipes } = get();
        const filtered = recentRecipes.filter((r) => r.id !== recipe.id);
        set({
          recentRecipes: [recipe, ...filtered].slice(0, 20),
        });
      },
      
      setDietaryRestrictions: (restrictions) => set({ dietaryRestrictions: restrictions }),
      
      addExcludedIngredient: (ingredient) => {
        set((state) => ({
          excludedIngredients: [...state.excludedIngredients, ingredient],
        }));
      },
      
      removeExcludedIngredient: (ingredient) => {
        set((state) => ({
          excludedIngredients: state.excludedIngredients.filter((i) => i !== ingredient),
        }));
      },
      
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'fridgesnap-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Common ingredient categories
export const INGREDIENT_CATEGORIES = {
  produce: ['Vegetables', 'Fruits', 'Herbs'],
  dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs'],
  meat: ['Chicken', 'Beef', 'Pork', 'Fish', 'Bacon', 'Ground Meat'],
  pantry: ['Rice', 'Pasta', 'Flour', 'Sugar', 'Oil', 'Spices', 'Sauce', 'Canned'],
  frozen: ['Frozen Vegetables', 'Ice Cream', 'Frozen Meat'],
  drinks: ['Water', 'Juice', 'Soda', 'Milk Alternatives'],
};

export const generateRecipeSuggestions = async (ingredients: Ingredient[]): Promise<Recipe[]> => {
  try {
    if (useSpoonacular) {
      return await fetchFromSpoonacular(ingredients, 8);
    }
    return await fetchFromMealDb(ingredients, 8);
  } catch (error) {
    console.warn('Failed to fetch recipe suggestions', error);
    return [];
  }
};
