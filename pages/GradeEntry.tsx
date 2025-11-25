import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const GradeEntry: React.FC = () => {
  const navigate = useNavigate();
  const { users, grades, updateGrade } = useApp();
  
  // Get actual students from context
  const students = users.filter(u => u.role === UserRole.STUDENT);

  const handleGradeChange = (studentId: string, field: 'n1' | 'n2', value: string) => {
    const numValue = parseFloat(value);
    const currentGrade = grades.find(g => g.studentId === studentId && g.subjectId === 'sub1') || { 
      studentId, 
      subjectId: 'sub1', 
      n1: 0, 
      n2: 0, 
      status: 'Em Curso' 
    };

    const updatedGrade = {
      ...currentGrade,
      [field]: numValue,
    };

    // Calculate final
    if (updatedGrade.n1 !== undefined && updatedGrade.n2 !== undefined) {
      updatedGrade.finalAverage = (updatedGrade.n1 + updatedGrade.n2) / 2;
      updatedGrade.status = updatedGrade.finalAverage >= 7 ? 'Aprovado' : 'Reprovado';
    }

    updateGrade(updatedGrade);
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
            <p className="text-xs text-gray-500">Teologia Sistemática I</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {students.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Nenhum aluno encontrado.</p>
            <p className="text-sm">Peça ao administrador para cadastrar alunos.</p>
          </div>
        ) : (
          students.map((student) => {
            const grade = grades.find(g => g.studentId === student.id && g.subjectId === 'sub1') || { n1: '', n2: '' };
            
            return (
              <div key={student.id} className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={student.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
                  <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Prova 1</label>
                    <input 
                      type="number" 
                      value={grade.n1}
                      onChange={(e) => handleGradeChange(student.id, 'n1', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Prova 2</label>
                    <input 
                      type="number" 
                      value={grade.n2}
                      onChange={(e) => handleGradeChange(student.id, 'n2', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center dark:bg-gray-800 dark:text-white"
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