import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const UserManagement: React.FC = () => {
    const navigate = useNavigate();
    const { users, removeUser } = useApp();

    const handleDelete = (userId: string, userName: string) => {
        if (confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
            removeUser(userId);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex justify-between items-center">
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

            <div className="p-4 space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{user.role}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Excluir usuário"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};

export default UserManagement;
