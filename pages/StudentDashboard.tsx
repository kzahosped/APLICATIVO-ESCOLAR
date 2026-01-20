import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, financials, events, getVisibleAnnouncements } = useApp();

    // Dados Financeiros
    const pendingFinancials = financials.filter(f => f.studentId === currentUser?.id && f.status !== 'Pago');
    const nextPayment = pendingFinancials.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    // Próximas Avaliações
    const upcomingExams = events
        .filter(e => e.type === 'Prova' && new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nextExam = upcomingExams[0];

    // Últimos Comunicados
    const announcements = getVisibleAnnouncements();
    const latestAnnouncement = announcements[0];
    const hasUnread = announcements.some(a => !a.readBy.includes(currentUser?.id || ''));

    return (
        <div className="pb-24 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e]">
            {/* Header Premium */}
            <div
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-5 pt-12 pb-8"
                style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={currentUser?.avatarUrl}
                                alt="Profile"
                                className="w-16 h-16 rounded-2xl object-cover border-3 border-white/30 shadow-xl"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p className="text-white/80 text-sm font-medium">Bem-vindo(a) de volta,</p>
                            <h1 className="font-bold text-2xl text-white">{currentUser?.name?.split(' ')[0]}!</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/notifications')}
                        className="relative p-3 bg-white/10 backdrop-blur-sm rounded-2xl active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white text-2xl">notifications</span>
                        {hasUnread && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Aviso de Conta Inativa */}
            {currentUser && currentUser.active === false && (
                <div className="mx-4 -mt-4 mb-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-4 rounded-2xl animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">Conta Inativa</h3>
                            <p className="text-sm text-red-600/80 dark:text-red-300/80">
                                Entre em contato com a secretaria para mais informações.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cards sobrepostos ao header */}
            <div className="px-4 -mt-6 space-y-4">
                {/* Card Performance - Destaque */}
                <div
                    onClick={() => navigate('/student/performance')}
                    className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-5 rounded-3xl shadow-xl cursor-pointer active:scale-[0.98] transition-all duration-200 touch-feedback animate-fade-in"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Performance</p>
                            <h2 className="text-xl font-bold">Ver Estatísticas</h2>
                            <p className="text-white/70 text-sm mt-1">Acompanhe seu desempenho</p>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-4xl">analytics</span>
                        </div>
                    </div>
                </div>

                {/* Card Financeiro */}
                <div
                    onClick={() => navigate('/student/finances')}
                    className="bg-white dark:bg-[#1a1a2e] p-5 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-all duration-200 touch-feedback animate-fade-in"
                    style={{ animationDelay: '0.15s' }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl">
                            <span className="material-symbols-outlined text-white text-2xl">payments</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Situação Financeira</h3>
                    {pendingFinancials.length > 0 ? (
                        <>
                            <p className="text-red-500 font-semibold">
                                {pendingFinancials.length} {pendingFinancials.length === 1 ? 'pendência' : 'pendências'}
                            </p>
                            {nextPayment && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                    Vence em {new Date(nextPayment.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-green-500">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span className="font-semibold">Tudo em dia!</span>
                        </div>
                    )}
                </div>

                {/* Card Atividades */}
                <div
                    onClick={() => navigate('/student/assignments')}
                    className="bg-white dark:bg-[#1a1a2e] p-5 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-all duration-200 touch-feedback animate-fade-in"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                            <span className="material-symbols-outlined text-white text-2xl">task_alt</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">chevron_right</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Atividades</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Ver tarefas e entregas</p>
                </div>

                {/* Grid de Acesso Rápido */}
                <div className="pt-2">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Acesso Rápido</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: 'how_to_reg', label: 'Frequência', desc: 'Minhas presenças', path: '/student/attendance', color: 'from-emerald-500 to-teal-500' },
                            { icon: 'assignment', label: 'Boletim', desc: 'Notas e médias', path: '/student/simple-report', color: 'from-amber-500 to-orange-500' },
                            { icon: 'calendar_month', label: 'Agenda', desc: 'Aulas e eventos', path: '/student/agenda', color: 'from-blue-500 to-indigo-500' },
                            { icon: 'folder_open', label: 'Materiais', desc: 'Arquivos e links', path: '/student/materials', color: 'from-purple-500 to-pink-500' },
                            { icon: 'menu_book', label: 'Disciplinas', desc: 'Livros e memorizações', path: '/student/disciplines', color: 'from-cyan-500 to-teal-500' },
                        ].map((item, idx) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="bg-white dark:bg-[#1a1a2e] p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col items-start gap-3 active:scale-[0.97] transition-all duration-200 touch-feedback animate-fade-in"
                                style={{ animationDelay: `${0.25 + idx * 0.05}s` }}
                            >
                                <div className={`p-2.5 bg-gradient-to-br ${item.color} rounded-xl`}>
                                    <span className="material-symbols-outlined text-white text-xl">{item.icon}</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{item.label}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Comunicados */}
                <div
                    onClick={() => navigate('/announcements')}
                    className="bg-white dark:bg-[#1a1a2e] p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all duration-200 touch-feedback animate-fade-in"
                    style={{ animationDelay: '0.4s' }}
                >
                    <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl">
                        <span className="material-symbols-outlined text-white text-xl">campaign</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white">Comunicados</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {latestAnnouncement ? latestAnnouncement.title : 'Nenhum comunicado recente'}
                        </p>
                    </div>
                    {hasUnread && (
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentDashboard;
