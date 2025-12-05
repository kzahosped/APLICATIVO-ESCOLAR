
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getStudentNotifications } = useApp();

  if (!currentUser) return null;

  const unreadCount = getStudentNotifications().filter(n => !n.read).length;

  const getNavItems = () => {
    if (currentUser.role === UserRole.STUDENT) {
      return [
        { icon: 'home', label: 'Início', path: '/student' },
        { icon: 'calendar_month', label: 'Agenda', path: '/student/agenda' },
        { icon: 'notifications', label: 'Avisos', path: '/notifications', badge: unreadCount },
        { icon: 'settings', label: 'Config', path: '/settings' },
      ];
    }
    if (currentUser.role === UserRole.PROFESSOR) {
      return [
        { icon: 'home', label: 'Início', path: '/professor' },
        { icon: 'edit_note', label: 'Notas', path: '/professor/grades' },
        { icon: 'campaign', label: 'Mural', path: '/announcements' },
        { icon: 'settings', label: 'Config', path: '/settings' },
      ];
    }
    return [
      { icon: 'dashboard', label: 'Painel', path: '/admin' },
      { icon: 'group', label: 'Usuários', path: '/admin/users' },
      { icon: 'payments', label: 'Finanças', path: '/admin/financial' },
      { icon: 'campaign', label: 'Comunic.', path: '/announcements' },
      { icon: 'settings', label: 'Config', path: '/settings' },
    ];
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-[#111621] border-t border-gray-200 dark:border-gray-800 flex justify-around items-center z-50 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {getNavItems().map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            <div className="relative">
              <span className={`material-symbols-outlined text-2xl mb-1 ${isActive ? 'filled' : ''}`}>{item.icon}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
