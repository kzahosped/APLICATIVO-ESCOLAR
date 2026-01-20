import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { getSubjects } from '../services/firestoreService';

const StudentSimpleReport: React.FC = () => {
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

    // Calculate simple subject grades
    const subjectGrades = useMemo(() => {
        if (!currentUser) return [];

        const studentGrades = grades.filter(g => g.studentId === currentUser.id);

        return studentGrades.map(grade => {
            const subject = subjects.find(s => s.id === grade.subjectId);
            return {
                id: grade.subjectId,
                name: subject?.name || 'Matéria Desconhecida',
                average: grade.finalAverage || 0,
                status: grade.status || 'Em Curso'
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [currentUser, grades, subjects]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = subjectGrades.length;
        const validGrades = subjectGrades.filter(s => s.average > 0);
        const average = validGrades.length > 0
            ? validGrades.reduce((sum, s) => sum + s.average, 0) / validGrades.length
            : 0;
        const approved = subjectGrades.filter(s => s.status === 'Aprovado').length;
        const inProgress = subjectGrades.filter(s => s.status === 'Em Curso').length;
        const failed = subjectGrades.filter(s => s.status === 'Reprovado').length;

        return { total, average, approved, inProgress, failed };
    }, [subjectGrades]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Aprovado':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-700 dark:text-green-400',
                    icon: 'check_circle'
                };
            case 'Reprovado':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    text: 'text-red-700 dark:text-red-400',
                    icon: 'cancel'
                };
            default:
                return {
                    bg: 'bg-amber-100 dark:bg-amber-900/30',
                    text: 'text-amber-700 dark:text-amber-400',
                    icon: 'schedule'
                };
        }
    };

    const getGradeColor = (average: number) => {
        if (average >= 7.0) return 'text-green-500';
        if (average >= 5.0) return 'text-amber-500';
        if (average > 0) return 'text-red-500';
        return 'text-gray-400';
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0f0f1a] dark:to-[#1a1a2e]">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 pt-12 pb-8"
                style={{ paddingTop: 'max(48px, env(safe-area-inset-top))' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-xl active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-xl text-white">Boletim</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <p className="text-3xl font-bold text-white">{stats.average.toFixed(1)}</p>
                        <p className="text-white/80 text-xs">Média Geral</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                        <p className="text-white/80 text-xs">Matérias</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                        <p className="text-3xl font-bold text-white">{stats.approved}</p>
                        <p className="text-white/80 text-xs">Aprovado</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 space-y-3">
                {subjectGrades.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl p-8 text-center shadow-lg animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-gray-400 text-4xl">assignment</span>
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Nenhuma nota ainda</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            As notas serão exibidas aqui quando forem lançadas.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl shadow-lg overflow-hidden animate-fade-in">
                        {subjectGrades.map((subject, idx) => {
                            const style = getStatusStyle(subject.status);
                            return (
                                <div
                                    key={subject.id}
                                    className={`p-4 flex items-center gap-4 ${idx < subjectGrades.length - 1
                                            ? 'border-b border-gray-100 dark:border-gray-800'
                                            : ''
                                        }`}
                                >
                                    {/* Status Icon */}
                                    <div className={`p-2.5 rounded-xl ${style.bg}`}>
                                        <span className={`material-symbols-outlined ${style.text}`}>
                                            {style.icon}
                                        </span>
                                    </div>

                                    {/* Subject Name */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                            {subject.name}
                                        </h3>
                                        <p className={`text-xs font-medium ${style.text}`}>
                                            {subject.status}
                                        </p>
                                    </div>

                                    {/* Grade */}
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${getGradeColor(subject.average)}`}>
                                            {subject.average > 0 ? subject.average.toFixed(1) : '—'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Legend */}
                {subjectGrades.length > 0 && (
                    <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-4 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Legenda</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">Aprovado (≥7.0)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">Em Curso</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                <span className="text-gray-600 dark:text-gray-400">Reprovado</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentSimpleReport;
