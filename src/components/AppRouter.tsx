import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import MainLayout from './Layout/MainLayout';

export default function AppRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MainLayout />;
}