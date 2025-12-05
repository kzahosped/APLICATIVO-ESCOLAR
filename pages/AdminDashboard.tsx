import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, financials, users, events } = useApp();
  const navigate = useNavigate();
  const [showDefaulters, setShowDefaulters] = useState(false);

  const totalStudents = users.filter(u => u.role === 'STUDENT').length;
  const totalRevenue = financials.reduce((acc, curr) => curr.status === 'Pago' ? acc + curr.amount : acc, 0);

  // Calcular alunos inadimplentes
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultingStudents = financials
    .filter(record => {
      const dueDate = new Date(record.dueDate);
      return record.status !== 'Pago' && dueDate < today;
    })
    .map(record => {
      const student = users.find(u => u.id === record.studentId);
      return {
        ...record,
        studentName: student?.name || 'Desconhecido'
      };
    });

  const defaultersCount = defaultingStudents.length;
  const totalOwed = defaultingStudents.reduce((acc, curr) => acc + (curr.amount - (curr.discount || 0)), 0);

  // Calcular receita do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthRevenue = financials
    .filter(record => {
      const date = new Date(record.dueDate);
      return record.status === 'Pago' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Eventos do dia
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

  // Calcular dados mensais do gráfico baseado nos lançamentos
  const monthlyData = financials.reduce((acc, record) => {
    if (record.status === 'Pago') {
      const date = new Date(record.dueDate);
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();

      // Apenas dados do ano corrente
      if (year === currentYear) {
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += record.amount;
      }
    }
    return acc;
  }, {} as Record<number, number>);

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const data = monthNames.map((name, index) => ({
    name,
    valor: monthlyData[index] || 0
  }));

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">dashboard</span>
          <h1 className="font-bold text-gray-900 dark:text-white">Painel Admin</h1>
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-500">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/admin/register')} className="p-4 bg-primary text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-primary/90">
            <span className="material-symbols-outlined text-3xl">person_add</span>
            <span className="font-medium text-sm">Novo Aluno</span>
          </button>
          <button onClick={() => navigate('/admin/register-professor')} className="p-4 bg-white dark:bg-[#1a202c] text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1f2937]">
            <span className="material-symbols-outlined text-3xl text-blue-500">school</span>
            <span className="font-medium text-sm text-center">Novo Professor</span>
          </button>
          <button onClick={() => navigate('/announcements')} className="p-4 bg-white dark:bg-[#1a202c] text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1f2937]">
            <span className="material-symbols-outlined text-3xl text-purple-500">campaign</span>
            <span className="font-medium text-sm">Comunicado</span>
          </button>

          <button onClick={() => navigate('/admin/subjects')} className="p-4 bg-white dark:bg-[#1a202c] text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1f2937]">
            <span className="material-symbols-outlined text-3xl text-green-600">menu_book</span>
            <span className="font-medium text-sm">Matérias</span>
          </button>
        </div>

        {/* Indicadores Importantes */}
        <div className="space-y-3">
          {/* Receita do Mês Atual */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs uppercase font-medium">Receita do Mês</p>
                <p className="text-3xl font-bold">R$ {currentMonthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-white/70 mt-1">{monthNames[currentMonth]} {currentYear}</p>
              </div>
              <span className="material-symbols-outlined text-5xl opacity-20">payments</span>
            </div>
          </div>

          {/* Alunos Inadimplentes */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowDefaulters(!showDefaulters)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1f2937] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-white">Alunos Inadimplentes</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{defaultersCount} aluno(s) • R$ {totalOwed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-400">
                {showDefaulters ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showDefaulters && defaultingStudents.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 pt-2 space-y-2 max-h-60 overflow-y-auto">
                {defaultingStudents.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1f2937] rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{record.studentName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Venc: {new Date(record.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400 ml-2">
                      R$ {(record.amount - (record.discount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {showDefaulters && defaultingStudents.length === 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">✅ Nenhum aluno inadimplente</p>
              </div>
            )}
          </div>

          {/* Eventos do Dia */}
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-600">event</span>
              <h3 className="font-bold text-gray-900 dark:text-white">Eventos de Hoje</h3>
            </div>

            {todayEvents.length > 0 ? (
              <div className="space-y-2">
                {todayEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-white text-sm">
                        {event.title.toLowerCase().includes('prova') ? 'quiz' :
                          event.title.toLowerCase().includes('reunião') ? 'groups' :
                            'event_note'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">📅 Nenhum evento programado para hoje</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-xs uppercase">Alunos Ativos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-xs uppercase">Receita (Total)</p>
            <p className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 h-64">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Fluxo de Caixa</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" fontSize={12} />
              <Tooltip />
              <Bar dataKey="valor" fill="#1754cf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <BottomNav />
    </div >
  );
};

export default AdminDashboard;
