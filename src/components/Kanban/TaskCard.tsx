import React from 'react';
import { Clock, User, Calendar, Edit2, Trash2, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useApp } from '../../contexts/AppContext';

interface TaskCardProps {
  task: any;
  onEdit: () => void;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { teamMembers, deleteTask } = useApp();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const assignee = teamMembers.find(member => member.id === task.assigneeId);

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(task.dueDate);
  const isOverdue = daysRemaining < 0;
  const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0;

  const completedSubtasks = task.subtasks.filter((st: any) => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  const getStatusColor = () => {
    if (isOverdue) return 'border-l-red-400 bg-red-50';
    if (isDueSoon) return 'border-l-yellow-400 bg-yellow-50';
    return 'border-l-blue-400 bg-blue-50';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleMemberClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open member profile or filter by member
    console.log('Member clicked:', assignee);
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getStatusColor()} p-4 hover:shadow-md transition-all duration-200 group cursor-pointer relative ${
        isDragging ? 'rotate-3 scale-105 shadow-xl' : ''
      }`}
      onClick={onEdit}
    >
      {/* Task Header with Inline Edit */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1 transition-opacity touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              defaultValue={task.title}
              className="w-full font-medium text-gray-900 text-sm bg-transparent border-none outline-none p-0 focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded transition-all"
              onBlur={(e) => {
                // Handle title update here
                console.log('Title updated:', e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-primary-600 rounded hover:bg-primary-50 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editable Description */}
      {task.description && (
        <div className="mb-3">
          <textarea
            defaultValue={task.description}
            className="w-full text-xs text-gray-600 bg-transparent border-none outline-none resize-none focus:bg-gray-50 focus:px-2 focus:py-1 focus:rounded transition-all"
            rows={2}
            onBlur={(e) => {
              // Handle description update here
              console.log('Description updated:', e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Priority Badge - Editable */}
      {task.priority && (
        <div className="mb-3">
          <select
            defaultValue={task.priority}
            className={`text-xs font-medium rounded-full px-2 py-1 border-none outline-none ${getPriorityColor(task.priority)}`}
            onChange={(e) => {
              // Handle priority update here
              console.log('Priority updated:', e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {assignee && (
            <button
              onClick={handleMemberClick}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-1.5 py-1 rounded transition-colors"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {assignee.name.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-xs">{assignee.name.split(' ')[0]}</span>
            </button>
          )}
          
          <div className="flex items-center text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className={`px-2 py-1 rounded text-xs font-medium ${
          isOverdue ? 'bg-red-100 text-red-800' :
          isDueSoon ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : 
           daysRemaining === 0 ? 'Due today' :
           `${daysRemaining}d left`}
        </div>
      </div>

      {/* Last Activity */}
      {task.lastActivity && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Last moved by {task.lastActivity.user} • {task.lastActivity.timestamp}
          </p>
        </div>
      )}
    </div>
  );
}