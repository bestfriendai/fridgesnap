import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRecipesByIngredients as fetchFromSpoonacular } from '../services/spoonacular';
import { fetchRecipesByIngredients as fetchFromMealDb, searchRecipes as searchMealDb, fetchFeaturedRecipes as featuredMealDb } from '../services/recipes';

const useSpoonacular = !!process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;

const FREE_SCAN_LIMIT = 3;

const getToday = (): string => new Date().toISOString().split('T')[0];

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
  
  // Premium
  isPremium: boolean;
  scanCount: number;
  scanDate: string;
  
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
  setPremium: (value: boolean) => void;
  incrementScanCount: () => void;
  canScan: () => boolean;
  remainingFreeScans: () => number;
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
      isPremium: false,
      scanCount: 0,
      scanDate: getToday(),
      
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
      
      setPremium: (value) => set({ isPremium: value }),
      
      incrementScanCount: () => {
        const today = getToday();
        const { scanDate, scanCount } = get();
        if (scanDate !== today) {
          set({ scanCount: 1, scanDate: today });
        } else {
          set({ scanCount: scanCount + 1 });
        }
      },
      
      canScan: () => {
        const { isPremium, scanCount, scanDate } = get();
        if (isPremium) return true;
        if (scanDate !== getToday()) return true;
        return scanCount < FREE_SCAN_LIMIT;
      },
      
      remainingFreeScans: () => {
        const { isPremium, scanCount, scanDate } = get();
        if (isPremium) return Infinity;
        if (scanDate !== getToday()) return FREE_SCAN_LIMIT;
        return Math.max(0, FREE_SCAN_LIMIT - scanCount);
      },
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

export const FREE_SCAN_LIMIT_VALUE = FREE_SCAN_LIMIT;

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
