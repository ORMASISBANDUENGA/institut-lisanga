import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  FileText,
  CreditCard,
  User,
  BookOpen,
  ClipboardCheck,
  Building2,
  Users2,
  GitBranch,
  ShieldCheck,
  History,
  FolderKanban,
  CheckCircle,
  AlertTriangle,
  Scale,
  Lock,
  DollarSign,
  UserCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeRole, activeNavTab, setActiveNavTab, admissions } = useApp();

  const pendingAdmissionsCount = admissions.filter(
    (a) => a.status === 'UNDER_REVIEW' || a.status === 'APPROVED' || a.status === 'SUBMITTED'
  ).length;

  const renderNavItems = () => {
    switch (activeRole) {
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Accueil & Synthèse', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'student-grades', label: '📊 Résultats & Notes', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'student-repechage', label: '📋 Repêchage (2e Session)', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
          { id: 'student-schedule', label: '📅 Horaire du cours', icon: <Calendar className="w-4 h-4" /> },
          { id: 'student-finances', label: '💰 Frais & Finances (USD/CDF)', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'student-discipline', label: '⚖️ Discipline & R.O.I', icon: <Scale className="w-4 h-4" /> },
          { id: 'student-documents', label: '📜 Documents Officiels', icon: <FileText className="w-4 h-4" /> },
          { id: 'student-profile', label: '👤 Profil & Coordonnées', icon: <User className="w-4 h-4" /> },
          { id: 'student-security', label: '🔐 Sécurité & Sessions', icon: <Lock className="w-4 h-4" /> },
        ];

      case 'TEACHER':
        return [
          { id: 'teacher-dashboard', label: 'Vue d’ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'teacher-gradebook', label: 'Saisie des notes', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'teacher-attendance', label: 'Feuille de présence', icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: 'student-schedule', label: 'Horaire & Planning Salles', icon: <Building2 className="w-4 h-4" /> },
        ];

      case 'PARENT':
        return [
          { id: 'parent-dashboard', label: 'Espace Parents (Multi-enfants)', icon: <Users2 className="w-4 h-4" /> },
          { id: 'student-grades', label: 'Résultats & Bulletins', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'student-repechage', label: 'Repêchage & Rattrapage', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'student-finances', label: 'Paiements & Quittances (USD/CDF)', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'student-schedule', label: 'Horaire de l’élève', icon: <Calendar className="w-4 h-4" /> },
          { id: 'student-discipline', label: 'Discipline & Assiduité', icon: <Scale className="w-4 h-4" /> },
          { id: 'student-documents', label: 'Documents & Certificats', icon: <FileText className="w-4 h-4" /> },
        ];

      case 'ADMIN':
        return [
          { id: 'admin-dashboard', label: 'Tableau de bord général', icon: <LayoutDashboard className="w-4 h-4" /> },
          {
            id: 'admin-admissions',
            label: 'Workflow Admissions',
            icon: <FolderKanban className="w-4 h-4" />,
            badge: pendingAdmissionsCount > 0 ? pendingAdmissionsCount : undefined,
          },
          { id: 'admin-enrollments', label: 'Inscriptions & Élèves (CRUD)', icon: <GitBranch className="w-4 h-4" /> },
          { id: 'admin-teachers-distribution', label: 'Attribution des Cours', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'admin-fee-schedules', label: 'Barème des Frais (USD/CDF)', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'admin-rooms', label: 'Gestion des Salles (ROOM)', icon: <Building2 className="w-4 h-4" /> },
          { id: 'admin-structure', label: 'Structure académique & Options', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'admin-settings', label: '⚙️ Configuration Établissement', icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
          { id: 'admin-users', label: 'Comptes & Statuts IAM', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'admin-audit', label: 'Journal d’Audit & Sécurité', icon: <History className="w-4 h-4" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = renderNavItems();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 shrink-0 border-r border-slate-800">
      
      {/* Role Badge Indicator */}
      <div className="mb-6 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
          Module Actif
        </div>
        <div className="text-sm font-semibold text-white mt-0.5">
          {activeRole === 'STUDENT' && 'Portail Élève'}
          {activeRole === 'TEACHER' && 'Portail Enseignant'}
          {activeRole === 'PARENT' && 'Portail Responsable'}
          {activeRole === 'ADMIN' && 'Direction & Administration'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveNavTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-bounce">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Institut Lisanga</span>
          <span className="font-semibold text-amber-400">v1.1</span>
        </div>
        <p className="text-[10px] text-slate-500">Matadi, Kongo Central (RDC) • C.O & Humanités</p>
      </div>

    </aside>
  );
};
