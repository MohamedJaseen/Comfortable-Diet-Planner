import React, { useState } from 'react';
import { LogOut, User, Sparkles, MessageSquare } from 'lucide-react';
import ProfileManagement from './ProfileManagement';
import AiChatbot from './AiChatbot';
import Results from './Results';
import api from '../utils/api';

interface DietPlannerProps {
  onLogout: () => void;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'diet' | 'chat'>('profile');
  const [aiMealPlan, setAiMealPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateAiDiet = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setAiMealPlan(null);
    try {
      const response = await api.get('/diet/recommend');
      // The backend returns a JSON string, which might need parsing if it was returned as a raw string or object.
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      setAiMealPlan(data);
    } catch (error: any) {
      console.error('Error generating AI diet:', error);
      const msg = error.response?.data?.message || 'Failed to generate AI recommendation. Make sure your profile is completed.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🌱 Comfortable Diet Planner
            </h1>
            
            {/* Navigation Tabs */}
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="h-4 w-4" />
                Profile & Stats
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('diet');
                  if (!aiMealPlan) {
                    generateAiDiet();
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'diet'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Meal Planner
              </button>
              
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'chat'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                AI Chatbot
              </button>
            </nav>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'profile' && <ProfileManagement />}
        
        {activeTab === 'chat' && <AiChatbot />}
        
        {activeTab === 'diet' && (
          <div className="space-y-6">
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Gemini is structuring your personalized meal plan...</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-sm">
                <p className="font-semibold mb-3">{errorMsg}</p>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Configure Profile
                </button>
              </div>
            )}

            {!isLoading && !errorMsg && aiMealPlan && (
              <Results
                mealPlan={aiMealPlan.days}
                explanation={aiMealPlan.explanation}
                totalCalories={aiMealPlan.totalCalories}
                onRegenerate={generateAiDiet}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DietPlanner;