import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const StudentDashboard: React.FC = () => {
  const { currentUser, grades, financials, logout } = useApp();

  const studentGrades = grades.filter(g => g.studentId === currentUser?.id);
  const pendingFinancials = financials.filter(f => f.studentId === currentUser?.id && f.status !== 'Pago');

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Olá, {currentUser?.name?.split(' ')[0]}!</h1>
            <p className="text-xs text-gray-500">ID: {currentUser?.registrationId || 'N/A'}</p>
          </div>
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-500">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Financial Summary */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-900 dark:text-white">Situação Financeira</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${pendingFinancials.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {pendingFinancials.length > 0 ? 'Pendente' : 'Em dia'}
            </span>
          </div>
          {pendingFinancials.length > 0 ? (
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {pendingFinancials.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{pendingFinancials.length} cobrança(s) em aberto</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma pendência financeira.</p>
          )}
        </div>

        {/* Grades Summary */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Meu Boletim</h2>
          </div>

          <div className="space-y-3">
            {studentGrades.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma nota lançada ainda.</p>
            ) : (
              studentGrades.map((grade, index) => (
                <div key={index} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {grade.subjectId === 'sub1' ? 'Teologia Sistemática' : 'Disciplina Genérica'}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      grade.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 
                      grade.status === 'Reprovado' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {grade.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                      <span className="block text-xs text-gray-500">N1</span>
                      <span className="font-semibold dark:text-gray-200">{grade.n1 || '-'}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                      <span className="block text-xs text-gray-500">N2</span>
                      <span className="font-semibold dark:text-gray-200">{grade.n2 || '-'}</span>
                    </div>
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded text-center">
                      <span className="block text-xs text-primary font-medium">Média</span>
                      <span className="font-bold text-primary">{grade.finalAverage || '-'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default StudentDashboard;