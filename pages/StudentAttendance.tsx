import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';
import { AttendanceRecord, AttendanceStatus } from '../types';

interface SubjectStats {
    subject: string;
    total: number;
    presente: number;
    ausente: number;
    justificado: number;
    percentage: number;
}

const StudentAttendance: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, getStudentAttendance } = useApp();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            loadAttendance();
        }
    }, [currentUser]);

    const loadAttendance = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const data = await getStudentAttendance(currentUser.id);
            setRecords(data);
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group by subject and calculate stats
    const subjectStats: SubjectStats[] = React.useMemo(() => {
        const grouped = new Map<string, { presente: number; ausente: number; justificado: number }>();

        records.forEach(record => {
            const studentData = record.students.find(s => s.studentId === currentUser?.id);
            if (!studentData) return;

            if (!grouped.has(record.subject)) {
                grouped.set(record.subject, { presente: 0, ausente: 0, justificado: 0 });
            }

            const stats = grouped.get(record.subject)!;
            if (studentData.status === 'Presente') stats.presente++;
            else if (studentData.status === 'Ausente') stats.ausente++;
            else if (studentData.status === 'Justificado') stats.justificado++;
        });

        return Array.from(grouped.entries()).map(([subject, counts]) => {
            const total = counts.presente + counts.ausente + counts.justificado;
            const percentage = total > 0 ? (counts.presente / total) * 100 : 0;

            return {
                subject,
                total,
                ...counts,
                percentage
            };
        }).sort((a, b) => a.subject.localeCompare(b.subject));
    }, [records, currentUser]);

    // Get detailed records for selected subject
    const selectedRecords = React.useMemo(() => {
        if (!selectedSubject) return [];
        return records
            .filter(r => r.subject === selectedSubject)
            .map(r => ({
                date: r.date,
                status: r.students.find(s => s.studentId === currentUser?.id)?.status || 'Presente'
            }))
            .sort((a, b) => b.date.localeCompare(a.date));
    }, [selectedSubject, records, currentUser]);

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case 'Presente': return 'bg-green-100 text-green-700';
            case 'Ausente': return 'bg-red-100 text-red-700';
            case 'Justificado': return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case 'Presente': return 'check_circle';
            case 'Ausente': return 'cancel';
            case 'Justificado': return 'assignment_late';
        }
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => selectedSubject ? setSelectedSubject(null) : navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                    {selectedSubject || 'Minha Frequência'}
                </h1>
            </div>

            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-10">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        <p className="mt-2 text-gray-500">Carregando...</p>
                    </div>
                ) : selectedSubject ? (
                    // Detail view for selected subject
                    <div className="space-y-2">
                        {selectedRecords.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Nenhum registro de frequência
                            </div>
                        ) : (
                            selectedRecords.map((record, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(record.date).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">{record.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 ${getStatusColor(record.status)}`}>
                                        <span className="material-symbols-outlined text-sm">{getStatusIcon(record.status)}</span>
                                        {record.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Subject list view
                    <>
                        {subjectStats.length === 0 ? (
                            <div className="text-center py-10">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">event_available</span>
                                <p className="text-gray-500">Nenhum registro de frequência ainda</p>
                            </div>
                        ) : (
                            <>
                                {/* Overall Warning */}
                                {subjectStats.some(s => s.percentage < 75) && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                        <div className="flex gap-3">
                                            <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                                            <div>
                                                <h3 className="font-bold text-red-900 dark:text-red-100">Atenção: Frequência Baixa</h3>
                                                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                                                    Você está com menos de 75% de presença em uma ou mais matérias.
                                                    Isso pode resultar em reprovação.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Subject Cards */}
                                {subjectStats.map((stats) => (
                                    <div
                                        key={stats.subject}
                                        onClick={() => setSelectedSubject(stats.subject)}
                                        className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{stats.subject}</h3>
                                                <p className="text-xs text-gray-500">{stats.total} aula{stats.total !== 1 ? 's' : ''}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                                        </div>

                                        {/* Percentage Bar */}
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Presença</span>
                                                <span className={`text-sm font-bold ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stats.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all ${stats.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                                                <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                                                <p className="font-bold text-green-700 dark:text-green-300">{stats.presente}</p>
                                            </div>
                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
                                                <span className="material-symbols-outlined text-red-600 text-lg">cancel</span>
                                                <p className="font-bold text-red-700 dark:text-red-300">{stats.ausente}</p>
                                            </div>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
                                                <span className="material-symbols-outlined text-yellow-600 text-lg">assignment_late</span>
                                                <p className="font-bold text-yellow-700 dark:text-yellow-300">{stats.justificado}</p>
                                            </div>
                                        </div>

                                        {stats.percentage < 75 && (
                                            <div className="mt-3 bg-red-100 dark:bg-red-900/30 rounded-lg p-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-red-600 text-sm">warning</span>
                                                <p className="text-xs text-red-800 dark:text-red-200 font-medium">
                                                    Risco de reprovação por falta
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentAttendance;
