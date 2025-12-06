import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { getUsers, updateUser } from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';

const ManageUsers: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const { showToast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

    useEffect(() => {
        if (currentUser?.role !== UserRole.ADMIN) {
            navigate('/');
            return;
        }
        loadUsers();
    }, [currentUser]);

    const loadUsers = async () => {
        setLoading(true);
        const allUsers = await getUsers();
        setUsers(allUsers);
        setLoading(false);
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean | undefined) => {
        const newStatus = !currentStatus; // Se undefined, vira true (ativo por padrão era true, então tornar false = inativo)

        const confirmed = confirm(`Deseja ${newStatus ? 'ativar' : 'desativar'} este usuário?`);
        if (!confirmed) return;

        const success = await updateUser(userId, { active: newStatus });
        if (success) {
            showToast(`Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso!`, 'success');
            loadUsers();
        } else {
            showToast('Erro ao atualizar status do usuário', 'error');
        }
    };

    const filteredUsers = users.filter(user => {
        // Filtro de role
        if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;

        // Filtro de status ativo/inativo
        const isActive = user.active !== false; // Se undefined ou true, considera ativo
        if (filter === 'active' && !isActive) return false;
        if (filter === 'inactive' && isActive) return false;

        return true;
    });

    const getRoleName = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return 'Admin';
            case UserRole.PROFESSOR: return 'Professor';
            case UserRole.STUDENT: return 'Aluno';
            case UserRole.FINANCE: return 'Financeiro';
            case UserRole.SECRETARY: return 'Secretaria';
            case UserRole.SUPPORT: return 'Suporte';
            default: return role;
        }
    };

    if (!currentUser || currentUser.role !== UserRole.ADMIN) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Gerenciar Usuários</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Filters */}
                <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${filter === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Ativos
                            </button>
                            <button
                                onClick={() => setFilter('inactive')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${filter === 'inactive'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                Inativos
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Usuário</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as any)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            <option value="ALL">Todos os tipos</option>
                            <option value={UserRole.STUDENT}>Alunos</option>
                            <option value={UserRole.PROFESSOR}>Professores</option>
                            <option value={UserRole.ADMIN}>Administradores</option>
                            <option value={UserRole.FINANCE}>Financeiro</option>
                            <option value={UserRole.SECRETARY}>Secretaria</option>
                            <option value={UserRole.SUPPORT}>Suporte</option>
                        </select>
                    </div>
                </div>

                {/* User List */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="font-bold text-gray-900 dark:text-white">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'usuário' : 'usuários'}
                        </h2>
                        {loading && <span className="text-sm text-gray-500">Carregando...</span>}
                    </div>

                    {filteredUsers.map(user => {
                        const isActive = user.active !== false;
                        return (
                            <div
                                key={user.id}
                                className={`bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm ${!isActive ? 'opacity-60 border-2 border-red-200 dark:border-red-900' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                                {!isActive && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                        Inativo
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{getRoleName(user.role)}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                            {user.classId && <p className="text-xs text-gray-500">Turma: {user.classId}</p>}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleToggleActive(user.id, isActive)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                            }`}
                                    >
                                        {isActive ? 'Desativar' : 'Ativar'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filteredUsers.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">
                            <p>Nenhum usuário encontrado com os filtros selecionados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
