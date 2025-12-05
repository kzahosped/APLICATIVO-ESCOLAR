
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

const Support: React.FC = () => {
  const { currentUser, getVisibleTickets, createTicket, updateTicketStatus } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState<'Secretaria' | 'Financeiro'>('Secretaria');

  const tickets = getVisibleTickets();

  const handleCreate = () => {
    if (!subject || !description) return;
    createTicket({ sector, subject, description });
    setShowNew(false);
    setSubject('');
    setDescription('');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aberto': return 'bg-yellow-100 text-yellow-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Solicitações</h1>
        {currentUser?.role === UserRole.STUDENT && (
          <button onClick={() => setShowNew(true)} className="text-primary text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-base">add_circle</span>
            Abrir Chamado
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-500 uppercase">{ticket.sector}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{ticket.subject}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ticket.description}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-900 dark:text-white mb-2">Histórico:</p>
              {ticket.history.map((h, idx) => (
                <p key={idx} className="text-xs text-gray-500 mb-1">
                  <span className="font-medium">{h.authorName}:</span> {h.action} <span className="opacity-50">({new Date(h.date).toLocaleDateString()})</span>
                </p>
              ))}
            </div>

            {/* Admin Actions */}
            {currentUser?.role === UserRole.ADMIN && ticket.status === 'Aberto' && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => updateTicketStatus(ticket.id, 'Em Análise')} className="flex-1 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded">Analisar</button>
                <button onClick={() => updateTicketStatus(ticket.id, 'Resolvido')} className="flex-1 py-2 bg-green-50 text-green-700 text-xs font-bold rounded">Resolver</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Novo Chamado */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Novo Chamado</h3>
            <div className="space-y-3">
              <select value={sector} onChange={(e: any) => setSector(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <option value="Secretaria">Secretaria</option>
                <option value="Financeiro">Financeiro</option>
              </select>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Assunto" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição detalhada..." className="w-full p-2 border rounded h-24 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              <button onClick={handleCreate} className="w-full bg-primary text-white py-2 rounded font-bold">Enviar</button>
              <button onClick={() => setShowNew(false)} className="w-full text-gray-500 py-2 text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Support;
