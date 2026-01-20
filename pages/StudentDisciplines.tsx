import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { StudentDiscipline } from '../types';
import { getStudentDisciplines } from '../services/firestoreService';

type TabType = 'book' | 'memorization' | 'punishment';

const StudentDisciplines: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const [activeTab, setActiveTab] = useState<TabType>('book');
    const [disciplines, setDisciplines] = useState<StudentDiscipline[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDisciplines = async () => {
            if (currentUser) {
                try {
                    const data = await getStudentDisciplines(currentUser.id);
                    setDisciplines(data);
                } catch (error) {
                    console.error('Error loading disciplines:', error);
                }
                setLoading(false);
            }
        };
        loadDisciplines();
    }, [currentUser]);

    const filteredDisciplines = useMemo(() => {
        return disciplines.filter(d => d.type === activeTab);
    }, [disciplines, activeTab]);

    const tabs: { key: TabType; label: string; icon: string; color: string }[] = [
        { key: 'book', label: 'Livros', icon: 'menu_book', color: 'from-blue-500 to-indigo-500' },
        { key: 'memorization', label: 'Memorizações', icon: 'psychology', color: 'from-purple-500 to-violet-500' },
        { key: 'punishment', label: 'Punições', icon: 'gavel', color: 'from-red-500 to-rose-500' }
    ];

    const getTabStats = (type: TabType) => disciplines.filter(d => d.type === type).length;

    const getHeaderColor = () => {
        switch (activeTab) {
            case 'book': return 'from-blue-500 via-indigo-500 to-purple-500';
            case 'memorization': return 'from-purple-500 via-violet-500 to-fuchsia-500';
            case 'punishment': return 'from-red-500 via-rose-500 to-pink-500';
            default: return 'from-blue-500 to-indigo-500';
        }
    };

    const getEmptyState = () => {
        switch (activeTab) {
            case 'book':
                return {
                    icon: 'menu_book',
                    title: 'Nenhum livro registrado',
                    message: 'Os livros que você ler serão registrados aqui.'
                };
            case 'memorization':
                return {
                    icon: 'psychology',
                    title: 'Nenhuma memorização',
                    message: 'Suas memorizações serão registradas aqui.'
                };
            case 'punishment':
                return {
                    icon: 'celebration',
                    title: 'Nenhuma punição!',
                    message: 'Continue assim! Você não possui punições registradas.'
                };
            default:
                return { icon: 'info', title: '', message: '' };
        }
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e]">
            {/* Header */}
            <div
                className={`bg-gradient-to-r ${getHeaderColor()} px-5 pt-12 pb-8 transition-all duration-500`}
                style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-xl active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-xl text-white">Disciplinas</h1>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    {tabs.map(tab => (
                        <div
                            key={tab.key}
                            className={`rounded-2xl p-3 text-center transition-all ${activeTab === tab.key
                                    ? 'bg-white/30 scale-105'
                                    : 'bg-white/10'
                                }`}
                        >
                            <p className="text-2xl font-bold text-white">{getTabStats(tab.key)}</p>
                            <p className="text-white/80 text-xs">{tab.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 -mt-4">
                <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-1.5 shadow-lg flex gap-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-3 px-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === tab.key
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 mt-4 space-y-3">
                {loading ? (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 text-center shadow-lg">
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500">Carregando...</p>
                    </div>
                ) : filteredDisciplines.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 text-center shadow-lg animate-fade-in">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${activeTab === 'punishment'
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                            <span className={`material-symbols-outlined text-4xl ${activeTab === 'punishment'
                                    ? 'text-green-500'
                                    : 'text-gray-400'
                                }`}>
                                {getEmptyState().icon}
                            </span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                            {getEmptyState().title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {getEmptyState().message}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-lg overflow-hidden">
                        {filteredDisciplines.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`p-4 animate-fade-in ${idx < filteredDisciplines.length - 1
                                        ? 'border-b border-gray-100 dark:border-gray-800'
                                        : ''
                                    }`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-xl bg-gradient-to-br ${tabs.find(t => t.key === item.type)?.color
                                        }`}>
                                        <span className="material-symbols-outlined text-white">
                                            {tabs.find(t => t.key === item.type)?.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {item.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(item.date).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentDisciplines;
