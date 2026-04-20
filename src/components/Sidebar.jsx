import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineSparkles,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/subjects', label: 'Subjects', icon: HiOutlineBookOpen },
  { path: '/tasks', label: 'Tasks', icon: HiOutlineClipboardList },
  { path: '/revision', label: 'Revision', icon: HiOutlineCalendar },
  { path: '/ai-tools', label: 'AI Tools', icon: HiOutlineSparkles },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="logo-icon">
              <HiOutlineSparkles />
            </div>
            <div className="logo-text">
              <span className="logo-title">StudyAI</span>
              <span className="logo-subtitle">Smart Companion</span>
            </div>
          </motion.div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nav-link-indicator" />
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-quote">
            <p>"The beautiful thing about learning is that nobody can take it away from you."</p>
            <span>— B.B. King</span>
          </div>
        </div>
      </aside>
    </>
  );
}
