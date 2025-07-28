import React, { createContext, useContext, useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'QA' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId: string;
  dueDate: string;
  workspaceId: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  lastActivity?: {
    user: string;
    action: string;
    timestamp: string;
  };
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  memberIds: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Scrum Master' | 'Developer' | 'Tester';
  status: 'Active' | 'Pending' | 'Inactive';
  joinedAt: string;
}

interface Notification {
  id: string;
  type: 'mention' | 'assignment' | 'due_soon' | 'status_change';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  author: string;
  timestamp: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  link?: string;
}

interface AppContextType {
  currentWorkspace: string;
  setCurrentWorkspace: (id: string) => void;
  workspaces: Workspace[];
  tasks: Task[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  activities: Activity[];
  meetings: Meeting[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addActivity: (message: string) => void;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  addWorkspace: (workspace: Omit<Workspace, 'id'>) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  deleteNotification: (id: string) => void;
  getMetrics: () => {
    activeWorkspaces: number;
    totalWorkspaces: number;
    completedTasks: number;
    inProgressTasks: number;
    teamMembers: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Mobile App Development',
    description: 'iOS and Android app development project',
    isActive: true,
    memberIds: ['1', '2', '3']
  },
  {
    id: 'workspace-2',
    name: 'Web Platform',
    description: 'Main web application platform',
    isActive: true,
    memberIds: ['1', '4']
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for the login and registration process',
    status: 'In Progress',
    assigneeId: '2',
    dueDate: '2024-01-15',
    workspaceId: 'workspace-1',
    subtasks: [
      { id: '1-1', title: 'Create wireframes', completed: true },
      { id: '1-2', title: 'Design mockups', completed: false },
      { id: '1-3', title: 'Review with team', completed: false }
    ],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '2',
    title: 'Implement API authentication',
    description: 'Set up JWT token-based authentication for the backend API',
    status: 'To Do',
    assigneeId: '3',
    dueDate: '2024-01-20',
    workspaceId: 'workspace-1',
    subtasks: [],
    createdAt: '2024-01-09T09:15:00Z',
    updatedAt: '2024-01-09T09:15:00Z'
  },
  {
    id: '3',
    title: 'Unit tests for user service',
    description: 'Write comprehensive unit tests for user management functionality',
    status: 'Done',
    assigneeId: '3',
    dueDate: '2024-01-12',
    workspaceId: 'workspace-1',
    subtasks: [
      { id: '3-1', title: 'Test user creation', completed: true },
      { id: '3-2', title: 'Test user validation', completed: true }
    ],
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2023-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Scrum',
    email: 'scrum@example.com',
    role: 'Scrum Master',
    status: 'Active',
    joinedAt: '2023-12-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'dev@example.com',
    role: 'Developer',
    status: 'Active',
    joinedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '4',
    name: 'Lisa Tester',
    email: 'tester@example.com',
    role: 'Tester',
    status: 'Pending',
    joinedAt: '2024-01-10T00:00:00Z'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'New task assigned',
    message: 'You have been assigned to "Design user authentication flow"',
    read: false,
    createdAt: '2024-01-10T14:30:00Z',
    taskId: '1'
  },
  {
    id: '2',
    type: 'due_soon',
    title: 'Task due soon',
    message: 'Task "Implement API authentication" is due in 2 days',
    read: false,
    createdAt: '2024-01-10T09:00:00Z',
    taskId: '2'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState('workspace-1');
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'task_created',
      message: 'Created task "Design user authentication flow"',
      author: 'Sarah Scrum',
      timestamp: '2024-01-08T10:00:00Z'
    },
    {
      id: '2',
      type: 'task_completed',
      message: 'Completed task "Unit tests for user service"',
      author: 'Mike Developer',
      timestamp: '2024-01-12T16:45:00Z'
    }
  ]);
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Daily Standup',
      date: '2024-01-15',
      time: '09:00',
      description: 'Daily team sync meeting',
      link: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2',
      title: 'Sprint Planning',
      date: '2024-01-16',
      time: '14:00',
      description: 'Plan tasks for next sprint'
    }
  ]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const addActivity = (message: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: 'custom',
      message,
      author: 'Current User',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addMeeting = (meetingData: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now().toString()
    };
    setMeetings(prev => [...prev, newMeeting]);
  };

  const addWorkspace = (workspaceData: Omit<Workspace, 'id'>) => {
    const newWorkspace: Workspace = {
      ...workspaceData,
      id: `workspace-${Date.now()}`
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    // Automatically switch to the new workspace
    setCurrentWorkspace(newWorkspace.id);
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString()
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getMetrics = () => {
    const workspaceTasks = tasks.filter(task => task.workspaceId === currentWorkspace);
    return {
      activeWorkspaces: workspaces.filter(w => w.isActive).length,
      totalWorkspaces: workspaces.length,
      completedTasks: workspaceTasks.filter(task => task.status === 'Done').length,
      inProgressTasks: workspaceTasks.filter(task => task.status === 'In Progress').length,
      teamMembers: teamMembers.length
    };
  };

  const value: AppContextType = {
    currentWorkspace,
    setCurrentWorkspace,
    workspaces,
    tasks,
    teamMembers,
    notifications,
    activities,
    meetings,
    addTask,
    updateTask,
    deleteTask,
    markNotificationRead,
    markAllNotificationsRead,
    addActivity,
    addMeeting,
    addWorkspace,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    deleteNotification,
    getMetrics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}