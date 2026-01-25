import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Grade, FinancialRecord, Announcement, InstitutionSettings, Notification, Ticket, CalendarEvent, Payment, AttendanceRecord } from '../types';
import * as firestoreService from '../services/firestoreService';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from '../services/firebase';


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
  loading: boolean;

  // Auth
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;

  // Actions
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'readBy' | 'authorId'>) => Promise<void>;
  markAnnouncementAsRead: (id: string) => Promise<void>;
  removeAnnouncement: (id: string) => Promise<void>;

  addFinancialRecord: (record: FinancialRecord) => Promise<void>;
  payRecord: (id: string) => Promise<void>;
  addPayment: (recordId: string, payment: Omit<Payment, 'id'>) => Promise<void>;
  deleteFinancialRecord: (id: string) => Promise<void>;

  createTicket: (ticket: Omit<Ticket, 'id' | 'studentId' | 'status' | 'history' | 'createdAt'>) => Promise<void>;
  updateTicketStatus: (id: string, status: Ticket['status'], comment?: string) => Promise<void>;

  updateGrade: (grade: Grade) => Promise<void>;

  addUser: (user: User) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  updateSettings: (settings: InstitutionSettings) => void;

  markNotificationAsRead: (id: string) => Promise<void>;

  // Data Access
  getVisibleAnnouncements: () => Announcement[];
  getVisibleFinancials: () => FinancialRecord[];
  getVisibleTickets: () => Ticket[];
  getStudentNotifications: () => Notification[];

  // Attendance
  saveAttendance: (record: AttendanceRecord) => Promise<boolean>;
  getAttendance: (date: string, subject: string, classId?: string) => Promise<AttendanceRecord | null>;
  getStudentAttendance: (studentId: string) => Promise<AttendanceRecord[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [financials, setFinancials] = useState<FinancialRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [settings, setSettings] = useState<InstitutionSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load data from Firestore on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Starting data loading in AppContext...');

      // Initialize default data if needed
      await firestoreService.initializeDefaultData();

      // Load all data
      console.log('📥 Fetching all collections from Firestore...');
      const [
        usersData,
        announcementsData,
        financialsData,
        gradesData,
        ticketsData,
        notificationsData,
        eventsData
      ] = await Promise.all([
        firestoreService.getUsers(),
        firestoreService.getAnnouncements(),
        firestoreService.getFinancialRecords(),
        firestoreService.getGrades(),
        firestoreService.getTickets(),
        firestoreService.getNotifications(),
        firestoreService.getEvents()
      ]);

      console.log('✅ Data fetched successfully:', {
        users: usersData.length,
        announcements: announcementsData.length,
        financials: financialsData.length,
        grades: gradesData.length,
        tickets: ticketsData.length,
        notifications: notificationsData.length,
        events: eventsData.length
      });

      setUsers(usersData);
      setAnnouncements(announcementsData);
      setFinancials(financialsData);
      setGrades(gradesData);
      setTickets(ticketsData);
      setNotifications(notificationsData);
      setEvents(eventsData);

      console.log('✅ AppContext state updated with fetched data');
    } catch (error) {
      console.error('❌ Error loading data in AppContext:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- AUTH ---
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user && user.role === role) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  // --- NOTIFICATION TRIGGER LOGIC ---
  const triggerNotification = async (userId: string, title: string, message: string, link: string) => {
    const newNotif: Notification = {
      id: Date.now().toString() + Math.random(),
      userId,
      title,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };

    await firestoreService.createNotification(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- ANNOUNCEMENTS ---
  const addAnnouncement = async (annData: Omit<Announcement, 'id' | 'readBy' | 'authorId'>) => {
    if (!currentUser) return;

    const newAnnouncement: Announcement = {
      ...annData,
      id: Date.now().toString(),
      authorId: currentUser.id,
      readBy: []
    };

    await firestoreService.createAnnouncement(newAnnouncement);
    setAnnouncements(prev => [newAnnouncement, ...prev]);

    // Trigger notifications
    let targetUsers: User[] = [];

    if (newAnnouncement.targetType === 'GLOBAL') {
      targetUsers = users;
    } else if (newAnnouncement.targetType === 'COURSE') {
      targetUsers = users.filter(u => u.courseId === newAnnouncement.targetId || u.role === UserRole.PROFESSOR);
    } else if (newAnnouncement.targetType === 'CLASS') {
      targetUsers = users.filter(u => u.classId === newAnnouncement.targetId);
    } else if (newAnnouncement.targetType === 'USER') {
      targetUsers = users.filter(u => u.id === newAnnouncement.targetId);
    }

    targetUsers.forEach(u => {
      if (u.id !== currentUser.id) {
        triggerNotification(
          u.id,
          `Novo Comunicado: ${newAnnouncement.title}`,
          newAnnouncement.content.substring(0, 50) + '...',
          '/announcements'
        );
      }
    });
  };

  const markAnnouncementAsRead = async (id: string) => {
    if (!currentUser) return;

    const announcement = announcements.find(ann => ann.id === id);
    if (announcement && !announcement.readBy.includes(currentUser.id)) {
      const updatedReadBy = [...announcement.readBy, currentUser.id];
      await firestoreService.updateAnnouncement(id, { readBy: updatedReadBy });

      setAnnouncements(prev => prev.map(ann =>
        ann.id === id ? { ...ann, readBy: updatedReadBy } : ann
      ));
    }
  };

  const removeAnnouncement = async (id: string) => {
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.PROFESSOR) return;

    await firestoreService.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  // --- ACCESS CONTROL GETTERS ---
  const getVisibleAnnouncements = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.ADMIN) return announcements;

    return announcements.filter(ann => {
      if (ann.targetType === 'GLOBAL') return true;
      if (ann.targetType === 'COURSE') return currentUser.courseId === ann.targetId;
      if (ann.targetType === 'CLASS') return currentUser.classId === ann.targetId;
      if (ann.targetType === 'USER') return currentUser.id === ann.targetId;
      if (ann.authorId === currentUser.id) return true;
      return false;
    });
  };

  const getVisibleFinancials = () => {
    if (!currentUser) return [];
    if (currentUser.role === UserRole.STUDENT) {
      return financials.filter(f => f.studentId === currentUser.id);
    }
    return financials;
  };

  const getVisibleTickets = () => {
    if (!currentUser) return [];
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
  const addFinancialRecord = async (record: FinancialRecord) => {
    await firestoreService.createFinancialRecord(record);
    setFinancials(prev => [record, ...prev]);

    await triggerNotification(
      record.studentId,
      'Nova Cobrança',
      `Um novo lançamento de ${record.category} foi adicionado.`,
      '/student/financial'
    );
  };

  const payRecord = async (id: string) => {
    const updatedData = { status: 'Pago' as const, paidAt: new Date().toISOString() };
    await firestoreService.updateFinancialRecord(id, updatedData);

    setFinancials(prev => prev.map(r =>
      r.id === id ? { ...r, ...updatedData } : r
    ));
  };

  const addPayment = async (recordId: string, payment: Omit<Payment, 'id'>) => {
    const record = financials.find(r => r.id === recordId);
    if (!record) return;

    // Create new payment with unique ID
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString() + Math.random()
    };

    // Calculate new payments array and balance
    const currentPayments = record.payments || [];
    const updatedPayments = [...currentPayments, newPayment];
    const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);

    const discount = record.discount || 0;
    const finalAmount = record.amount - discount;
    const newBalance = finalAmount - totalPaid;

    // Determine new status
    let newStatus: 'Pago' | 'Pendente' | 'Vencido' | 'Parcial';
    if (newBalance <= 0) {
      newStatus = 'Pago';
    } else if (totalPaid > 0) {
      newStatus = 'Parcial';
    } else {
      // Keep existing status if no payments yet
      newStatus = record.status;
    }

    // Update record
    const updatedData = {
      payments: updatedPayments,
      balance: newBalance,
      status: newStatus,
      paidAt: newBalance <= 0 ? new Date().toISOString() : record.paidAt
    };

    await firestoreService.updateFinancialRecord(recordId, updatedData);

    setFinancials(prev => prev.map(r =>
      r.id === recordId ? { ...r, ...updatedData } : r
    ));
  };

  const deleteFinancialRecord = async (id: string) => {
    await firestoreService.deleteFinancialRecord(id);
    setFinancials(prev => prev.filter(r => r.id !== id));
  };

  // --- TICKETS ---
  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'studentId' | 'status' | 'history' | 'createdAt'>) => {
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

    await firestoreService.createTicket(newTicket);
    setTickets(prev => [newTicket, ...prev]);

    // Notify admins
    users.filter(u => u.role === UserRole.ADMIN).forEach(admin => {
      triggerNotification(admin.id, 'Novo Chamado', `${currentUser.name} abriu um chamado: ${newTicket.subject}`, '/admin/support');
    });
  };

  const updateTicketStatus = async (id: string, status: Ticket['status'], comment?: string) => {
    if (!currentUser) return;

    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    const newHistoryEntry = {
      date: new Date().toISOString(),
      action: `Status alterado para ${status}. ${comment ? `Obs: ${comment}` : ''}`,
      authorName: currentUser.name
    };

    const updatedHistory = [...ticket.history, newHistoryEntry];

    await firestoreService.updateTicket(id, {
      status,
      history: updatedHistory
    });

    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, status, history: updatedHistory } : t
    ));

    // Notify student
    if (ticket.studentId !== currentUser.id) {
      await triggerNotification(ticket.studentId, 'Atualização de Chamado', `Seu chamado "${ticket.subject}" mudou para ${status}.`, '/student/support');
    }
  };

  // --- ACADEMIC ---
  const updateGrade = async (newGrade: Grade) => {
    const gradeId = `${newGrade.studentId}_${newGrade.subjectId}`;
    await firestoreService.createGrade(newGrade);

    setGrades(prev => {
      const existingIdx = prev.findIndex(g => g.studentId === newGrade.studentId && g.subjectId === newGrade.subjectId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        const oldGrade = copy[existingIdx];
        copy[existingIdx] = newGrade;

        // Notify if published
        if (newGrade.published && !oldGrade.published) {
          triggerNotification(newGrade.studentId, 'Notas Publicadas', 'Novas notas disponíveis no boletim.', '/student');
        }

        return copy;
      }
      return [...prev, newGrade];
    });
  };

  const markNotificationAsRead = async (id: string) => {
    await firestoreService.updateNotification(id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // --- USER MGMT ---
  const addUser = async (user: User) => {
    try {
      // Create user in Firebase Authentication using secondary auth
      // This prevents logging out the current admin user
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, user.email, user.password);

      // Sign out from secondary auth immediately (doesn't affect main auth)
      await secondaryAuth.signOut();

      // Then save to Firestore
      await firestoreService.createUser(user);
      setUsers(prev => [...prev, user]);
    } catch (error: any) {
      console.error('Error creating user:', error);
      // If auth creation fails, still throw to show error to admin
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este e-mail já está cadastrado.');
      }
      throw new Error('Erro ao criar usuário. Tente novamente.');
    }
  };

  const removeUser = async (userId: string) => {
    if (userId === '1') {
      console.warn("Não é possível remover o administrador principal.");
      return;
    }

    await firestoreService.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUser = async (user: User) => {
    await firestoreService.updateUser(user.id, user);
    setUsers(users.map(u => u.id === user.id ? user : u));
    if (currentUser?.id === user.id) setCurrentUser(user);
  };

  const updateSettings = (s: InstitutionSettings) => setSettings(s);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, users, financials, grades, announcements, notifications, tickets, events, settings, loading,
      login, logout,
      addAnnouncement, markAnnouncementAsRead, removeAnnouncement,
      addFinancialRecord, payRecord, addPayment, deleteFinancialRecord,
      createTicket, updateTicketStatus,
      updateGrade,
      addUser, removeUser, updateUser, updateSettings,
      markNotificationAsRead,
      getVisibleAnnouncements, getVisibleFinancials, getVisibleTickets, getStudentNotifications,
      saveAttendance: firestoreService.saveAttendance,
      getAttendance: firestoreService.getAttendance,
      getStudentAttendance: firestoreService.getStudentAttendance
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
