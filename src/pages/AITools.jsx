import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { HiOutlineSparkles, HiOutlineKey, HiOutlineLightBulb, HiOutlineClipboardList, HiOutlineCollection } from 'react-icons/hi';
import { useSubjects } from '../hooks/useSubjects';
import { generateSummary, generateQuestions, generateFlashcards, setApiKey, hasApiKey } from '../services/aiService';
import './AITools.css';

const TABS = [
  { key: 'summary', label: 'Summaries', icon: HiOutlineLightBulb },
  { key: 'questions', label: 'Questions', icon: HiOutlineClipboardList },
  { key: 'flashcards', label: 'Flashcards', icon: HiOutlineCollection },
];

export default function AITools() {
  const { subjects, getTopicsForSubject } = useSubjects();
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyForm, setShowApiKeyForm] = useState(!hasApiKey());

  const topics = selectedSubject ? getTopicsForSubject(selectedSubject) : [];
  const selectedSubjectName = subjects.find(s => s.id === selectedSubject)?.name || '';
  const selectedTopicName = topics.find(t => t.id === selectedTopic)?.name || customPrompt || '';

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyForm(false);
      toast.success('API key saved!');
    }
  };

  const handleGenerate = async () => {
    const topicName = selectedTopicName || customPrompt;
    if (!topicName) {
      toast.error('Please select a topic or enter a custom prompt');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let response;
      switch (activeTab) {
        case 'summary':
          response = await generateSummary(topicName, selectedSubjectName || 'General');
          break;
        case 'questions':
          response = await generateQuestions(topicName, selectedSubjectName || 'General');
          break;
        case 'flashcards':
          response = await generateFlashcards(topicName, selectedSubjectName || 'General');
          break;
        default:
          break;
      }
      setResult(response);
      toast.success('Content generated! 🎉');
    } catch (error) {
      toast.error(error.message);
      if (error.message.includes('API key')) {
        setShowApiKeyForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="ai-tools-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <div>
          <h1>AI Study Assistant</h1>
          <p className="page-subtitle">Generate summaries, questions, and flashcards with AI</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowApiKeyForm(!showApiKeyForm)}
        >
          <HiOutlineKey size={16} />
          {hasApiKey() ? 'Update API Key' : 'Set API Key'}
        </button>
      </div>

      <AnimatePresence>
        {showApiKeyForm && (
          <motion.div
            className="api-key-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="api-key-card">
              <div className="api-key-info">
                <HiOutlineKey size={20} />
                <div>
                  <h4>Gemini API Key</h4>
                  <p>Get your free API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
                </div>
              </div>
              <div className="api-key-form">
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your Gemini API key..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSaveApiKey}>Save Key</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setResult(''); }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ai-form-section">
        <div className="ai-form-card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Subject (Optional)</label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
              >
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Topic</label>
              <select
                className="form-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">Select topic</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Or enter custom topic</label>
            <input
              className="form-input"
              placeholder={`e.g. "Binary Search Trees" or "Dijkstra's Algorithm"`}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Generating...
              </>
            ) : (
              <>
                <HiOutlineSparkles size={18} />
                Generate {activeTab === 'summary' ? 'Summary' : activeTab === 'questions' ? 'Questions' : 'Flashcards'}
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="ai-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="ai-result-header">
              <h3>
                <HiOutlineSparkles />
                AI Generated {activeTab === 'summary' ? 'Summary' : activeTab === 'questions' ? 'Questions' : 'Flashcards'}
              </h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }}
              >
                Copy
              </button>
            </div>
            <div className="ai-result-content">
              {result.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
