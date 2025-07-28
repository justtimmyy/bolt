import React, { useState } from 'react';
import { Bot, Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationDropdown } from '../Notifications/NotificationDropdown';

interface HeaderProps {
  onToggleAI: () => void;
}

export default function Header({ onToggleAI }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { workspaces, currentWorkspace, notifications } = useApp();
  const { user, logout, updateProfile } = useAuth();
  
  const workspace = workspaces.find(w => w.id === currentWorkspace);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: 'bg-primary-100 text-primary-800',
      'Scrum Master': 'bg-accent-100 text-accent-800',
      Developer: 'bg-green-100 text-green-800',
      Tester: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || colors.Developer;
  };

  const handleProfileUpdate = () => {
    // Simulate profile update
    console.log('Profile update clicked');
    setShowUserMenu(false);
  };

  const handlePreferences = () => {
    // Simulate preferences
    console.log('Preferences clicked');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent truncate">
              {workspace?.name || 'Select Workspace'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">
              {workspace?.description || 'Choose a workspace to get started'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks, members..."
              className="w-32 sm:w-48 lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Mobile Search */}
          <button className="sm:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* AI Assistant Toggle */}
          <button
            onClick={onToggleAI}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative group"
            title="AI Assistant"
          >
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-lg font-semibold text-white">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleBadgeColor(user?.role || '')}`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={handleProfileUpdate}
                    className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-700">Profile Settings</span>
                  </button>
                  
                  <button 
                    onClick={handlePreferences}
                    className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-700">Preferences</span>
                  </button>

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileSearch(false)}
        />
      )}
    </header>
  );
}