/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { LoginScreen } from './components/auth/LoginScreen';

// Student Containers
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentGrades } from './components/student/StudentGrades';
import { StudentRepechage } from './components/student/StudentRepechage';
import { StudentSchedule } from './components/student/StudentSchedule';
import { StudentFinances } from './components/student/StudentFinances';
import { StudentDiscipline } from './components/student/StudentDiscipline';
import { StudentProfile } from './components/student/StudentProfile';
import { StudentSecurity } from './components/student/StudentSecurity';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherGradebook } from './components/teacher/TeacherGradebook';
import { TeacherAttendance } from './components/teacher/TeacherAttendance';

// Parent Views
import { ParentDashboard } from './components/parent/ParentDashboard';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAdmissions } from './components/admin/AdminAdmissions';
import { AdminRooms } from './components/admin/AdminRooms';
import { AdminEnrollments } from './components/admin/AdminEnrollments';
import { AdminAcademicStructure } from './components/admin/AdminAcademicStructure';
import { AdminTeacherDistribution } from './components/admin/AdminTeacherDistribution';
import { AdminFeeSchedules } from './components/admin/AdminFeeSchedules';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { SchoolSettingsManager } from './components/admin/SchoolSettingsManager';
import { Footer } from './components/common/Footer';

const MainContent: React.FC = () => {
  const { activeNavTab, activeRole } = useApp();

  const renderActiveView = () => {
    // 1. Strict Student Guard
    if (activeRole === 'STUDENT') {
      switch (activeNavTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'student-grades':
          return <StudentGrades />;
        case 'student-repechage':
          return <StudentRepechage />;
        case 'student-schedule':
          return <StudentSchedule />;
        case 'student-finances':
          return <StudentFinances />;
        case 'student-discipline':
          return <StudentDiscipline />;
        case 'student-profile':
        case 'student-documents':
          return <StudentProfile />;
        case 'student-security':
          return <StudentSecurity />;
        default:
          return <StudentDashboard />;
      }
    }

    // 2. Strict Teacher Guard
    if (activeRole === 'TEACHER') {
      switch (activeNavTab) {
        case 'teacher-dashboard':
          return <TeacherDashboard />;
        case 'teacher-gradebook':
          return <TeacherGradebook />;
        case 'teacher-attendance':
          return <TeacherAttendance />;
        case 'student-schedule':
          return <StudentSchedule />;
        default:
          return <TeacherDashboard />;
      }
    }

    // 3. Strict Parent Guard
    if (activeRole === 'PARENT') {
      switch (activeNavTab) {
        case 'parent-dashboard':
          return <ParentDashboard />;
        case 'student-grades':
          return <StudentGrades />;
        case 'student-repechage':
          return <StudentRepechage />;
        case 'student-schedule':
          return <StudentSchedule />;
        case 'student-finances':
          return <StudentFinances />;
        case 'student-discipline':
          return <StudentDiscipline />;
        case 'student-documents':
        case 'student-profile':
          return <StudentProfile />;
        default:
          return <ParentDashboard />;
      }
    }

    // 4. Strict Admin / Direction Guard (Admin cannot see student self-service pages)
    switch (activeNavTab) {
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-admissions':
        return <AdminAdmissions />;
      case 'admin-rooms':
        return <AdminRooms />;
      case 'admin-enrollments':
        return <AdminEnrollments />;
      case 'admin-teachers-distribution':
        return <AdminTeacherDistribution />;
      case 'admin-fee-schedules':
        return <AdminFeeSchedules />;
      case 'admin-structure':
        return <AdminAcademicStructure />;
      case 'admin-settings':
        return <SchoolSettingsManager />;
      case 'admin-users':
        return <AdminUsers />;
      case 'admin-audit':
        return <AdminAuditLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
      {renderActiveView()}
    </main>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-100">
        <LoginScreen />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <MainContent />
          <Footer />
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

