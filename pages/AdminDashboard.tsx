import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, financials, users, events } = useApp();
  const navigate = useNavigate();
  const [showOverdueList, setShowOverdueList] = useState(false);

  const totalStudents = users.filter(u => u.role === 'STUDENT').length;

  // Receita do mês atual
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthRevenue = financials.reduce((acc, curr) => {
    if (curr.status === 'Pago') {
      const paidDate = new Date(curr.paidAt || curr.dueDate);
      if (paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear) {
        return acc + curr.amount;
      }
    }
    return acc;
  }, 0);

  // Alunos inadimplentes
  const overdueStudents = financials
    .filter(f => f.status === 'Vencido')
    .map(f => {
      const student = users.find(u => u.id === f.studentId);
      return {
        studentName: student?.name || 'Desconhecido',
        description: f.description,
        amount: f.amount,
        dueDate: f.dueDate
      };
    })
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.studentName === curr.studentName);
      if (existing) {
        existing.totalDebt += curr.amount;
        existing.records.push(curr);
      } else {
        acc.push({
          studentName: curr.studentName,
          totalDebt: curr.amount,
          records: [curr]
        });
      }
      return acc;
    }, [] as Array<{ studentName: string; totalDebt: number; records: any[] }>);

  const overdueCount = overdueStudents.length;

  // Eventos do dia
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(event => event.date === today);

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
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/admin/register')} className="p-4 bg-primary text-white rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-primary/90">
            <span className="material-symbols-outlined text-3xl">person_add</span>
            <span className="font-medium text-sm">Novo Aluno</span>
          </button>
          <button onClick={() => navigate('/announcements')} className="p-4 bg-white dark:bg-[#1a202c] text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl text-purple-500">campaign</span>
            <span className="font-medium text-sm">Comunicado</span>
          </button>
        </div>

        {/* Stats - Updated */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-xs uppercase">Alunos Ativos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-xs uppercase">Receita (Mês Atual)</p>
            <p className="text-2xl font-bold text-green-600">R$ {currentMonthRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Alunos Inadimplentes Card */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-gray-500 text-xs uppercase">Alunos Inadimplentes</p>
              <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-xl">
              <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
            </div>
          </div>

          {overdueCount > 0 && (
            <>
              <button
                onClick={() => setShowOverdueList(!showOverdueList)}
                className="w-full mt-2 text-sm text-primary font-medium flex items-center justify-center gap-1"
              >
                {showOverdueList ? 'Ocultar Lista' : 'Ver Lista'}
                <span className="material-symbols-outlined text-sm">
                  {showOverdueList ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showOverdueList && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {overdueStudents.map((student, index) => (
                    <div key={index} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="font-bold text-gray-900 dark:text-white">{student.studentName}</p>
                      <p className="text-sm text-red-600 font-medium">
                        Total em atraso: R$ {student.totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500">{student.records.length} pendência(s)</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Eventos do Dia */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-blue-600">event</span>
            <h3 className="font-bold text-gray-900 dark:text-white">Eventos de Hoje</h3>
          </div>

          {todayEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum evento agendado para hoje</p>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description || 'Sem descrição'}</p>
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
};

export default AdminDashboard;
