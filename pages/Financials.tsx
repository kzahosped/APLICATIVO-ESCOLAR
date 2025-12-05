import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';
import { INITIAL_CATEGORIES } from '../constants/initialData';

const Financials: React.FC = () => {
  const navigate = useNavigate();
  const { getVisibleFinancials, payRecord, addPayment, currentUser, addFinancialRecord, users, deleteFinancialRecord } = useApp();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Admin States
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Mensalidade do curso');

  const { showToast } = useToast();
  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'PIX' | 'Cartão' | 'Transferência'>('PIX');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);


  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allRecords = getVisibleFinancials();

  // Filter records for the current student view
  const studentRecords = currentUser?.role === UserRole.STUDENT
    ? allRecords.filter(r => r.studentId === currentUser.id)
    : allRecords;

  // Calculate Totals (considering partial payments)
  const totalPaid = studentRecords
    .filter(r => r.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = studentRecords
    .filter(r => r.status === 'Pendente' || r.status === 'Vencido')
    .reduce((acc, curr) => acc + (curr.balance ?? curr.amount), 0);

  const totalPartial = studentRecords
    .filter(r => r.status === 'Parcial')
    .reduce((acc, curr) => {
      const totalPaidAmount = (curr.payments || []).reduce((sum, p) => sum + p.amount, 0);
      return acc + totalPaidAmount;
    }, 0);

  const totalPartialBalance = studentRecords
    .filter(r => r.status === 'Parcial')
    .reduce((acc, curr) => acc + (curr.balance ?? 0), 0);

  const totalOverdue = studentRecords
    .filter(r => r.status === 'Vencido')
    .reduce((acc, curr) => acc + (curr.balance ?? curr.amount), 0);

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

  const handleAddPayment = async () => {
    if (!selectedRecord || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    const maxAmount = selectedRecord.balance ?? selectedRecord.amount;

    if (!amount || amount <= 0 || amount > maxAmount) {
      showToast(`Por favor, insira um valor entre R$ 0,01 e R$ ${maxAmount.toFixed(2)}`, 'warning');
      return;
    }

    await addPayment(selectedRecord.id, {
      amount,
      date: new Date().toISOString(),
      method: paymentMethod,
      notes: paymentNotes || undefined
    });

    // Reset form
    setShowPaymentModal(false);
    setSelectedRecord(null);
    setPaymentAmount('');
    setPaymentMethod('PIX');
    setPaymentNotes('');
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

          {totalPartial > 0 && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm mb-3">
              <p className="text-sm font-medium text-blue-900 mb-1">Pagamento Parcial</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-700">
                    R$ {totalPartial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-sm font-normal">pago</span>
                  </p>
                  <p className="text-sm text-blue-600">
                    Restam: R$ {totalPartialBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              const balance = record.balance ?? finalValue;
              const totalPaidForRecord = (record.payments || []).reduce((sum, p) => sum + p.amount, 0);

              return (
                <div key={record.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                  {/* Card Header */}
                  <div
                    className="flex justify-between items-start mb-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${record.status === 'Pago' ? 'bg-green-100 text-green-600' :
                        record.status === 'Vencido' ? 'bg-red-100 text-red-600' :
                          record.status === 'Parcial' ? 'bg-blue-100 text-blue-600' :
                            'bg-orange-100 text-orange-600'
                        }`}>
                        <span className="material-symbols-outlined">
                          {record.status === 'Pago' ? 'check_circle' : 'attach_money'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 capitalize">
                          {record.description || getMonthYear(record.dueDate)}
                        </h3>
                        <p className="text-xs text-gray-500">{record.category}</p>
                        {record.status === 'Parcial' && (
                          <p className="text-xs text-blue-600 font-medium mt-1">
                            Pago: R$ {totalPaidForRecord.toFixed(2)} de R$ {finalValue.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Pago' ? 'bg-green-100 text-green-700' :
                        record.status === 'Vencido' ? 'bg-red-100 text-red-700' :
                          record.status === 'Parcial' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                        {record.status}
                      </span>
                      <span className="material-symbols-outlined text-gray-400 text-sm">
                        {expandedId === record.id ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vencimento:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(record.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valor Original:</span>
                      <span className="font-medium text-gray-900">
                        R$ {record.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    {expandedId === record.id && (
                      <div className="pt-2 mt-2 border-t border-gray-100 space-y-2 animate-fade-in">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Desconto:</span>
                          <span className="text-green-600 font-medium">
                            - R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Payment History */}
                        {record.payments && record.payments.length > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg mt-2">
                            <p className="text-xs text-blue-900 uppercase font-bold mb-2">Histórico de Pagamentos</p>
                            <div className="space-y-2">
                              {record.payments.map((payment) => (
                                <div key={payment.id} className="flex justify-between items-center text-sm border-b border-blue-100 pb-2 last:border-0">
                                  <div>
                                    <p className="font-medium text-blue-900">R$ {payment.amount.toFixed(2)}</p>
                                    <p className="text-xs text-blue-600">{payment.method} - {new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                                    {payment.notes && <p className="text-xs text-gray-500 italic">{payment.notes}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.paidAt && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pago em:</span>
                            <span className="text-gray-900">
                              {new Date(record.paidAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        )}
                        <div className="bg-gray-50 p-3 rounded-lg mt-2">
                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Detalhes</p>
                          <p className="text-sm text-gray-700">{record.description || 'Mensalidade escolar referente ao período.'}</p>
                        </div>

                        {/* Admin Actions */}
                        {currentUser?.role === UserRole.ADMIN && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Tem certeza que deseja excluir este lançamento?')) {
                                  deleteFinancialRecord(record.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                              Excluir Lançamento
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
                      <span className="font-bold text-gray-700">
                        {record.status === 'Parcial' ? 'Saldo Restante:' : 'Total a Pagar:'}
                      </span>
                      <span className={`text-xl font-bold ${record.status === 'Pago' ? 'text-green-600' :
                        record.status === 'Vencido' ? 'text-red-600' :
                          record.status === 'Parcial' ? 'text-blue-600' :
                            'text-orange-500'
                        }`}>
                        R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions (Student Only) */}
                  {currentUser?.role === UserRole.STUDENT && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                      {record.status === 'Pago' ? (
                        <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">receipt</span>
                          Comprovante
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowPaymentModal(true);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">payments</span>
                          {record.status === 'Parcial' ? 'Adicionar Pagamento' : 'Pagar'}
                        </button>
                      )}
                    </div>
                  )}
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



      {/* Payment Modal */}
      {/* Payment Modal */}
      {showPaymentModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-900">
                {showPaymentInfo ? 'Realizar Pagamento' : 'Adicionar Pagamento'}
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRecord(null);
                  setPaymentAmount('');
                  setPaymentNotes('');
                  setShowPaymentInfo(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {!showPaymentInfo ? (
              // Step 1: Payment Form
              <>
                <div className="mb-4 bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-900 font-medium mb-1">{selectedRecord.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600">Saldo Restante:</span>
                    <span className="text-lg font-bold text-blue-700">
                      R$ {(selectedRecord.balance ?? selectedRecord.amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Pagamento *</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0,00"
                      step="0.01"
                      max={selectedRecord.balance ?? selectedRecord.amount}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo: R$ {(selectedRecord.balance ?? selectedRecord.amount).toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pagamento *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="PIX">PIX</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão">Cartão</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
                    <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="Ex: Pagamento referente à..."
                      rows={3}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedRecord(null);
                      setPaymentAmount('');
                      setPaymentNotes('');
                      setShowPaymentInfo(false);
                    }}
                    className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (paymentMethod === 'PIX') {
                        setShowPaymentInfo(true);
                      } else {
                        handleAddPayment();
                      }
                    }}
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paymentMethod === 'PIX' ? (
                      <>
                        <span className="material-symbols-outlined">qr_code_2</span>
                        Ir para Pagamento
                      </>
                    ) : (
                      'Confirmar Pagamento'
                    )}
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Payment Info (QR Code)
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor a Pagar:</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {parseFloat(paymentAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-xl border-4 border-green-500 shadow-lg">
                    <img
                      src="/pix-qrcode.png"
                      alt="QR Code PIX"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Aponte a câmera do seu aplicativo de banco para o QR Code
                  </p>
                </div>

                {/* PIX Info */}
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-700 mb-1">CHAVE PIX:</p>
                    <p className="text-sm font-bold text-blue-900">Igreja Evangélica Servos de Cristo</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-purple-700 mb-1">CNPJ:</p>
                    <p className="text-sm font-bold text-purple-900">09.102.175/0001-84</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowPaymentInfo(false)}
                    className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Confirmar que o pagamento foi realizado?')) {
                        handleAddPayment();
                        setShowPaymentInfo(false);
                      }
                    }}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">check_circle</span>
                    Já Paguei
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Financials;
