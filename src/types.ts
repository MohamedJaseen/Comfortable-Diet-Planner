export interface UserData {
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'weight-loss' | 'muscle-gain' | 'maintain-weight';
  dietaryPreference: 'vegetarian' | 'non-vegetarian';
}

export interface CalculationResults {
  bmi: number;
  bmr: number;
  dailyCalories: number;
  bmiCategory: string;
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  instructions?: string;
  isVegetarian: boolean;
}

export interface DayMealPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
}