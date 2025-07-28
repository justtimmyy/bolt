import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: 'bg-purple-100 text-purple-800',
      'Scrum Master': 'bg-blue-100 text-blue-800',
      Developer: 'bg-green-100 text-green-800',
      Tester: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || colors.Developer;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">
            {user?.name?.charAt(0)}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Profile Settings</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Preferences</span>
            </button>

            {(user?.role === 'Admin' || user?.role === 'Scrum Master') && (
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Admin Panel</span>
              </button>
            )}

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}