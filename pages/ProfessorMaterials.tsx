import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate, useLocation } from 'react-router-dom';
import { Material } from '../types';
import { createMaterial, getMaterials, deleteMaterial } from '../services/firestoreService';

const ProfessorMaterials: React.FC = () => {
    const { currentUser } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const { subjectId, subjectName } = location.state || {};

    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        type: 'link' as 'link' | 'file',
        description: ''
    });

    useEffect(() => {
        if (!subjectId) {
            navigate('/professor');
            return;
        }
        fetchMaterials();
    }, [subjectId]);

    const fetchMaterials = async () => {
        setLoading(true);
        if (subjectId) {
            const fetchedMaterials = await getMaterials(subjectId);
            // Ordenar por data (mais recente primeiro)
            fetchedMaterials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setMaterials(fetchedMaterials);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectId) return;

        const newMaterial: Material = {
            id: crypto.randomUUID(),
            title: formData.title,
            url: formData.url,
            type: formData.type,
            subjectId: subjectId,
            date: new Date().toISOString(),
            description: formData.description
        };

        const success = await createMaterial(newMaterial);

        if (success) {
            alert('Material enviado com sucesso!');
            setIsModalOpen(false);
            setFormData({ title: '', url: '', type: 'link', description: '' });
            fetchMaterials();
        } else {
            alert('Erro ao enviar material.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este material?')) {
            const success = await deleteMaterial(id);
            if (success) {
                fetchMaterials();
            } else {
                alert('Erro ao excluir material.');
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
                    <div>
                        <h1 className="font-bold text-gray-900 dark:text-white">Materiais de Estudo</h1>
                        <p className="text-xs text-gray-500">{subjectName}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Novo
                </button>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando materiais...</p>
                ) : materials.length === 0 ? (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined text-4xl text-gray-300">folder_open</span>
                        <p className="text-gray-500 mt-2">Nenhum material enviado para esta turma.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {materials.map(material => (
                            <div key={material.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className={`p-2 rounded-lg h-fit ${material.type === 'link' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                            <span className="material-symbols-outlined">
                                                {material.type === 'link' ? 'link' : 'description'}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{material.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Enviado em {new Date(material.date).toLocaleDateString('pt-BR')}
                                            </p>
                                            {material.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{material.description}</p>
                                            )}
                                            <a
                                                href={material.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline mt-2 inline-block font-medium"
                                            >
                                                Acessar Material
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(material.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a202c] rounded-xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Novo Material</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                    placeholder="Ex: Slides da Aula 1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as 'link' | 'file' })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                >
                                    <option value="link">Link da Web</option>
                                    <option value="file">Arquivo (URL)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL / Link</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white"
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-gray-500 mt-1">Cole o link do Drive, YouTube, PDF, etc.</p>
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
                                    Enviar
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

export default ProfessorMaterials;
