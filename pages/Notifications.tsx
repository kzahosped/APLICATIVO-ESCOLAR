
import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Notifications: React.FC = () => {
  const { getStudentNotifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();
  const notifications = getStudentNotifications();

  const handleClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    navigate(notif.link);
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Notificações</h1>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
            <p>Nenhuma notificação.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => handleClick(notif)}
              className={`p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${notif.read 
                ? 'bg-white dark:bg-[#1a202c] border-gray-200 dark:border-gray-700' 
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold text-sm ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                  {notif.title}
                </h3>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-primary"></span>}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{notif.message}</p>
              <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString().slice(0,5)}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Notifications;
