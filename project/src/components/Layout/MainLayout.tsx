import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../../pages/Dashboard';
import KanbanBoard from '../../pages/KanbanBoard';
import CalendarView from '../../pages/CalendarView';
import UserManagement from '../../pages/UserManagement';
import Commitments from '../../pages/Commitments';
import TaskDetailPage from '../../pages/TaskDetailPage';
import AIAssistant from '../AIAssistant/AIAssistant';

type ViewType = 'dashboard' | 'workspace' | 'calendar' | 'commitments' | 'users';

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const renderCurrentView = () => {
    if (selectedTaskId) {
      return (
        <TaskDetailPage 
          taskId={selectedTaskId} 
          onBack={() => setSelectedTaskId(null)}
          onEdit={() => {
            // Handle edit - could open task modal
            setSelectedTaskId(null);
          }}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'workspace':
        return <KanbanBoard onTaskClick={setSelectedTaskId} />;
      case 'calendar':
        return <CalendarView />;
      case 'commitments':
        return <Commitments />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="flex-1 flex flex-col">
        <Header onToggleAI={() => setShowAIAssistant(!showAIAssistant)} />
        
        <main className="flex-1 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>

      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  );
}