import { useMemo, useCallback } from 'react';
import { useStudyContext } from '../context/StudyContext';

export function useSubjects() {
  const { subjects, topics, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useStudyContext();

  const getTopicsForSubject = useCallback((subjectId) => {
    return topics.filter(t => t.subjectId === subjectId);
  }, [topics]);

  const getSubjectById = useCallback((id) => {
    return subjects.find(s => s.id === id);
  }, [subjects]);

  const getTopicById = useCallback((id) => {
    return topics.find(t => t.id === id);
  }, [topics]);

  const subjectProgress = useMemo(() => {
    return subjects.map(subject => {
      const subTopics = topics.filter(t => t.subjectId === subject.id);
      const completed = subTopics.filter(t => t.status === 'Completed').length;
      const total = subTopics.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...subject, completed, total, percentage };
    });
  }, [subjects, topics]);

  const searchSubjectsAndTopics = useCallback((query) => {
    if (!query) return { subjects: [], topics: [] };
    const q = query.toLowerCase();
    const matchedSubjects = subjects.filter(s =>
      s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
    const matchedTopics = topics.filter(t =>
      t.name.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
    );
    return { subjects: matchedSubjects, topics: matchedTopics };
  }, [subjects, topics]);

  return {
    subjects, topics,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
    getTopicsForSubject, getSubjectById, getTopicById,
    subjectProgress, searchSubjectsAndTopics,
  };
}
