import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login, settings } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedRole) return;

    const success = login(email, password, selectedRole);
    
    if (!success) {
      setError('Credenciais inválidas ou usuário não pertence a este perfil.');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'Administrador';
      case UserRole.PROFESSOR: return 'Professor';
      case UserRole.STUDENT: return 'Aluno';
      default: return '';
    }
  };

  // Initial View: Role Selection
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 animate-fade-in">
          <div className="flex justify-center mb-6">
            <img 
              src={settings.logoUrl} 
              alt={settings.name} 
              className="h-24 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Bem-vindo</h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Selecione seu perfil para continuar</p>

          <div className="space-y-3">
            <button 
              onClick={() => setSelectedRole(UserRole.ADMIN)}
              className="w-full flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary">Administrador</p>
                <p className="text-xs text-gray-500">Gestão e Configurações</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:text-primary">chevron_right</span>
            </button>

            <button 
              onClick={() => setSelectedRole(UserRole.PROFESSOR)}
              className="w-full flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                <span className="material-symbols-outlined">history_edu</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary">Professor</p>
                <p className="text-xs text-gray-500">Diário e Notas</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:text-primary">chevron_right</span>
            </button>

            <button 
              onClick={() => setSelectedRole(UserRole.STUDENT)}
              className="w-full flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                <span className="material-symbols-outlined">backpack</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary">Aluno</p>
                <p className="text-xs text-gray-500">Boletim e Financeiro</p>
              </div>
              <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:text-primary">chevron_right</span>
            </button>
          </div>

          {/* Website CTA */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quer conhecer mais sobre o Seminário?</p>
            <a 
              href="https://www.seminariosdcsul.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <span>Visite nosso Site Oficial</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Credentials Form View
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a202c] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 animate-fade-in">
        <button 
          onClick={() => { setSelectedRole(null); setError(''); setEmail(''); setPassword(''); }}
          className="flex items-center text-sm text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
          Voltar
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Login {getRoleLabel(selectedRole)}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Entre com suas credenciais</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all transform active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;