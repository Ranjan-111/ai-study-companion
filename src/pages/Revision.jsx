import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, parseISO } from 'date-fns';
import RevisionList from '../components/RevisionList';
import { useStudyContext } from '../context/StudyContext';
import { formatDate } from '../utils/helpers';
import './Revision.css';

export default function Revision() {
  const { revisions, toggleRevision, deleteRevision } = useStudyContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, completed

  const filteredRevisions = useMemo(() => {
    let filtered = [...revisions];
    if (activeFilter === 'pending') {
      filtered = filtered.filter(r => !r.completed);
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(r => r.completed);
    }
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [revisions, activeFilter]);

  const selectedDateRevisions = useMemo(() => {
    return revisions.filter(r => {
      try {
        return isSameDay(parseISO(r.date), selectedDate);
      } catch {
        return false;
      }
    });
  }, [revisions, selectedDate]);

  const revisionDates = useMemo(() => {
    return revisions
      .filter(r => !r.completed)
      .map(r => r.date);
  }, [revisions]);

  const tileContent = ({ date }) => {
    const hasRevision = revisionDates.some(rd => {
      try {
        return isSameDay(parseISO(rd), date);
      } catch {
        return false;
      }
    });
    return hasRevision ? <div className="revision-dot" /> : null;
  };

  return (
    <motion.div className="revision-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <div>
          <h1>Revision Planner</h1>
          <p className="page-subtitle">Schedule and track your revision sessions</p>
        </div>
      </div>

      <div className="revision-layout">
        <div className="revision-calendar-section">
          <div className="chart-card">
            <h3>Revision Calendar</h3>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileContent={tileContent}
            />
          </div>

          {selectedDateRevisions.length > 0 && (
            <div className="chart-card selected-date-revisions">
              <h3>Revisions on {formatDate(selectedDate)}</h3>
              <RevisionList
                revisions={selectedDateRevisions}
                onToggle={toggleRevision}
                onDelete={deleteRevision}
              />
            </div>
          )}
        </div>

        <div className="revision-list-section">
          <div className="chart-card">
            <div className="revision-list-header">
              <h3>All Revisions</h3>
              <div className="revision-filter-tabs">
                <button
                  className={`tab-mini ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All ({revisions.length})
                </button>
                <button
                  className={`tab-mini ${activeFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending ({revisions.filter(r => !r.completed).length})
                </button>
                <button
                  className={`tab-mini ${activeFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Done ({revisions.filter(r => r.completed).length})
                </button>
              </div>
            </div>
            <RevisionList
              revisions={filteredRevisions}
              onToggle={toggleRevision}
              onDelete={deleteRevision}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
