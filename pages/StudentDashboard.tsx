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
        <div className="pb-24 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <img
                        src={currentUser?.avatarUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <h1 className="font-bold text-xl text-gray-900">Olá, {currentUser?.name?.split(' ')[0]}!</h1>
                    </div>
                </div>
                <button onClick={() => navigate('/notifications')} className="relative text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    {hasUnread && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
            </div>

            {/* Aviso de Conta Inativa */}
            {currentUser && currentUser.active === false && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 p-4 mx-4 mt-4 rounded-r-xl">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                        <div>
                            <h3 className="font-bold text-red-900 dark:text-red-100 mb-1">Conta Inativa</h3>
                            <p className="text-sm text-red-800 dark:text-red-200">
                                Sua conta está marcada como inativa. Você pode visualizar seus dados, mas não poderá participar de atividades.
                                Entre em contato com a secretaria para mais informações.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 space-y-4">
                {/* Card Performance */}
                <div
                    onClick={() => navigate('/student/performance')}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-2xl shadow-lg cursor-pointer active:scale-98 transition-transform"
                >
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <h2 className="font-medium text-sm mb-1 opacity-90">Análise de Performance</h2>
                            <p className="text-2xl font-bold">Ver Estatísticas</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-80">analytics</span>
                    </div>
                </div>

                {/* Card Financeiro */}
                <div
                    onClick={() => navigate('/student/financial')}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                >
                    <h2 className="text-red-400 font-medium text-sm mb-2">Situação Financeira</h2>
                    {pendingFinancials.length > 0 ? (
                        <>
                            <p className="text-xl font-bold text-gray-900 mb-1">
                                {pendingFinancials.length} {pendingFinancials.length === 1 ? 'mensalidade pendente' : 'mensalidades pendentes'}
                            </p>
                            {nextPayment && (
                                <p className="text-sm text-gray-500 mb-3">
                                    Vencimento em {new Date(nextPayment.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                            )}
                            <p className="text-sm text-gray-400">Clique para ver detalhes e gerar boleto</p>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600">
                            <span className="material-symbols-outlined">check_circle</span>
                            <p className="font-bold">Tudo em dia!</p>
                        </div>
                    )}
                </div>

                {/* Card Avaliações */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-orange-400 font-medium text-sm mb-2">Próximas Avaliações</h2>
                    {nextExam ? (
                        <>
                            <p className="text-xl font-bold text-gray-900 mb-1">{nextExam.title}</p>
                            <p className="text-sm text-gray-500 mb-3">
                                Data: {new Date(nextExam.date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-400">Clique para ver todas as avaliações</p>
                        </>
                    ) : (
                        <p className="text-gray-500 font-medium">Nenhuma avaliação agendada.</p>
                    )}
                </div>

                {/* Card Comunicados */}
                <div
                    onClick={() => navigate('/announcements')}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-98 transition-transform cursor-pointer"
                >
                    <div className="bg-gray-100 p-3 rounded-xl">
                        <span className="material-symbols-outlined text-gray-600">campaign</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900">Últimos Comunicados</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                            {latestAnnouncement ? latestAnnouncement.title : 'Nenhum comunicado recente'}
                        </p>
                    </div>
                    {hasUnread && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                </div>

                {/* Grid de Acesso Rápido */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/student/attendance')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                    >
                        <span className="material-symbols-outlined text-blue-600 text-3xl">how_to_reg</span>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Frequência</p>
                            <p className="text-xs text-gray-500">Minhas presenças</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/student/report')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                    >
                        <span className="material-symbols-outlined text-blue-600 text-3xl">assignment</span>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Boletim</p>
                            <p className="text-xs text-gray-500">Notas e médias</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/student/agenda')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                    >
                        <span className="material-symbols-outlined text-blue-600 text-3xl">calendar_month</span>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Agenda</p>
                            <p className="text-xs text-gray-500">Aulas e eventos</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/student/materials')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                    >
                        <span className="material-symbols-outlined text-blue-600 text-3xl">folder_open</span>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Materiais</p>
                            <p className="text-xs text-gray-500">Arquivos e links</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/announcements')}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow"
                    >
                        <span className="material-symbols-outlined text-blue-600 text-3xl">description</span>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Comunicados</p>
                            <p className="text-xs text-gray-500">Avisos importantes</p>
                        </div>
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentDashboard;
