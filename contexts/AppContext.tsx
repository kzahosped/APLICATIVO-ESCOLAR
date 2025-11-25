
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Grade, FinancialRecord, Announcement, InstitutionSettings, Notification, Ticket, CalendarEvent } from '../types';

// --- MOCK DATA INICIAL ---
const INITIAL_USERS: User[] = [
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

const INITIAL_SETTINGS: InstitutionSettings = {
  name: 'Seminário Teológico Servos de Cristo',
  logoUrl: 'https://cdn-icons-png.flaticon.com/512/2997/2997257.png', 
  mission: 'Formar servos para o Reino através do ensino teológico de excelência.'
};

interface AppContextType {
  currentUser: User | null;
  users: User[];
  financials: FinancialRecord[];
  grades: Grade[];
  announcements: Announcement[];
  notifications: Notification[];
  tickets: Ticket[];
  events: CalendarEvent[];
  settings: InstitutionSettings;
  
  // Auth
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  
  // Actions
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'readBy' | 'authorId'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  removeAnnouncement: (id: string) => void;
  
  addFinancialRecord: (record: FinancialRecord) => void;
  payRecord: (id: string) => void;
  
  createTicket: (ticket: Omit<Ticket, 'id' | 'studentId' | 'status' | 'history' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status'], comment?: string) => void;
  
  updateGrade: (grade: Grade) => void;
  
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (user: User) => void;
  updateSettings: (settings: InstitutionSettings) => void;
  
  markNotificationAsRead: (id: string) => void;
  
  // Data Access (Simulating Backend Filters)
  getVisibleAnnouncements: () => Announcement[];
  getVisibleFinancials: () => FinancialRecord[];
  getVisibleTickets: () => Ticket[];
  getStudentNotifications: () => Notification[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Início das Aulas', date: '2024-02-01', type: 'Evento', targetType: 'GLOBAL' },
    { id: '2', title: 'Prova de Teologia', date: '2024-10-25', type: 'Prova', targetType: 'CLASS', targetId: 'TURMA_A' }
  ]);
  const [settings, setSettings] = useState<InstitutionSettings>(INITIAL_SETTINGS);

  // --- AUTH ---
  const login = (email: string, password: string, role: UserRole): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user && user.role === role) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  // --- NOTIFICATION TRIGGER LOGIC ---
  const triggerNotification = (userId: string, title: string, message: string, link: string) => {
    const newNotif: Notification = {
      id: Date.now().toString() + Math.random(),
      userId,
      title,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- ANNOUNCEMENTS (With Logic Rule: 1, 2, 3, 4, 5, 6) ---
  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'readBy' | 'authorId'>) => {
    if (!currentUser) return;

    const newAnnouncement: Announcement = {
      ...annData,
      id: Date.now().toString(),
      authorId: currentUser.id,
      readBy: []
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);

    // REGRA DE NOTIFICAÇÃO 1 & 2 & 3: Gerar push para o público alvo
    let targetUsers: User[] = [];
    
    if (newAnnouncement.targetType === 'GLOBAL') {
      targetUsers = users;
    } else if (newAnnouncement.targetType === 'COURSE') {
      targetUsers = users.filter(u => u.courseId === newAnnouncement.targetId || u.role === UserRole.PROFESSOR); // Simplificação
    } else if (newAnnouncement.targetType === 'CLASS') {
      targetUsers = users.filter(u => u.classId === newAnnouncement.targetId);
    } else if (newAnnouncement.targetType === 'USER') {
      targetUsers = users.filter(u => u.id === newAnnouncement.targetId);
    }

    targetUsers.forEach(u => {
      if (u.id !== currentUser.id) { // Não notificar a si mesmo
        triggerNotification(
          u.id,
          `Novo Comunicado: ${newAnnouncement.title}`,
          newAnnouncement.content.substring(0, 50) + '...',
          '/announcements'
        );
      }
    });
  };

  const markAnnouncementAsRead = (id: string) => {
    if (!currentUser) return;
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === id && !ann.readBy.includes(currentUser.id)) {
        return { ...ann, readBy: [...ann.readBy, currentUser.id] };
      }
      return ann;
    }));
  };

  const removeAnnouncement = (id: string) => {
    // Regra 8: Admin deleta
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.PROFESSOR) return;
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  // --- ACCESS CONTROL GETTERS (Rules of Visibility) ---
  const getVisibleAnnouncements = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return announcements;

    return announcements.filter(ann => {
      if (ann.targetType === 'GLOBAL') return true;
      if (ann.targetType === 'COURSE') return currentUser.courseId === ann.targetId;
      if (ann.targetType === 'CLASS') return currentUser.classId === ann.targetId;
      if (ann.targetType === 'USER') return currentUser.id === ann.targetId;
      if (ann.authorId === currentUser.id) return true; // Ver os próprios
      return false;
    });
  };

  const getVisibleFinancials = () => {
    if (!currentUser) return [];
    // Regra Financeiro 1: Aluno só vê o dele. Admin/Financeiro vê tudo.
    if (currentUser.role === UserRole.STUDENT) {
      return financials.filter(f => f.studentId === currentUser.id);
    }
    return financials;
  };

  const getVisibleTickets = () => {
    if (!currentUser) return [];
    // Aluno vê os seus. Admin/Suporte vê todos (ou filtrado por setor numa impl real)
    if (currentUser.role === UserRole.STUDENT) {
      return tickets.filter(t => t.studentId === currentUser.id);
    }
    return tickets;
  };

  const getStudentNotifications = () => {
    if (!currentUser) return [];
    return notifications.filter(n => n.userId === currentUser.id);
  };

  // --- FINANCIALS ---
  const addFinancialRecord = (record: FinancialRecord) => {
    setFinancials(prev => [record, ...prev]);
    triggerNotification(
      record.studentId,
      'Nova Cobrança',
      `Um novo lançamento de ${record.category} foi adicionado.`,
      '/student/financial'
    );
  };

  const payRecord = (id: string) => {
    setFinancials(prev => prev.map(r => r.id === id ? { ...r, status: 'Pago', paidAt: new Date().toISOString() } : r));
  };

  // --- TICKETS (SUPPORT) ---
  const createTicket = (ticketData: Omit<Ticket, 'id' | 'studentId' | 'status' | 'history' | 'createdAt'>) => {
    if (!currentUser) return;
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      studentId: currentUser.id,
      status: 'Aberto',
      createdAt: new Date().toISOString(),
      history: [{
        date: new Date().toISOString(),
        action: 'Ticket Criado',
        authorName: currentUser.name
      }]
    };
    setTickets(prev => [newTicket, ...prev]);
    
    // Notificar Admins (Simulação)
    users.filter(u => u.role === UserRole.ADMIN).forEach(admin => {
      triggerNotification(admin.id, 'Novo Chamado', `${currentUser.name} abriu um chamado: ${newTicket.subject}`, '/admin/support');
    });
  };

  const updateTicketStatus = (id: string, status: Ticket['status'], comment?: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status };
        updated.history.push({
          date: new Date().toISOString(),
          action: `Status alterado para ${status}. ${comment ? `Obs: ${comment}` : ''}`,
          authorName: currentUser.name
        });
        
        // Notificar Aluno
        if (t.studentId !== currentUser.id) {
          triggerNotification(t.studentId, 'Atualização de Chamado', `Seu chamado "${t.subject}" mudou para ${status}.`, '/student/support');
        }
        
        return updated;
      }
      return t;
    }));
  };

  // --- ACADEMIC ---
  const updateGrade = (newGrade: Grade) => {
    setGrades(prev => {
      const existingIdx = prev.findIndex(g => g.studentId === newGrade.studentId && g.subjectId === newGrade.subjectId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newGrade;
        // Regra Acadêmica 3: Notificar se publicado
        if (newGrade.published && !prev[existingIdx].published) {
           triggerNotification(newGrade.studentId, 'Notas Publicadas', 'Novas notas disponíveis no boletim.', '/student');
        }
        return copy;
      }
      return [...prev, newGrade];
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // --- USER MGMT ---
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  
  const removeUser = (userId: string) => {
    if (userId === '1') {
      alert("Não é possível remover o administrador principal.");
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
    if (currentUser?.id === user.id) setCurrentUser(user);
  };
  const updateSettings = (s: InstitutionSettings) => setSettings(s);

  return (
    <AppContext.Provider value={{
      currentUser, users, financials, grades, announcements, notifications, tickets, events, settings,
      login, logout,
      addAnnouncement, markAnnouncementAsRead, removeAnnouncement,
      addFinancialRecord, payRecord,
      createTicket, updateTicketStatus,
      updateGrade,
      addUser, removeUser, updateUser, updateSettings,
      markNotificationAsRead,
      getVisibleAnnouncements, getVisibleFinancials, getVisibleTickets, getStudentNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
