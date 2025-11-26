import { User, UserRole, CalendarEvent } from '../types';

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Administrador',
        email: 'admin@escola.com',
        password: '123',
        role: UserRole.ADMIN,
        avatarUrl: 'https://ui-avatar.com/api/?name=Admin&background=3079BE&color=fff',
        bio: 'Gestão Geral'
    },
    {
        id: 'admin-2',
        name: 'Super Admin',
        email: 'Admin@gmail.com',
        password: 'Admin313',
        role: UserRole.ADMIN,
        avatarUrl: 'https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff',
        bio: 'Administrador Principal'
    },
    {
        id: '2',
        name: 'Prof. João',
        email: 'prof@escola.com',
        password: '123',
        role: UserRole.PROFESSOR,
        avatarUrl: 'https://ui-avatars.com/api/?name=Joao&background=random',
        classId: 'TURMA_A'
    },
    {
        id: '3',
        name: 'Aluno Carlos',
        email: 'aluno@escola.com',
        password: '123',
        role: UserRole.STUDENT,
        avatarUrl: 'https://ui-avatars.com/api/?name=Carlos&background=random',
        courseId: 'TEOLOGIA',
        classId: 'TURMA_A',
        registrationId: '2024001'
    }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'Início das Aulas',
        date: '2024-02-01',
        type: 'Evento',
        targetType: 'GLOBAL'
    },
    {
        id: '2',
        title: 'Prova de Teologia',
        date: '2024-10-25',
        type: 'Prova',
        targetType: 'CLASS',
        targetId: 'TURMA_A'
    }
];

export const INITIAL_CATEGORIES = [
    { id: '1', name: 'Mercearia', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '2', name: 'Padaria', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '3', name: 'Hambúrgueria', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '4', name: 'Mensalidade do curso', type: 'income' as const, createdAt: new Date().toISOString() },
    { id: '5', name: 'Energia', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '6', name: 'Lavanderia', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '7', name: 'Movimente-se', type: 'expense' as const, createdAt: new Date().toISOString() },
    { id: '8', name: 'Papelaria', type: 'expense' as const, createdAt: new Date().toISOString() },
];
