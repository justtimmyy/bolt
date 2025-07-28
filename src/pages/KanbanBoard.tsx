import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import TaskCard from '../components/Kanban/TaskCard';
import TaskModal from '../components/Modals/TaskModal';

const columns = [
  { id: 'To Do', title: 'To Do', color: 'gray' },
  { id: 'In Progress', title: 'In Progress', color: 'primary' },
  { id: 'QA', title: 'QA', color: 'accent' },
  { id: 'Done', title: 'Done', color: 'green' }
];

interface KanbanBoardProps {
  onTaskClick?: (taskId: string) => void;
}

export default function KanbanBoard({ onTaskClick }: KanbanBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [initialStatus, setInitialStatus] = useState<string>('To Do');
  const [activeTask, setActiveTask] = useState(null);
  const { tasks, currentWorkspace, teamMembers, updateTask, workspaces } = useApp();
  const { user } = useAuth();

  const currentWorkspaceData = workspaces.find(w => w.id === currentWorkspace);
  const workspaceTasks = tasks.filter(task => task.workspaceId === currentWorkspace);
  const filteredTasks = workspaceTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teamMembers.find(member => member.id === task.assigneeId)?.name
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTask = (status: string) => {
    setSelectedTask(null);
    setInitialStatus(status);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task: any) => {
    if (onTaskClick) {
      onTaskClick(task.id);
    } else {
      handleEditTask(task);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    const task = filteredTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask(taskId, { 
        status: newStatus,
        lastActivity: {
          user: user?.name || 'Unknown User',
          action: `moved from ${task.status} to ${newStatus}`,
          timestamp: new Date().toLocaleString()
        }
      });
    }
  };

  if (!currentWorkspaceData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-600">Please select a workspace from the sidebar to view tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
              Welcome to {currentWorkspaceData.name}
            </h1>
            <p className="text-gray-600">Manage your tasks and collaborate with your team</p>
          </div>

          <button
            onClick={() => handleCreateTask('To Do')}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title, description, or assignee..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="flex space-x-6 overflow-x-auto pb-6 min-h-[600px]">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={filteredTasks.filter(task => task.status === column.id)}
              onCreateTask={() => handleCreateTask(column.id)}
              onEditTask={handleTaskClick}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <TaskCard task={activeTask} onEdit={() => {}} />
          </div>
        ) : null}
      </DragOverlay>

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          initialStatus={initialStatus}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </DndContext>
  );
}