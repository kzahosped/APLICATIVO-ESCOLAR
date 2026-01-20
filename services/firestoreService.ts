import { db } from './firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    setDoc
} from 'firebase/firestore';
import { User, Announcement, FinancialRecord, Grade, Ticket, Notification, CalendarEvent, UserRole, AttendanceRecord, Subject, Material, Assignment, AssignmentSubmission, StudentDiscipline } from '../types';
import { INITIAL_USERS, INITIAL_EVENTS } from '../constants/initialData';

const USERS_COLLECTION = 'users';
const ANNOUNCEMENTS_COLLECTION = 'announcements';
const FINANCIALS_COLLECTION = 'financials';
const GRADES_COLLECTION = 'grades';
const TICKETS_COLLECTION = 'tickets';
const NOTIFICATIONS_COLLECTION = 'notifications';
const EVENTS_COLLECTION = 'events';
const ATTENDANCE_COLLECTION = 'attendance';
const SUBJECTS_COLLECTION = 'subjects';
const MATERIALS_COLLECTION = 'materials';
const ASSIGNMENTS_COLLECTION = 'assignments';
const SUBMISSIONS_COLLECTION = 'submissions';
const DISCIPLINES_COLLECTION = 'studentDisciplines';

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

export const updateUser = async (userId: string, data: Partial<User>) => {
    try {
        await updateDoc(doc(db, USERS_COLLECTION, userId), data as any);
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

export const deleteFinancialRecord = async (recordId: string) => {
    try {
        await deleteDoc(doc(db, FINANCIALS_COLLECTION, recordId));
        return true;
    } catch (error) {
        console.error('Error deleting financial record:', error);
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

// ==================== ATTENDANCE ====================
export const saveAttendance = async (record: AttendanceRecord) => {
    try {
        await setDoc(doc(db, ATTENDANCE_COLLECTION, record.id), record);
        return true;
    } catch (error) {
        console.error('Error saving attendance:', error);
        return false;
    }
};

export const getAttendance = async (date: string, subject: string, classId?: string): Promise<AttendanceRecord | null> => {
    try {
        let q = query(
            collection(db, ATTENDANCE_COLLECTION),
            where('date', '==', date),
            where('subject', '==', subject)
        );

        if (classId) {
            q = query(q, where('classId', '==', classId));
        }

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;

        // Return the first match (should be unique per date/subject/class)
        return querySnapshot.docs[0].data() as AttendanceRecord;
    } catch (error) {
        console.error('Error getting attendance:', error);
        return null;
    }
};

export const getStudentAttendance = async (studentId: string): Promise<AttendanceRecord[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, ATTENDANCE_COLLECTION));
        const records: AttendanceRecord[] = [];

        querySnapshot.docs.forEach(doc => {
            const record = doc.data() as AttendanceRecord;
            // Check if this student is in the record
            if (record.students.some(s => s.studentId === studentId)) {
                records.push(record);
            }
        });

        return records;
    } catch (error) {
        console.error('Error getting student attendance:', error);
        return [];
    }
};

// ==================== SUBJECTS ====================
export const createSubject = async (subject: Subject) => {
    try {
        await setDoc(doc(db, SUBJECTS_COLLECTION, subject.id), subject);
        return true;
    } catch (error) {
        console.error('Error creating subject:', error);
        return false;
    }
};

export const getSubjects = async (): Promise<Subject[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, SUBJECTS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as Subject);
    } catch (error) {
        console.error('Error getting subjects:', error);
        return [];
    }
};

export const updateSubject = async (subjectId: string, data: Partial<Subject>) => {
    try {
        await updateDoc(doc(db, SUBJECTS_COLLECTION, subjectId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating subject:', error);
        return false;
    }
};

export const deleteSubject = async (subjectId: string) => {
    try {
        await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
        return true;
    } catch (error) {
        console.error('Error deleting subject:', error);
        return false;
    }
};

// ==================== MATERIALS ====================
export const createMaterial = async (material: Material) => {
    try {
        await setDoc(doc(db, MATERIALS_COLLECTION, material.id), material);
        return true;
    } catch (error) {
        console.error('Error creating material:', error);
        return false;
    }
};

export const getMaterials = async (subjectId?: string): Promise<Material[]> => {
    try {
        let q = query(collection(db, MATERIALS_COLLECTION));
        if (subjectId) {
            q = query(q, where('subjectId', '==', subjectId));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Material);
    } catch (error) {
        console.error('Error getting materials:', error);
        return [];
    }
};

export const deleteMaterial = async (materialId: string) => {
    try {
        await deleteDoc(doc(db, MATERIALS_COLLECTION, materialId));
        return true;
    } catch (error) {
        console.error('Error deleting material:', error);
        return false;
    }
};

// ==================== ASSIGNMENTS ====================
export const createAssignment = async (assignment: Assignment) => {
    try {
        await setDoc(doc(db, ASSIGNMENTS_COLLECTION, assignment.id), assignment);
        return true;
    } catch (error) {
        console.error('Error creating assignment:', error);
        return false;
    }
};

export const getAssignments = async (subjectId?: string): Promise<Assignment[]> => {
    try {
        let q = query(collection(db, ASSIGNMENTS_COLLECTION));
        if (subjectId) {
            q = query(q, where('subjectId', '==', subjectId));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Assignment);
    } catch (error) {
        console.error('Error getting assignments:', error);
        return [];
    }
};

export const updateAssignment = async (assignmentId: string, data: Partial<Assignment>) => {
    try {
        await updateDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating assignment:', error);
        return false;
    }
};

export const deleteAssignment = async (assignmentId: string) => {
    try {
        await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, assignmentId));
        return true;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        return false;
    }
};

// ==================== SUBMISSIONS ====================
export const createSubmission = async (submission: AssignmentSubmission) => {
    try {
        await setDoc(doc(db, SUBMISSIONS_COLLECTION, submission.id), submission);
        return true;
    } catch (error) {
        console.error('Error creating submission:', error);
        return false;
    }
};

export const getSubmissions = async (): Promise<AssignmentSubmission[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
        return querySnapshot.docs.map(doc => doc.data() as AssignmentSubmission);
    } catch (error) {
        console.error('Error getting submissions:', error);
        return [];
    }
};

export const getSubmissionsByAssignment = async (assignmentId: string): Promise<AssignmentSubmission[]> => {
    try {
        const q = query(
            collection(db, SUBMISSIONS_COLLECTION),
            where('assignmentId', '==', assignmentId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as AssignmentSubmission);
    } catch (error) {
        console.error('Error getting submissions by assignment:', error);
        return [];
    }
};

export const getSubmissionsByStudent = async (studentId: string): Promise<AssignmentSubmission[]> => {
    try {
        const q = query(
            collection(db, SUBMISSIONS_COLLECTION),
            where('studentId', '==', studentId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as AssignmentSubmission);
    } catch (error) {
        console.error('Error getting submissions by student:', error);
        return [];
    }
};

export const updateSubmission = async (submissionId: string, data: Partial<AssignmentSubmission>) => {
    try {
        await updateDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId), data as any);
        return true;
    } catch (error) {
        console.error('Error updating submission:', error);
        return false;
    }
};

// ==================== STUDENT DISCIPLINES ====================
export const createStudentDiscipline = async (discipline: StudentDiscipline) => {
    try {
        await setDoc(doc(db, DISCIPLINES_COLLECTION, discipline.id), discipline);
        return true;
    } catch (error) {
        console.error('Error creating student discipline:', error);
        return false;
    }
};

export const getStudentDisciplines = async (studentId?: string): Promise<StudentDiscipline[]> => {
    try {
        let q = query(collection(db, DISCIPLINES_COLLECTION));
        if (studentId) {
            q = query(q, where('studentId', '==', studentId));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as StudentDiscipline);
    } catch (error) {
        console.error('Error getting student disciplines:', error);
        return [];
    }
};

export const deleteStudentDiscipline = async (disciplineId: string) => {
    try {
        await deleteDoc(doc(db, DISCIPLINES_COLLECTION, disciplineId));
        return true;
    } catch (error) {
        console.error('Error deleting student discipline:', error);
        return false;
    }
};

// ==================== INITIALIZATION ====================
export const initializeDefaultData = async () => {
    try {
        console.log('🔄 Checking if default data initialization is needed...');
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        console.log(`📊 Users collection has ${snapshot.size} documents`);

        console.log(`📊 Users collection has ${snapshot.size} documents`);

        // Check and ensure all INITIAL_USERS exist
        for (const user of INITIAL_USERS) {
            const userDocRef = doc(usersRef, user.id);
            const userDocSnap = await getDocs(query(usersRef, where('email', '==', user.email)));

            // Check by ID or Email to avoid duplicates
            if (userDocSnap.empty) {
                await setDoc(userDocRef, user);
                console.log(`✅ Default user created/restored: ${user.email}`);
            }
        }

        if (snapshot.empty) {
            console.log('⚠️ No users found. Initializing default events...');

            // Add default events
            const eventsRef = collection(db, 'events');
            for (const event of INITIAL_EVENTS) {
                await setDoc(doc(eventsRef, event.id), event);
            }

            console.log('✅ Default data initialization complete!');
        } else {
            console.log('✅ Users checked. Skipping full initialization.');
        }
    } catch (error) {
        console.error('❌ Error initializing default data:', error);
    }
};
