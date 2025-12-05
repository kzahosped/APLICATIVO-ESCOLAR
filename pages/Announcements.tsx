import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import BottomNav from '../components/BottomNav';
import { UserRole } from '../types';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AttachedFile {
  name: string;
  size: number;
  file: File;
}

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const { getVisibleAnnouncements, addAnnouncement, removeAnnouncement, markAnnouncementAsRead, currentUser } = useApp();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [expirationDate, setExpirationDate] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENTS' | 'PROFESSORS'>('ALL');
  const [isPublishing, setIsPublishing] = useState(false);

  const announcements = getVisibleAnnouncements().filter(ann => {
    // 1. Filter by Expiration
    if (ann.expiresAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiration = new Date(ann.expiresAt);
      // Adjust expiration to end of day
      expiration.setHours(23, 59, 59, 999);

      if (today > expiration) return false;
    }

    // 2. Filter by Audience
    if (currentUser?.role === UserRole.ADMIN) return true; // Admin sees all
    if (!ann.targetAudience || ann.targetAudience === 'ALL') return true;

    if (ann.targetAudience === 'STUDENTS' && currentUser?.role === UserRole.STUDENT) return true;
    if (ann.targetAudience === 'PROFESSORS' && currentUser?.role === UserRole.PROFESSOR) return true;

    return false;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file: File) => {
        const isValidType = file.type === 'application/pdf' ||
          file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      const newAttachments = validFiles.map((file: File) => ({
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

  const handlePublish = async () => {
    if (!title || !content) return;

    try {
      setIsPublishing(true);
      const uploadedAttachments = [];

      // Upload files if any
      if (attachedFiles.length > 0) {
        for (const fileObj of attachedFiles) {
          const fileRef = ref(storage, `announcements/${Date.now()}_${fileObj.name}`);
          const snapshot = await uploadBytes(fileRef, fileObj.file);
          const url = await getDownloadURL(snapshot.ref);

          uploadedAttachments.push({
            name: fileObj.name,
            url: url,
            type: fileObj.file.type.startsWith('image/') ? 'image' : 'pdf'
          });
        }
      }

      await addAnnouncement({
        title,
        content,
        date: new Date().toLocaleDateString('pt-BR'),
        type: 'Geral',
        targetType: 'GLOBAL',
        targetAudience,
        expiresAt: expirationDate || undefined,
        targetId: undefined,
        attachments: uploadedAttachments
      });

      setShowModal(false);
      setTitle('');
      setContent('');
      setExpirationDate('');
      setTargetAudience('ALL');
      setAttachedFiles([]);
    } catch (error) {
      console.error("Error publishing announcement:", error);
      showToast('Erro ao publicar comunicado. Tente novamente.', 'error');
    } finally {
      setIsPublishing(false);
    }
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
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-5xl">campaign</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Nenhum aviso publicado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-sm">
              {canManage
                ? "Comece criando o primeiro comunicado para sua comunidade"
                : "Ainda não há comunicados disponíveis no momento"}
            </p>
            {canManage && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-2xl">add_circle</span>
                Criar Primeiro Aviso
              </button>
            )}
          </div>
        ) : (
          announcements.map((ann) => {
            const isRead = currentUser ? ann.readBy.includes(currentUser.id) : false;
            return (
              <div
                key={ann.id}
                onClick={() => !isRead && markAnnouncementAsRead(ann.id)}
                className={`bg-white dark:bg-[#1a202c] p-4 rounded-xl border shadow-sm transition-all ${isRead ? 'border-gray-200 dark:border-gray-700' : 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-900'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold">
                      {ann.targetAudience === 'ALL' ? 'Todos' : ann.targetAudience === 'STUDENTS' ? 'Alunos' : 'Professores'}
                    </span>
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

                {/* Attachments Display */}
                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {ann.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                          <span className="material-symbols-outlined text-primary text-sm">
                            {att.type === 'image' ? 'image' : 'picture_as_pdf'}
                          </span>
                        </div>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate flex-1">
                          {att.name}
                        </span>
                        <span className="material-symbols-outlined text-gray-400 text-sm">open_in_new</span>
                      </a>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-gray-400 mt-2">{ann.date}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Criação - Redesigned */}
      {showModal && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col h-[100dvh]">
          {/* Header */}
          <div className="flex-none bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <button onClick={() => { setShowModal(false); setTitle(''); setContent(''); setExpirationDate(''); setTargetAudience('ALL'); setAttachedFiles([]); }} className="text-gray-600">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg text-gray-900">Novo Comunicado</h1>
            <button
              onClick={() => { setShowModal(false); setTitle(''); setContent(''); setExpirationDate(''); setTargetAudience('ALL'); setAttachedFiles([]); }}
              className="text-primary font-medium text-sm"
            >
              Cancelar
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-6">
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



            {/* Configurações de Envio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-900 font-medium mb-2">Público Alvo</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="ALL">Todos</option>
                  <option value="STUDENTS">Alunos</option>
                  <option value="PROFESSORS">Professores</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-2">Validade (Opcional)</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
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
          </div>

          {/* Fixed Send Button Footer */}
          <div className="flex-none bg-white border-t border-gray-200 p-4 z-10">
            <button
              onClick={handlePublish}
              disabled={!title || !content || isPublishing}
              className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Enviando...
                </>
              ) : (
                'Enviar Comunicado'
              )}
            </button>
          </div>
        </div>
      )
      }

      <BottomNav />
    </div >
  );
};

export default Announcements;
