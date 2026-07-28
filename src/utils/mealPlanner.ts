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
      isVegetarian: true
    },
    {
      name: 'Idli with Sambar',
      calories: 200,
      protein: 10,
      carbs: 35,
      fat: 2,
      description: 'Steamed rice cakes with lentil curry',
      isVegetarian: true
    },
    {
      name: 'Upma with Vegetables',
      calories: 220,
      protein: 6,
      carbs: 40,
      fat: 5,
      description: 'Semolina porridge with mixed vegetables',
      isVegetarian: true
    },
    {
      name: 'Paratha with Curd',
      calories: 300,
      protein: 12,
      carbs: 35,
      fat: 12,
      description: 'Stuffed flatbread with yogurt',
      isVegetarian: true
    },
    {
      name: 'Dosa with Coconut Chutney',
      calories: 180,
      protein: 8,
      carbs: 28,
      fat: 4,
      description: 'Crispy rice and lentil crepe with chutney',
      isVegetarian: true
    },
    {
      name: 'Oats Upma',
      calories: 200,
      protein: 8,
      carbs: 30,
      fat: 6,
      description: 'Healthy oats cooked with vegetables and spices',
      isVegetarian: true
    },
    {
      name: 'Besan Chilla',
      calories: 180,
      protein: 12,
      carbs: 20,
      fat: 6,
      description: 'Gram flour pancake with vegetables',
      isVegetarian: true
    },
    {
      name: 'Egg Paratha',
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 14,
      description: 'Flatbread stuffed with scrambled eggs',
      isVegetarian: false
    },
    {
      name: 'Chicken Sandwich',
      calories: 280,
      protein: 22,
      carbs: 25,
      fat: 12,
      description: 'Grilled chicken sandwich with vegetables',
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
      isVegetarian: true
    },
    {
      name: 'Rajma with Rice',
      calories: 380,
      protein: 20,
      carbs: 60,
      fat: 6,
      description: 'Kidney bean curry with basmati rice',
      isVegetarian: true
    },
    {
      name: 'Paneer Curry with Chapati',
      calories: 420,
      protein: 22,
      carbs: 45,
      fat: 18,
      description: 'Cottage cheese curry with whole wheat bread',
      isVegetarian: true
    },
    {
      name: 'Chole with Bhature',
      calories: 480,
      protein: 18,
      carbs: 65,
      fat: 16,
      description: 'Chickpea curry with fried bread',
      isVegetarian: true
    },
    {
      name: 'Sambar Rice',
      calories: 350,
      protein: 15,
      carbs: 60,
      fat: 6,
      description: 'Rice mixed with lentil and vegetable curry',
      isVegetarian: true
    },
    {
      name: 'Aloo Gobi with Roti',
      calories: 320,
      protein: 10,
      carbs: 50,
      fat: 10,
      description: 'Potato and cauliflower curry with flatbread',
      isVegetarian: true
    },
    {
      name: 'Palak Paneer with Rice',
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 18,
      description: 'Spinach with cottage cheese and rice',
      isVegetarian: true
    },
    {
      name: 'Chicken Curry with Roti',
      calories: 450,
      protein: 35,
      carbs: 40,
      fat: 15,
      description: 'Spiced chicken curry with whole wheat flatbread',
      isVegetarian: false
    },
    {
      name: 'Fish Curry with Rice',
      calories: 400,
      protein: 30,
      carbs: 45,
      fat: 12,
      description: 'Bengali fish curry with steamed rice',
      isVegetarian: false
    },
    {
      name: 'Mutton Biryani',
      calories: 520,
      protein: 28,
      carbs: 55,
      fat: 20,
      description: 'Aromatic rice with spiced mutton',
      isVegetarian: false
    },
    {
      name: 'Egg Curry with Rice',
      calories: 380,
      protein: 20,
      carbs: 50,
      fat: 12,
      description: 'Boiled eggs in spiced gravy with rice',
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
      isVegetarian: true
    },
    {
      name: 'Vegetable Curry with Roti',
      calories: 320,
      protein: 10,
      carbs: 45,
      fat: 12,
      description: 'Mixed vegetable curry with whole wheat bread',
      isVegetarian: true
    },
    {
      name: 'Dal Tadka with Rice',
      calories: 300,
      protein: 15,
      carbs: 50,
      fat: 6,
      description: 'Tempered lentil curry with rice',
      isVegetarian: true
    },
    {
      name: 'Palak Paneer with Roti',
      calories: 380,
      protein: 18,
      carbs: 30,
      fat: 20,
      description: 'Spinach with cottage cheese and flatbread',
      isVegetarian: true
    },
    {
      name: 'Moong Dal with Rice',
      calories: 260,
      protein: 14,
      carbs: 45,
      fat: 4,
      description: 'Yellow lentil curry with steamed rice',
      isVegetarian: true
    },
    {
      name: 'Mixed Vegetable Pulao',
      calories: 320,
      protein: 8,
      carbs: 55,
      fat: 8,
      description: 'Aromatic rice with mixed vegetables',
      isVegetarian: true
    },
    {
      name: 'Baingan Bharta with Roti',
      calories: 280,
      protein: 8,
      carbs: 40,
      fat: 12,
      description: 'Roasted eggplant curry with flatbread',
      isVegetarian: true
    },
    {
      name: 'Egg Curry with Chapati',
      calories: 350,
      protein: 20,
      carbs: 35,
      fat: 15,
      description: 'Boiled eggs in spiced gravy with bread',
      isVegetarian: false
    },
    {
      name: 'Chicken Tikka with Roti',
      calories: 380,
      protein: 32,
      carbs: 30,
      fat: 16,
      description: 'Grilled chicken pieces with flatbread',
      isVegetarian: false
    },
    {
      name: 'Fish Fry with Rice',
      calories: 350,
      protein: 25,
      carbs: 40,
      fat: 12,
      description: 'Pan-fried fish with steamed rice',
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
      isVegetarian: true
    },
    {
      name: 'Roasted Peanuts',
      calories: 150,
      protein: 8,
      carbs: 6,
      fat: 12,
      description: 'Healthy roasted groundnuts',
      isVegetarian: true
    },
    {
      name: 'Fruit Chaat',
      calories: 100,
      protein: 2,
      carbs: 25,
      fat: 0,
      description: 'Mixed seasonal fruits with spices',
      isVegetarian: true
    },
    {
      name: 'Dhokla',
      calories: 80,
      protein: 4,
      carbs: 15,
      fat: 1,
      description: 'Steamed gram flour cake',
      isVegetarian: true
    },
    {
      name: 'Samosa',
      calories: 200,
      protein: 4,
      carbs: 25,
      fat: 10,
      description: 'Deep-fried pastry with potato filling',
      isVegetarian: true
    },
    {
      name: 'Lassi',
      calories: 120,
      protein: 6,
      carbs: 18,
      fat: 3,
      description: 'Yogurt-based drink',
      isVegetarian: true
    },
    {
      name: 'Murmura Chaat',
      calories: 90,
      protein: 3,
      carbs: 18,
      fat: 2,
      description: 'Puffed rice with vegetables and chutney',
      isVegetarian: true
    },
    {
      name: 'Banana',
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0,
      description: 'Fresh ripe banana',
      isVegetarian: true
    },
    {
      name: 'Boiled Eggs',
      calories: 140,
      protein: 12,
      carbs: 1,
      fat: 10,
      description: 'Hard-boiled eggs with salt and pepper',
      isVegetarian: false
    },
    {
      name: 'Chicken Tikka Bites',
      calories: 180,
      protein: 20,
      carbs: 5,
      fat: 8,
      description: 'Grilled chicken pieces as snack',
      isVegetarian: false
    }
  ]
};

const getRandomMeal = (mealType: keyof typeof indianMeals, isVegetarian: boolean): Meal => {
  const meals = indianMeals[mealType].filter(meal => 
    isVegetarian ? meal.isVegetarian : true
  );
  return meals[Math.floor(Math.random() * meals.length)];
};

const getRandomSnacks = (targetCalories: number, isVegetarian: boolean): Meal[] => {
  const availableSnacks = indianMeals.snacks.filter(snack => 
    isVegetarian ? snack.isVegetarian : true
  );
  
  const snacks = [];
  let totalCalories = 0;
  
  while (totalCalories < targetCalories && snacks.length < 3) {
    const snack = availableSnacks[Math.floor(Math.random() * availableSnacks.length)];
    if (totalCalories + snack.calories <= targetCalories + 50) {
      snacks.push(snack);
      totalCalories += snack.calories;
    } else {
      break;
    }
  }
  
  return snacks.length > 0 ? snacks : [availableSnacks[0]];
};

export const generateMealPlan = (dailyCalories: number, goal: string, dietaryPreference: 'vegetarian' | 'non-vegetarian'): DayMealPlan[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealPlan: DayMealPlan[] = [];
  const isVegetarian = dietaryPreference === 'vegetarian';
  
  // Calorie distribution
  const breakfastCalories = Math.round(dailyCalories * 0.25);
  const lunchCalories = Math.round(dailyCalories * 0.35);
  const dinnerCalories = Math.round(dailyCalories * 0.30);
  const snackCalories = Math.round(dailyCalories * 0.10);
  
  for (const day of days) {
    const breakfast = getRandomMeal('breakfast', isVegetarian);
    const lunch = getRandomMeal('lunch', isVegetarian);
    const dinner = getRandomMeal('dinner', isVegetarian);
    const snacks = getRandomSnacks(snackCalories, isVegetarian);
    
    const totalCalories = breakfast.calories + lunch.calories + dinner.calories + 
                         snacks.reduce((sum, snack) => sum + snack.calories, 0);
    
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