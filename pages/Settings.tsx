import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings, currentUser, updateUser } = useApp();
  
  // State for Institution Settings (Admin)
  const [instName, setInstName] = useState(settings.name);
  const [instLogo, setInstLogo] = useState(settings.logoUrl);
  const [instMission, setInstMission] = useState(settings.mission);

  // State for User Profile (All)
  const [userBio, setUserBio] = useState(currentUser?.bio || '');
  const [userAvatar, setUserAvatar] = useState(currentUser?.avatarUrl || '');

  useEffect(() => {
    setInstName(settings.name);
    setInstLogo(settings.logoUrl);
    setInstMission(settings.mission);
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      setUserBio(currentUser.bio || '');
      setUserAvatar(currentUser.avatarUrl || '');
    }
  }, [currentUser]);

  const handleSaveInstitution = () => {
    updateSettings({
      name: instName,
      logoUrl: instLogo,
      mission: instMission
    });
    alert('Configurações da instituição salvas!');
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser({
        ...currentUser,
        bio: userBio,
        avatarUrl: userAvatar
      });
      alert('Perfil atualizado com sucesso!');
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Configurações</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Profile Section (All Roles) */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Meu Perfil
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={userAvatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-gray-200" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL do Avatar</label>
                <input 
                  type="text" 
                  value={userAvatar}
                  onChange={(e) => setUserAvatar(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minha Missão (Bio)</label>
              <textarea 
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white h-24 text-sm"
                placeholder="Qual é o seu objetivo principal?"
              />
            </div>

            <button 
              onClick={handleSaveProfile}
              className="w-full bg-primary text-white py-2 rounded-lg font-bold shadow hover:bg-primary/90 transition-colors"
            >
              Salvar Perfil
            </button>
          </div>
        </div>

        {/* Institution Section (Admin Only) */}
        {currentUser?.role === UserRole.ADMIN && (
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">domain</span>
              Instituição
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Instituição</label>
                <input 
                  type="text" 
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL da Logo</label>
                <input 
                  type="text" 
                  value={instLogo}
                  onChange={(e) => setInstLogo(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Missão da Instituição</label>
                <textarea 
                  value={instMission}
                  onChange={(e) => setInstMission(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white h-24 text-sm"
                />
              </div>

              <button 
                onClick={handleSaveInstitution}
                className="w-full bg-gray-800 dark:bg-gray-700 text-white py-2 rounded-lg font-bold shadow hover:bg-gray-900 transition-colors"
              >
                Salvar Instituição
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;