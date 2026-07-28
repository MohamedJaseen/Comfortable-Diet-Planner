import React, { useState, useEffect } from 'react';
import { User, Scale, Ruler, Activity, Target, Leaf, Save, Calculator, ShieldAlert, Award } from 'lucide-react';
import api from '../utils/api';

interface ProfileData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bmi?: number;
  bmr?: number;
  tdee?: number;
  dailyCalories?: number;
}

const ProfileManagement: React.FC = () => {
  const [formData, setFormData] = useState<ProfileData>({
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'moderate',
    goal: 'maintain-weight',
    foodPreference: 'vegetarian',
    allergies: '',
    medicalConditions: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/profile');
      if (response.data && response.data.age) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ProfileData, string>> = {};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const response = await api.post('/profile', formData);
      setFormData(response.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIBg = (bmi: number) => {
    if (bmi < 18.5) return 'bg-blue-50 border-blue-200';
    if (bmi < 25) return 'bg-green-50 border-green-200';
    if (bmi < 30) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile & Health Metrics</h2>
        <p className="text-gray-600">Manage your body stats, diet preferences, and view your energy needs</p>
      </div>

      {formData.bmi && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-2xl border-2 ${getBMIBg(formData.bmi)}`}>
            <div className="flex items-center gap-3 mb-2">
              <Calculator className={`h-5 w-5 ${getBMIColor(formData.bmi)}`} />
              <h3 className="font-semibold text-gray-900">BMI</h3>
            </div>
            <div className={`text-2xl font-bold ${getBMIColor(formData.bmi)}`}>
              {formData.bmi.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Healthy: 18.5 - 24.9</p>
          </div>

          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">BMR</h3>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(formData.bmr || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">kcal/day at rest</p>
          </div>

          <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">TDEE</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(formData.tdee || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Total daily energy burned</p>
          </div>

          <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Daily Calories</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(formData.dailyCalories || 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Target for your goal</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Profile saved and health metrics computed successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1 text-gray-400" />
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
              <Ruler className="inline h-4 w-4 mr-1 text-gray-400" />
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
              <Scale className="inline h-4 w-4 mr-1 text-gray-400" />
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
            <Leaf className="inline h-4 w-4 mr-1 text-gray-400" />
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
                  name="foodPreference"
                  value={option.value}
                  checked={formData.foodPreference === option.value}
                  onChange={(e) => handleInputChange('foodPreference', e.target.value)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.foodPreference === option.value 
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
            <Activity className="inline h-4 w-4 mr-1 text-gray-400" />
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
                  <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Target className="inline h-4 w-4 mr-1 text-gray-400" />
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
                  <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShieldAlert className="inline h-4 w-4 mr-1 text-gray-400" />
              Allergies
            </label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. peanuts, dairy, gluten (or none)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShieldAlert className="inline h-4 w-4 mr-1 text-gray-400" />
              Medical Conditions
            </label>
            <input
              type="text"
              value={formData.medicalConditions}
              onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. diabetes, hypertension, thyroid (or none)"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving Profile...' : 'Save Profile & Update Metrics'}
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;
