import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { UserRole } from '../types';

const ProfessorRegistration: React.FC = () => {
    const navigate = useNavigate();
    const { addUser } = useApp();
    const { showToast } = useToast();

    // Dados Pessoais
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [cpf, setCpf] = useState('');
    const [rg, setRg] = useState('');
    const [phone, setPhone] = useState('');

    // Dados de Acesso
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Matérias (lista de strings)
    const [currentSubject, setCurrentSubject] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);

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

    const addSubject = () => {
        if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
            setSubjects([...subjects, currentSubject.trim()]);
            setCurrentSubject('');
        }
    };

    const removeSubject = (index: number) => {
        setSubjects(subjects.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validações
        if (!name || !email || !password) {
            showToast('Por favor, preencha nome, email e senha.', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast('As senhas não coincidem.', 'warning');
            return;
        }

        if (subjects.length === 0) {
            showToast('Adicione pelo menos uma matéria.', 'warning');
            return;
        }

        const newProfessor = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role: UserRole.PROFESSOR,
            cpf,
            rg,
            phone,
            birthDate,
            subjects,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            registrationId: `PROF-${Date.now()}`
        };

        try {
            await addUser(newProfessor);
            showToast('Professor cadastrado com sucesso!', 'success');
            navigate('/admin/users');
        } catch (error: any) {
            showToast(error.message || 'Erro ao cadastrar professor.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-200 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-gray-900">Cadastrar Professor</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Dados Pessoais */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Dados Pessoais
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Nome do professor"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(maskPhone(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                                <input
                                    type="text"
                                    value={rg}
                                    onChange={(e) => setRg(maskRG(e.target.value))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="00.000.000-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dados de Acesso */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        Dados de Acesso
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Digite a senha"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha *</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Digite a senha novamente"
                            />
                        </div>
                    </div>
                </div>

                {/* Matérias */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">menu_book</span>
                        Matérias Lecionadas
                    </h2>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentSubject}
                                onChange={(e) => setCurrentSubject(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Ex: Teologia Sistemática, Hermenêutica..."
                            />
                            <button
                                onClick={addSubject}
                                className="bg-primary text-white px-4 rounded-lg hover:bg-primary/90 flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Adicionar
                            </button>
                        </div>

                        {subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {subjects.map((subject, index) => (
                                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span>{subject}</span>
                                        <button
                                            onClick={() => removeSubject(index)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão Salvar */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white py-4 rounded-lg font-bold text-base shadow-lg hover:bg-primary/90 transition-colors"
                >
                    Cadastrar Professor
                </button>
            </div>
        </div>
    );
};

export default ProfessorRegistration;
