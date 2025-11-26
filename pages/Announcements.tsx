import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';

interface AttachedFile {
  name: string;
  size: number;
  file: File;
}

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const { getVisibleAnnouncements, addAnnouncement, removeAnnouncement, markAnnouncementAsRead, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const announcements = getVisibleAnnouncements();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidType = file.type === 'application/pdf' ||
          file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      const newAttachments = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        file
      }));

      setAttachedFiles([...attachedFiles, ...newAttachments]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handlePublish = () => {
    if (!title || !content) return;

    addAnnouncement({
      title,
      content,
      date: new Date().toLocaleDateString('pt-BR'),
      type: 'Geral',
      targetType: 'GLOBAL',
      targetId: undefined
    });

    setShowModal(false);
    setTitle('');
    setContent('');
    setAttachedFiles([]);
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

      {/* Modal de Criação - Redesigned */}
      {showModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button onClick={() => { setShowModal(false); setTitle(''); setContent(''); setAttachedFiles([]); }} className="text-gray-600">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg text-gray-900">Novo Comunicado</h1>
            <button
              onClick={() => { setShowModal(false); setTitle(''); setContent(''); setAttachedFiles([]); }}
              className="text-primary font-medium text-sm"
            >
              Cancelar
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assunto do comunicado"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Mensagem</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite o corpo do comunicado aqui..."
                className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Anexos */}
            <div>
              <label className="block text-gray-900 font-medium mb-2">Anexos</label>
              <p className="text-xs text-gray-500 mb-3">
                Limite de 5MB por arquivo. Tipos aceitos: PDF, JPG, PNG.
              </p>

              {/* Lista de Arquivos Anexados */}
              <div className="space-y-2 mb-3">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="material-symbols-outlined text-primary">
                        {file.file.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Botão Anexar Arquivo */}
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <span className="material-symbols-outlined text-primary mb-1">attach_file</span>
                  <p className="text-primary font-medium text-sm">Anexar Arquivo</p>
                </div>
              </label>
            </div>

            {/* Botão Enviar */}
            <button
              onClick={handlePublish}
              disabled={!title || !content}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Comunicado
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Announcements;
