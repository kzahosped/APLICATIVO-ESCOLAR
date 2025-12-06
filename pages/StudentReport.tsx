import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { getSubjects } from '../services/firestoreService';

interface SubjectGrade {
    subject: string;
    subjectId: string;
    average: number;
    n1?: number;
    n2?: number;
    work?: number;
    recovery?: number;
    status: 'Aprovado' | 'Reprovado' | 'Em Curso';
}

const StudentReport: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, grades } = useApp();
    const [subjects, setSubjects] = React.useState<any[]>([]);

    React.useEffect(() => {
        const loadSubjects = async () => {
            const allSubjects = await getSubjects();
            setSubjects(allSubjects);
        };
        loadSubjects();
    }, []);

    // Calculate subject-level statistics
    const subjectGrades: SubjectGrade[] = useMemo(() => {
        if (!currentUser) return [];

        const studentGrades = grades.filter(g => g.studentId === currentUser.id);

        return studentGrades.map(grade => {
            const subject = subjects.find(s => s.id === grade.subjectId);
            const subjectName = subject?.name || 'Matéria Desconhecida';

            // Usar finalAverage se já estiver calculado, senão calcular
            let average = grade.finalAverage || 0;
            let status: 'Aprovado' | 'Reprovado' | 'Em Curso' = grade.status || 'Em Curso';

            return {
                subject: subjectName,
                subjectId: grade.subjectId,
                average,
                n1: grade.n1,
                n2: grade.n2,
                work: grade.work,
                recovery: grade.recovery,
                status
            };
        }).sort((a, b) => a.subject.localeCompare(b.subject));
    }, [currentUser, grades, subjects]);

    // Calculate overall statistics
    const overallStats = useMemo(() => {
        if (subjectGrades.length === 0) {
            return {
                average: 0,
                total: 0,
                approved: 0,
                recovery: 0,
                failed: 0
            };
        }

        // Filtrar apenas matérias com média válida
        const validGrades = subjectGrades.filter(s => s.average > 0);
        const average = validGrades.length > 0
            ? validGrades.reduce((sum, s) => sum + s.average, 0) / validGrades.length
            : 0;
        const approved = subjectGrades.filter(s => s.status === 'Aprovado').length;
        const failed = subjectGrades.filter(s => s.status === 'Reprovado').length;
        const inProgress = subjectGrades.filter(s => s.status === 'Em Curso').length;

        return {
            average,
            total: subjectGrades.length,
            approved,
            recovery: inProgress,
            failed
        };
    }, [subjectGrades]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprovado': return 'bg-green-100 text-green-700 border-green-200';
            case 'Em Curso': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Reprovado': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getProgressColor = (average: number) => {
        if (average >= 7.0) return 'bg-green-500';
        if (average >= 5.0) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Boletim</h1>
            </div>

            <div className="p-4 space-y-4">
                {subjectGrades.length === 0 ? (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
                        <p className="text-gray-500">Nenhuma nota registrada ainda</p>
                    </div>
                ) : (
                    <>
                        {/* Overall Stats Card */}
                        <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-4xl">school</span>
                                <div>
                                    <h2 className="font-bold text-xl">Desempenho Geral</h2>
                                    <p className="text-sm opacity-90">Ano Letivo 2024</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                                    <p className="text-xs opacity-90 mb-1">Média Geral</p>
                                    <p className="text-3xl font-bold">{overallStats.average.toFixed(1)}</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                                    <p className="text-xs opacity-90 mb-1">Matérias</p>
                                    <p className="text-3xl font-bold">{overallStats.total}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-green-500/30 rounded-lg p-2 text-center">
                                    <p className="opacity-90">Aprovado</p>
                                    <p className="text-lg font-bold">{overallStats.approved}</p>
                                </div>
                                <div className="bg-yellow-500/30 rounded-lg p-2 text-center">
                                    <p className="opacity-90">Em Curso</p>
                                    <p className="text-lg font-bold">{overallStats.recovery}</p>
                                </div>
                                <div className="bg-red-500/30 rounded-lg p-2 text-center">
                                    <p className="opacity-90">Reprovado</p>
                                    <p className="text-lg font-bold">{overallStats.failed}</p>
                                </div>
                            </div>
                        </div>

                        {/* Subject Cards */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-900 dark:text-white px-2">Matérias</h3>

                            {subjectGrades.map((subject) => (
                                <div
                                    key={subject.subjectId}
                                    className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{subject.subject}</h4>
                                            <p className="text-xs text-gray-500">Notas lançadas</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(subject.status)}`}>
                                            {subject.status}
                                        </span>
                                    </div>

                                    {/* Average Display */}
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Média</span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {subject.average > 0 ? subject.average.toFixed(1) : '-'}
                                            </span>
                                        </div>
                                        {subject.average > 0 && (
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${getProgressColor(subject.average)}`}
                                                    style={{ width: `${Math.min((subject.average / 10) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Individual Grades */}
                                    <div className="flex flex-wrap gap-2">
                                        {subject.n1 !== undefined && subject.n1 !== null && (
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1">
                                                <p className="text-xs text-gray-500">Prova 1</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{subject.n1.toFixed(1)}</p>
                                            </div>
                                        )}
                                        {subject.n2 !== undefined && subject.n2 !== null && (
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1">
                                                <p className="text-xs text-gray-500">Prova 2</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{subject.n2.toFixed(1)}</p>
                                            </div>
                                        )}
                                        {subject.work !== undefined && subject.work !== null && (
                                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1">
                                                <p className="text-xs text-gray-500">Trabalho</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{subject.work.toFixed(1)}</p>
                                            </div>
                                        )}
                                        {subject.recovery !== undefined && subject.recovery !== null && (
                                            <div className="bg-red-100 dark:bg-red-900/20 rounded-lg px-3 py-1">
                                                <p className="text-xs text-red-600">Recuperação</p>
                                                <p className="text-sm font-bold text-red-700 dark:text-red-300">{subject.recovery.toFixed(1)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning for low grades */}
                                    {subject.status === 'Reprovado' && (
                                        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                                            <p className="text-xs text-red-800 dark:text-red-200 font-medium">
                                                Risco de reprovação - média abaixo de 7.0
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Legenda</h4>
                            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <p>✅ <strong>Aprovado:</strong> Média ≥ 7.0</p>
                                <p>⏳ <strong>Em Curso:</strong> Notas ainda sendo lançadas</p>
                                <p>❌ <strong>Reprovado:</strong> Média &lt; 7.0</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentReport;
