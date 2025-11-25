import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [registrationId, setRegistrationId] = useState('');

  const handleSubmit = () => {
    if (name && email && password) {
      const generatedId = registrationId || Date.now().toString().slice(-6);
      addUser({
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        registrationId: generatedId,
        avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
      });
      navigate('/admin/users');
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Cadastrar Novo Usuário</h1>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Usuário</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            >
              <option value={UserRole.STUDENT}>Aluno</option>
              <option value={UserRole.PROFESSOR}>Professor</option>
              <option value={UserRole.ADMIN}>Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Ex: Maria Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Ex: maria@escola.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Defina uma senha"
            />
          </div>

          {role === UserRole.STUDENT && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matrícula (Opcional)</label>
              <input 
                type="text" 
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Gerado automaticamente se vazio"
              />
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!name || !email || !password}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Cadastro
        </button>
      </div>
    </div>
  );
};

export default StudentRegistration;