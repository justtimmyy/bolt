import React, { useState } from 'react';
import { Calendar, Plus, ExternalLink, Video } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AddMeetingModal from '../Modals/AddMeetingModal';

export default function MeetingSchedule() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { meetings } = useApp();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Meeting Schedule</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Meeting</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">{meeting.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(meeting.date)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTime(meeting.time)}</span>
                  </div>
                  {meeting.description && (
                    <p className="text-xs sm:text-sm text-gray-600">{meeting.description}</p>
                  )}
                </div>
                
                {meeting.link && (
                  <a
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Join meeting"
                  >
                    <Video className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {meetings.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No upcoming meetings</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddMeetingModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}