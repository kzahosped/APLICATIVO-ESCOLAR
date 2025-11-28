
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
  targetId?: string; // ID do curso, turma ou aluno (null se Global)
  authorId: string;
  readBy: string[]; // Array de UserIDs que leram
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
}

export interface InstitutionSettings {
  name: string;
  logoUrl: string;
  mission: string;
}
