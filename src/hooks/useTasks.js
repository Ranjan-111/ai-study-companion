import { useMemo, useCallback } from 'react';
import { useStudyContext } from '../context/StudyContext';
import { isOverdue } from '../utils/helpers';

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask, subjects, topics } = useStudyContext();

  const getFilteredTasks = useCallback((filters = {}) => {
    let filtered = [...tasks];

    // Tab filter
    if (filters.tab) {
      switch (filters.tab) {
        case 'Pending':
          filtered = filtered.filter(t => t.status === 'Pending');
          break;
        case 'Completed':
          filtered = filtered.filter(t => t.status === 'Completed');
          break;
        case 'Overdue':
          filtered = filtered.filter(t => t.status !== 'Completed' && isOverdue(t.deadline));
          break;
        case 'Revision':
          filtered = filtered.filter(t => t.status === 'Revision');
          break;
        default:
          break;
      }
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter(t => t.subject === filters.subject);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(t => {
        const subject = subjects.find(s => s.id === t.subject);
        const topic = topics.find(tp => tp.id === t.topic);
        return (
          t.title.toLowerCase().includes(query) ||
          (subject?.name || '').toLowerCase().includes(query) ||
          (topic?.name || '').toLowerCase().includes(query)
        );
      });
    }

    // Sort
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'deadline':
            return new Date(a.deadline) - new Date(b.deadline);
          case 'priority': {
            const order = { High: 0, Medium: 1, Low: 2 };
            return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
          }
          case 'subject':
            return (a.subject || '').localeCompare(b.subject || '');
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [tasks, subjects, topics]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const overdue = tasks.filter(t => t.status !== 'Completed' && isOverdue(t.deadline)).length;
    const revision = tasks.filter(t => t.status === 'Revision').length;
    return { total, completed, pending, overdue, revision };
  }, [tasks]);

  return {
    tasks, addTask, updateTask, deleteTask,
    getFilteredTasks, taskStats,
  };
}
