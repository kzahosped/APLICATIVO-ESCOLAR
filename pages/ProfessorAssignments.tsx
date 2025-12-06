import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Assignment, AssignmentSubmission } from '../types';
import {
    getAssignments,
    getSubjects,
    createAssignment,
    getSubmissionsByAssignment,
    updateSubmission,
    getUsers
} from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';

const ProfessorAssignments: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useApp();
    const { showToast } = useToast();

    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        dueDate: '',
        totalPoints: 10
    });

    useEffect(() => {
        loadData();
    }, [currentUser]);

    const loadData = async () => {
        setLoading(true);
        const [allAssignments, allSubjects, allStudents] = await Promise.all([
            getAssignments(),
            getSubjects(),
            getUsers()
        ]);

        // Filtrar matérias do professor
        const mySubjects = allSubjects.filter(s => s.teacherId === currentUser?.id);
        setSubjects(mySubjects);

        // Filtrar atividades das matérias do professor
        const mySubjectIds = mySubjects.map(s => s.id);
        const myAssignments = allAssignments.filter(a => mySubjectIds.includes(a.subjectId));
        setAssignments(myAssignments);

        setStudents(allStudents.filter(u => u.role === 'STUDENT'));
        setLoading(false);
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();

        const newAssignment: Assignment = {
            id: crypto.randomUUID(),
            title: formData.title,
            description: formData.description,
            subjectId: formData.subjectId,
            teacherId: currentUser?.id || '',
            dueDate: formData.dueDate,
            totalPoints: formData.totalPoints,
            createdAt: new Date().toISOString()
        };

        const success = await createAssignment(newAssignment);
        if (success) {
            showToast('Atividade criada com sucesso!', 'success');
            setIsModalOpen(false);
            setFormData({ title: '', description: '', subjectId: '', dueDate: '', totalPoints: 10 });
            loadData();
        } else {
            showToast('Erro ao criar atividade', 'error');
        }
    };

    const handleViewSubmissions = async (assignment: Assignment) => {
        const subs = await getSubmissionsByAssignment(assignment.id);
        setSubmissions(subs);
        setSelectedAssignment(assignment);
    };

    const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
        const success = await updateSubmission(submissionId, {
            grade,
            feedback,
            status: 'graded'
        });

        if (success) {
            showToast('Nota e feedback enviados!', 'success');
            if (selectedAssignment) {
                handleViewSubmissions(selectedAssignment);
            }
        } else {
            showToast('Erro ao salvar avaliação', 'error');
        }
    };

    const getSubjectName = (subjectId: string) => {
        return subjects.find(s => s.id === subjectId)?.name || 'Matéria';
    };

    const getStudentName = (studentId: string) => {
        return students.find(s => s.id === studentId)?.name || 'Aluno';
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-lg text-gray-900 dark:text-white">Atividades</h1>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Nova
                </button>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : selectedAssignment ? (
                    // Visualização de submissões
                    <div className="space-y-3">
                        <button
                            onClick={() => setSelectedAssignment(null)}
                            className="flex items-center gap-2 text-primary"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Voltar para atividades
                        </button>

                        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl">
                            <h2 className="font-bold text-gray-900 dark:text-white">{selectedAssignment.title}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedAssignment.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Prazo: {new Date(selectedAssignment.dueDate).toLocaleDateString('pt-BR')} | {selectedAssignment.totalPoints} pontos
                            </p>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white px-2">
                            Submissões ({submissions.length})
                        </h3>

                        {submissions.map(sub => (
                            <div key={sub.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{getStudentName(sub.studentId)}</p>
                                        <p className="text-xs text-gray-500">
                                            Enviado em: {new Date(sub.submittedAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'graded' ? 'bg-green-100 text-green-700' :
                                            sub.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {sub.status === 'graded' ? 'Corrigida' :
                                            sub.status === 'submitted' ? 'Entregue' : 'Pendente'}
                                    </span>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{sub.content}</p>
                                    {sub.fileUrl && (
                                        <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary mt-2 inline-block">
                                            📎 Ver arquivo anexo
                                        </a>
                                    )}
                                </div>

                                {sub.status === 'submitted' && (
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max={selectedAssignment.totalPoints}
                                            placeholder="Nota"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            id={`grade-${sub.id}`}
                                        />
                                        <textarea
                                            placeholder="Feedback para o aluno"
                                            className="w-full p-2 border rounded-lg text-sm"
                                            rows={2}
                                            id={`feedback-${sub.id}`}
                                        />
                                        <button
                                            onClick={() => {
                                                const grade = parseFloat((document.getElementById(`grade-${sub.id}`) as HTMLInputElement).value);
                                                const feedback = (document.getElementById(`feedback-${sub.id}`) as HTMLTextAreaElement).value;
                                                if (!isNaN(grade)) {
                                                    handleGradeSubmission(sub.id, grade, feedback);
                                                } else {
                                                    showToast('Digite uma nota válida', 'warning');
                                                }
                                            }}
                                            className="w-full bg-primary text-white py-2 rounded-lg text-sm"
                                        >
                                            Salvar Avaliação
                                        </button>
                                    </div>
                                )}

                                {sub.status === 'graded' && (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                        <p className="text-sm font-bold text-green-700">Nota: {sub.grade}/{selectedAssignment.totalPoints}</p>
                                        {sub.feedback && <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{sub.feedback}</p>}
                                    </div>
                                )}
                            </div>
                        ))}

                        {submissions.length === 0 && (
                            <p className="text-center text-gray-500 py-10">Nenhuma submissão ainda</p>
                        )}
                    </div>
                ) : (
                    // Lista de atividades
                    <>
                        {assignments.map(assignment => (
                            <div
                                key={assignment.id}
                                className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition"
                                onClick={() => handleViewSubmissions(assignment)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{assignment.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {getSubjectName(assignment.subjectId)} | {assignment.totalPoints} pontos
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className={`text-xs px-2 py-1 rounded-full ${isOverdue(assignment.dueDate) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {isOverdue(assignment.dueDate) ? '⏰ Vencida' : '📅'} {new Date(assignment.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {assignments.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                <p>Nenhuma atividade criada ainda</p>
                                <p className="text-sm mt-2">Clique em "Nova" para criar</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Criação */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nova Atividade</h2>
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matéria</label>
                                <select
                                    required
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-800"
                                >
                                    <option value="">Selecione...</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    placeholder="Ex: Lista de Exercícios 1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prazo</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pontos</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.totalPoints}
                                        onChange={e => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
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
                                    Criar Atividade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessorAssignments;
