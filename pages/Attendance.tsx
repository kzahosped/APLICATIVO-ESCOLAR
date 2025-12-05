import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import BottomNav from '../components/BottomNav';
import { UserRole, AttendanceStatus, AttendanceRecord } from '../types';

const Attendance: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, users, saveAttendance, getAttendance } = useApp();
    const { showToast } = useToast();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Filter students based on role and class
    const students = users.filter(u => u.role === UserRole.STUDENT);

    // Get unique classes from students
    const classes = Array.from(new Set(students.map(s => s.classId).filter(Boolean))) as string[];

    const [subjectsList, setSubjectsList] = useState<string[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            const allSubjects = await import('../services/firestoreService').then(m => m.getSubjects());
            if (currentUser?.role === UserRole.PROFESSOR) {
                // Filtrar matérias do professor
                const mySubjects = allSubjects.filter(s => s.teacherId === currentUser.id).map(s => s.name);
                setSubjectsList(mySubjects);
            } else {
                // Admin vê todas
                setSubjectsList(allSubjects.map(s => s.name));
            }
        };
        fetchSubjects();
    }, [currentUser]);

    // Filter students for display
    const filteredStudents = students.filter(s => {
        if (selectedClass && s.classId !== selectedClass) return false;
        return true;
    });

    // Load existing attendance
    useEffect(() => {
        if (selectedSubject && date) {
            loadAttendance();
        } else {
            setAttendanceData({});
        }
    }, [date, selectedSubject, selectedClass]);

    const loadAttendance = async () => {
        setLoading(true);
        try {
            const record = await getAttendance(date, selectedSubject, selectedClass);
            if (record) {
                const data: Record<string, AttendanceStatus> = {};
                record.students.forEach(s => {
                    data[s.studentId] = s.status;
                });
                setAttendanceData(data);
            } else {
                // Default to 'Presente' for all filtered students
                const data: Record<string, AttendanceStatus> = {};
                filteredStudents.forEach(s => {
                    data[s.id] = 'Presente';
                });
                setAttendanceData(data);
            }
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSave = async () => {
        if (!selectedSubject) {
            showToast('Selecione uma matéria', 'warning');
            return;
        }

        setSaving(true);
        try {
            const record: AttendanceRecord = {
                id: `${date}_${selectedSubject}_${selectedClass || 'ALL'}`,
                date,
                subject: selectedSubject,
                professorId: currentUser?.id || '',
                classId: selectedClass || undefined,
                students: Object.entries(attendanceData).map(([studentId, status]) => ({
                    studentId,
                    status
                }))
            };

            await saveAttendance(record);
            showToast('Chamada salva com sucesso!', 'success');
        } catch (error) {
            console.error('Error saving attendance:', error);
            showToast('Erro ao salvar chamada', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900 dark:text-white">Frequência</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Filters */}
                <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matéria</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">Selecione a matéria...</option>
                            {subjectsList.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Turma (Opcional)</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">Todas as turmas</option>
                            {classes.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Student List */}
                {selectedSubject ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                            <h2 className="font-bold text-gray-900 dark:text-white">Alunos ({filteredStudents.length})</h2>
                            {loading && <span className="text-sm text-gray-500">Carregando...</span>}
                        </div>

                        {filteredStudents.map(student => (
                            <div key={student.id} className="bg-white dark:bg-[#1a202c] p-3 rounded-xl shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                        {student.avatarUrl ? (
                                            <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.classId || 'Sem turma'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'Presente')}
                                        className={`p-2 rounded-lg transition-colors ${attendanceData[student.id] === 'Presente' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title="Presente"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'Ausente')}
                                        className={`p-2 rounded-lg transition-colors ${attendanceData[student.id] === 'Ausente' ? 'bg-red-100 text-red-700' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title="Ausente"
                                    >
                                        <span className="material-symbols-outlined">cancel</span>
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(student.id, 'Justificado')}
                                        className={`p-2 rounded-lg transition-colors ${attendanceData[student.id] === 'Justificado' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title="Justificado"
                                    >
                                        <span className="material-symbols-outlined">assignment_late</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        Selecione uma matéria para iniciar a chamada
                    </div>
                )}
            </div>

            {/* Save Button */}
            {selectedSubject && (
                <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pointer-events-none">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg pointer-events-auto hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">save</span>
                                Salvar Chamada
                            </>
                        )}
                    </button>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default Attendance;
