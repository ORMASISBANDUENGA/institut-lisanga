import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  GraduationCap,
  Bell,
  User,
  MoreVertical,
  Calendar,
  CreditCard,
  FileText,
  Building2,
  GitBranch,
  ShieldCheck,
  History,
  X,
  BookOpen,
  ClipboardCheck,
  AlertTriangle,
  Scale,
  Lock,
  DollarSign,
  UserCheck,
  Users,
  FolderKanban,
  CheckCircle,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const MobileNav: React.FC = () => {
  const { activeNavTab, setActiveNavTab, activeRole, unreadNotificationsCount, admissions } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const safeAdmissions = admissions || [];
  const pendingAdmissionsCount = safeAdmissions.filter(
    (a) => a.status === 'UNDER_REVIEW' || a.status === 'APPROVED' || a.status === 'SUBMITTED'
  ).length;

  return (
    <>
      {/* Bottom Fixed Navigation Bar (Role partitioned) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          
          {/* 1. Accueil Principal */}
          <button
            id="mobile-nav-home"
            onClick={() => {
              setActiveNavTab(
                activeRole === 'STUDENT'
                  ? 'dashboard'
                  : activeRole === 'TEACHER'
                  ? 'teacher-dashboard'
                  : activeRole === 'PARENT'
                  ? 'parent-dashboard'
                  : 'admin-dashboard'
              );
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
              activeNavTab.includes('dashboard')
                ? 'text-[#1A3A5C] font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Accueil</span>
          </button>

          {/* 2. Onglet Clé selon Rôle */}
          {activeRole === 'STUDENT' && (
            <button
              id="mobile-nav-student-grades"
              onClick={() => setActiveNavTab('student-grades')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'student-grades' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Notes</span>
            </button>
          )}

          {activeRole === 'TEACHER' && (
            <button
              id="mobile-nav-teacher-gradebook"
              onClick={() => setActiveNavTab('teacher-gradebook')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'teacher-gradebook' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Cote & Notes</span>
            </button>
          )}

          {activeRole === 'PARENT' && (
            <button
              id="mobile-nav-parent-grades"
              onClick={() => setActiveNavTab('student-grades')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'student-grades' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Bulletins</span>
            </button>
          )}

          {activeRole === 'ADMIN' && (
            <button
              id="mobile-nav-admin-admissions"
              onClick={() => setActiveNavTab('admin-admissions')}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'admin-admissions' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderKanban className="w-5 h-5" />
              <span>Admissions</span>
              {pendingAdmissionsCount > 0 && (
                <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {pendingAdmissionsCount}
                </span>
              )}
            </button>
          )}

          {/* 3. Notifications */}
          <button
            id="mobile-nav-notif"
            onClick={() => setIsNotifOpen(true)}
            className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span>Notif.</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-0 right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* 4. Horaire / Inscriptions */}
          {activeRole === 'STUDENT' && (
            <button
              id="mobile-nav-student-schedule"
              onClick={() => setActiveNavTab('student-schedule')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'student-schedule' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Horaire</span>
            </button>
          )}

          {activeRole === 'TEACHER' && (
            <button
              id="mobile-nav-teacher-attendance"
              onClick={() => setActiveNavTab('teacher-attendance')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'teacher-attendance' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>Présences</span>
            </button>
          )}

          {activeRole === 'PARENT' && (
            <button
              id="mobile-nav-parent-finances"
              onClick={() => setActiveNavTab('student-finances')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'student-finances' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Paiements</span>
            </button>
          )}

          {activeRole === 'ADMIN' && (
            <button
              id="mobile-nav-admin-enrollments"
              onClick={() => setActiveNavTab('admin-enrollments')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
                activeNavTab === 'admin-enrollments' ? 'text-[#1A3A5C] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GitBranch className="w-5 h-5" />
              <span>Élèves</span>
            </button>
          )}

          {/* 5. Menu Plus (Drawer strictly partitioned) */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-800"
          >
            <MoreVertical className="w-5 h-5" />
            <span>Menu</span>
          </button>

        </div>
      </div>

      {/* Expandable "Plus" Drawer Menu with smooth slide-up transition */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
              className="relative w-full z-10 bg-white rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Handle Bar */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#1A3A5C]">Menu de Navigation</span>
                  <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-bold">
                    {activeRole === 'STUDENT' && 'Portail Élève'}
                    {activeRole === 'TEACHER' && 'Portail Enseignant'}
                    {activeRole === 'PARENT' && 'Portail Parent'}
                    {activeRole === 'ADMIN' && 'Direction & Admin'}
                  </span>
                </div>
                <button
                  id="close-mobile-menu"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                
                {/* 1. STUDENT MENU ITEMS ONLY */}
                {activeRole === 'STUDENT' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setActiveNavTab('dashboard'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-700" />
                        <span className="font-semibold text-slate-800 text-xs">Tableau de bord</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-grades'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Résultats & Notes</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-repechage'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-left hover:bg-amber-50 flex items-center gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-slate-800 text-xs">Repêchage (2e Sess.)</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-schedule'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 text-xs">Horaire de cours</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-finances'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Frais & Reçus</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-discipline'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Scale className="w-4 h-4 text-slate-700" />
                        <span className="font-semibold text-slate-800 text-xs">Discipline & R.O.I</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-documents'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-800 text-xs">Documents Officiels</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-security'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Lock className="w-4 h-4 text-rose-600" />
                        <span className="font-semibold text-slate-800 text-xs">Sécurité & Compte</span>
                      </button>
                    </div>

                    <button
                      onClick={() => { setActiveNavTab('student-profile'); setIsMenuOpen(false); }}
                      className="w-full p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-700" />
                      <span className="font-semibold text-slate-800 text-xs">Mon Profil & Coordonnées</span>
                    </button>
                  </div>
                )}

                {/* 2. TEACHER MENU ITEMS ONLY */}
                {activeRole === 'TEACHER' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => { setActiveNavTab('teacher-dashboard'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-800 text-xs">Vue d’ensemble Enseignant</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('teacher-gradebook'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-800 text-xs">Cote & Saisie des Notes</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('teacher-attendance'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <ClipboardCheck className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-slate-800 text-xs">Feuille de Présence</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-schedule'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 text-xs">Planning Salles & Horaires</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. PARENT MENU ITEMS ONLY */}
                {activeRole === 'PARENT' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setActiveNavTab('parent-dashboard'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5 col-span-2"
                      >
                        <Users className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-slate-800 text-xs">Espace Parents (Multi-enfants)</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-grades'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Résultats scolaires</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-finances'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Frais & Quittances</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-schedule'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 text-xs">Horaire de l’enfant</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('student-discipline'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Scale className="w-4 h-4 text-slate-700" />
                        <span className="font-semibold text-slate-800 text-xs">Discipline & Suivi</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ADMIN MENU ITEMS ONLY */}
                {activeRole === 'ADMIN' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setActiveNavTab('admin-dashboard'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5 col-span-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-800 text-xs">Tableau de bord Direction</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-admissions'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <FolderKanban className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-800 text-xs">Admissions</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-enrollments'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <GitBranch className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-slate-800 text-xs">Inscriptions Élèves</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-teachers-distribution'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-800 text-xs">Attribution Cours</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-fee-schedules'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Barème des Frais</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-rooms'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 text-xs">Salles (ROOM)</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-structure'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <CheckCircle className="w-4 h-4 text-cyan-600" />
                        <span className="font-semibold text-slate-800 text-xs">Structure & Options</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-settings'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <Building2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-xs">Paramètres École</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-users'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-slate-800 text-xs">Comptes IAM</span>
                      </button>
                      <button
                        onClick={() => { setActiveNavTab('admin-audit'); setIsMenuOpen(false); }}
                        className="p-3 rounded-xl border border-slate-200 text-left hover:bg-slate-50 flex items-center gap-2.5 col-span-2"
                      >
                        <History className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-slate-800 text-xs">Journal d’Audit & Sécurité</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
