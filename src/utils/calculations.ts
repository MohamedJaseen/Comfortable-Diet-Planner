import { UserData, CalculationResults } from '../types';

export const calculateResults = (userData: UserData): CalculationResults => {
  // Calculate BMI
  const heightInMeters = userData.height / 100;
  const bmi = userData.weight / (heightInMeters * heightInMeters);
  
  // Determine BMI category
  let bmiCategory = '';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
  } else if (bmi < 25) {
    bmiCategory = 'Normal weight';
  } else if (bmi < 30) {
    bmiCategory = 'Overweight';
  } else {
    bmiCategory = 'Obese';
  }
  
  // Calculate BMR using Mifflin-St Jeor Formula
  let bmr = 0;
  if (userData.gender === 'male') {
    bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) + 5;
  } else {
    bmr = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) - 161;
  }
  
  // Calculate daily calorie needs based on activity level
  let activityMultiplier = 1.2; // sedentary
  if (userData.activityLevel === 'moderate') {
    activityMultiplier = 1.55;
  } else if (userData.activityLevel === 'active') {
    activityMultiplier = 1.725;
  }
  
  let dailyCalories = bmr * activityMultiplier;
  
  // Adjust calories based on goal
  if (userData.goal === 'weight-loss') {
    dailyCalories -= 500; // 500 calorie deficit for 1 lb/week loss
  } else if (userData.goal === 'muscle-gain') {
    dailyCalories += 300; // 300 calorie surplus for muscle gain
  }
  
  return {
    bmi,
    bmr,
    dailyCalories,
    bmiCategory
  };
};