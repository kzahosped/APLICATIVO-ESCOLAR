import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { getSubjects } from '../services/firestoreService';
import BottomNav from '../components/BottomNav';

interface Alert {
    type: 'danger' | 'warning' | 'success';
    message: string;
    icon: string;
}

const StudentPerformance: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, grades } = useApp();
    const [subjects, setSubjects] = useState<any[]>([]);

    useEffect(() => {
        const loadSubjects = async () => {
            const allSubjects = await getSubjects();
            setSubjects(allSubjects);
        };
        loadSubjects();
    }, []);

    // Calcular performance por matéria
    const performanceData = useMemo(() => {
        if (!currentUser) return [];

        const studentGrades = grades.filter(g => g.studentId === currentUser.id);

        return studentGrades.map(grade => {
            const subject = subjects.find(s => s.id === grade.subjectId);
            const average = grade.finalAverage || 0;

            return {
                subjectId: grade.subjectId,
                subjectName: subject?.name || 'Matéria',
                average,
                n1: grade.n1 || 0,
                n2: grade.n2 || 0,
                work: grade.work || 0,
                status: grade.status || 'Em Curso'
            };
        }).filter(p => p.average > 0);
    }, [currentUser, grades, subjects]);

    // Estat ísticas gerais
    const stats = useMemo(() => {
        if (performanceData.length === 0) {
            return {
                overall: 0,
                highest: 0,
                lowest: 0,
                approved: 0,
                atRisk: 0,
                failed: 0
            };
        }

        const averages = performanceData.map(p => p.average);
        const overall = averages.reduce((a, b) => a + b, 0) / averages.length;
        const highest = Math.max(...averages);
        const lowest = Math.min(...averages);
        const approved = performanceData.filter(p => p.average >= 7).length;
        const atRisk = performanceData.filter(p => p.average >= 5 && p.average < 7).length;
        const failed = performanceData.filter(p => p.average < 5).length;

        return { overall, highest, lowest, approved, atRisk, failed };
    }, [performanceData]);

    // Gerar alertas
    const alerts = useMemo((): Alert[] => {
        const alertList: Alert[] = [];

        performanceData.forEach(perf => {
            if (perf.average < 5) {
                alertList.push({
                    type: 'danger',
                    message: `${perf.subjectName}: Nota crítica (${perf.average.toFixed(1)})`,
                    icon: 'error'
                });
            } else if (perf.average < 7) {
                alertList.push({
                    type: 'warning',
                    message: `${perf.subjectName}: Atenção necessária (${perf.average.toFixed(1)})`,
                    icon: 'warning'
                });
            }
        });

        if (stats.overall >= 7) {
            alertList.unshift({
                type: 'success',
                message: `Excelente desempenho! Média geral: ${stats.overall.toFixed(1)}`,
                icon: 'check_circle'
            });
        }

        return alertList;
    }, [performanceData, stats]);

    // Ordenar matérias por desempenho
    const sortedByPerformance = [...performanceData].sort((a, b) => b.average - a.average);

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Análise de Performance</h1>
            </div>

            <div className="p-4 space-y-4">
                {performanceData.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">analytics</span>
                        <p>Nenhuma nota registrada ainda</p>
                    </div>
                ) : (
                    <>
                        {/* Cards de Estatísticas */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                                <p className="text-xs opacity-90">Média Geral</p>
                                <p className="text-3xl font-bold">{stats.overall.toFixed(1)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
                                <p className="text-xs opacity-90">Maior Nota</p>
                                <p className="text-3xl font-bold">{stats.highest.toFixed(1)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white">
                                <p className="text-xs opacity-90">Menor Nota</p>
                                <p className="text-3xl font-bold">{stats.lowest.toFixed(1)}</p>
                            </div>
                        </div>

                        {/* Status das Disciplinas */}
                        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Status das Disciplinas</h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
                                    <p className="text-xs text-green-600">Aprovado</p>
                                </div>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-yellow-700">{stats.atRisk}</p>
                                    <p className="text-xs text-yellow-600">Atenção</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
                                    <p className="text-xs text-red-600">Crítico</p>
                                </div>
                            </div>
                        </div>

                        {/* Alertas */}
                        {alerts.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-bold text-gray-900 dark:text-white px-2">Alertas</h3>
                                {alerts.map((alert, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-xl flex items-center gap-3 ${alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' :
                                            alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500' :
                                                'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
                                            }`}
                                    >
                                        <span className={`material-symbols-outlined ${alert.type === 'danger' ? 'text-red-600' :
                                            alert.type === 'warning' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {alert.icon}
                                        </span>
                                        <p className={`text-sm font-medium ${alert.type === 'danger' ? 'text-red-800 dark:text-red-200' :
                                            alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                                                'text-green-800 dark:text-green-200'
                                            }`}>
                                            {alert.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Ranking de Disciplinas */}
                        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Desempenho por Disciplina</h3>
                            <div className="space-y-3">
                                {sortedByPerformance.map((perf, idx) => {
                                    const percentage = (perf.average / 10) * 100;
                                    const color = perf.average >= 7 ? 'bg-green-500' : perf.average >= 5 ? 'bg-yellow-500' : 'bg-red-500';

                                    return (
                                        <div key={perf.subjectId}>
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{perf.subjectName}</span>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">{perf.average.toFixed(1)}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${color} transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                <span>P1: {perf.n1.toFixed(1)}</span>
                                                <span>P2: {perf.n2.toFixed(1)}</span>
                                                <span>Trab: {perf.work.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Gráfico de Comparação Simples (CSS) */}
                        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Comparação Visual</h3>
                            <div className="flex items-end justify-around h-48 border-b border-gray-200 dark:border-gray-700">
                                {sortedByPerformance.slice(0, 5).map(perf => {
                                    const height = (perf.average / 10) * 100;
                                    const color = perf.average >= 7 ? 'bg-green-500' : perf.average >= 5 ? 'bg-yellow-500' : 'bg-red-500';

                                    return (
                                        <div key={perf.subjectId} className="flex flex-col items-center gap-2" style={{ flex: 1 }}>
                                            <div className="text-xs font-bold text-gray-900 dark:text-white">{perf.average.toFixed(1)}</div>
                                            <div
                                                className={`w-full max-w-[60px] ${color} rounded-t-lg transition-all`}
                                                style={{ height: `${height}%` }}
                                            />
                                            <div className="text-[10px] text-center text-gray-600 dark:text-gray-400 leading-tight">
                                                {perf.subjectName.substring(0, 10)}...
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dicas de Melhoria */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-600 text-2xl">lightbulb</span>
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Dicas para Melhorar</h4>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                        {stats.failed > 0 && <li>• Foque nas disciplinas críticas primeiro</li>}
                                        {stats.atRisk > 0 && <li>• Revise conteúdos das disciplinas em atenção</li>}
                                        <li>• Participe das aulas e tire dúvidas</li>
                                        <li>• Faça os trabalhos e atividades extras</li>
                                        {stats.overall >= 7 && <li>• Continue assim! Seu desempenho está ótimo!</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentPerformance;
