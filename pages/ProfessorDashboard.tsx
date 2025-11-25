import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatarUrl} className="w-10 h-10 rounded-full" alt="Prof" />
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Prof. {currentUser?.name.split(' ')[1]}</h1>
            <p className="text-xs text-gray-500">Painel Docente</p>
          </div>
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-500">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
          <h2 className="text-lg font-bold text-primary mb-2">Minhas Turmas</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Selecione uma turma para gerenciar notas e frequência.</p>
          
          <div className="space-y-3">
            <div onClick={() => navigate('/professor/grades')} className="bg-white dark:bg-[#1a202c] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Teologia Sistemática I</h3>
                  <p className="text-xs text-gray-500">Turma A - 2024/2</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a202c] p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 opacity-75">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">História da Igreja</h3>
                  <p className="text-xs text-gray-500">Turma B - 2024/2</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/announcements')} className="p-4 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-orange-500">campaign</span>
            <span className="text-sm font-medium dark:text-gray-200">Comunicados</span>
          </button>
          <button className="p-4 bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-500">calendar_month</span>
            <span className="text-sm font-medium dark:text-gray-200">Calendário</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfessorDashboard;
