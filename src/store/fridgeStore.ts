import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// AI Recipe suggestions (mock - would connect to actual AI API in production)
export const generateRecipeSuggestions = (ingredients: Ingredient[]): Recipe[] => {
  const ingredientNames = ingredients.map((i) => i.name.toLowerCase());
  
  // Mock recipes based on common ingredients
  const mockRecipes: Recipe[] = [
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
  ];
  
  // Filter based on available ingredients
  return mockRecipes.filter((recipe) => {
    const matchCount = recipe.ingredients.filter((ing) =>
      ingredientNames.some((name) => name.includes(ing))
    ).length;
    return matchCount >= 1;
  }).slice(0, 5);
};
