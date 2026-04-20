import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { HiOutlinePlus } from 'react-icons/hi';
import SubjectCard from '../components/SubjectCard';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { useSubjects } from '../hooks/useSubjects';
import { useDebounce } from '../hooks/useDebounce';
import { subjectColors } from '../utils/helpers';
import './Subjects.css';

const subjectSchema = yup.object({
  name: yup.string().required('Subject name is required').min(2, 'At least 2 characters'),
  description: yup.string().required('Description is required'),
  color: yup.string().required(),
});

const topicSchema = yup.object({
  name: yup.string().required('Topic name is required').min(2, 'At least 2 characters'),
  difficulty: yup.string().required('Difficulty is required'),
  status: yup.string().required('Status is required'),
  notes: yup.string(),
});

export default function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useSubjects();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeSubjectId, setActiveSubjectId] = useState(null);

  const subjectForm = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: { name: '', description: '', color: subjectColors[0] },
  });

  const topicForm = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: { name: '', difficulty: 'Medium', status: 'Not Started', notes: '' },
  });

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    subjectForm.reset({ name: '', description: '', color: subjectColors[0] });
    setShowSubjectModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    subjectForm.reset(subject);
    setShowSubjectModal(true);
  };

  const handleSubjectSubmit = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
      toast.success('Subject updated!');
    } else {
      addSubject(data);
      toast.success('Subject added!');
    }
    setShowSubjectModal(false);
    subjectForm.reset();
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('Delete this subject and all its topics?')) {
      deleteSubject(id);
      toast.success('Subject deleted');
    }
  };

  const handleAddTopic = (subjectId) => {
    setActiveSubjectId(subjectId);
    setEditingTopic(null);
    topicForm.reset({ name: '', difficulty: 'Medium', status: 'Not Started', notes: '' });
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic) => {
    setActiveSubjectId(topic.subjectId);
    setEditingTopic(topic);
    topicForm.reset(topic);
    setShowTopicModal(true);
  };

  const handleTopicSubmit = (data) => {
    if (editingTopic) {
      updateTopic(editingTopic.id, data);
      toast.success('Topic updated!');
    } else {
      addTopic({ ...data, subjectId: activeSubjectId });
      toast.success('Topic added!');
    }
    setShowTopicModal(false);
    topicForm.reset();
  };

  const handleDeleteTopic = (id) => {
    if (window.confirm('Delete this topic?')) {
      deleteTopic(id);
      toast.success('Topic deleted');
    }
  };

  return (
    <motion.div className="subjects-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1>Subjects</h1>
        <div className="header-actions">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search subjects..." />
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <HiOutlinePlus size={18} /> Add Subject
          </button>
        </div>
      </div>

      <div className="subjects-grid">
        <AnimatePresence>
          {filteredSubjects.map(subject => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleEditSubject}
              onDelete={handleDeleteSubject}
              onEditTopic={handleEditTopic}
              onDeleteTopic={handleDeleteTopic}
              onAddTopic={handleAddTopic}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredSubjects.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No subjects found. Add your first subject!</p>
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <HiOutlinePlus size={18} /> Add Subject
          </button>
        </div>
      )}

      {/* Subject Modal */}
      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
      >
        <form onSubmit={subjectForm.handleSubmit(handleSubjectSubmit)}>
          <div className="form-group">
            <label className="form-label">Subject Name</label>
            <input className="form-input" {...subjectForm.register('name')} placeholder="e.g. Mathematics" />
            {subjectForm.formState.errors.name && (
              <span className="form-error">{subjectForm.formState.errors.name.message}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" {...subjectForm.register('description')} placeholder="Brief description..." />
            {subjectForm.formState.errors.description && (
              <span className="form-error">{subjectForm.formState.errors.description.message}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker">
              {subjectColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${subjectForm.watch('color') === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => subjectForm.setValue('color', color)}
                />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowSubjectModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingSubject ? 'Update' : 'Add Subject'}</button>
          </div>
        </form>
      </Modal>

      {/* Topic Modal */}
      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title={editingTopic ? 'Edit Topic' : 'Add Topic'}
      >
        <form onSubmit={topicForm.handleSubmit(handleTopicSubmit)}>
          <div className="form-group">
            <label className="form-label">Topic Name</label>
            <input className="form-input" {...topicForm.register('name')} placeholder="e.g. Binary Trees" />
            {topicForm.formState.errors.name && (
              <span className="form-error">{topicForm.formState.errors.name.message}</span>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-select" {...topicForm.register('difficulty')}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" {...topicForm.register('status')}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" {...topicForm.register('notes')} placeholder="Any notes..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowTopicModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingTopic ? 'Update' : 'Add Topic'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
