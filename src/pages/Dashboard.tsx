import React from 'react';
import { useApp } from '../contexts/AppContext';
import MetricsCards from '../components/Dashboard/MetricsCards';
import RecentActivity from '../components/Dashboard/RecentActivity';
import MeetingSchedule from '../components/Dashboard/MeetingSchedule';

type ViewType = 'dashboard' | 'kanban' | 'calendar' | 'commitments' | 'notifications' | 'users';

interface DashboardProps {
  onNavigate: (view: ViewType) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Overview of your workspace activities and metrics</p>
      </div>

      <MetricsCards onNavigate={onNavigate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RecentActivity />
        <MeetingSchedule />
      </div>
    </div>
  );
}