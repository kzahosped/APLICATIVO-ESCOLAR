import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Subject, User } from '../types';
import { createSubject, getSubjects, updateSubject, deleteSubject, getUsers } from '../services/firestoreService';

const AdminSubjects: React.FC = () => {
    const { currentUser, logout } = useApp();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [professors, setProfessors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        teacherId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [fetchedSubjects, fetchedUsers] = await Promise.all([
            getSubjects(),
            getUsers()
        ]);
        setSubjects(fetchedSubjects);
        setProfessors(fetchedUsers.filter(u => u.role === 'PROFESSOR'));
        setLoading(false);
    };

    const handleOpenModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({
                name: subject.name,
                code: subject.code,
                description: subject.description || '',
                teacherId: subject.teacherId || ''
            });
        } else {
            setEditingSubject(null);
            setFormData({
                name: '',
                code: '',
                description: '',
                teacherId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const subjectData: Subject = {
            id: editingSubject ? editingSubject.id : crypto.randomUUID(),
            name: formData.name,
            code: formData.code,
            description: formData.description,
            teacherId: formData.teacherId
        };

        let success = false;
        if (editingSubject) {
            success = await updateSubject(editingSubject.id, subjectData);
        } else {
            success = await createSubject(subjectData);
        }

        if (success) {
            alert(editingSubject ? 'Matéria atualizada!' : 'Matéria criada!');
            setIsModalOpen(false);
            fetchData();
        } else {
            alert('Erro ao salvar matéria.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta matéria?')) {
            const success = await deleteSubject(id);
            if (success) {
                fetchData();
            } else {
                alert('Erro ao excluir matéria.');
            }
        }
    };

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="text-gray-500">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-gray-900 dark:text-white">Gerenciar Matérias</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Nova
                </button>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : subjects.length === 0 ? (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined text-4xl text-gray-300">menu_book</span>
                        <p className="text-gray-500 mt-2">Nenhuma matéria cadastrada.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {subjects.map(subject => {
                            const teacher = professors.find(p => p.id === subject.teacherId);
                            return (
                                <div key={subject.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{subject.name}</h3>
                                            <p className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded inline-block mt-1">
                                                {subject.code}
                                            </p>
                                            {teacher && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-base">person</span>
                                                    Prof. {teacher.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(subject)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(subject.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingSubject ? 'Editar Matéria' : 'Nova Matéria'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Matéria</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                    placeholder="Ex: Matemática Financeira"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                    placeholder="Ex: MAT-101"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Professor Responsável</label>
                                <select
                                    value={formData.teacherId}
                                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                >
                                    <option value="">Selecione um professor...</option>
                                    {professors.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição (Opcional)</label>
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

export default AdminSubjects;
