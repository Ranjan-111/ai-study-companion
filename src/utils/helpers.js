import { format, formatDistanceToNow, isPast, isToday, addDays } from 'date-fns';

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Format dates
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateShort = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MM/dd');
};

export const formatRelative = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Check if a task is overdue
export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return isPast(new Date(deadline)) && !isToday(new Date(deadline));
};

// Get revision date (default: 3 days after completion)
export const getRevisionDate = (completionDate, daysAfter = 3) => {
  return addDays(new Date(completionDate), daysAfter);
};

// Priority color mapping
export const getPriorityColor = (priority) => {
  const colors = {
    Low: { bg: 'rgba(76, 175, 80, 0.15)', text: '#4caf50', border: '#4caf50' },
    Medium: { bg: 'rgba(255, 183, 77, 0.15)', text: '#ffb74d', border: '#ffb74d' },
    High: { bg: 'rgba(244, 67, 54, 0.15)', text: '#f44336', border: '#f44336' },
  };
  return colors[priority] || colors.Medium;
};

// Status color mapping
export const getStatusColor = (status) => {
  const colors = {
    'Not Started': { bg: 'rgba(158, 158, 158, 0.15)', text: '#9e9e9e' },
    'In Progress': { bg: 'rgba(33, 150, 243, 0.15)', text: '#2196f3' },
    'Completed': { bg: 'rgba(76, 175, 80, 0.15)', text: '#4caf50' },
    'Needs Revision': { bg: 'rgba(255, 152, 0, 0.15)', text: '#ff9800' },
    'Pending': { bg: 'rgba(255, 183, 77, 0.15)', text: '#ffb74d' },
    'Overdue': { bg: 'rgba(244, 67, 54, 0.15)', text: '#f44336' },
  };
  return colors[status] || colors['Not Started'];
};

// Difficulty mapping
export const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: '#4caf50',
    Medium: '#ffb74d',
    Hard: '#f44336',
  };
  return colors[difficulty] || '#9e9e9e';
};

// Subject default colors
export const subjectColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#a855f7', '#e11d48',
];

// Get random color 
export const getRandomColor = () => {
  return subjectColors[Math.floor(Math.random() * subjectColors.length)];
};

// localStorage helpers
export const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Calculate completion percentage
export const calcPercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Get week day labels
export const getWeekDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    days.push(format(d, 'EEE'));
  }
  return days;
};
