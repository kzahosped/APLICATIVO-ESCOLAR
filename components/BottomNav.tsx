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
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f0f1a] z-50"
      style={{
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="flex justify-around items-center h-16">
        {getNavItems().map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 touch-feedback"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Indicador ativo */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-b-full animate-scale-in"
                />
              )}

              {/* Ícone com container */}
              <div className={`relative p-2 rounded-2xl transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10'
                  : ''
                }`}>
                <span
                  className={`material-symbols-outlined transition-all duration-200 ${isActive
                      ? 'text-transparent bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text filled text-2xl'
                      : 'text-gray-400 dark:text-gray-500 text-xl'
                    }`}
                  style={isActive ? {
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundImage: 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                  } : {}}
                >
                  {item.icon}
                </span>

                {/* Badge de notificação */}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white font-bold shadow-lg animate-pulse">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-medium mt-0.5 transition-all duration-200 ${isActive
                  ? 'text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-gray-400 dark:text-gray-500'
                }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
