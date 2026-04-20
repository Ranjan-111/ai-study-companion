import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage, generateId, getRevisionDate } from '../utils/helpers';

const StudyContext = createContext();

// Initial sample data
const sampleSubjects = [
  { id: 'sub1', name: 'Data Structures', description: 'Fundamental data structures and algorithms', color: '#6366f1' },
  { id: 'sub2', name: 'Mathematics', description: 'Calculus, Linear Algebra, and Probability', color: '#ec4899' },
  { id: 'sub3', name: 'Computer Networks', description: 'Network protocols and architecture', color: '#14b8a6' },
];

const sampleTopics = [
  { id: 'top1', subjectId: 'sub1', name: 'Binary Trees', difficulty: 'Medium', status: 'In Progress', notes: 'Focus on traversal algorithms' },
  { id: 'top2', subjectId: 'sub1', name: 'Graph Algorithms', difficulty: 'Hard', status: 'Not Started', notes: 'BFS, DFS, Dijkstra' },
  { id: 'top3', subjectId: 'sub1', name: 'Dynamic Programming', difficulty: 'Hard', status: 'Not Started', notes: 'Memoization and tabulation' },
  { id: 'top4', subjectId: 'sub2', name: 'Calculus', difficulty: 'Medium', status: 'Completed', notes: 'Differentiation and integration' },
  { id: 'top5', subjectId: 'sub2', name: 'Linear Algebra', difficulty: 'Medium', status: 'In Progress', notes: 'Matrices and vector spaces' },
  { id: 'top6', subjectId: 'sub3', name: 'TCP/IP Protocol', difficulty: 'Easy', status: 'Completed', notes: 'Study the OSI model layers' },
  { id: 'top7', subjectId: 'sub3', name: 'HTTP & REST', difficulty: 'Easy', status: 'Needs Revision', notes: 'Request methods and status codes' },
];

const sampleTasks = [
  { id: 'task1', title: 'Solve 10 binary tree problems', subject: 'sub1', topic: 'top1', deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], priority: 'High', status: 'Pending' },
  { id: 'task2', title: 'Revise Graph algorithms', subject: 'sub1', topic: 'top2', deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], priority: 'Medium', status: 'Pending' },
  { id: 'task3', title: 'Complete Calculus assignment', subject: 'sub2', topic: 'top4', deadline: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], priority: 'High', status: 'Completed', completedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 'task4', title: 'Study TCP/IP layers', subject: 'sub3', topic: 'top6', deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], priority: 'Low', status: 'Pending' },
  { id: 'task5', title: 'Practice Linear Algebra problems', subject: 'sub2', topic: 'top5', deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], priority: 'Medium', status: 'Pending' },
];

const sampleRevisions = [
  { id: 'rev1', topicId: 'top4', topicName: 'Calculus', subjectName: 'Mathematics', date: getRevisionDate(new Date()).toISOString().split('T')[0], completed: false },
  { id: 'rev2', topicId: 'top6', topicName: 'TCP/IP Protocol', subjectName: 'Computer Networks', date: getRevisionDate(new Date(Date.now() - 86400000)).toISOString().split('T')[0], completed: false },
];

export function StudyProvider({ children }) {
  const [subjects, setSubjects] = useState(() => loadFromStorage('subjects', sampleSubjects));
  const [topics, setTopics] = useState(() => loadFromStorage('topics', sampleTopics));
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', sampleTasks));
  const [revisions, setRevisions] = useState(() => loadFromStorage('revisions', sampleRevisions));
  const [activityLog, setActivityLog] = useState(() => loadFromStorage('activityLog', []));

  // Persist to localStorage
  useEffect(() => { saveToStorage('subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('topics', topics); }, [topics]);
  useEffect(() => { saveToStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('revisions', revisions); }, [revisions]);
  useEffect(() => { saveToStorage('activityLog', activityLog); }, [activityLog]);

  // Log activity for weekly productivity
  const logActivity = useCallback((type) => {
    setActivityLog(prev => [...prev, { type, date: new Date().toISOString() }]);
  }, []);

  // Subject CRUD
  const addSubject = useCallback((subject) => {
    const newSubject = { ...subject, id: generateId() };
    setSubjects(prev => [...prev, newSubject]);
    logActivity('subject_added');
    return newSubject;
  }, [logActivity]);

  const updateSubject = useCallback((id, updates) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSubject = useCallback((id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTopics(prev => prev.filter(t => t.subjectId !== id));
    setTasks(prev => prev.filter(t => t.subject !== id));
  }, []);

  // Topic CRUD
  const addTopic = useCallback((topic) => {
    const newTopic = { ...topic, id: generateId() };
    setTopics(prev => [...prev, newTopic]);
    logActivity('topic_added');
    return newTopic;
  }, [logActivity]);

  const updateTopic = useCallback((id, updates) => {
    setTopics(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        // If topic is completed, schedule revision
        if (updates.status === 'Completed' && t.status !== 'Completed') {
          const subject = subjects.find(s => s.id === t.subjectId);
          const revisionDate = getRevisionDate(new Date());
          setRevisions(prev => [...prev, {
            id: generateId(),
            topicId: id,
            topicName: t.name,
            subjectName: subject?.name || '',
            date: revisionDate.toISOString().split('T')[0],
            completed: false,
          }]);
        }
        return updated;
      }
      return t;
    }));
  }, [subjects]);

  const deleteTopic = useCallback((id) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  }, []);

  // Task CRUD
  const addTask = useCallback((task) => {
    const newTask = { ...task, id: generateId() };
    setTasks(prev => [...prev, newTask]);
    logActivity('task_added');
    return newTask;
  }, [logActivity]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (updates.status === 'Completed' && t.status !== 'Completed') {
          updated.completedAt = new Date().toISOString();
          logActivity('task_completed');
        }
        return updated;
      }
      return t;
    }));
  }, [logActivity]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // Revision CRUD
  const toggleRevision = useCallback((id) => {
    setRevisions(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  }, []);

  const deleteRevision = useCallback((id) => {
    setRevisions(prev => prev.filter(r => r.id !== id));
  }, []);

  const value = {
    subjects, topics, tasks, revisions, activityLog,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
    addTask, updateTask, deleteTask,
    toggleRevision, deleteRevision,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};

export default StudyContext;
