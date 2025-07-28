import React from 'react';
import { 
  Briefcase, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  Users 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

type ViewType = 'dashboard' | 'kanban' | 'calendar' | 'commitments' | 'notifications' | 'users';

interface MetricsCardsProps {
  onNavigate: (view: ViewType, filter?: string) => void;
}

export default function MetricsCards({ onNavigate }: MetricsCardsProps) {
  const { getMetrics } = useApp();
  const metrics = getMetrics();

  const cards = [
    {
      title: 'Active Workspaces',
      value: metrics.activeWorkspaces,
      icon: Briefcase,
      color: 'blue',
      onClick: () => onNavigate('dashboard', 'active'),
    },
    {
      title: 'Total Workspaces',
      value: metrics.totalWorkspaces,
      icon: FolderOpen,
      color: 'emerald',
      onClick: () => onNavigate('dashboard', 'all'),
    },
    {
      title: 'Completed Tasks',
      value: metrics.completedTasks,
      icon: CheckCircle,
      color: 'green',
      onClick: () => onNavigate('kanban', 'done'),
    },
    {
      title: 'In Progress',
      value: metrics.inProgressTasks,
      icon: Clock,
      color: 'yellow',
      onClick: () => onNavigate('kanban', 'in-progress'),
    },
    {
      title: 'Team Members',
      value: metrics.teamMembers,
      icon: Users,
      color: 'purple',
      onClick: () => onNavigate('users'),
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <button
            key={index}
            onClick={card.onClick}
            className={`${getColorClasses(card.color)} p-3 sm:p-4 lg:p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-left group`}
          >
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform" />
              <span className="text-lg sm:text-xl lg:text-3xl font-bold">{card.value}</span>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm lg:text-base">{card.title}</h3>
          </button>
        );
      })}
    </div>
  );
}