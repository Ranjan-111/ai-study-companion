import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { getDifficultyColor, getStatusColor } from '../utils/helpers';
import './SubjectCard.css';

export default function SubjectCard({ subject, onEdit, onDelete, onEditTopic, onDeleteTopic, onAddTopic }) {
  const [expanded, setExpanded] = useState(false);
  const { getTopicsForSubject } = useSubjects();
  const topics = getTopicsForSubject(subject.id);
  
  const completed = topics.filter(t => t.status === 'Completed').length;
  const percentage = topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;

  return (
    <motion.div
      className="subject-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
    >
      <div className="subject-card-accent" style={{ background: subject.color }} />
      
      <div className="subject-card-header">
        <div className="subject-info">
          <div className="subject-color-dot" style={{ background: subject.color }} />
          <div>
            <h3 className="subject-name">{subject.name}</h3>
            <p className="subject-desc">{subject.description}</p>
          </div>
        </div>
        <div className="subject-actions">
          <button className="btn-icon" onClick={() => onEdit(subject)}>
            <HiOutlinePencil size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(subject.id)}>
            <HiOutlineTrash size={16} />
          </button>
        </div>
      </div>

      <div className="subject-progress">
        <div className="progress-info">
          <span>{completed}/{topics.length} topics completed</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ background: subject.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <button className="subject-expand-btn" onClick={() => setExpanded(!expanded)}>
        <span>{topics.length} Topics</span>
        {expanded ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
      </button>

      {expanded && (
        <motion.div
          className="topics-list"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          {topics.map(topic => (
            <div key={topic.id} className="topic-item">
              <div className="topic-info">
                <span className="topic-name">{topic.name}</span>
                <div className="topic-badges">
                  <span
                    className="badge"
                    style={{
                      color: getDifficultyColor(topic.difficulty),
                      background: `${getDifficultyColor(topic.difficulty)}20`,
                    }}
                  >
                    {topic.difficulty}
                  </span>
                  <span
                    className="badge"
                    style={{
                      color: getStatusColor(topic.status).text,
                      background: getStatusColor(topic.status).bg,
                    }}
                  >
                    {topic.status}
                  </span>
                </div>
              </div>
              <div className="topic-actions">
                <button className="btn-icon" onClick={() => onEditTopic(topic)}>
                  <HiOutlinePencil size={14} />
                </button>
                <button className="btn-icon" onClick={() => onDeleteTopic(topic.id)}>
                  <HiOutlineTrash size={14} />
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm add-topic-btn" onClick={() => onAddTopic(subject.id)}>
            + Add Topic
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
