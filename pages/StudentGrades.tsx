import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import BottomNav from '../components/BottomNav';

const StudentGrades: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, grades } = useApp();
    const [selectedPeriod, setSelectedPeriod] = useState('2024/2');

    const studentGrades = grades.filter(g => g.studentId === currentUser?.id && g.published);

    // Calcular média geral
    const averageGrades = studentGrades.filter(g => g.finalAverage);
    const generalAverage = averageGrades.length > 0
        ? (averageGrades.reduce((acc, g) => acc + (g.finalAverage || 0), 0) / averageGrades.length).toFixed(1)
        : '0.0';

    // Determinar situação geral
    const getOverallStatus = () => {
        if (studentGrades.length === 0) return 'Sem Notas';
        const hasReprovado = studentGrades.some(g => g.status === 'Reprovado');
        const hasEmCurso = studentGrades.some(g => g.status === 'Em Curso');

        if (hasReprovado) return 'Reprovado';
        if (hasEmCurso) return 'Cursando';
        return 'Aprovado';
    };

    const overallStatus = getOverallStatus();

    // Mapear ícones por disciplina
    const getSubjectIcon = (subjectId: string) => {
        const icons: { [key: string]: string } = {
            'TEOLOGIA_SISTEMATICA': 'book',
            'HISTORIA_IGREJA': 'history_edu',
            'GREGO': 'translate',
            'TEOLOGIA_PASTORAL': 'church',
            'default': 'school'
        };
        return icons[subjectId] || icons.default;
    };

    // Mapear nomes de disciplinas
    const getSubjectName = (subjectId: string) => {
        const names: { [key: string]: string } = {
            'TEOLOGIA_SISTEMATICA': 'Teologia Sistemática I',
            'HISTORIA_IGREJA': 'História da Igreja',
            'GREGO': 'Grego I',
            'TEOLOGIA_PASTORAL': 'Teologia Pastoral',
            'sub1': 'Teologia Sistemática I',
            'sub2': 'História da Igreja'
        };
        return names[subjectId] || 'Disciplina';
    };

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="text-gray-600">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">Meu Boletim</h1>
                </div>
                <button onClick={() => navigate('/notifications')} className="text-gray-600">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Filtros de Período */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {['2024/2', '2024/1', '2023/2', '2023/1'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${selectedPeriod === period
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 border border-gray-200'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Média Geral</p>
                        <p className="text-3xl font-bold text-gray-900">{generalAverage}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Situação</p>
                        <p className={`text-2xl font-bold ${overallStatus === 'Aprovado' ? 'text-green-600' :
                                overallStatus === 'Cursando' ? 'text-primary' :
                                    overallStatus === 'Reprovado' ? 'text-red-600' :
                                        'text-gray-400'
                            }`}>
                            {overallStatus}
                        </p>
                    </div>
                </div>

                {/* Detalhes por Disciplina */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Detalhes por Disciplina</h2>
                    <div className="space-y-3">
                        {studentGrades.length === 0 ? (
                            <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                                <p className="text-gray-500">Nenhuma nota lançada ainda para este período.</p>
                            </div>
                        ) : (
                            studentGrades.map((grade, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-3">
                                    {/* Ícone da Disciplina */}
                                    <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-gray-600 text-2xl">
                                            {getSubjectIcon(grade.subjectId)}
                                        </span>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">
                                            {getSubjectName(grade.subjectId)}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            N1: {grade.n1?.toFixed(1) || '-'}, N2: {grade.n2?.toFixed(1) || '-'}
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            Média Final: <span className="font-bold">{grade.finalAverage?.toFixed(1) || '-'}</span>
                                        </p>
                                    </div>

                                    {/* Badge de Status */}
                                    <div className="flex items-start">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${grade.status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                                                grade.status === 'Em Curso' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {grade.status === 'Em Curso' ? 'Cursando' : grade.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default StudentGrades;
