import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { User, UserRole, Grade, FinancialRecord, Announcement, Ticket, Notification, CalendarEvent } from '../types';

// Collections
const USERS_COLLECTION = 'users';
const ANNOUNCEMENTS_COLLECTION = 'announcements';
const FINANCIALS_COLLECTION = 'financials';
const GRADES_COLLECTION = 'grades';
const TICKETS_COLLECTION = 'tickets';
const NOTIFICATIONS_COLLECTION = 'notifications';
const EVENTS_COLLECTION = 'events';

// ==================== USERS ====================
export const createUser = async (user: User) => {
    try {
        await setDoc(doc(db, USERS_COLLECTION, user.id), user);
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), userData as any);
        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
};

export const deleteUser = async (userId: string) => {
    try {
        await deleteDoc(doc(db, USERS_COLLECTION, userId));
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
};

// ==================== ANNOUNCEMENTS ====================
export const createAnnouncement = async (announcement: Announcement) => {
    try {
        await setDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcement.id), announcement);
        return true;
    } catch (error) {
        console.error('Error creating announcement:', error);
        return false;
    }
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, ANNOUNCEMENTS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Announcement);
    } catch (error) {
        console.error('Error getting announcements:', error);
        return [];
    }
};

export const updateAnnouncement = async (announcementId: string, data: Partial<Announcement>) => {
    try {
        await updateDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcementId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating announcement:', error);
        return false;
    }
};

export const deleteAnnouncement = async (announcementId: string) => {
    try {
        await deleteDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcementId));
        return true;
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return false;
    }
};

// ==================== FINANCIALS ====================
export const createFinancialRecord = async (record: FinancialRecord) => {
    try {
        await setDoc(doc(db, FINANCIALS_COLLECTION, record.id), record);
        return true;
    } catch (error) {
        console.error('Error creating financial record:', error);
        return false;
    }
};

export const getFinancialRecords = async (): Promise<FinancialRecord[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, FINANCIALS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as FinancialRecord);
    } catch (error) {
        console.error('Error getting financial records:', error);
        return [];
    }
};

export const updateFinancialRecord = async (recordId: string, data: Partial<FinancialRecord>) => {
    try {
        await updateDoc(doc(db, FINANCIALS_COLLECTION, recordId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating financial record:', error);
        return false;
    }
};

// ==================== GRADES ====================
export const createGrade = async (grade: Grade) => {
    try {
        const gradeId = `${grade.studentId}_${grade.subjectId}`;
        await setDoc(doc(db, GRADES_COLLECTION, gradeId), grade);
        return true;
    } catch (error) {
        console.error('Error creating grade:', error);
        return false;
    }
};

export const getGrades = async (): Promise<Grade[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, GRADES_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Grade);
    } catch (error) {
        console.error('Error getting grades:', error);
        return [];
    }
};

export const updateGrade = async (gradeId: string, data: Partial<Grade>) => {
    try {
        await updateDoc(doc(db, GRADES_COLLECTION, gradeId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating grade:', error);
        return false;
    }
};

// ==================== TICKETS ====================
export const createTicket = async (ticket: Ticket) => {
    try {
        await setDoc(doc(db, TICKETS_COLLECTION, ticket.id), ticket);
        return true;
    } catch (error) {
        console.error('Error creating ticket:', error);
        return false;
    }
};

export const getTickets = async (): Promise<Ticket[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, TICKETS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Ticket);
    } catch (error) {
        console.error('Error getting tickets:', error);
        return [];
    }
};

export const updateTicket = async (ticketId: string, data: Partial<Ticket>) => {
    try {
        await updateDoc(doc(db, TICKETS_COLLECTION, ticketId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating ticket:', error);
        return false;
    }
};

// ==================== NOTIFICATIONS ====================
export const createNotification = async (notification: Notification) => {
    try {
        await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id), notification);
        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
};

export const getNotifications = async (): Promise<Notification[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, NOTIFICATIONS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Notification);
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
};

export const updateNotification = async (notificationId: string, data: Partial<Notification>) => {
    try {
        await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating notification:', error);
        return false;
    }
};

// ==================== EVENTS ====================
export const createEvent = async (event: CalendarEvent) => {
    try {
        await setDoc(doc(db, EVENTS_COLLECTION, event.id), event);
        return true;
    } catch (error) {
        console.error('Error creating event:', error);
        return false;
    }
};

export const getEvents = async (): Promise<CalendarEvent[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, EVENTS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as CalendarEvent);
    } catch (error) {
        console.error('Error getting events:', error);
        return [];
    }
};

// ==================== INITIALIZATION ====================
export const initializeDefaultData = async () => {
    try {
        // Check if admin user exists
        const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));

        if (usersSnapshot.empty) {
            // Create default admin user
            const adminUser: User = {
                id: '1',
                name: 'Administrador',
                email: 'admin@escola.com',
                password: '123',
                role: UserRole.ADMIN,
                avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=3079BE&color=fff',
                bio: 'Gestão Geral'
            };

            await createUser(adminUser);

            // Create default professor
            const professorUser: User = {
                id: '2',
                name: 'Prof. João',
                email: 'prof@escola.com',
                password: '123',
                role: UserRole.PROFESSOR,
                avatarUrl: 'https://ui-avatars.com/api/?name=Joao&background=random',
                classId: 'TURMA_A'
            };

            await createUser(professorUser);

            // Create default student
            const studentUser: User = {
                id: '3',
                name: 'Aluno Carlos',
                email: 'aluno@escola.com',
                password: '123',
                role: UserRole.STUDENT,
                avatarUrl: 'https://ui-avatars.com/api/?name=Carlos&background=random',
                courseId: 'TEOLOGIA',
                classId: 'TURMA_A',
                registrationId: '2024001'
            };

            await createUser(studentUser);

            // Create default events
            const event1: CalendarEvent = {
                id: '1',
                title: 'Início das Aulas',
                date: '2024-02-01',
                type: 'Evento',
                targetType: 'GLOBAL'
            };

            const event2: CalendarEvent = {
                id: '2',
                title: 'Prova de Teologia',
                date: '2024-10-25',
                type: 'Prova',
                targetType: 'CLASS',
                targetId: 'TURMA_A'
            };

            await createEvent(event1);
            await createEvent(event2);

            console.log('✅ Default data initialized in Firestore');
        }
    } catch (error) {
        console.error('Error initializing default data:', error);
    }
};
