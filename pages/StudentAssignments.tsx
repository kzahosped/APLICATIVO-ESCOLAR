import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Assignment, AssignmentSubmission } from '../types';
import {
    getAssignments,
    getSubjects,
    createSubmission,
    getSubmissionsByStudent,
    updateSubmission
} from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';

const StudentAssignments: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const { showToast } = useToast();

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submitForm, setSubmitForm] = useState({
        content: '',
        fileUrl: ''
    });

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        const [allAssignments, allSubjects, mySubmissions] = await Promise.all([
            getAssignments(),
            getSubjects(),
            getSubmissionsByStudent(currentUser?.id || '')
        ]);

        setAssignments(allAssignments);
        setSubjects(allSubjects);
        setSubmissions(mySubmissions);
        setLoading(false);
    };

    const getSubjectName = (subjectId: string) => {
        return subjects.find(s => s.id === subjectId)?.name || 'Matéria';
    };

    const getSubmissionForAssignment = (assignmentId: string) => {
        return submissions.find(s => s.assignmentId === assignmentId);
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAssignment) return;

        const existingSubmission = getSubmissionForAssignment(selectedAssignment.id);

        if (existingSubmission) {
            // Atualizar submissão existente
            const success = await updateSubmission(existingSubmission.id, {
                content: submitForm.content,
                fileUrl: submitForm.fileUrl || undefined,
                submittedAt: new Date().toISOString(),
                status: 'submitted'
            });

            if (success) {
                showToast('Resposta atualizada com sucesso!', 'success');
                setIsSubmitModalOpen(false);
                setSelectedAssignment(null);
                setSubmitForm({ content: '', fileUrl: '' });
                loadData();
            } else {
                showToast('Erro ao atualizar resposta', 'error');
            }
        } else {
            // Criar nova submissão
            const newSubmission: AssignmentSubmission = {
                id: crypto.randomUUID(),
                assignmentId: selectedAssignment.id,
                studentId: currentUser?.id || '',
                content: submitForm.content,
                fileUrl: submitForm.fileUrl || undefined,
                submittedAt: new Date().toISOString(),
                status: 'submitted'
            };

            const success = await createSubmission(newSubmission);

            if (success) {
                showToast('Atividade enviada com sucesso!', 'success');
                setIsSubmitModalOpen(false);
                setSelectedAssignment(null);
                setSubmitForm({ content: '', fileUrl: '' });
                loadData();
            } else {
                showToast('Erro ao enviar atividade', 'error');
            }
        }
    };

    const handleOpenSubmitModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        const existingSub = getSubmissionForAssignment(assignment.id);
        if (existingSub) {
            setSubmitForm({
                content: existingSub.content,
                fileUrl: existingSub.fileUrl || ''
            });
        }
        setIsSubmitModalOpen(true);
    };

    const getStatusBadge = (assignment: Assignment) => {
        const submission = getSubmissionForAssignment(assignment.id);

        if (!submission) {
            return isOverdue(assignment.dueDate)
                ? { text: 'Atrasada', color: 'bg-red-100 text-red-700' }
                : { text: 'Pendente', color: 'bg-yellow-100 text-yellow-700' };
        }

        if (submission.status === 'graded') {
            return { text: 'Corrigida', color: 'bg-green-100 text-green-700' };
        }

        return { text: 'Entregue', color: 'bg-blue-100 text-blue-700' };
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Minhas Atividades</h1>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : (
                    <>
                        {assignments.map(assignment => {
                            const submission = getSubmissionForAssignment(assignment.id);
                            const status = getStatusBadge(assignment);
                            const overdue = isOverdue(assignment.dueDate);

                            return (
                                <div
                                    key={assignment.id}
                                    className={`bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm ${overdue && !submission ? 'border-l-4 border-red-500' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {getSubjectName(assignment.subjectId)} | {assignment.totalPoints} pontos
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                                                {status.text}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                📅 {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>

                                        {submission?.status === 'graded' ? (
                                            <button
                                                onClick={() => setSelectedAssignment(assignment)}
                                                className="text-sm text-primary underline"
                                            >
                                                Ver Feedback
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleOpenSubmitModal(assignment)}
                                                className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm"
                                            >
                                                {submission ? 'Editar Resposta' : 'Enviar'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Mostrar nota se corrigida */}
                                    {submission?.status === 'graded' && (
                                        <div className="mt-3 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <p className="text-sm font-bold text-green-700">
                                                Nota: {submission.grade}/{assignment.totalPoints}
                                            </p>
                                            {submission.feedback && (
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                    📝 {submission.feedback}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {assignments.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
                                <p>Nenhuma atividade disponível</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Envio/Edição */}
            {isSubmitModalOpen && selectedAssignment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{selectedAssignment.title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedAssignment.description}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Sua Resposta *
                                </label>
                                <textarea
                                    required
                                    value={submitForm.content}
                                    onChange={e => setSubmitForm({ ...submitForm, content: e.target.value })}
                                    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    rows={6}
                                    placeholder="Digite sua resposta aqui..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link do Arquivo (opcional)
                                </label>
                                <input
                                    type="url"
                                    value={submitForm.fileUrl}
                                    onChange={e => setSubmitForm({ ...submitForm, fileUrl: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    placeholder="https://drive.google.com/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Cole o link do Google Drive, Dropbox ou outro serviço
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSubmitModalOpen(false);
                                        setSelectedAssignment(null);
                                        setSubmitForm({ content: '', fileUrl: '' });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Enviar Atividade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Feedback (visualização apenas) */}
            {!isSubmitModalOpen && selectedAssignment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Feedback da Atividade</h2>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Atividade</p>
                                <p className="text-gray-900 dark:text-white">{selectedAssignment.title}</p>
                            </div>

                            {(() => {
                                const sub = getSubmissionForAssignment(selectedAssignment.id);
                                return sub ? (
                                    <>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <p className="text-lg font-bold text-green-700">
                                                Nota: {sub.grade}/{selectedAssignment.totalPoints}
                                            </p>
                                        </div>

                                        {sub.feedback && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentário do Professor</p>
                                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{sub.feedback}</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : null;
                            })()}
                        </div>

                        <button
                            onClick={() => setSelectedAssignment(null)}
                            className="w-full mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAssignments;
