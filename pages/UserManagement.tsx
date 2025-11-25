import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const UserManagement: React.FC = () => {
  const { users, removeUser } = useApp();
  const navigate = useNavigate();

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Gerenciar Usuários</h1>
        <button onClick={() => navigate('/admin/register')} className="text-primary font-medium text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span>
          Novo
        </button>
      </div>

      <div className="p-4 space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-4 bg-white dark:bg-[#1a202c] p-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-600 dark:text-gray-300">
                {user.role}
              </span>
            </div>
            {user.id !== '1' && (
              <button 
                onClick={() => {
                  if(window.confirm('Tem certeza que deseja remover este usuário?')) {
                    removeUser(user.id);
                  }
                }}
                className="text-gray-400 hover:text-red-500"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
        ))}
        {users.length === 1 && (
          <p className="text-center text-gray-500 text-sm mt-4">Nenhum outro usuário cadastrado.</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default UserManagement;