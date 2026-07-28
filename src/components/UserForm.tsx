import React, { useState } from 'react';
import { UserData } from '../types';
import { User, Scale, Ruler, Activity, Target, Leaf } from 'lucide-react';

interface UserFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'moderate',
    goal: 'maintain-weight',
    dietaryPreference: 'vegetarian'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};

    if (formData.age < 15 || formData.age > 100) {
      newErrors.age = 'Age must be between 15 and 100';
    }
    if (formData.height < 120 || formData.height > 250) {
      newErrors.height = 'Height must be between 120 and 250 cm';
    }
    if (formData.weight < 30 || formData.weight > 200) {
      newErrors.weight = 'Weight must be between 30 and 200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Plan Your Perfect Diet</h2>
        <p className="text-gray-600">Tell us about yourself to get personalized meal recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.age ? 'border-red-300' : 'border-gray-300'
              }`}
              min="15"
              max="100"
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="inline h-4 w-4 mr-1" />
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.height ? 'border-red-300' : 'border-gray-300'
              }`}
              min="120"
              max="250"
            />
            {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Scale className="inline h-4 w-4 mr-1" />
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.weight ? 'border-red-300' : 'border-gray-300'
              }`}
              min="30"
              max="200"
            />
            {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Leaf className="inline h-4 w-4 mr-1" />
            Dietary Preference
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'vegetarian', label: 'Vegetarian', desc: 'Plant-based meals only', icon: '🌱' },
              { value: 'non-vegetarian', label: 'Non-Vegetarian', desc: 'Includes meat, fish & eggs', icon: '🍗' }
            ].map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="dietaryPreference"
                  value={option.value}
                  checked={formData.dietaryPreference === option.value}
                  onChange={(e) => handleInputChange('dietaryPreference', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.dietaryPreference === option.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Activity className="inline h-4 w-4 mr-1" />
            Activity Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
              { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-4 times/week' },
              { value: 'active', label: 'Active', desc: 'Exercise 5+ times/week' }
            ].map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="activityLevel"
                  value={option.value}
                  checked={formData.activityLevel === option.value}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.activityLevel === option.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Target className="inline h-4 w-4 mr-1" />
            Diet Goal
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'weight-loss', label: 'Weight Loss', desc: 'Lose weight safely' },
              { value: 'muscle-gain', label: 'Muscle Gain', desc: 'Build muscle mass' },
              { value: 'maintain-weight', label: 'Maintain Weight', desc: 'Stay at current weight' }
            ].map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  value={option.value}
                  checked={formData.goal === option.value}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.goal === option.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-300'
                }`}>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? 'Generating Your Plan...' : 'Create My Diet Plan'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;