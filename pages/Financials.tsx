import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';
import { INITIAL_CATEGORIES } from '../constants/initialData';

const Financials: React.FC = () => {
  const navigate = useNavigate();
  const { getVisibleFinancials, payRecord, currentUser, addFinancialRecord, users } = useApp();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Admin States
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Mensalidade do curso');

  const allRecords = getVisibleFinancials();

  // Filter records for the current student view
  const studentRecords = currentUser?.role === UserRole.STUDENT
    ? allRecords.filter(r => r.studentId === currentUser.id)
    : allRecords;

  // Calculate Totals
  const totalPaid = studentRecords
    .filter(r => r.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = studentRecords
    .filter(r => r.status === 'Pendente')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOverdue = studentRecords
    .filter(r => r.status === 'Vencido')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filter by Year
  const filteredRecords = studentRecords.filter(r =>
    new Date(r.dueDate).getFullYear().toString() === selectedYear
  ).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  const getMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  };

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
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-gray-900">Minhas Mensalidades</h1>
        </div>
        {currentUser?.role === UserRole.ADMIN && (
          <button onClick={() => setShowModal(true)} className="text-primary font-bold text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">add</span> Lançar
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Section */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Resumo Geral</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pago</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-1">Total em Aberto</p>
              <p className="text-2xl font-bold text-orange-500">
                R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Vencido</p>
            <p className="text-2xl font-bold text-red-600">
              R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Year Filter */}
        <div className="bg-gray-200 p-1 rounded-lg flex gap-1">
          {['2024', '2023', '2022'].map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${selectedYear === year
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Nenhum registro encontrado para {selectedYear}.</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const discount = record.discount || 0;
              const finalValue = record.amount - discount;

              return (
                <div key={record.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900 capitalize">
                      {getMonthYear(record.dueDate)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Pago' ? 'bg-green-100 text-green-700' :
                      record.status === 'Vencido' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                      {record.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-medium text-gray-900">
                        R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-medium text-gray-900">
                        - R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-bold text-gray-700">Valor Final:</span>
                      <span className={`text-xl font-bold ${record.status === 'Pago' ? 'text-green-600' :
                        record.status === 'Vencido' ? 'text-red-600' :
                          'text-orange-500'
                        }`}>
                        R$ {finalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Vencimento: {new Date(record.dueDate).toLocaleDateString('pt-BR')}
                    </span>

                    {record.status === 'Pago' ? (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                        Ver Comprovante
                      </button>
                    ) : record.status === 'Vencido' ? (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
                        Ver Detalhes
                      </button>
                    ) : (
                      <button
                        onClick={() => currentUser?.role === UserRole.ADMIN && payRecord(record.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                      >
                        Pagar Agora
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">Novo Lançamento</h3>
            <div className="space-y-3 mb-6">
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full p-3 border rounded-lg">
                <option value="">Selecione o Aluno</option>
                {users.filter(u => u.role === UserRole.STUDENT).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select
                value={INITIAL_CATEGORIES.some(c => c.name === category) ? category : 'Outro'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Outro') {
                    setCategory('');
                  } else {
                    setCategory(val);
                  }
                }}
                className="w-full p-3 border rounded-lg"
              >
                {INITIAL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                <option value="Outro">Outro (Personalizado)</option>
              </select>

              {(!INITIAL_CATEGORIES.some(c => c.name === category) || category === '') && (
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Digite a categoria personalizada"
                  className="w-full p-3 border rounded-lg bg-gray-50"
                  autoFocus
                />
              )}
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="w-full p-3 border rounded-lg" />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (R$)" className="w-full p-3 border rounded-lg" />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-3 border rounded-lg" />
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
