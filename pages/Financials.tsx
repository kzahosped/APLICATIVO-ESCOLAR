
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

const Financials: React.FC = () => {
  const { getVisibleFinancials, payRecord, currentUser, addFinancialRecord, users } = useApp();
  const [showModal, setShowModal] = useState(false);
  
  // Admin Form States
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Mensalidade');

  const displayRecords = getVisibleFinancials();
  const students = users.filter(u => u.role === UserRole.STUDENT);

  const handleAddRecord = () => {
    if (selectedStudent && amount && description && dueDate) {
      addFinancialRecord({
        id: Date.now().toString(),
        studentId: selectedStudent,
        description,
        amount: parseFloat(amount),
        dueDate,
        status: 'Pendente',
        category: category as any
      });
      setShowModal(false);
      setAmount('');
      setDescription('');
      setDueDate('');
      setSelectedStudent('');
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Financeiro</h1>
        {currentUser?.role === UserRole.ADMIN && (
          <button onClick={() => setShowModal(true)} className="text-primary font-bold text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">add</span> Lançar
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {displayRecords.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2">account_balance_wallet</span>
            <p>Nenhum registro financeiro.</p>
          </div>
        ) : (
          displayRecords.map((record) => {
            const student = users.find(u => u.id === record.studentId);
            return (
              <div key={record.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{record.description}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded uppercase">{record.category}</span>
                    </div>
                    <p className="text-sm text-gray-500">Vence: {new Date(record.dueDate).toLocaleDateString()}</p>
                    {currentUser?.role === UserRole.ADMIN && (
                      <p className="text-xs text-primary mt-1 font-medium">Aluno: {student?.name}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-md font-bold ${
                    record.status === 'Pago' ? 'bg-green-100 text-green-700' : 
                    record.status === 'Vencido' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">R$ {record.amount.toFixed(2)}</span>
                  {/* Admin ou Financeiro podem baixar */}
                  {record.status !== 'Pago' && currentUser?.role === UserRole.ADMIN && (
                    <button onClick={() => payRecord(record.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      Baixar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Record Modal (Admin Only) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Novo Lançamento</h3>
            <div className="space-y-3 mb-6">
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white">
                <option value="">Selecione o Aluno</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white">
                <option value="Mensalidade">Mensalidade</option>
                <option value="Cantina">Cantina</option>
                <option value="Livraria">Livraria</option>
              </select>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"/>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (R$)" className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"/>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"/>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold">Cancelar</button>
              <button onClick={handleAddRecord} className="flex-1 py-3 bg-primary text-white rounded-lg font-bold">Salvar</button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Financials;
