import { useMemo } from 'react';
import { useStudyContext } from '../context/StudyContext';
import { isToday, subDays, isWithinInterval, startOfDay } from 'date-fns';

export function useProgress() {
  const { tasks, topics, subjects, activityLog } = useStudyContext();

  const overallProgress = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, percentage };
  }, [tasks]);

  const subjectProgress = useMemo(() => {
    return subjects.map(subject => {
      const subTopics = topics.filter(t => t.subjectId === subject.id);
      const completed = subTopics.filter(t => t.status === 'Completed').length;
      const total = subTopics.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: subject.name,
        color: subject.color,
        completed,
        total,
        percentage,
      };
    });
  }, [subjects, topics]);

  const weeklyProductivity = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = activityLog.filter(log => {
        try {
          const logDate = new Date(log.date);
          return isWithinInterval(logDate, { start: dayStart, end: dayEnd });
        } catch {
          return false;
        }
      }).length;

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data.push({
        day: dayNames[day.getDay()],
        activities: count,
      });
    }
    return data;
  }, [activityLog]);

  const topicStatusDistribution = useMemo(() => {
    const statuses = ['Not Started', 'In Progress', 'Completed', 'Needs Revision'];
    return statuses.map(status => ({
      name: status,
      value: topics.filter(t => t.status === status).length,
    })).filter(s => s.value > 0);
  }, [topics]);

  return {
    overallProgress, subjectProgress, weeklyProductivity, topicStatusDistribution,
  };
}
