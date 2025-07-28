import React, { useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function RecentActivity() {
  const [newActivity, setNewActivity] = useState('');
  const { activities, addActivity } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      addActivity(newActivity);
      setNewActivity('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Add custom activity..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newActivity.trim()}
            className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{activity.author}</span>
                <span className="mx-2">•</span>
                <span>{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}