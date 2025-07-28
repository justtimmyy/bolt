import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Users, 
  Briefcase,
  Plus,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

type ViewType = 'dashboard' | 'workspace' | 'calendar' | 'commitments' | 'users';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const { workspaces, currentWorkspace, setCurrentWorkspace, addWorkspace } = useApp();
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const isAdmin = user?.role === 'Admin' || user?.role === 'Scrum Master';

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      addWorkspace({
        name: newWorkspaceName,
        description: `${newWorkspaceName} workspace`,
        isActive: true,
        memberIds: [user?.id || '']
      });
      setNewWorkspaceName('');
      setShowCreateWorkspace(false);
    }
  };

  const handleWorkspaceClick = (workspaceId: string) => {
    setCurrentWorkspace(workspaceId);
    onNavigate('workspace');
  };

  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard', color: 'text-primary-400' },
    { id: 'calendar' as ViewType, icon: Calendar, label: 'Calendar', color: 'text-accent-400' },
    { id: 'commitments' as ViewType, icon: Target, label: 'Commitments', color: 'text-primary-300' },
    ...(isAdmin ? [{ id: 'users' as ViewType, icon: Users, label: 'Team Management', color: 'text-accent-300' }] : [])
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TaskFlow</h1>
            <p className="text-sm text-gray-400">Project Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-3">Navigation</h3>
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.color
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Workspaces Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Workspaces</h3>
            {isAdmin && (
              <button 
                onClick={() => setShowCreateWorkspace(true)}
                className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                title="Create Workspace"
              >
                <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Create Workspace Form */}
          {showCreateWorkspace && (
            <div className="mb-3 px-3">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="Workspace name..."
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                  autoFocus
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleCreateWorkspace}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-3 py-1 rounded text-sm hover:from-primary-700 hover:to-accent-700 transition-all"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateWorkspace(false);
                      setNewWorkspaceName('');
                    }}
                    className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {workspaces.map(workspace => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                  currentWorkspace === workspace.id && currentView === 'workspace'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      workspace.isActive ? 'bg-accent-400' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{workspace.name}</p>
                      <p className="text-xs opacity-75 truncate">{workspace.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}