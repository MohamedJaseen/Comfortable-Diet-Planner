import React, { useState } from 'react';
import { RefreshCw, Leaf, HelpCircle, ChefHat, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface Meal {
  name: string;
  description: string;
  instructions?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface DayPlan {
  day: string;
  totalCalories: number;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

interface ResultsProps {
  mealPlan: DayPlan[];
  explanation: string;
  totalCalories: number;
  onRegenerate: () => void;
}

const Results: React.FC<ResultsProps> = ({ mealPlan, explanation, totalCalories, onRegenerate }) => {
  const [openInstructions, setOpenInstructions] = useState<Record<string, boolean>>({});

  const toggleInstructions = (key: string) => {
    setOpenInstructions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMealCard = (meal: Meal, mealType: string, themeColor: 'yellow' | 'green' | 'blue' | 'purple', keyId: string) => {
    const isExpanded = !!openInstructions[keyId];

    const themeStyles = {
      yellow: {
        bg: 'bg-amber-50/60',
        border: 'border-amber-200',
        badge: 'text-amber-800 bg-amber-100',
        btnBg: 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900',
        textAccent: 'text-amber-700'
      },
      green: {
        bg: 'bg-emerald-50/60',
        border: 'border-emerald-200',
        badge: 'text-emerald-800 bg-emerald-100',
        btnBg: 'bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900',
        textAccent: 'text-emerald-700'
      },
      blue: {
        bg: 'bg-sky-50/60',
        border: 'border-sky-200',
        badge: 'text-sky-800 bg-sky-100',
        btnBg: 'bg-sky-100/80 hover:bg-sky-200/80 text-sky-900',
        textAccent: 'text-sky-700'
      },
      purple: {
        bg: 'bg-purple-50/60',
        border: 'border-purple-200',
        badge: 'text-purple-800 bg-purple-100',
        btnBg: 'bg-purple-100/80 hover:bg-purple-200/80 text-purple-900',
        textAccent: 'text-purple-700'
      }
    }[themeColor];

    return (
      <div className={`${themeStyles.bg} border ${themeStyles.border} p-5 rounded-xl flex flex-col justify-between shadow-xs transition-all`}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h5 className={`font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded-md ${themeStyles.badge}`}>
              {mealType}
            </h5>
          </div>
          <p className="text-base text-gray-900 font-bold mb-1 leading-snug">{meal.name}</p>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">{meal.description}</p>
          
          {/* Cooking Instructions Button */}
          {meal.instructions && (
            <div className="mt-2">
              <button
                onClick={() => toggleInstructions(keyId)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${themeStyles.btnBg}`}
              >
                <span className="flex items-center gap-1.5">
                  <ChefHat className="h-3.5 w-3.5" />
                  {isExpanded ? 'Hide Recipe Instructions' : 'View Cooking Instructions'}
                </span>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {isExpanded && (
                <div className="mt-2 p-3 bg-white/90 border border-gray-200 rounded-lg text-xs text-gray-700 leading-relaxed shadow-inner space-y-1.5 animate-fadeIn">
                  <div className="font-semibold text-gray-900 flex items-center gap-1 mb-1 border-b pb-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Preparation & Cooking Steps:
                  </div>
                  {meal.instructions.split('\n').map((step, idx) => (
                    <p key={idx} className="text-gray-700">
                      {step}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nutritional Macros */}
        <div className={`mt-4 pt-3 border-t ${themeStyles.border} grid grid-cols-5 gap-1 text-[10px] font-bold text-center text-gray-600`}>
          <div>
            <span className={`block ${themeStyles.textAccent}`}>{meal.calories}</span>
            <span>Cal</span>
          </div>
          <div>
            <span className={`block ${themeStyles.textAccent}`}>{meal.protein}g</span>
            <span>Pro</span>
          </div>
          <div>
            <span className={`block ${themeStyles.textAccent}`}>{meal.carbs}g</span>
            <span>Carb</span>
          </div>
          <div>
            <span className={`block ${themeStyles.textAccent}`}>{meal.fat}g</span>
            <span>Fat</span>
          </div>
          <div>
            <span className={`block ${themeStyles.textAccent}`}>{meal.fiber || 2}g</span>
            <span>Fib</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Unique Weekly Diet Plan</h2>
          <div className="flex items-center gap-2 mt-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600 font-medium">
              Daily Target: {Math.round(totalCalories)} kcal (Unique Meals Every Day)
            </span>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm shadow-sm cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Plan
        </button>
      </div>

      {/* AI Explanation Box */}
      {explanation && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-green-800 text-lg flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5" />
            Why this plan was generated
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {explanation}
          </p>
        </div>
      )}

      {/* 7 Day Meal Plan list */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Your 7-Day Custom Nutrition Schedule</h3>
          <span className="text-xs font-semibold text-green-800 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" /> Includes Step-by-Step Recipes
          </span>
        </div>

        <div className="space-y-8">
          {mealPlan.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-b from-white to-gray-50/50">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {dayIndex + 1}
                  </span>
                  <h4 className="text-xl font-bold text-gray-900">{day.day}</h4>
                </div>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3.5 py-1.5 rounded-full border border-green-200">
                  {Math.round(day.totalCalories)} kcal
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Breakfast */}
                {renderMealCard(day.breakfast, 'Breakfast', 'yellow', `${dayIndex}-breakfast`)}

                {/* Lunch */}
                {renderMealCard(day.lunch, 'Lunch', 'green', `${dayIndex}-lunch`)}

                {/* Dinner */}
                {renderMealCard(day.dinner, 'Dinner', 'blue', `${dayIndex}-dinner`)}

                {/* Snacks */}
                <div className="bg-purple-50/60 border border-purple-200 p-5 rounded-xl flex flex-col justify-between shadow-xs">
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider mb-3 px-2 py-0.5 rounded-md text-purple-800 bg-purple-100 inline-block">
                      Snacks
                    </h5>
                    {day.snacks.map((snack, snackIndex) => {
                      const snackKey = `${dayIndex}-snack-${snackIndex}`;
                      const isSnackExpanded = !!openInstructions[snackKey];

                      return (
                        <div key={snackIndex} className="mb-4 last:mb-0 pb-3 last:pb-0 border-b border-purple-200/60 last:border-b-0">
                          <p className="text-sm text-gray-900 font-bold mb-0.5">{snack.name}</p>
                          <p className="text-xs text-gray-600 leading-normal mb-2">{snack.description}</p>
                          
                          {/* Cooking / prep instructions for snack */}
                          {snack.instructions && (
                            <div className="mb-2">
                              <button
                                onClick={() => toggleInstructions(snackKey)}
                                className="w-full flex items-center justify-between px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-100/80 hover:bg-purple-200 text-purple-900 transition-all"
                              >
                                <span className="flex items-center gap-1">
                                  <ChefHat className="h-3 w-3" />
                                  {isSnackExpanded ? 'Hide Prep' : 'View Prep Steps'}
                                </span>
                                {isSnackExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              </button>

                              {isSnackExpanded && (
                                <div className="mt-1.5 p-2.5 bg-white border border-purple-200 rounded-md text-[11px] text-gray-700 leading-relaxed shadow-inner">
                                  {snack.instructions.split('\n').map((step, idx) => (
                                    <p key={idx}>{step}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-5 gap-1 text-[9px] font-bold text-center text-purple-800 bg-purple-100/50 p-1.5 rounded-md">
                            <div>{snack.calories} C</div>
                            <div>{snack.protein}g P</div>
                            <div>{snack.carbs}g C</div>
                            <div>{snack.fat}g F</div>
                            <div>{snack.fiber || 1}g Fib</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;