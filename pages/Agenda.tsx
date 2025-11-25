
import React from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const Agenda: React.FC = () => {
  const { events, currentUser } = useApp();

  // Filtro de Agenda (Regra: GLOBAL ou Specífico da Turma/Curso)
  const myEvents = events.filter(evt => {
    if (evt.targetType === 'GLOBAL') return true;
    if (currentUser?.classId && evt.targetType === 'CLASS' && evt.targetId === currentUser.classId) return true;
    return false;
  });

  const sortedEvents = myEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Prova': return 'bg-red-100 text-red-700 border-red-200';
      case 'Feriado': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Agenda Acadêmica</h1>
      </div>

      <div className="p-4 space-y-4">
        {sortedEvents.map(evt => (
          <div key={evt.id} className="flex gap-4 bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
              <span className="text-xs font-bold text-gray-500 uppercase">{new Date(evt.date).toLocaleString('pt-BR', { month: 'short' })}</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{new Date(evt.date).getDate()}</span>
            </div>
            <div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getTypeColor(evt.type)}`}>{evt.type}</span>
              <h3 className="font-bold text-gray-900 dark:text-white mt-1">{evt.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
            </div>
          </div>
        ))}
        {sortedEvents.length === 0 && <p className="text-center text-gray-500 mt-10">Nenhum evento próximo.</p>}
      </div>
      <BottomNav />
    </div>
  );
};

export default Agenda;
