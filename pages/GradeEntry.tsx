import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole, Grade } from '../types';
import { getGrades, updateGrade, createGrade } from '../services/firestoreService';

const GradeEntry: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useApp();
  const { subjectId, subjectName } = location.state || {};

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  // Get actual students
  const students = users.filter(u => u.role === UserRole.STUDENT);

  useEffect(() => {
    if (!subjectId) {
      navigate('/professor');
      return;
    }
    fetchGrades();
  }, [subjectId]);

  const fetchGrades = async () => {
    setLoading(true);
    const allGrades = await getGrades();
    // Filtrar notas desta matéria
    const subjectGrades = allGrades.filter(g => g.subjectId === subjectId);
    setGrades(subjectGrades);
    setLoading(false);
  };

  const handleGradeChange = async (studentId: string, field: keyof Grade, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);

    let currentGrade = grades.find(g => g.studentId === studentId);
    let isNew = false;

    if (!currentGrade) {
      isNew = true;
      currentGrade = {
        id: `${studentId}_${subjectId}`,
        studentId,
        subjectId: subjectId,
        status: 'Em Curso',
        published: true
      };
    }

    const updatedGrade: Grade = {
      ...currentGrade,
      [field]: numValue,
    };

    // Recalcular média simples (N1 + N2 + Trabalho) / 3 ou regra customizada
    // Regra simples: (N1 + N2 + Trabalho) / 3. Se Recuperação > Média, substitui.
    const n1 = updatedGrade.n1 || 0;
    const n2 = updatedGrade.n2 || 0;
    const work = updatedGrade.work || 0;

    let average = (n1 + n2 + work) / 3;

    if (updatedGrade.recovery) {
      if (updatedGrade.recovery > average) {
        average = updatedGrade.recovery;
      }
    }

    updatedGrade.finalAverage = parseFloat(average.toFixed(1));
    updatedGrade.status = updatedGrade.finalAverage >= 7 ? 'Aprovado' : 'Reprovado';

    // Atualizar estado local para feedback rápido
    if (isNew) {
      setGrades([...grades, updatedGrade]);
      await createGrade(updatedGrade);
    } else {
      setGrades(grades.map(g => g.studentId === studentId ? updatedGrade : g));
      await updateGrade(updatedGrade.id, updatedGrade);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <div className="bg-white dark:bg-[#111621] p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Lançar Notas</h1>
            <p className="text-xs text-gray-500">{subjectName}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Carregando notas...</p>
        ) : students.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Nenhum aluno encontrado.</p>
          </div>
        ) : (
          students.map((student) => {
            const grade = grades.find(g => g.studentId === student.id) || {};

            return (
              <div key={student.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img src={student.avatarUrl || 'https://ui-avatars.com/api/?name=' + student.name} className="w-10 h-10 rounded-full" alt="" />
                    <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${(grade.finalAverage || 0) >= 7 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      Média: {grade.finalAverage?.toFixed(1) || '-'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase">Prova 1</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.n1 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'n1', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase">Prova 2</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.n2 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'n2', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase">Trabalho</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.work ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'work', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-800 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase text-red-500">Recup.</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={grade.recovery ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'recovery', e.target.value)}
                      className="w-full p-2 border border-red-200 dark:border-red-900/50 rounded-lg text-center dark:bg-gray-800 dark:text-white text-sm focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GradeEntry;