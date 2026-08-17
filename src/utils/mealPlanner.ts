import { Meal, DayMealPlan } from '../types';

const indianMeals = {
  breakfast: [
    {
      name: 'Poha with Vegetables',
      calories: 250,
      protein: 8,
      carbs: 45,
      fat: 6,
      description: 'Flattened rice with onions, potatoes, and spices',
      instructions: '1. Rinse poha in water and drain.\n2. Heat 1 tsp oil, sauté mustard seeds, curry leaves, onions, and green peas.\n3. Add turmeric, salt, and poha. Toss gently for 3 mins and serve with lemon.',
      isVegetarian: true
    },
    {
      name: 'Idli with Sambar',
      calories: 200,
      protein: 10,
      carbs: 35,
      fat: 2,
      description: 'Steamed rice cakes with lentil curry',
      instructions: '1. Pour idli batter into oiled molds and steam for 10-12 mins.\n2. Simmer cooked lentils with tamarind water, diced vegetables, and sambar powder.\n3. Serve warm idlis with hot sambar.',
      isVegetarian: true
    },
    {
      name: 'Upma with Vegetables',
      calories: 220,
      protein: 6,
      carbs: 40,
      fat: 5,
      description: 'Semolina porridge with mixed vegetables',
      instructions: '1. Dry roast semolina (rava) until fragrant.\n2. Sauté mustard seeds, curry leaves, diced carrots, and peas in oil.\n3. Add boiling water, fold in roasted semolina gradually, and simmer 4 mins.',
      isVegetarian: true
    },
    {
      name: 'Paratha with Curd',
      calories: 300,
      protein: 12,
      carbs: 35,
      fat: 12,
      description: 'Stuffed flatbread with yogurt',
      instructions: '1. Knead whole wheat dough.\n2. Stuff dough ball with spiced grated paneer or potatoes.\n3. Roll out and cook on tava with minimal ghee until golden. Serve with low-fat curd.',
      isVegetarian: true
    },
    {
      name: 'Dosa with Coconut Chutney',
      calories: 180,
      protein: 8,
      carbs: 28,
      fat: 4,
      description: 'Crispy rice and lentil crepe with chutney',
      instructions: '1. Spread fermented dosa batter thinly on a hot skillet.\n2. Drizzle a few drops of oil and cook until crisp.\n3. Grind grated coconut, roasted chana dal, green chilli, and salt for chutney.',
      isVegetarian: true
    },
    {
      name: 'Oats Upma',
      calories: 200,
      protein: 8,
      carbs: 30,
      fat: 6,
      description: 'Healthy oats cooked with vegetables and spices',
      instructions: '1. Heat oil, temper with mustard seeds and green chillies.\n2. Add finely chopped onions, carrots, and beans. Sauté 3 mins.\n3. Add water and rolled oats; cook for 4 minutes until thick.',
      isVegetarian: true
    },
    {
      name: 'Besan Chilla',
      calories: 180,
      protein: 12,
      carbs: 20,
      fat: 6,
      description: 'Gram flour pancake with vegetables',
      instructions: '1. Mix gram flour (besan), water, chopped spinach, onion, salt, and cumin into a pouring batter.\n2. Pour onto a hot non-stick tava and spread into a round pancake.\n3. Flip and cook both sides until golden brown.',
      isVegetarian: true
    },
    {
      name: 'Egg Paratha',
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 14,
      description: 'Flatbread stuffed with scrambled eggs',
      instructions: '1. Whisk 2 eggs with green chillies, onions, coriander, and salt.\n2. Roll out wheat flatbread and begin cooking on hot tava.\n3. Pour whisked egg onto paratha, flip to sear egg directly on tava.',
      isVegetarian: false
    },
    {
      name: 'Chicken Sandwich',
      calories: 280,
      protein: 22,
      carbs: 25,
      fat: 12,
      description: 'Grilled chicken sandwich with vegetables',
      instructions: '1. Shred boiled chicken breast.\n2. Mix with 2 tbsp plain Greek yogurt, black pepper, and sliced cucumber.\n3. Layer inside whole wheat bread slices and toast.',
      isVegetarian: false
    }
  ],
  lunch: [
    {
      name: 'Rice with Dal and Vegetables',
      calories: 400,
      protein: 18,
      carbs: 65,
      fat: 8,
      description: 'Steamed rice with lentil curry and mixed vegetables',
      instructions: '1. Boil brown or basmati rice.\n2. Pressure cook yellow lentils (toor dal) with turmeric and salt.\n3. Temper dal with ghee, cumin, and garlic. Serve alongside steamed rice and stir-fried veggies.',
      isVegetarian: true
    },
    {
      name: 'Rajma with Rice',
      calories: 380,
      protein: 20,
      carbs: 60,
      fat: 6,
      description: 'Kidney bean curry with basmati rice',
      instructions: '1. Soak kidney beans overnight and pressure cook until tender.\n2. Prepare gravy with sautéed onions, ginger-garlic, and tomato puree.\n3. Simmer rajma in gravy for 15 mins. Serve over hot basmati rice.',
      isVegetarian: true
    },
    {
      name: 'Paneer Curry with Chapati',
      calories: 420,
      protein: 22,
      carbs: 45,
      fat: 18,
      description: 'Cottage cheese curry with whole wheat bread',
      instructions: '1. Sauté onion-tomato paste with ginger, garlic, and curry spices.\n2. Add fresh paneer cubes and simmer for 5 mins.\n3. Serve warm with 2 whole wheat rotis/chapatis.',
      isVegetarian: true
    },
    {
      name: 'Chole with Bhature',
      calories: 480,
      protein: 18,
      carbs: 65,
      fat: 16,
      description: 'Chickpea curry with fried bread',
      instructions: '1. Soak chickpeas overnight and pressure cook until soft.\n2. Cook in a thick spiced tomato-onion curry base with chole masala.\n3. Serve hot with whole wheat flatbread or bhatura.',
      isVegetarian: true
    },
    {
      name: 'Sambar Rice',
      calories: 350,
      protein: 15,
      carbs: 60,
      fat: 6,
      description: 'Rice mixed with lentil and vegetable curry',
      instructions: '1. Pressure cook lentils and mixed vegetables (drumsticks, pumpkin, carrots).\n2. Add tamarind pulp and sambar powder; simmer for 10 mins.\n3. Mix with warm steamed rice and temper with mustard seeds.',
      isVegetarian: true
    },
    {
      name: 'Aloo Gobi with Roti',
      calories: 320,
      protein: 10,
      carbs: 50,
      fat: 10,
      description: 'Potato and cauliflower curry with flatbread',
      instructions: '1. Heat oil, add cumin seeds, chopped potatoes, and cauliflower florets.\n2. Sprinkle turmeric, coriander powder, and salt; cover and cook on low heat.\n3. Garnish with cilantro and serve with 2 wheat rotis.',
      isVegetarian: true
    },
    {
      name: 'Palak Paneer with Rice',
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 18,
      description: 'Spinach with cottage cheese and rice',
      instructions: '1. Blanch spinach leaves and purée into a smooth green paste.\n2. Sauté garlic, onions, add spinach puree, and cook 5 mins.\n3. Toss in paneer cubes and serve with steamed rice.',
      isVegetarian: true
    },
    {
      name: 'Chicken Curry with Roti',
      calories: 450,
      protein: 35,
      carbs: 40,
      fat: 15,
      description: 'Spiced chicken curry with whole wheat flatbread',
      instructions: '1. Sauté onions, ginger-garlic paste, tomatoes, and curry spices.\n2. Add chicken pieces and simmer for 20 mins until cooked through.\n3. Serve hot with 2 whole wheat rotis.',
      isVegetarian: false
    },
    {
      name: 'Fish Curry with Rice',
      calories: 400,
      protein: 30,
      carbs: 45,
      fat: 12,
      description: 'Bengali fish curry with steamed rice',
      instructions: '1. Marinate white fish fillet with turmeric and salt; lightly pan fry.\n2. Simmer in mustard seed, cumin, and tomato gravy for 6 mins.\n3. Serve hot over steamed white or brown rice.',
      isVegetarian: false
    },
    {
      name: 'Mutton Biryani',
      calories: 520,
      protein: 28,
      carbs: 55,
      fat: 20,
      description: 'Aromatic rice with spiced mutton',
      instructions: '1. Marinate tender mutton with yogurt and ground spices; pressure cook.\n2. Parboil basmati rice with whole spices.\n3. Layer rice and mutton, seal pot, and dum cook on low heat for 15 mins.',
      isVegetarian: false
    },
    {
      name: 'Egg Curry with Rice',
      calories: 380,
      protein: 20,
      carbs: 50,
      fat: 12,
      description: 'Boiled eggs in spiced gravy with rice',
      instructions: '1. Hard boil 2 eggs and peel.\n2. Sauté onions, garlic, tomato puree, and Indian spices.\n3. Add boiled eggs, simmer 5 mins, and serve over warm basmati rice.',
      isVegetarian: false
    }
  ],
  dinner: [
    {
      name: 'Khichdi with Curd',
      calories: 280,
      protein: 12,
      carbs: 50,
      fat: 4,
      description: 'Rice and lentil porridge with yogurt',
      instructions: '1. Wash equal parts moong dal and rice.\n2. Pressure cook with 4 cups water, turmeric, salt, and cumin for 4 whistles.\n3. Top with 1/2 tsp ghee and serve with low-fat curd.',
      isVegetarian: true
    },
    {
      name: 'Vegetable Curry with Roti',
      calories: 320,
      protein: 10,
      carbs: 45,
      fat: 12,
      description: 'Mixed vegetable curry with whole wheat bread',
      instructions: '1. Dice carrots, green beans, peas, and bell peppers.\n2. Sauté in onion-tomato gravy with coriander and Garam masala.\n3. Serve warm with 2 whole wheat rotis.',
      isVegetarian: true
    },
    {
      name: 'Dal Tadka with Rice',
      calories: 300,
      protein: 15,
      carbs: 50,
      fat: 6,
      description: 'Tempered lentil curry with rice',
      instructions: '1. Cook yellow split lentils (arhar dal) with turmeric and salt.\n2. Heat ghee in a pan, fry cumin, garlic, and red chillies; pour over dal.\n3. Serve hot with steamed rice.',
      isVegetarian: true
    },
    {
      name: 'Palak Paneer with Roti',
      calories: 380,
      protein: 18,
      carbs: 30,
      fat: 20,
      description: 'Spinach with cottage cheese and flatbread',
      instructions: '1. Purée blanched spinach with green chillies.\n2. Cook in garlic onion paste, fold in paneer cubes, and simmer 5 mins.\n3. Serve hot with 2 whole wheat rotis.',
      isVegetarian: true
    },
    {
      name: 'Moong Dal with Rice',
      calories: 260,
      protein: 14,
      carbs: 45,
      fat: 4,
      description: 'Yellow lentil curry with steamed rice',
      instructions: '1. Boil washed yellow moong dal with salt and turmeric.\n2. Temper with cumin seeds and ginger.\n3. Serve over soft steamed rice.',
      isVegetarian: true
    },
    {
      name: 'Mixed Vegetable Pulao',
      calories: 320,
      protein: 8,
      carbs: 55,
      fat: 8,
      description: 'Aromatic rice with mixed vegetables',
      instructions: '1. Sauté whole cardamom, cloves, onions, and mixed veggies in 1 tsp ghee.\n2. Add basmati rice and water; cover and cook until rice is fluffy.\n3. Serve with plain yogurt.',
      isVegetarian: true
    },
    {
      name: 'Baingan Bharta with Roti',
      calories: 280,
      protein: 8,
      carbs: 40,
      fat: 12,
      description: 'Roasted eggplant curry with flatbread',
      instructions: '1. Roast large eggplant over gas flame until skin chars. Peel and mash.\n2. Sauté garlic, onions, tomatoes, and chillies; add eggplant and spices.\n3. Cook for 8 mins and serve with whole wheat roti.',
      isVegetarian: true
    },
    {
      name: 'Egg Curry with Chapati',
      calories: 350,
      protein: 20,
      carbs: 35,
      fat: 15,
      description: 'Boiled eggs in spiced gravy with bread',
      instructions: '1. Hard boil 2 eggs and peel.\n2. Simmer in tomato-onion ginger gravy for 8 mins.\n3. Serve with 2 warm chapatis.',
      isVegetarian: false
    },
    {
      name: 'Chicken Tikka with Roti',
      calories: 380,
      protein: 32,
      carbs: 30,
      fat: 16,
      description: 'Grilled chicken pieces with flatbread',
      instructions: '1. Marinate chicken breast cubes in spiced yogurt for 30 mins.\n2. Grill on skillet or oven skewers for 10-12 mins.\n3. Serve with whole wheat roti and mint chutney.',
      isVegetarian: false
    },
    {
      name: 'Fish Fry with Rice',
      calories: 350,
      protein: 25,
      carbs: 40,
      fat: 12,
      description: 'Pan-fried fish with steamed rice',
      instructions: '1. Rub fish fillet with chilli powder, turmeric, lemon juice, and salt.\n2. Pan fry with 1 tsp oil until crisp on both sides.\n3. Serve with steamed rice and sliced lemon.',
      isVegetarian: false
    }
  ],
  snacks: [
    {
      name: 'Masala Chai with Biscuits',
      calories: 120,
      protein: 3,
      carbs: 20,
      fat: 4,
      description: 'Spiced tea with digestive biscuits',
      instructions: '1. Brew tea leaves with crushed ginger, cardamom, water, and low-fat milk.\n2. Strain into cup and serve with 2 digestive biscuits.',
      isVegetarian: true
    },
    {
      name: 'Roasted Peanuts',
      calories: 150,
      protein: 8,
      carbs: 6,
      fat: 12,
      description: 'Healthy roasted groundnuts',
      instructions: '1. Dry roast raw peanuts in a heavy pan on low heat until skin cracks.\n2. Sprinkle lightly with sea salt.',
      isVegetarian: true
    },
    {
      name: 'Fruit Chaat',
      calories: 100,
      protein: 2,
      carbs: 25,
      fat: 0,
      description: 'Mixed seasonal fruits with spices',
      instructions: '1. Dice fresh apple, papaya, and banana.\n2. Sprinkle chaat masala, black salt, and lemon juice.',
      isVegetarian: true
    },
    {
      name: 'Dhokla',
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      description: 'Steamed gram flour cake',
      instructions: '1. Mix gram flour (besan), water, lemon juice, and fruit salt into batter.\n2. Steam in plate for 15 mins. Temper with mustard seeds and chillies.',
      isVegetarian: true
    },
    {
      name: 'Samosa',
      calories: 200,
      protein: 4,
      carbs: 25,
      fat: 10,
      description: 'Air-fried/baked pastry with spiced potato filling',
      instructions: '1. Stuff whole wheat pastry cone with spiced mashed potatoes and peas.\n2. Air fry or bake at 190°C for 15 mins until golden brown.',
      isVegetarian: true
    },
    {
      name: 'Lassi',
      calories: 120,
      protein: 6,
      carbs: 18,
      fat: 3,
      description: 'Yogurt-based drink',
      instructions: '1. Blend fresh yogurt, chilled water, a pinch of cardamom, and minimal honey.\n2. Serve chilled in a tall glass.',
      isVegetarian: true
    },
    {
      name: 'Murmura Chaat',
      calories: 90,
      protein: 3,
      carbs: 18,
      fat: 2,
      description: 'Puffed rice with vegetables and chutney',
      instructions: '1. Toss puffed rice with finely chopped onion, tomato, green chillies, and cilantro.\n2. Drizzle lemon juice and mix.',
      isVegetarian: true
    },
    {
      name: 'Banana',
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
      description: 'Fresh ripe banana',
      instructions: '1. Peel fresh banana and eat as a quick natural energy snack.',
      isVegetarian: true
    },
    {
      name: 'Boiled Eggs',
      calories: 140,
      protein: 12,
      carbs: 1,
      fat: 10,
      description: 'Hard-boiled eggs with salt and pepper',
      instructions: '1. Boil eggs for 9 mins in water. Peel shells.\n2. Cut in half and sprinkle black pepper and salt.',
      isVegetarian: false
    },
    {
      name: 'Chicken Tikka Bites',
      calories: 180,
      protein: 20,
      carbs: 5,
      fat: 8,
      description: 'Grilled chicken pieces as snack',
      instructions: '1. Pan sear small marinated chicken breast cubes for 6 mins until fully cooked.\n2. Serve hot with green mint chutney.',
      isVegetarian: false
    }
  ]
};

export const generateMealPlan = (dailyCalories: number, goal: string, dietaryPreference: 'vegetarian' | 'non-vegetarian'): DayMealPlan[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealPlan: DayMealPlan[] = [];
  const isVegetarian = dietaryPreference === 'vegetarian';
  
  // Calorie distribution
  const snackCalories = Math.round(dailyCalories * 0.10);
  
  // Filter meals according to preference
  const availableBreakfasts = indianMeals.breakfast.filter(m => isVegetarian ? m.isVegetarian : true);
  const availableLunches = indianMeals.lunch.filter(m => isVegetarian ? m.isVegetarian : true);
  const availableDinners = indianMeals.dinner.filter(m => isVegetarian ? m.isVegetarian : true);
  const availableSnacks = indianMeals.snacks.filter(m => isVegetarian ? m.isVegetarian : true);

  const usedBreakfasts = new Set<string>();
  const usedLunches = new Set<string>();
  const usedDinners = new Set<string>();
  const usedSnacks = new Set<string>();

  const getUniqueMeal = (meals: Meal[], usedSet: Set<string>): Meal => {
    const remaining = meals.filter(m => !usedSet.has(m.name));
    const pool = remaining.length > 0 ? remaining : meals;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    usedSet.add(selected.name);
    return selected;
  };

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const breakfast = getUniqueMeal(availableBreakfasts, usedBreakfasts);
    const lunch = getUniqueMeal(availableLunches, usedLunches);
    const dinner = getUniqueMeal(availableDinners, usedDinners);

    // Pick 1-2 snacks avoiding exact duplicate snack names across days
    const snack = getUniqueMeal(availableSnacks, usedSnacks);
    const snacks = [snack];

    const totalCalories = breakfast.calories + lunch.calories + dinner.calories + 
                         snacks.reduce((sum, s) => sum + s.calories, 0);
    
    mealPlan.push({
      day,
      breakfast,
      lunch,
      dinner,
      snacks,
      totalCalories
    });
  }
  
  return mealPlan;
};