
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

const Announcements: React.FC = () => {
  const { getVisibleAnnouncements, addAnnouncement, removeAnnouncement, markAnnouncementAsRead, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState<'GLOBAL' | 'CLASS'>('GLOBAL');

  const announcements = getVisibleAnnouncements();

  const handlePublish = () => {
    if (!title || !content) return;
    
    addAnnouncement({
      title,
      content,
      date: new Date().toLocaleDateString('pt-BR'),
      type: 'Geral',
      targetType: targetType,
      targetId: targetType === 'CLASS' ? 'TURMA_A' : undefined // Simplificado para demo
    });
    
    setShowModal(false);
    setTitle('');
    setContent('');
  };

  const canManage = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.PROFESSOR;

  return (
    <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="font-bold text-lg text-gray-900 dark:text-white">Mural de Avisos</h1>
        {canManage && (
          <button onClick={() => setShowModal(true)} className="text-primary font-bold text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-base">add</span> Novo
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {announcements.map((ann) => {
          const isRead = currentUser ? ann.readBy.includes(currentUser.id) : false;
          return (
            <div 
              key={ann.id} 
              onClick={() => !isRead && markAnnouncementAsRead(ann.id)}
              className={`bg-white dark:bg-[#1a202c] p-4 rounded-xl border shadow-sm transition-all ${isRead ? 'border-gray-200 dark:border-gray-700' : 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-900'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold">{ann.targetType}</span>
                  {!isRead && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-bold">NOVO</span>}
                </div>
                {canManage && (
                  <button onClick={(e) => { e.stopPropagation(); removeAnnouncement(ann.id); }} className="text-gray-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                )}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{ann.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ann.content}</p>
              <p className="text-[10px] text-gray-400 mt-2">{ann.date}</p>
            </div>
          );
        })}
      </div>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a202c] w-full max-w-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Novo Comunicado</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Destino</label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setTargetType('GLOBAL')} className={`flex-1 py-2 text-xs font-bold rounded ${targetType === 'GLOBAL' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>GLOBAL</button>
                  <button onClick={() => setTargetType('CLASS')} className={`flex-1 py-2 text-xs font-bold rounded ${targetType === 'CLASS' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>TURMA A</button>
                </div>
              </div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mensagem..." className="w-full p-3 border rounded-lg h-32 dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold">Cancelar</button>
                <button onClick={handlePublish} className="flex-1 py-3 bg-primary text-white rounded-lg font-bold shadow-lg">Publicar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default Announcements;
