import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StudyProvider } from './context/StudyContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Revision from './pages/Revision';
import AITools from './pages/AITools';

function App() {
  return (
    <StudyProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/ai-tools" element={<AITools />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </Router>
    </StudyProvider>
  );
}

export default App;
