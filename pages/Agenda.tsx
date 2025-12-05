import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { CalendarEvent, UserRole } from '../types';
import { createEvent } from '../services/firestoreService';

const Agenda: React.FC = () => {
  const { events, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'Outro' as CalendarEvent['type'],
    description: ''
  });

  const canCreateEvent = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.PROFESSOR;

  // Filtro de Agenda
  const myEvents = events.filter(evt => {
    if (evt.targetType === 'GLOBAL') return true;
    if (currentUser?.classId && evt.targetType === 'CLASS' && evt.targetId === currentUser.classId) return true;
    // Se for professor, vê todos os globais e talvez os que ele criou (se tivesse esse campo, mas por enquanto vê globais)
    return false;
  });

  const sortedEvents = myEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Prova': return 'bg-red-100 text-red-700 border-red-200';
      case 'Trabalho': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Feriado': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: formData.title,
      date: formData.date, // YYYY-MM-DD
      type: formData.type,
      targetType: 'GLOBAL', // Simplificação: cria global por padrão
      targetId: 'all',
      description: formData.description
    };

    const success = await createEvent(newEvent);
    if (success) {
      alert('Evento criado com sucesso!');
      setIsModalOpen(false);
      setFormData({ title: '', date: '', type: 'Outro', description: '' });
      // Recarregar eventos seria ideal, mas o contexto deve atualizar se for realtime ou se forçar refresh
      window.location.reload(); // Forçar refresh simples
    } else {
      alert('Erro ao criar evento.');
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Agenda Acadêmica</h1>
        {canCreateEvent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Novo
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {sortedEvents.map(evt => (
          <div key={evt.id} className="flex gap-4 bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
              <span className="text-xs font-bold text-gray-500 uppercase">{new Date(evt.date).toLocaleString('pt-BR', { month: 'short' })}</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{new Date(evt.date).getUTCDate()}</span>
            </div>
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(evt.type)}`}>{evt.type}</span>
              <h3 className="font-bold text-gray-900 dark:text-white mt-1">{evt.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'UTC' })}</p>
              {evt.description && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{evt.description}</p>}
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && <p className="text-center text-gray-500 mt-10">Nenhum evento próximo.</p>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Novo Evento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                  placeholder="Ex: Entrega de Trabalho"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                >
                  <option value="Prova">Prova</option>
                  <option value="Trabalho">Trabalho</option>
                  <option value="Feriado">Feriado</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Agenda;
