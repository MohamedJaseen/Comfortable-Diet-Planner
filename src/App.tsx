import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import DietPlanner from './components/DietPlanner';

function AppContent() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    if (token && name && email && role) {
      setIsLoggedIn(true);
      setUser({ name, email, role });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogin = (token: string, name: string, email: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    setIsLoggedIn(true);
    setUser({ name, email, role });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onLogin={handleLogin}
                onNavigateToRegister={() => navigate('/register')}
                onNavigateToForgotPassword={() => navigate('/forgot-password')}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register
                onBackToLogin={() => navigate('/login')}
                onRegisterSuccess={() => {
                  alert('Registration successful! Please login.');
                  navigate('/login');
                }}
              />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPassword onBackToLogin={() => navigate('/login')} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DietPlanner onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Redirect empty paths to login or dashboard */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;