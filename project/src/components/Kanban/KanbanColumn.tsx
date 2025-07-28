import React from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    color: string;
  };
  tasks: any[];
  onCreateTask: () => void;
  onEditTask: (task: any) => void;
}

export default function KanbanColumn({ column, tasks, onCreateTask, onEditTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColorClasses = (color: string) => {
    const colors = {
      gray: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100',
      primary: 'border-primary-300 bg-gradient-to-br from-primary-50 to-primary-100',
      accent: 'border-accent-300 bg-gradient-to-br from-accent-50 to-accent-100',
      green: 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getHeaderColorClasses = (color: string) => {
    const colors = {
      gray: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800',
      primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-900',
      accent: 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-900',
      green: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-900'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="flex-shrink-0 w-80" ref={setNodeRef}>
      <div className={`rounded-xl border-2 shadow-sm ${getColorClasses(column.color)} h-full transition-all duration-200 ${
        isOver ? 'ring-2 ring-primary-400 ring-opacity-50 scale-105' : ''
      }`}>
        {/* Column Header */}
        <div className={`p-4 border-b border-gray-200 rounded-t-xl ${getHeaderColorClasses(column.color)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">{column.title}</h3>
              <span className="text-sm opacity-75">{tasks.length} tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={onCreateTask}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors group"
                title="Add task"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="p-4 space-y-3 min-h-[300px]">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-2">No tasks here</p>
              <button
                onClick={onCreateTask}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
              >
                Create one!
              </button>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}