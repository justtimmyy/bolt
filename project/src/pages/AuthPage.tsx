import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import FirstTimeSetup from '../components/Auth/FirstTimeSetup';

type AuthView = 'login' | 'forgot' | 'firstTime';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const { user, clearError } = useAuth();

  // If user exists and it's first login, show setup
  if (user && user.isFirstLogin) {
    return <FirstTimeSetup />;
  }

  // Clear any errors when switching views
  const handleViewChange = (view: AuthView) => {
    clearError();
    setCurrentView(view);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to TaskFlow</h1>
          <p className="text-gray-600">
            {currentView === 'login' && 'Sign in to your account'}
            {currentView === 'forgot' && 'Reset your password'}
          </p>
        </div>

        {/* Auth Forms */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentView === 'login' && (
            <LoginForm onForgotPassword={() => handleViewChange('forgot')} />
          )}
          {currentView === 'forgot' && (
            <ForgotPasswordForm onBackToLogin={() => handleViewChange('login')} />
          )}
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <h4 className="font-semibold mb-2">Demo Credentials:</h4>
          <div className="space-y-1">
            <div>Admin: admin@example.com / password</div>
            <div>Scrum Master: scrum@example.com / password</div>
            <div>Developer: dev@example.com / password</div>
          </div>
          <p className="text-xs text-blue-600 mt-2 italic">
            Note: Use "dev@example.com" to test first-time login flow
          </p>
        </div>
      </div>
    </div>
  );
}