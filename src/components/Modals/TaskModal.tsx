import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, Plus, Check, Edit2, Trash2, GripVertical } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface TaskModalProps {
  task?: any;
  initialStatus?: string;
  onClose: () => void;
}

export default function TaskModal({ task, initialStatus = 'To Do', onClose }: TaskModalProps) {
  const { addTask, updateTask, teamMembers, currentWorkspace } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStatus,
    assigneeId: '',
    dueDate: '',
    subtasks: [] as { id: string; title: string; completed: boolean }[]
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [editingSubtask, setEditingSubtask] = useState<string | null>(null);
  const [editSubtaskTitle, setEditSubtaskTitle] = useState('');
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority || 'Medium',
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        subtasks: [...task.subtasks]
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask({
        ...formData,
        workspaceId: currentWorkspace,
        subtasks: formData.subtasks
      });
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(),
          title: newSubtask,
          completed: false
        }]
      }));
      setNewSubtask('');
    }
  };

  const startEditingSubtask = (subtask: any) => {
    setEditingSubtask(subtask.id);
    setEditSubtaskTitle(subtask.title);
  };

  const saveSubtaskEdit = () => {
    if (editSubtaskTitle.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(subtask =>
          subtask.id === editingSubtask
            ? { ...subtask, title: editSubtaskTitle }
            : subtask
        )
      }));
    }
    setEditingSubtask(null);
    setEditSubtaskTitle('');
  };

  const cancelSubtaskEdit = () => {
    setEditingSubtask(null);
    setEditSubtaskTitle('');
  };
  const toggleSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask =>
        subtask.id === id
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    }));
  };

  const removeSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== id)
    }));
  };

  const moveSubtask = (dragIndex: number, dropIndex: number) => {
    const draggedSubtask = formData.subtasks[dragIndex];
    const newSubtasks = [...formData.subtasks];
    newSubtasks.splice(dragIndex, 1);
    newSubtasks.splice(dropIndex, 0, draggedSubtask);
    
    setFormData(prev => ({
      ...prev,
      subtasks: newSubtasks
    }));
  };
  const statuses = ['To Do', 'In Progress', 'QA', 'Done'];
  const priorities = ['Low', 'Medium', 'High'];

  const getAssigneeName = (assigneeId: string) => {
    const assignee = teamMembers.find(m => m.id === assigneeId);
    return assignee?.name || 'Unassigned';
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Task description..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select assignee</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              {formData.assigneeId && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-semibold text-white">
                        {getAssigneeName(formData.assigneeId).charAt(0)}
                      </span>
                    </div>
                    {getAssigneeName(formData.assigneeId)}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtasks
            </label>
            
            <div className="space-y-2 mb-3">
              {formData.subtasks.map((subtask, index) => (
                <div key={subtask.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group">
                  <button
                    type="button"
                    className="cursor-move text-gray-400 hover:text-gray-600"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSubtask(subtask.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      subtask.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {subtask.completed && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    {editingSubtask === subtask.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editSubtaskTitle}
                          onChange={(e) => setEditSubtaskTitle(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && saveSubtaskEdit()}
                          onBlur={saveSubtaskEdit}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={saveSubtaskEdit}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelSubtaskEdit}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span 
                        className={`${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'} cursor-pointer`}
                        onClick={() => startEditingSubtask(subtask)}
                      >
                        {subtask.title}
                      </span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                    <button
                      type="button"
                      onClick={() => startEditingSubtask(subtask)}
                      className="text-gray-400 hover:text-blue-500 p-1"
                      title="Edit subtask"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete subtask"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}