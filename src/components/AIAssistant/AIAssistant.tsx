import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, FileText, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AIAssistantProps {
  onClose: () => void;
}

export default function AIAssistant({ onClose }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'summarize' | 'suggest'>('generate');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { addTask, tasks, currentWorkspace } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (activeTab === 'generate') {
      // Generate task from prompt
      const suggestion = {
        title: `${input.replace(/^(add|create|make)\s*/i, '').replace(/\s*(task|todo)$/i, '')}`,
        description: `Generated from AI prompt: "${input}"`,
        status: 'To Do' as const,
        assigneeId: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        workspaceId: currentWorkspace,
        subtasks: []
      };

      setResponse(`I've generated a task suggestion based on your prompt. Would you like me to add this task to your workspace?

**Suggested Task:**
- Title: ${suggestion.title}
- Description: ${suggestion.description}
- Due Date: ${suggestion.dueDate}
- Status: To Do

Click "Add Task" to add it to your Kanban board.`);
    } else if (activeTab === 'summarize') {
      // Generate stand-up summary
      const workspaceTasks = tasks.filter(t => t.workspaceId === currentWorkspace);
      const completedTasks = workspaceTasks.filter(t => t.status === 'Done');
      const inProgressTasks = workspaceTasks.filter(t => t.status === 'In Progress');
      
      setResponse(`**Stand-up Summary**

**Yesterday:**
- Completed ${completedTasks.length} tasks
- Key accomplishments: ${completedTasks.slice(0, 2).map(t => t.title).join(', ')}

**Today:**
- ${inProgressTasks.length} tasks in progress
- Focus areas: ${inProgressTasks.slice(0, 2).map(t => t.title).join(', ')}

**Blockers:**
- No significant blockers identified
- Team collaboration proceeding smoothly`);
    } else {
      // Suggest next steps
      setResponse(`**Suggested Next Steps:**

Based on your current workspace activity, here are my recommendations:

1. **Priority Tasks:** Review overdue items and update their status
2. **Team Coordination:** Schedule a sync meeting for in-progress tasks
3. **Quality Check:** Move completed tasks through QA process
4. **Planning:** Plan next sprint with stakeholder input

Focus on completing current in-progress tasks before taking on new work.`);
    }

    setIsLoading(false);
  };

  const addSuggestedTask = () => {
    if (activeTab === 'generate' && input.trim()) {
      addTask({
        title: input.replace(/^(add|create|make)\s*/i, '').replace(/\s*(task|todo)$/i, ''),
        description: `Generated from AI prompt: "${input}"`,
        status: 'To Do',
        assigneeId: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        workspaceId: currentWorkspace,
        subtasks: []
      });
      setResponse('Task has been added to your Kanban board!');
    }
  };

  const tabs = [
    { id: 'generate', icon: FileText, label: 'Generate Task' },
    { id: 'summarize', icon: Users, label: 'Stand-up Summary' },
    { id: 'suggest', icon: Sparkles, label: 'Suggest Next Steps' }
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setResponse('');
                setInput('');
              }}
              className={`flex-1 p-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Prompt Area */}
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeTab === 'generate' ? 'Describe the task you want to create...' :
              activeTab === 'summarize' ? 'Any specific points to include in the summary?' :
              'What area would you like suggestions for?'
            }
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && activeTab !== 'suggest')}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {activeTab === 'generate' ? 'Generate Task' :
                   activeTab === 'summarize' ? 'Create Summary' :
                   'Get Suggestions'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Response Area */}
        {response && (
          <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {response}
              </div>
            </div>

            {activeTab === 'generate' && response && !response.includes('has been added') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={addSuggestedTask}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Task to Board
                </button>
              </div>
            )}

            {/* Feedback */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Was this helpful?</p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  👍 Yes
                </button>
                <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  👎 No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        {!response && (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                {activeTab === 'generate' && 'Describe what you want to create and I\'ll generate a task for you.'}
                {activeTab === 'summarize' && 'I\'ll create a stand-up summary based on your recent activity.'}
                {activeTab === 'suggest' && 'I\'ll analyze your workspace and suggest next steps.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}