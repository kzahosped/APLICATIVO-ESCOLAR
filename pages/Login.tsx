import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login, settings } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) return;

    const success = await login(email, password, selectedRole);

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
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="w-full max-w-md relative z-10 animate-scale-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-float p-8 border border-white/20">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lifted">
                <span className="material-symbols-outlined text-white text-5xl">school</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bem-vindo
            </h1>
            <p className="text-center text-gray-600 mb-8">Selecione seu perfil para continuar</p>

            <div className="space-y-3">
              {/* Admin Role */}
              <button
                onClick={() => setSelectedRole(UserRole.ADMIN)}
                className="w-full flex items-center p-5 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lifted hover-lift transform transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-lg">Administrador</p>
                  <p className="text-sm text-purple-100">Gestão e Configurações</p>
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {/* Professor Role */}
              <button
                onClick={() => setSelectedRole(UserRole.PROFESSOR)}
                className="w-full flex items-center p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lifted hover-lift transform transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-lg">Professor</p>
                  <p className="text-sm text-blue-100">Diário e Notas</p>
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {/* Student Role */}
              <button
                onClick={() => setSelectedRole(UserRole.STUDENT)}
                className="w-full flex items-center p-5 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lifted hover-lift transform transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mr-4 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-lg">Aluno</p>
                  <p className="text-sm text-green-100">Boletim e Financeiro</p>
                </div>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <a href="https://www.seminariosdcsul.com.br" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Quer conhecer mais sobre o Seminário?
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Form View
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-float p-8 border border-white/20">
          {/* Back Button */}
          <button
            onClick={() => { setSelectedRole(null); setError(''); }}
            className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined mr-1">arrow_back</span>
            <span className="text-sm font-medium">Voltar</span>
          </button>

          {/* Role Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-6 py-3 rounded-2xl shadow-lifted">
              <span className="text-white font-bold text-lg">{getRoleLabel(selectedRole)}</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Entre com suas credenciais</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Login (CPF)</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Digite seu CPF"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all"
                placeholder="Digite sua senha"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lifted hover-lift transform transition-all text-lg"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;