import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi';
import { formatDate } from '../utils/helpers';
import './RevisionList.css';

export default function RevisionList({ revisions, onToggle, onDelete }) {
  if (!revisions || revisions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <p>No revisions scheduled yet.</p>
        <p style={{ fontSize: '0.85rem' }}>Complete topics to auto-schedule revisions!</p>
      </div>
    );
  }

  return (
    <div className="revision-list">
      {revisions.map((revision, index) => (
        <motion.div
          key={revision.id}
          className={`revision-item ${revision.completed ? 'done' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className="revision-left">
            <button
              className={`revision-checkbox ${revision.completed ? 'checked' : ''}`}
              onClick={() => onToggle(revision.id)}
            >
              {revision.completed && <HiOutlineCheck size={14} />}
            </button>
            <div className="revision-info">
              <span className={`revision-topic ${revision.completed ? 'completed-text' : ''}`}>
                {revision.topicName}
              </span>
              <span className="revision-subject">{revision.subjectName}</span>
            </div>
          </div>
          <div className="revision-right">
            <div className="revision-date">
              <HiOutlineCalendar size={14} />
              <span>{formatDate(revision.date)}</span>
            </div>
            <button className="btn-icon" onClick={() => onDelete(revision.id)}>
              <HiOutlineTrash size={15} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
