import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { HiOutlinePlus } from 'react-icons/hi';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useDebounce } from '../hooks/useDebounce';
import './Tasks.css';

const taskSchema = yup.object({
  title: yup.string().required('Task title is required').min(3, 'At least 3 characters'),
  subject: yup.string().required('Subject is required'),
  topic: yup.string(),
  deadline: yup.string().required('Deadline is required'),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
});

const TABS = ['All', 'Pending', 'Completed', 'Overdue', 'Revision'];

export default function Tasks() {
  const { addTask, updateTask, deleteTask, getFilteredTasks, taskStats } = useTasks();
  const { subjects, getTopicsForSubject } = useSubjects();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const form = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: { title: '', subject: '', topic: '', deadline: '', priority: 'Medium', status: 'Pending' },
  });

  const watchSubject = form.watch('subject');
  const availableTopics = useMemo(() => watchSubject ? getTopicsForSubject(watchSubject) : [], [watchSubject, getTopicsForSubject]);

  const filteredTasks = useMemo(() => {
    return getFilteredTasks({
      tab: activeTab === 'All' ? null : activeTab,
      search: debouncedSearch,
      subject: filterSubject,
      priority: filterPriority,
      sortBy,
    });
  }, [activeTab, debouncedSearch, filterSubject, filterPriority, sortBy, getFilteredTasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    form.reset({ title: '', subject: '', topic: '', deadline: '', priority: 'Medium', status: 'Pending' });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.reset(task);
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      toast.success('Task updated!');
    } else {
      addTask(data);
      toast.success('Task added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      deleteTask(id);
      toast.success('Task deleted');
    }
  };

  const handleToggleComplete = (id) => {
    const task = filteredTasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { status: task.status === 'Completed' ? 'Pending' : 'Completed' });
      toast.success(task.status === 'Completed' ? 'Task reopened' : 'Task completed! 🎉');
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'All': return taskStats.total;
      case 'Pending': return taskStats.pending;
      case 'Completed': return taskStats.completed;
      case 'Overdue': return taskStats.overdue;
      case 'Revision': return taskStats.revision;
      default: return 0;
    }
  };

  return (
    <motion.div className="tasks-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1>Study Tasks</h1>
        <button className="btn btn-primary" onClick={handleAddTask}>
          <HiOutlinePlus size={18} /> Add Task
        </button>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab-count">{getTabCount(tab)}</span>
          </button>
        ))}
      </div>

      <div className="filters-bar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks..." />
        <select className="form-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="subject">Sort by Subject</option>
        </select>
      </div>

      <div className="tasks-list">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No tasks found. Create your first study task!</p>
          <button className="btn btn-primary" onClick={handleAddTask}>
            <HiOutlinePlus size={18} /> Add Task
          </button>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTask ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input className="form-input" {...form.register('title')} placeholder="e.g. Solve 10 binary tree problems" />
            {form.formState.errors.title && <span className="form-error">{form.formState.errors.title.message}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select className="form-select" {...form.register('subject')}>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {form.formState.errors.subject && <span className="form-error">{form.formState.errors.subject.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Topic</label>
              <select className="form-select" {...form.register('topic')}>
                <option value="">Select topic</option>
                {availableTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-input" {...form.register('deadline')} />
              {form.formState.errors.deadline && <span className="form-error">{form.formState.errors.deadline.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" {...form.register('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" {...form.register('status')}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Revision">Revision</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingTask ? 'Update' : 'Add Task'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
