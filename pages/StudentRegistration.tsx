import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';

const StudentRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { addUser } = useApp();

  // Seleção de Tipo
  const [userType, setUserType] = useState<'STUDENT' | 'PROFESSOR'>('STUDENT');

  // Dados Pessoais
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dados Acadêmicos (Aluno)
  const [course, setCourse] = useState('');
  const [classId, setClassId] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');

  // Dados Professor
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const availableSubjects = [
    'Teologia Sistemática',
    'Hermenêutica',
    'Homilética',
    'História da Igreja',
    'Grego Bíblico',
    'Hebraico Bíblico',
    'Antigo Testamento',
    'Novo Testamento',
    'Ética Cristã',
    'Apologética',
    'Teologia Pastoral',
    'Missões'
  ];

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

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pwd = '';
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async () => {
    const cpfClean = cpf.replace(/\D/g, '');
    const loginEmail = email || cpfClean;
    const loginPassword = password || cpfClean;

    if (userType === 'STUDENT') {
      if (name && cpf && rg && course && classId && enrollmentYear) {
        await addUser({
          id: Date.now().toString(),
          name,
          email: loginEmail,
          password: loginPassword,
          role: UserRole.STUDENT,
          registrationId: Date.now().toString().slice(-6),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          courseId: course,
          classId: classId,
          birthDate,
          cpf,
          rg,
          phone,
          enrollmentYear
        } as any);
        navigate('/admin/users');
      }
    } else if (userType === 'PROFESSOR') {
      if (name && email && password && selectedSubjects.length > 0) {
        await addUser({
          id: Date.now().toString(),
          name,
          email,
          password,
          role: UserRole.PROFESSOR,
          registrationId: Date.now().toString().slice(-6),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          subjects: selectedSubjects,
          cpf,
          rg,
          phone,
          birthDate
        } as any);
        navigate('/admin/users');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-lg text-gray-900">Cadastrar Usuário</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Tipo de Usuário */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Tipo de Usuário</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUserType('STUDENT')}
              className={`p-3 rounded-lg border-2 transition-all ${userType === 'STUDENT'
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-gray-200 text-gray-600'
                }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">school</span>
              <p className="font-bold text-sm">Aluno</p>
            </button>
            <button
              onClick={() => setUserType('PROFESSOR')}
              className={`p-3 rounded-lg border-2 transition-all ${userType === 'PROFESSOR'
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-gray-200 text-gray-600'
                }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">person</span>
              <p className="font-bold text-sm">Professor</p>
            </button>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Dados Pessoais</h2>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Nome Completo *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Insira o nome completo"
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
            <label className="block text-gray-700 text-sm mb-2">CPF {userType === 'STUDENT' && '*'}</label>
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
            <label className="block text-gray-700 text-sm mb-2">RG {userType === 'STUDENT' && '*'}</label>
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

          {userType === 'PROFESSOR' && (
            <div>
              <label className="block text-gray-700 text-sm mb-2">E-mail (Login) *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="professor@escola.com"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm mb-2">
              Senha {userType === 'PROFESSOR' && '*'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={userType === 'STUDENT' ? 'Vazio = CPF como senha' : 'Digite ou gere uma senha'}
              />
              <button
                onClick={generatePassword}
                className="px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
              >
                Gerar
              </button>
            </div>
            {userType === 'STUDENT' && !password && (
              <p className="text-xs text-gray-500 mt-1">Se vazio, o CPF será usado como senha</p>
            )}
          </div>
        </div>

        {/* Dados Acadêmicos (ALUNO) */}
        {userType === 'STUDENT' && (
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h2 className="font-bold text-gray-900 text-sm">Dados Acadêmicos</h2>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Curso *</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione o curso</option>
                <option value="teologia">Teologia</option>
                <option value="bacharel">Bacharel em Teologia</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Turma *</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione a turma</option>
                <option value="1ano">1º Ano</option>
                <option value="2ano">2º Ano</option>
                <option value="3ano">3º Ano</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-2">Ano de Matrícula *</label>
              <input
                type="text"
                value={enrollmentYear}
                onChange={(e) => setEnrollmentYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="2025"
              />
            </div>
          </div>
        )}

        {/* Matérias (PROFESSOR) */}
        {userType === 'PROFESSOR' && (
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h2 className="font-bold text-gray-900 text-sm">Matérias Lecionadas *</h2>
            <div className="grid grid-cols-2 gap-2">
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-all ${selectedSubjects.includes(subject)
                    ? 'border-primary bg-blue-50 text-primary'
                    : 'border-gray-300 text-gray-600'
                    }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {selectedSubjects.length} matéria(s) selecionada(s)
            </p>
          </div>
        )}

        {/* Botão Cadastrar */}
        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg hover:bg-primary/90 transition-colors"
        >
          Cadastrar {userType === 'STUDENT' ? 'Aluno' : 'Professor'}
        </button>
      </div>
    </div>
  );
};

export default StudentRegistration;