import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface DetectedIngredient {
  name: string;
  category: string;
  confidence: number;
}

export const detectIngredientsFromImage = async (
  base64Image: string
): Promise<DetectedIngredient[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image of a fridge or pantry contents. 
              Identify all visible food ingredients and list them.
              
              For each ingredient, provide:
              1. The ingredient name (in English, singular form)
              2. The category: produce, dairy, meat, pantry, frozen, drinks, or other
              
              Return a JSON array of objects with this exact format:
              [
                {"name": "ingredient name", "category": "category", "confidence": 0.95},
                ...
              ]
              
              Only include items you are confident are food ingredients.
              Do not include brand names or packaging.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.warn('No content in OpenAI response');
      return [];
    }

    const parsed = JSON.parse(content);
    
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
      return parsed.ingredients;
    } else if (parsed.items && Array.isArray(parsed.items)) {
      return parsed.items;
    }
    
    console.warn('Unexpected response format from OpenAI:', parsed);
    return [];
  } catch (error) {
    console.error('Error detecting ingredients from image:', error);
    throw error;
  }
};

export const imageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
