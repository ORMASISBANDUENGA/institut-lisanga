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

interface NavSection {
  groupTitle?: string;
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    isWarning?: boolean;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeRole, activeNavTab, setActiveNavTab, admissions, grades } = useApp();

  const safeAdmissions = admissions || [];
  const safeGrades = grades || [];

  const pendingAdmissionsCount = safeAdmissions.filter(
    (a) => a.status === 'UNDER_REVIEW' || a.status === 'APPROVED' || a.status === 'SUBMITTED'
  ).length;

  // Check if student has failing grades requiring repêchage (<10/20)
  const hasFailingGrades = safeGrades.some((g) => (g.average || 0) < 10);

  const renderNavSections = (): NavSection[] => {
    switch (activeRole) {
      case 'STUDENT': {
        const scolariteItems: NavSection['items'] = [
          { id: 'student-grades', label: 'Résultats & Notes', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'student-schedule', label: 'Emploi du temps', icon: <Calendar className="w-4 h-4" /> },
        ];

        // Conditional Repêchage entry
        if (hasFailingGrades) {
          scolariteItems.push({
            id: 'student-repechage',
            label: 'Repêchage (2e Session)',
            icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
            isWarning: true,
          });
        }

        return [
          {
            groupTitle: 'ACCUEIL',
            items: [
              { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: 'SCOLARITÉ',
            items: scolariteItems,
          },
          {
            groupTitle: 'SERVICES',
            items: [
              { id: 'student-finances', label: 'Finances & Minerval', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'student-documents', label: 'Documents & Reçus', icon: <FileText className="w-4 h-4" /> },
              { id: 'student-discipline', label: 'Discipline & R.O.I', icon: <Scale className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: 'PROFIL & SYSTÈME',
            items: [
              { id: 'student-profile', label: 'Mon Profil', icon: <User className="w-4 h-4" /> },
              { id: 'student-security', label: 'Sécurité & Accès', icon: <Lock className="w-4 h-4" /> },
            ],
          },
        ];
      }

      case 'TEACHER':
        return [
          {
            groupTitle: 'ACCUEIL',
            items: [
              { id: 'teacher-dashboard', label: 'Vue d’ensemble', icon: <LayoutDashboard className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: 'ACTIVITÉS PÉDAGOGIQUES',
            items: [
              { id: 'teacher-gradebook', label: 'Saisie des notes', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'teacher-attendance', label: 'Feuille de présence', icon: <ClipboardCheck className="w-4 h-4" /> },
              { id: 'student-schedule', label: 'Planning & Salles', icon: <Building2 className="w-4 h-4" /> },
            ],
          },
        ];

      case 'PARENT': {
        const scolariteItems: NavSection['items'] = [
          { id: 'student-grades', label: 'Résultats & Bulletins', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'student-schedule', label: 'Horaire de cours', icon: <Calendar className="w-4 h-4" /> },
        ];

        if (hasFailingGrades) {
          scolariteItems.push({
            id: 'student-repechage',
            label: 'Repêchage & 2e Session',
            icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
            isWarning: true,
          });
        }

        return [
          {
            groupTitle: 'ACCUEIL',
            items: [
              { id: 'parent-dashboard', label: 'Espace Parents (Multi-enfants)', icon: <Users2 className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: 'SUIVI SCOLARITÉ',
            items: scolariteItems,
          },
          {
            groupTitle: 'FINANCES & SERVICES',
            items: [
              { id: 'student-finances', label: 'Paiements & Quittances', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'student-discipline', label: 'Discipline & Assiduité', icon: <Scale className="w-4 h-4" /> },
              { id: 'student-documents', label: 'Documents & Certificats', icon: <FileText className="w-4 h-4" /> },
            ],
          },
        ];
      }

      case 'ADMIN':
        return [
          {
            groupTitle: 'DIRECTION',
            items: [
              { id: 'admin-dashboard', label: 'Tableau de bord général', icon: <LayoutDashboard className="w-4 h-4" /> },
              {
                id: 'admin-admissions',
                label: 'Workflow Admissions',
                icon: <FolderKanban className="w-4 h-4" />,
                badge: pendingAdmissionsCount > 0 ? pendingAdmissionsCount : undefined,
              },
            ],
          },
          {
            groupTitle: 'GESTION ACADÉMIQUE',
            items: [
              { id: 'admin-enrollments', label: 'Inscriptions & Élèves', icon: <GitBranch className="w-4 h-4" /> },
              { id: 'admin-teachers-distribution', label: 'Attribution des Cours', icon: <UserCheck className="w-4 h-4" /> },
              { id: 'admin-rooms', label: 'Gestion des Salles (ROOM)', icon: <Building2 className="w-4 h-4" /> },
              { id: 'admin-structure', label: 'Structure & Options', icon: <CheckCircle className="w-4 h-4" /> },
            ],
          },
          {
            groupTitle: 'FINANCES & CONFIGURATION',
            items: [
              { id: 'admin-fee-schedules', label: 'Barème des Frais', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'admin-settings', label: 'Configuration Établissement', icon: <Building2 className="w-4 h-4 text-emerald-400" /> },
              { id: 'admin-users', label: 'Comptes & Statuts IAM', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'admin-audit', label: 'Journal d’Audit & Sécurité', icon: <History className="w-4 h-4" /> },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const sections = renderNavSections();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 shrink-0 border-r border-slate-800">
      
      {/* Role Badge Indicator */}
      <div className="mb-5 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
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

      {/* Navigation Sections */}
      <nav className="space-y-4 flex-1 overflow-y-auto pr-1">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {section.groupTitle && (
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 py-1">
                {section.groupTitle}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeNavTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => setActiveNavTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                        : item.isWarning
                        ? 'text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-bounce shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
