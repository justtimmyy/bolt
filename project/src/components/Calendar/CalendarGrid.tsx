import React from 'react';
import { useApp } from '../../contexts/AppContext';

interface CalendarGridProps {
  viewMode: 'month' | 'week' | 'day';
  currentDate: Date;
  tasks: any[];
  onDateClick: (date: string) => void;
  onTaskClick: (task: any) => void;
}

export default function CalendarGrid({ 
  viewMode, 
  currentDate, 
  tasks, 
  onDateClick, 
  onTaskClick 
}: CalendarGridProps) {
  const { teamMembers } = useApp();

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.dueDate === date);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekdays.map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-900">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const isCurrentMonth = day.getMonth() === month;
            const isToday = dateStr === today;
            const dayTasks = getTasksForDate(dateStr);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => onDateClick(dateStr)}
              >
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map(task => {
                    const assignee = teamMembers.find(m => m.id === task.assigneeId);
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                        className={`text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm transition-shadow ${
                          task.status === 'Done' ? 'bg-green-100 text-green-800' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                        title={`${task.title} - ${assignee?.name || 'Unassigned'}`}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const isToday = dateStr === today;
            const dayTasks = getTasksForDate(dateStr);

            return (
              <div key={index} className="border-r border-gray-200 last:border-r-0">
                <div className={`p-4 border-b border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">{weekdays[index]}</div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-4 min-h-[400px] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onDateClick(dateStr)}
                >
                  <div className="space-y-2">
                    {dayTasks.map(task => {
                      const assignee = teamMembers.find(m => m.id === task.assigneeId);
                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                          }}
                          className={`text-sm p-2 rounded cursor-pointer hover:shadow-sm transition-shadow ${
                            task.status === 'Done' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <div className="font-medium truncate">{task.title}</div>
                          <div className="text-xs opacity-75">{assignee?.name || 'Unassigned'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayTasks = getTasksForDate(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const isToday = dateStr === today;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className={`p-6 border-b border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
            </h3>
            <div className={`text-3xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {currentDate.getDate()}
            </div>
          </div>
        </div>

        <div 
          className="p-6 min-h-[500px] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onDateClick(dateStr)}
        >
          {dayTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No tasks scheduled</div>
              <div className="text-gray-500">Click to add a task</div>
            </div>
          ) : (
            <div className="space-y-4">
              {dayTasks.map(task => {
                const assignee = teamMembers.find(m => m.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    className={`p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                      task.status === 'Done' ? 'bg-green-100 border-l-4 border-green-500' :
                      task.status === 'In Progress' ? 'bg-blue-100 border-l-4 border-blue-500' :
                      'bg-gray-100 border-l-4 border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'Done' ? 'bg-green-200 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      Assigned to: {assignee?.name || 'Unassigned'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  switch (viewMode) {
    case 'week':
      return renderWeekView();
    case 'day':
      return renderDayView();
    default:
      return renderMonthView();
  }
}