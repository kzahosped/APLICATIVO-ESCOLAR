
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { UserRole } from './types';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentGrades from './pages/StudentGrades';
import ProfessorDashboard from './pages/ProfessorDashboard';
import Announcements from './pages/Announcements';
import Financials from './pages/Financials';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Debug from './pages/Debug';
import StudentRegistration from './pages/StudentRegistration';
import ProfessorRegistration from './pages/ProfessorRegistration';
import GradeEntry from './pages/GradeEntry';
import ProfessorMaterials from './pages/ProfessorMaterials';
import Notifications from './pages/Notifications';
import Agenda from './pages/Agenda';
import Support from './pages/Support';
import LandingPage from './pages/LandingPage';
import Attendance from './pages/Attendance';
import StudentAttendance from './pages/StudentAttendance';
import StudentReport from './pages/StudentReport';
import StudentMaterials from './pages/StudentMaterials';
import AdminSubjects from './pages/AdminSubjects';
import ManageUsers from './pages/ManageUsers';
import ProfessorAssignments from './pages/ProfessorAssignments';
import StudentAssignments from './pages/StudentAssignments';
import StudentPerformance from './pages/StudentPerformance';
import StudentFinances from './pages/StudentFinances';
import StudentSimpleReport from './pages/StudentSimpleReport';
import StudentDisciplines from './pages/StudentDisciplines';

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const MainRouter = () => {
  const { currentUser } = useApp();

  // Gerencia o botão voltar do Android (temporariamente desativado para teste)
  // useBackButton();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        currentUser ? (
          currentUser.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
            currentUser.role === UserRole.PROFESSOR ? <Navigate to="/professor" /> :
              <Navigate to="/student" />
        ) : <Login />
      } />
      <Route path="/debug" element={<Debug />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/register" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><StudentRegistration /></ProtectedRoute>} />
      <Route path="/admin/register-professor" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><ProfessorRegistration /></ProtectedRoute>} />
      <Route path="/admin/financial" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><Financials /></ProtectedRoute>} />
      <Route path="/admin/support" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><Support /></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminSubjects /></ProtectedRoute>} />
      <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><ManageUsers /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/grades" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentGrades /></ProtectedRoute>} />
      <Route path="/student/financial" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><Financials /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/report" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentReport /></ProtectedRoute>} />
      <Route path="/student/materials" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentMaterials /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/performance" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentPerformance /></ProtectedRoute>} />
      <Route path="/student/agenda" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><Agenda /></ProtectedRoute>} />
      <Route path="/student/support" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><Support /></ProtectedRoute>} />
      <Route path="/student/finances" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentFinances /></ProtectedRoute>} />
      <Route path="/student/simple-report" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentSimpleReport /></ProtectedRoute>} />
      <Route path="/student/disciplines" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentDisciplines /></ProtectedRoute>} />

      {/* Professor Routes */}
      <Route path="/professor" element={<ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}><ProfessorDashboard /></ProtectedRoute>} />
      <Route path="/professor/grades" element={<ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}><GradeEntry /></ProtectedRoute>} />
      <Route path="/professor/materials" element={<ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}><ProfessorMaterials /></ProtectedRoute>} />
      <Route path="/professor/assignments" element={<ProtectedRoute allowedRoles={[UserRole.PROFESSOR]}><ProfessorAssignments /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={[UserRole.PROFESSOR, UserRole.ADMIN]}><Attendance /></ProtectedRoute>} />

      {/* Shared Routes */}
      <Route path="/announcements" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT]}><Announcements /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT]}><Notifications /></ProtectedRoute>} />
      <Route path="/agenda" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT]}><Agenda /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT]}><Settings /></ProtectedRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <HashRouter>
          <MainRouter />
        </HashRouter>
      </AppProvider>
    </ToastProvider>
  );
}
