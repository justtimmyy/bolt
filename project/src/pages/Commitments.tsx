import React, { useState } from 'react';
import { Plus, Target, Check, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import TaskModal from '../components/Modals/TaskModal';

export default function Commitments() {
  const { user } = useAuth();
  const { tasks, currentWorkspace, updateTask, teamMembers } = useApp();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Scrum Master';
  const workspaceCommitments = tasks.filter(task => task.workspaceId === currentWorkspace);

  const handleEditTask = (task: any) => {
    if (isAdmin) {
      setSelectedTask(task);
      setShowTaskModal(true);
    }
  };

  const handleCreateCommitment = () => {
    if (isAdmin) {
      setSelectedTask(null);
      setShowTaskModal(true);
    }
  };

  const toggleTaskStatus = (taskId: string, currentStatus: string) => {
    if (isAdmin) {
      const newStatus = currentStatus === 'Done' ? 'In Progress' : 'Done';
      updateTask(taskId, { status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'To Do': 'border-gray-300 bg-gray-50',
      'In Progress': 'border-blue-300 bg-blue-50',
      'QA': 'border-yellow-300 bg-yellow-50',
      'Done': 'border-green-300 bg-green-50'
    };
    return colors[status as keyof typeof colors] || colors['To Do'];
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commitments</h1>
            <p className="text-gray-600">
              Workspace commitments {!isAdmin && '(Read-only)'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleCreateCommitment}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Commitment</span>
            </button>
          )}
        </div>

        {!isAdmin && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Only Admins and Scrum Masters can modify commitments. 
              You can view all workspace commitments below.
            </p>
          </div>
        )}

        {workspaceCommitments.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No commitments yet</h3>
            <p className="text-gray-600 mb-6">
              {isAdmin 
                ? 'Create your first commitment to track important deliverables.'
                : 'No commitments have been created for this workspace.'}
            </p>
            {isAdmin && (
              <button
                onClick={handleCreateCommitment}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Commitment
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaceCommitments.map(task => {
              const assignee = teamMembers.find(m => m.id === task.assigneeId);
              const daysRemaining = getDaysRemaining(task.dueDate);
              const isOverdue = daysRemaining < 0;
              const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0;

              return (
                <div
                  key={task.id}
                  className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                    isAdmin ? 'cursor-pointer' : 'cursor-default'
                  } ${getStatusColor(task.status)}`}
                  onClick={() => handleEditTask(task)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {task.title}
                    </h3>
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id, task.status);
                        }}
                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ml-2 ${
                          task.status === 'Done'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                        title={task.status === 'Done' ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.status === 'Done' && <Check className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  {/* Subtasks Progress */}
                  {task.subtasks.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {task.subtasks.filter((st: any) => st.completed).length}/{task.subtasks.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(task.subtasks.filter((st: any) => st.completed).length / task.subtasks.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="space-y-2">
                    {assignee && (
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>{assignee.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Done' ? 'bg-green-100 text-green-800' :
                        isOverdue ? 'bg-red-100 text-red-800' :
                        isDueSoon ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status === 'Done' ? 'Completed' :
                         isOverdue ? `${Math.abs(daysRemaining)}d overdue` :
                         daysRemaining === 0 ? 'Due today' :
                         `${daysRemaining}d left`}
                      </span>
                    </div>

                    <div className={`px-2 py-1 rounded text-xs font-medium text-center ${
                      task.status === 'Done' ? 'bg-green-600 text-white' :
                      task.status === 'In Progress' ? 'bg-blue-600 text-white' :
                      task.status === 'QA' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {task.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showTaskModal && isAdmin && (
        <TaskModal
          task={selectedTask}
          initialStatus="To Do"
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </>
  );
}