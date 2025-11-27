import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout, financials, users } = useApp();
  const navigate = useNavigate();

  const totalStudents = users.filter(u => u.role === 'STUDENT').length;
  const totalRevenue = financials.reduce((acc, curr) => curr.status === 'Pago' ? acc + curr.amount : acc, 0);

  // Calcular dados mensais do gráfico baseado nos lançamentos
  const monthlyData = financials.reduce((acc, record) => {
    if (record.status === 'Pago') {
      const date = new Date(record.dueDate);
      const month = date.getMonth(); // 0-11
      const year = date.getFullYear();
      const currentYear = new Date().getFullYear();

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
    </div>
  );
};

export default AdminDashboard;
