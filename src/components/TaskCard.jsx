import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineFlag } from 'react-icons/hi';
import { formatDate, getPriorityColor, getStatusColor, isOverdue } from '../utils/helpers';
import { useSubjects } from '../hooks/useSubjects';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const { getSubjectById, getTopicById } = useSubjects();
  const subject = getSubjectById(task.subject);
  const topic = getTopicById(task.topic);
  const overdue = task.status !== 'Completed' && isOverdue(task.deadline);
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(overdue ? 'Overdue' : task.status);

  return (
    <motion.div
      className={`task-card ${overdue ? 'overdue' : ''}`}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ x: 4 }}
    >
      <div className="task-card-left">
        <button
          className={`task-checkbox ${task.status === 'Completed' ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task.id)}
          title={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.status === 'Completed' && '✓'}
        </button>
        <div className="task-details">
          <h4 className={`task-title ${task.status === 'Completed' ? 'completed' : ''}`}>
            {task.title}
          </h4>
          <div className="task-meta">
            {subject && (
              <span className="task-subject" style={{ color: subject.color }}>
                {subject.name}
              </span>
            )}
            {topic && (
              <span className="task-topic">{topic.name}</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-card-right">
        <div className="task-badges">
          <span
            className="badge"
            style={{ background: priorityColor.bg, color: priorityColor.text, border: `1px solid ${priorityColor.border}` }}
          >
            <HiOutlineFlag size={12} />
            {task.priority}
          </span>
          <span
            className="badge"
            style={{ background: statusColor.bg, color: statusColor.text }}
          >
            {overdue ? 'Overdue' : task.status}
          </span>
        </div>
        <div className="task-deadline">
          <HiOutlineClock size={14} />
          <span>{formatDate(task.deadline)}</span>
        </div>
        <div className="task-card-actions">
          <button className="btn-icon" onClick={() => onEdit(task)}>
            <HiOutlinePencil size={15} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(task.id)}>
            <HiOutlineTrash size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
