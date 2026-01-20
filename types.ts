
export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT',
  FINANCE = 'FINANCE',
  SECRETARY = 'SECRETARY',
  SUPPORT = 'SUPPORT' // Cantina/Livraria etc
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl?: string;
  registrationId?: string;
  bio?: string;
  // Novos campos para targeting
  courseId?: string;
  classId?: string;
  // Campos adicionais de cadastro
  cpf?: string;
  rg?: string;
  phone?: string;
  birthDate?: string;
  enrollmentYear?: string;
  // Campos para professor
  subjects?: string[]; // Matérias que o professor leciona
  // Status ativo/inativo
  active?: boolean; // true = ativo (padrão), false = inativo
}

export interface Course {
  id: string;
  name: string;
  code: string;
}

export interface Class {
  id: string;
  name: string;
  courseId: string;
  semester: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  n1?: number;
  n2?: number;

  work?: number;
  recovery?: number;
  finalAverage?: number;
  status: 'Aprovado' | 'Reprovado' | 'Em Curso';
  published: boolean; // Regra: Aluno só vê se true
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'Dinheiro' | 'PIX' | 'Cartão' | 'Transferência';
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Vencido' | 'Parcial';
  category: string; // Agora será customizável
  paidAt?: string;
  discount?: number; // Novo campo para desconto
  payments?: Payment[]; // Lista de pagamentos
  balance?: number; // Saldo restante = amount - soma(payments)
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'Acadêmico' | 'Financeiro' | 'Eventos' | 'Geral';
  // Regras de Targeting
  targetType: 'GLOBAL' | 'COURSE' | 'CLASS' | 'USER';
  targetAudience?: 'ALL' | 'STUDENTS' | 'PROFESSORS'; // Segmentação por role
  targetId?: string; // ID do curso, turma ou aluno (null se Global)
  authorId: string;
  readBy: string[]; // Array de UserIDs que leram
  expiresAt?: string; // Data de expiração (ISO string ou YYYY-MM-DD)
  attachments?: {
    name: string;
    url: string;
    type: string; // 'image' | 'pdf' | 'other'
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  studentId: string;
  sector: 'Secretaria' | 'Financeiro' | 'TI' | 'Pedagógico';
  subject: string;
  description: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido' | 'Cancelado';
  createdAt: string;
  history: {
    date: string;
    action: string;
    authorName: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Prova' | 'Feriado' | 'Evento' | 'Aula';
  targetType: 'GLOBAL' | 'COURSE' | 'CLASS';
  targetId?: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'link' | 'file';
  url: string;
  subjectId: string;
  date: string;
  description?: string;
}

// Sistema de Atividades/Tarefas
export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  dueDate: string; // YYYY-MM-DD
  totalPoints: number;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string; // Texto da resposta
  fileUrl?: string; // Link para arquivo (opcional)
  submittedAt: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number; // Nota recebida
  feedback?: string; // Comentário do professor
}

export interface InstitutionSettings {
  name: string;
  logoUrl: string;
  mission: string;
}

export type AttendanceStatus = 'Presente' | 'Ausente' | 'Justificado';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  professorId: string;
  classId?: string;
  students: {
    studentId: string;
    status: AttendanceStatus;
  }[];
}

// Sistema de Disciplinas do Aluno (Livros, Memorizações, Punições)
export interface StudentDiscipline {
  id: string;
  studentId: string;
  type: 'book' | 'memorization' | 'punishment';
  title: string;
  description?: string;
  date: string;
  createdBy: string;
}

