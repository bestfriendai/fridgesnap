import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../src/theme';
import { useFridgeStore, INGREDIENT_CATEGORIES, generateRecipeSuggestions, Recipe, FREE_SCAN_LIMIT_VALUE } from '../../src/store/fridgeStore';
import { detectIngredientsFromImage, imageToBase64, DetectedIngredient } from '../../src/services/vision';

const QUICK_ADD_INGREDIENTS = [
  'Chicken', 'Eggs', 'Milk', 'Cheese', 'Butter', 'Rice', 'Pasta', 'Tomatoes',
  'Onions', 'Garlic', 'Potatoes', 'Carrots', 'Lettuce', 'Cucumber', 'Bell Pepper',
];

export default function HomeScreen() {
  const router = useRouter();
  const { ingredients, addIngredient, removeIngredient, clearIngredients, addRecentRecipe, isPremium, scanCount, incrementScanCount, canScan } = useFridgeStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('produce');
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAddIngredient = () => {
    if (!newIngredient.trim()) return;
    addIngredient(newIngredient.trim(), selectedCategory);
    setNewIngredient('');
    setShowAddModal(false);
  };
  
  const handleQuickAdd = (name: string) => {
    addIngredient(name, selectedCategory);
  };
  
  const checkScanLimit = (): boolean => {
    if (!canScan()) {
      router.push('/paywall');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (!checkScanLimit()) return;
    
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is needed to take photos of your fridge.');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets[0]) {
      incrementScanCount();
      await analyzeImage(result.assets[0].uri);
    }
  };

  const handlePickImage = async () => {
    if (!checkScanLimit()) return;
    
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Photo library permission is needed.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets[0]) {
      incrementScanCount();
      await analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    const hasApiKey = !!process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    if (!hasApiKey) {
      Alert.alert(
        'API Key Required',
        'To enable AI ingredient detection, please add your OpenAI API key to the environment variables.\n\nSee API_KEYS.md for instructions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const base64 = await imageToBase64(uri);
      const detectedIngredients = await detectIngredientsFromImage(base64);
      
      if (detectedIngredients.length === 0) {
        Alert.alert(
          'No Ingredients Found',
          'Could not detect any ingredients in this image. Try a clearer photo of your fridge contents.',
          [{ text: 'OK' }]
        );
        return;
      }

      const ingredientMap: Record<string, string> = {
        produce: 'produce',
        vegetable: 'produce',
        fruit: 'produce',
        herb: 'produce',
        dairy: 'dairy',
        milk: 'dairy',
        cheese: 'dairy',
        butter: 'dairy',
        egg: 'dairy',
        yogurt: 'dairy',
        meat: 'meat',
        chicken: 'meat',
        beef: 'meat',
        pork: 'meat',
        fish: 'meat',
        seafood: 'meat',
        bacon: 'meat',
        ground: 'meat',
        pantry: 'pantry',
        rice: 'pantry',
        pasta: 'pantry',
        flour: 'pantry',
        sugar: 'pantry',
        oil: 'pantry',
        spice: 'pantry',
        sauce: 'pantry',
        canned: 'pantry',
        frozen: 'frozen',
        drinks: 'drinks',
        beverage: 'drinks',
        water: 'drinks',
        juice: 'drinks',
      };

      let addedCount = 0;
      
      for (const detected of detectedIngredients) {
        const lowerName = detected.name.toLowerCase();
        let category = 'pantry';
        
        for (const [key, value] of Object.entries(ingredientMap)) {
          if (lowerName.includes(key)) {
            category = value;
            break;
          }
        }
        
        addIngredient(detected.name, category);
        addedCount++;
      }

      Alert.alert(
        'Ingredients Detected!',
        `Found and added ${addedCount} ingredient${addedCount !== 1 ? 's' : ''} from your photo.`,
        [{ text: 'Great!' }]
      );
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Failed',
        'Could not analyze this image. Please try again or add ingredients manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  useEffect(() => {
    let active = true;

    const loadSuggestions = async () => {
      const recipes = await generateRecipeSuggestions(ingredients);
      if (active) {
        setSuggestedRecipes(recipes);
      }
    };

    loadSuggestions();

    return () => {
      active = false;
    };
  }, [ingredients]);

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, typeof ingredients>);
  
  const categories = Object.keys(INGREDIENT_CATEGORIES);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.headerTitle}>What's in your fridge? 🥬</Text>
          <Text style={styles.headerSubtitle}>
            {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
          </Text>
          
          {!isPremium && (
            <View style={styles.scanCounter}>
              <Text style={styles.scanCounterText}>
                {Math.max(0, FREE_SCAN_LIMIT_VALUE - scanCount)} free scan{FREE_SCAN_LIMIT_VALUE - scanCount !== 1 ? 's' : ''} remaining
              </Text>
            </View>
          )}
          {isPremium && (
            <View style={styles.proBadgeHeader}>
              <Text style={styles.proBadgeText}>⚡ PRO — Unlimited</Text>
            </View>
          )}
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, isAnalyzing && styles.quickActionDisabled]} 
              onPress={handleTakePhoto}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.quickActionIcon}>📷</Text>
              )}
              <Text style={styles.quickActionText}>
                {isAnalyzing ? 'Analyzing...' : 'Snap Photo'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAction, isAnalyzing && styles.quickActionDisabled]} 
              onPress={handlePickImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Text style={styles.quickActionIcon}>🖼️</Text>
              )}
              <Text style={styles.quickActionText}>
                {isAnalyzing ? 'Analyzing...' : 'Pick Photo'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      
      {/* Add Ingredient Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(!showAddModal)}
        >
          <Text style={styles.addIcon}>➕</Text>
          <Text style={styles.addText}>Add Ingredient</Text>
        </TouchableOpacity>
        
        {/* Add Modal */}
        {showAddModal && (
          <View style={styles.addModal}>
            <TextInput
              style={styles.input}
              placeholder="Enter ingredient name"
              placeholderTextColor={colors.gray400}
              value={newIngredient}
              onChangeText={setNewIngredient}
            />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.quickAddLabel}>Quick Add:</Text>
            <View style={styles.quickAddGrid}>
              {QUICK_ADD_INGREDIENTS.slice(0, 8).map((ing) => (
                <TouchableOpacity
                  key={ing}
                  style={styles.quickAddChip}
                  onPress={() => handleQuickAdd(ing)}
                >
                  <Text style={styles.quickAddChipText}>{ing}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleAddIngredient}>
              <Text style={styles.submitText}>Add Ingredient</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Current Ingredients */}
      {ingredients.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Ingredients</Text>
            <TouchableOpacity onPress={clearIngredients}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <View key={category} style={styles.categoryGroup}>
              <Text style={styles.categoryLabel}>{category}</Text>
              <View style={styles.ingredientGrid}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.ingredientChip}
                    onPress={() => removeIngredient(item.id)}
                  >
                    <Text style={styles.ingredientText}>{item.name}</Text>
                    <Text style={styles.ingredientRemove}>✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Recipe Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipe Ideas</Text>
        
        {suggestedRecipes.length > 0 ? (
          suggestedRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => {
                addRecentRecipe(recipe);
                router.push(`/recipe/${recipe.id}`);
              }}
            >
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDesc}>{recipe.description}</Text>
                <View style={styles.recipeMeta}>
                  <Text style={styles.recipeTime}>⏱️ {recipe.prepTime + recipe.cookTime} min</Text>
                  <Text style={styles.recipeDifficulty}>• {recipe.difficulty}</Text>
                  <Text style={styles.recipeServings}>• {recipe.servings} servings</Text>
                </View>
              </View>
              <Text style={styles.recipeArrow}>›</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧊</Text>
            <Text style={styles.emptyTitle}>Your fridge is empty</Text>
            <Text style={styles.emptySubtitle}>Add ingredients to get recipe suggestions!</Text>
          </View>
        )}
      </View>
      
      {/* Premium Banner */}
      {!isPremium && (
        <TouchableOpacity 
          style={styles.premiumBanner}
          onPress={() => router.push('/paywall')}
        >
          <View style={styles.premiumContent}>
            <Text style={styles.premiumEmoji}>⚡</Text>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Unlock Premium</Text>
              <Text style={styles.premiumSubtitle}>AI-powered recipes, meal planning & more</Text>
            </View>
          </View>
          <Text style={styles.premiumArrow}>›</Text>
        </TouchableOpacity>
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
  headerCard: {
    margin: spacing.lg,
    marginBottom: spacing.md,
  },
  gradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize.titleLarge,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  scanCounter: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  scanCounterText: {
    fontSize: fontSize.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  proBadgeHeader: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  proBadgeText: {
    fontSize: fontSize.caption,
    color: colors.white,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  quickActionDisabled: {
    opacity: 0.7,
  },
  quickActionIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  quickActionText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    color: colors.primary,
  },
  addText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.primary,
  },
  addModal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadows.md,
  },
  input: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    color: colors.black,
    marginBottom: spacing.md,
  },
  categoryPicker: {
    marginBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.caption,
    fontWeight: '500',
    color: colors.gray600,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  quickAddLabel: {
    fontSize: fontSize.caption,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickAddChip: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  quickAddChipText: {
    fontSize: fontSize.caption,
    color: colors.gray700,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitText: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '600',
    color: colors.black,
  },
  clearText: {
    fontSize: fontSize.caption,
    color: colors.error,
    fontWeight: '500',
  },
  categoryGroup: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    fontSize: fontSize.caption,
    fontWeight: '600',
    color: colors.gray500,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.sm,
  },
  ingredientText: {
    fontSize: fontSize.body,
    color: colors.black,
    marginRight: spacing.sm,
  },
  ingredientRemove: {
    fontSize: 12,
    color: colors.gray400,
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
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray900,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  premiumContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.white,
  },
  premiumSubtitle: {
    fontSize: fontSize.caption,
    color: colors.gray400,
    marginTop: 2,
  },
  premiumArrow: {
    fontSize: 24,
    color: colors.gray400,
  },
});
