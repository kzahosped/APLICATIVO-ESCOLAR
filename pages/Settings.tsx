import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings, currentUser, updateUser, logout } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // State for Institution Settings (Admin)
  const [instName, setInstName] = useState(settings.name);
  const [instLogo, setInstLogo] = useState(settings.logoUrl);
  const [instMission, setInstMission] = useState(settings.mission);

  // State for User Profile (All)
  const [userBio, setUserBio] = useState(currentUser?.bio || '');
  const [userAvatar, setUserAvatar] = useState(currentUser?.avatarUrl || '');
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('A imagem deve ter no máximo 2MB', 'warning');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione uma imagem válida', 'warning');
      return;
    }

    try {
      setUploading(true);

      // Import dynamically to avoid issues if storage not init
      const { storage } = await import('../services/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${currentUser?.id}_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setUserAvatar(downloadURL);

      // Auto-save the new avatar
      if (currentUser) {
        updateUser({
          ...currentUser,
          avatarUrl: downloadURL
        });
      }

      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Erro ao fazer upload da imagem. Tente novamente.', 'error');
      setUploading(false);
    }
  };

  const handleSaveInstitution = () => {
    updateSettings({
      name: instName,
      logoUrl: instLogo,
      mission: instMission
    });
    showToast('Configurações da instituição salvas!', 'success');
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser({
        ...currentUser,
        bio: userBio,
        // avatarUrl is already saved on upload, but we include it here too just in case
        avatarUrl: userAvatar
      });
      showToast('Perfil atualizado com sucesso!', 'success');
    }
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
      navigate('/login');
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
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={userAvatar || 'https://via.placeholder.com/150'}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-4 border-primary shadow-lg bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <span className="text-white text-xs">...</span>
                  </div>
                )}
              </div>

              <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">upload</span>
                Escolher Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Bio */}
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
              className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow hover:bg-primary/90 transition-colors"
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
                className="w-full bg-gray-800 dark:bg-gray-700 text-white py-3 rounded-lg font-bold shadow hover:bg-gray-900 transition-colors"
              >
                Salvar Instituição
              </button>
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold mb-4 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">logout</span>
            Conta
          </h2>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold shadow transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair da Conta
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;