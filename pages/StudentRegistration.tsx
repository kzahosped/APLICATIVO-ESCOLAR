import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useApp();
  const { showToast } = useToast();

  // Dados Pessoais
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [phone, setPhone] = useState('');

  // Dados Acadêmicos
  const [course, setCourse] = useState('');
  const [classId, setClassId] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');

  // Dados de Acesso
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Máscara para CPF: 000.000.000-00
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Máscara para RG: 00.000.000-0
  const maskRG = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  // Máscara para Telefone: (00) 00000-0000
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Máscara para Data: DD/MM/AAAA
  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  };

  const handleSubmit = async () => {
    if (!name || !cpf || !rg || !course || !classId || !enrollmentYear || !email || !password) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('As senhas não coincidem.', 'warning');
      return;
    }

    try {
      await addUser({
        id: Date.now().toString(),
        name,
        email,
        password,
        role: UserRole.STUDENT,
        registrationId: Date.now().toString().slice(-6),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        courseId: course,
        classId: classId,
        // Campos adicionais
        birthDate,
        cpf,
        rg,
        phone,
        enrollmentYear
      } as any);
      showToast('Aluno cadastrado com sucesso!', 'success');
      navigate('/admin/users');
    } catch (error: any) {
      showToast(error.message || 'Erro ao cadastrar aluno.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-gray-900">Cadastrar Novo Aluno</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Dados Pessoais</h2>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Insira o nome completo do aluno"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Data de Nascimento</label>
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(maskDate(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="DD/MM/AAAA"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">RG</label>
            <input
              type="text"
              value={rg}
              onChange={(e) => setRg(maskRG(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="00.000.000-0"
              maxLength={12}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>
        </div>

        {/* Dados de Acesso */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Dados de Acesso</h2>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Senha *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite a senha"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Confirmar Senha *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite a senha novamente"
            />
          </div>
        </div>

        {/* Dados Acadêmicos */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Dados Acadêmicos</h2>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Curso</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Selecione um curso</option>
              <option value="TEOLOGIA">Teologia</option>
              <option value="MINISTERIAL">Ministerial</option>
              <option value="MISSIONARIO">Missionário</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Turma</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Selecione uma turma</option>
              <option value="1ANO">1º Ano</option>
              <option value="2ANO">2º Ano</option>
              <option value="3ANO">3º Ano</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Ano/Semestre de Ingresso</label>
            <input
              type="text"
              value={enrollmentYear}
              onChange={(e) => setEnrollmentYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: 2024/2"
            />
          </div>
        </div>

        {/* Botão Salvar */}
        <button
          onClick={handleSubmit}
          disabled={!name || !cpf || !rg || !course || !classId || !enrollmentYear}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar Cadastro
        </button>
      </div>
    </div>
  );
};

export default StudentRegistration;