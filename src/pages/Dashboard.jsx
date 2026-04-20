import { motion } from 'framer-motion';
import { HiOutlineClipboardList, HiOutlineCheck, HiOutlineClock, HiOutlineRefresh } from 'react-icons/hi';
import { SubjectProgressChart, CompletionPieChart, WeeklyProductivityChart } from '../components/ProgressChart';
import RevisionList from '../components/RevisionList';
import { useProgress } from '../hooks/useProgress';
import { useTasks } from '../hooks/useTasks';
import { useStudyContext } from '../context/StudyContext';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { overallProgress, subjectProgress, weeklyProductivity, topicStatusDistribution } = useProgress();
  const { taskStats } = useTasks();
  const { revisions, toggleRevision, deleteRevision } = useStudyContext();
  
  const upcomingRevisions = revisions
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const stats = [
    { label: 'Total Tasks', value: taskStats.total, icon: HiOutlineClipboardList, colorClass: 'purple', iconBg: 'rgba(99,102,241,0.2)', iconColor: '#6366f1' },
    { label: 'Completed', value: taskStats.completed, icon: HiOutlineCheck, colorClass: 'teal', iconBg: 'rgba(34,197,94,0.2)', iconColor: '#22c55e' },
    { label: 'Pending', value: taskStats.pending, icon: HiOutlineClock, colorClass: 'orange', iconBg: 'rgba(249,115,22,0.2)', iconColor: '#f97316' },
    { label: 'Needs Revision', value: taskStats.revision + (revisions.filter(r => !r.completed).length), icon: HiOutlineRefresh, colorClass: 'pink', iconBg: 'rgba(236,72,153,0.2)', iconColor: '#ec4899' },
  ];

  return (
    <motion.div className="dashboard" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="page-header" variants={cardVariants}>
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Track your study progress and stay on track</p>
        </div>
        <div className="completion-badge">
          <span className="completion-value">{overallProgress.percentage}%</span>
          <span className="completion-label">Overall</span>
        </div>
      </motion.div>

      <motion.div className="stats-grid" variants={cardVariants}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`stat-card ${stat.colorClass}`}
            whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ background: stat.iconBg, color: stat.iconColor }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="charts-grid" variants={cardVariants}>
        <SubjectProgressChart data={subjectProgress} />
        <CompletionPieChart data={topicStatusDistribution} />
      </motion.div>

      <motion.div className="charts-grid" variants={cardVariants}>
        <WeeklyProductivityChart data={weeklyProductivity} />
        <div className="chart-card">
          <h3>Upcoming Revisions</h3>
          <RevisionList
            revisions={upcomingRevisions}
            onToggle={toggleRevision}
            onDelete={deleteRevision}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
