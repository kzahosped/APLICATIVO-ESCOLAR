import { User, UserRole, CalendarEvent } from '../types';

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Administrador',
        email: 'admin@escola.com',
        password: '123',
        role: UserRole.ADMIN,
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=3079BE&color=fff',
        bio: 'Gestão Geral'
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
