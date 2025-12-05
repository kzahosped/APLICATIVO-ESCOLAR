import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

interface SubjectGrade {
    subject: string;
    average: number;
    grades: number[];
    status: 'Aprovado' | 'Recuperação' | 'Reprovado';
}

const StudentReport: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, grades } = useApp();

    // Calculate subject-level statistics
    const subjectGrades: SubjectGrade[] = useMemo(() => {
        if (!currentUser) return [];

        const studentGrades = grades.filter(g => g.studentId === currentUser.id);
        const grouped = new Map<string, number[]>();

        studentGrades.forEach(grade => {
            if (!grouped.has(grade.subject)) {
                grouped.set(grade.subject, []);
            }
            grouped.get(grade.subject)!.push(grade.value);
        });

        return Array.from(grouped.entries()).map(([subject, gradesList]) => {
            const average = gradesList.reduce((a, b) => a + b, 0) / gradesList.length;
            let status: 'Aprovado' | 'Recuperação' | 'Reprovado';

            if (average >= 7.0) status = 'Aprovado';
            else if (average >= 5.0) status = 'Recuperação';
            else status = 'Reprovado';

            return {
                subject,
                average,
                grades: gradesList,
                status
            };
        }).sort((a, b) => a.subject.localeCompare(b.subject));
    }, [currentUser, grades]);

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

        const average = subjectGrades.reduce((sum, s) => sum + s.average, 0) / subjectGrades.length;
        const approved = subjectGrades.filter(s => s.status === 'Aprovado').length;
        const recovery = subjectGrades.filter(s => s.status === 'Recuperação').length;
        const failed = subjectGrades.filter(s => s.status === 'Reprovado').length;

        return {
            average,
            total: subjectGrades.length,
            approved,
            recovery,
            failed
        };
    }, [subjectGrades]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprovado': return 'bg-green-100 text-green-700 border-green-200';
            case 'Recuperação': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
                                    <p className="opacity-90">Recuperação</p>
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
                                    key={subject.subject}
                                    className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{subject.subject}</h4>
                                            <p className="text-xs text-gray-500">{subject.grades.length} avaliação{subject.grades.length !== 1 ? 'ões' : ''}</p>
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
                                                {subject.average.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${getProgressColor(subject.average)}`}
                                                style={{ width: `${Math.min((subject.average / 10) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Individual Grades */}
                                    <div className="flex flex-wrap gap-2">
                                        {subject.grades.map((grade, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1"
                                            >
                                                <p className="text-xs text-gray-500">Nota {idx + 1}</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{grade.toFixed(1)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Warning for low grades */}
                                    {subject.status === 'Reprovado' && (
                                        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                                            <p className="text-xs text-red-800 dark:text-red-200 font-medium">
                                                Risco de reprovação - média abaixo de 5.0
                                            </p>
                                        </div>
                                    )}

                                    {subject.status === 'Recuperação' && (
                                        <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-yellow-600 text-sm">info</span>
                                            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                                                Necessário recuperação - média entre 5.0 e 6.9
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
                                <p>⚠️ <strong>Recuperação:</strong> 5.0 ≤ Média &lt; 7.0</p>
                                <p>❌ <strong>Reprovado:</strong> Média &lt; 5.0</p>
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
