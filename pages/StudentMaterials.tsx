import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Material, Subject } from '../types';
import { getMaterials, getSubjects } from '../services/firestoreService';

const StudentMaterials: React.FC = () => {
    const { currentUser } = useApp();
    const navigate = useNavigate();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [fetchedMaterials, fetchedSubjects] = await Promise.all([
                getMaterials(),
                getSubjects()
            ]);

            // Filtrar materiais (opcional: aqui poderia filtrar por turma se tivesse o vinculo)
            // Por enquanto mostra todos os materiais públicos ou vinculados a matérias
            setMaterials(fetchedMaterials);
            setSubjects(fetchedSubjects);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Agrupar materiais por matéria
    const materialsBySubject = materials.reduce((acc, material) => {
        if (!acc[material.subjectId]) {
            acc[material.subjectId] = [];
        }
        acc[material.subjectId].push(material);
        return acc;
    }, {} as Record<string, Material[]>);

    // Filtrar matérias que têm materiais
    const subjectsWithMaterials = subjects.filter(s => materialsBySubject[s.id]?.length > 0);

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="text-gray-500">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-gray-900 dark:text-white">Materiais de Estudo</h1>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Carregando...</p>
                ) : subjectsWithMaterials.length === 0 ? (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined text-4xl text-gray-300">folder_off</span>
                        <p className="text-gray-500 mt-2">Nenhum material disponível no momento.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subjectsWithMaterials.map(subject => (
                            <div key={subject.id} className="bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <button
                                    onClick={() => setSelectedSubjectId(selectedSubjectId === subject.id ? null : subject.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1f2937] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">folder</span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{subject.name}</h3>
                                            <p className="text-xs text-gray-500">{materialsBySubject[subject.id].length} arquivos</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-400">
                                        {selectedSubjectId === subject.id ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>

                                {selectedSubjectId === subject.id && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-[#1f2937]/50">
                                        {materialsBySubject[subject.id]
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map(material => (
                                                <div key={material.id} className="flex items-start gap-3 bg-white dark:bg-[#1a202c] p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className={`p-2 rounded-lg shrink-0 ${material.type === 'link' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        <span className="material-symbols-outlined text-xl">
                                                            {material.type === 'link' ? 'link' : 'description'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{material.title}</h4>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(material.date).toLocaleDateString('pt-BR')}
                                                        </p>
                                                        {material.description && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{material.description}</p>
                                                        )}
                                                        <a
                                                            href={material.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-medium text-primary hover:underline mt-2 inline-block"
                                                        >
                                                            Acessar
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default StudentMaterials;
