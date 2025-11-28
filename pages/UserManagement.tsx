import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const { users, removeUser } = useApp();
    const [filter, setFilter] = useState<'ALL' | 'STUDENT' | 'PROFESSOR'>('ALL');

    const handleDelete = (userId: string, userName: string) => {
        if (confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
            removeUser(userId);
        }
    };

    // Safety check for users array
    const safeUsers = Array.isArray(users) ? users : [];

    const filteredUsers = safeUsers.filter(user => {
        if (!user) return false;
        if (filter === 'ALL') return true;
        return user?.role === filter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="text-gray-600">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="font-bold text-lg text-gray-900">Gerenciar Usuários</h1>
                    </div>
                    <button
                        onClick={() => navigate('/admin/register')}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Novo
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'ALL'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('STUDENT')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'STUDENT'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Alunos
                    </button>
                    <button
                        onClick={() => setFilter('PROFESSOR')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'PROFESSOR'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Professores
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {filteredUsers.map(user => {
                    if (!user) return null;
                    return (
                        <div key={user.id || Math.random()} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                            <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{user.name || 'Sem Nome'}</h3>
                                <p className="text-sm text-gray-500 truncate">{user.email || 'Sem Email'}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded inline-block">
                                        {user.role === 'STUDENT' ? 'Aluno' :
                                            user.role === 'PROFESSOR' ? 'Professor' :
                                                user.role === 'ADMIN' ? 'Admin' : (user.role || 'N/A')}
                                    </span>
                                    {user.role === 'PROFESSOR' && Array.isArray(user.subjects) && user.subjects.length > 0 && (
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block truncate max-w-[150px]">
                                            {user.subjects.join(', ')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => user.id && handleDelete(user.id, user.name || '')}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Excluir usuário"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <BottomNav />
        </div >
    );
};

export default UserManagement;
