import React from 'react';
import { RefreshCw, Leaf, HelpCircle } from 'lucide-react';

interface Meal {
  name: string;
  description: string;
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your AI-Generated Diet Plan</h2>
          <div className="flex items-center gap-2 mt-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600 font-medium">
              Daily Target: {Math.round(totalCalories)} kcal
            </span>
          </div>
        </div>
        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm shadow-sm"
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
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Weekly Nutrition Schedule</h3>
        <div className="space-y-8">
          {mealPlan.map((day, index) => (
            <div key={index} className="border border-gray-150 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                <h4 className="text-xl font-bold text-gray-900">{day.day}</h4>
                <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                  {Math.round(day.totalCalories)} kcal
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Breakfast */}
                <div className="bg-yellow-50/50 border border-yellow-100 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-yellow-800 text-sm uppercase tracking-wider mb-2">Breakfast</h5>
                    <p className="text-sm text-gray-800 font-bold mb-1">{day.breakfast.name}</p>
                    <p className="text-xs text-gray-600 leading-normal">{day.breakfast.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-yellow-100 grid grid-cols-5 gap-1 text-[10px] font-bold text-center text-gray-600">
                    <div>
                      <span className="block text-yellow-700">{day.breakfast.calories}</span>
                      <span>Cal</span>
                    </div>
                    <div>
                      <span className="block text-yellow-700">{day.breakfast.protein}g</span>
                      <span>Pro</span>
                    </div>
                    <div>
                      <span className="block text-yellow-700">{day.breakfast.carbs}g</span>
                      <span>Carb</span>
                    </div>
                    <div>
                      <span className="block text-yellow-700">{day.breakfast.fat}g</span>
                      <span>Fat</span>
                    </div>
                    <div>
                      <span className="block text-yellow-700">{day.breakfast.fiber}g</span>
                      <span>Fib</span>
                    </div>
                  </div>
                </div>
                
                {/* Lunch */}
                <div className="bg-green-50/50 border border-green-100 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-green-800 text-sm uppercase tracking-wider mb-2">Lunch</h5>
                    <p className="text-sm text-gray-800 font-bold mb-1">{day.lunch.name}</p>
                    <p className="text-xs text-gray-600 leading-normal">{day.lunch.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-green-100 grid grid-cols-5 gap-1 text-[10px] font-bold text-center text-gray-600">
                    <div>
                      <span className="block text-green-700">{day.lunch.calories}</span>
                      <span>Cal</span>
                    </div>
                    <div>
                      <span className="block text-green-700">{day.lunch.protein}g</span>
                      <span>Pro</span>
                    </div>
                    <div>
                      <span className="block text-green-700">{day.lunch.carbs}g</span>
                      <span>Carb</span>
                    </div>
                    <div>
                      <span className="block text-green-700">{day.lunch.fat}g</span>
                      <span>Fat</span>
                    </div>
                    <div>
                      <span className="block text-green-700">{day.lunch.fiber}g</span>
                      <span>Fib</span>
                    </div>
                  </div>
                </div>
                
                {/* Dinner */}
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-blue-800 text-sm uppercase tracking-wider mb-2">Dinner</h5>
                    <p className="text-sm text-gray-800 font-bold mb-1">{day.dinner.name}</p>
                    <p className="text-xs text-gray-600 leading-normal">{day.dinner.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-blue-100 grid grid-cols-5 gap-1 text-[10px] font-bold text-center text-gray-600">
                    <div>
                      <span className="block text-blue-700">{day.dinner.calories}</span>
                      <span>Cal</span>
                    </div>
                    <div>
                      <span className="block text-blue-700">{day.dinner.protein}g</span>
                      <span>Pro</span>
                    </div>
                    <div>
                      <span className="block text-blue-700">{day.dinner.carbs}g</span>
                      <span>Carb</span>
                    </div>
                    <div>
                      <span className="block text-blue-700">{day.dinner.fat}g</span>
                      <span>Fat</span>
                    </div>
                    <div>
                      <span className="block text-blue-700">{day.dinner.fiber}g</span>
                      <span>Fib</span>
                    </div>
                  </div>
                </div>
                
                {/* Snacks */}
                <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-xl flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-purple-800 text-sm uppercase tracking-wider mb-2">Snacks</h5>
                    {day.snacks.map((snack, snackIndex) => (
                      <div key={snackIndex} className="mb-3 last:mb-0 pb-2 last:pb-0 border-b border-purple-100/50 last:border-b-0">
                        <p className="text-sm text-gray-800 font-bold mb-1">{snack.name}</p>
                        <p className="text-xs text-gray-600 leading-normal">{snack.description}</p>
                        <div className="mt-2 grid grid-cols-5 gap-1 text-[9px] font-bold text-center text-purple-700">
                          <div>{snack.calories} C</div>
                          <div>{snack.protein}g P</div>
                          <div>{snack.carbs}g C</div>
                          <div>{snack.fat}g F</div>
                          <div>{snack.fiber}g F</div>
                        </div>
                      </div>
                    ))}
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