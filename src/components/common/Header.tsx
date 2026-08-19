import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Bell,
  GraduationCap,
  Users,
  ShieldCheck,
  BookOpen,
  RotateCcw,
  Sparkles,
  School,
  LogOut,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    setActiveNavTab,
    unreadNotificationsCount,
    resetAllData,
    currentPerson,
    currentStudent,
    schoolSettings,
    logout,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const roleConfigs: Record<
    UserRole,
    { label: string; subLabel: string; roleTag: string; icon: React.ReactNode; badgeClass: string; avatar: string }
  > = {
    STUDENT: {
      label: `${currentPerson.lastName} ${currentPerson.postName} ${currentPerson.firstName}`,
      subLabel: `${currentStudent.currentClassName} • ${currentStudent.permanentStudentNumber}`,
      roleTag: 'Portail Élève',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      avatar: currentPerson.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    TEACHER: {
      label: 'Dr. KABEYA Tshilumba',
      subLabel: 'Enseignant Titulaire • Mathématiques (Matadi)',
      roleTag: 'Portail Enseignant',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    PARENT: {
      label: 'M. Jean BAKALAYETO',
      subLabel: 'Responsable Légal • 3 Enfants scolarisés',
      roleTag: 'Portail Responsable / Parent',
      icon: <Users className="w-4 h-4 text-amber-600" />,
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    ADMIN: {
      label: 'Direction des Études & Administration',
      subLabel: 'Administrateur Principal • Institut Lisanga Matadi',
      roleTag: 'Direction & Administration',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    SUPER_ADMIN: {
      label: 'Super Administrateur Système',
      subLabel: 'Contrôle Global & Sécurité • Institut Lisanga Matadi',
      roleTag: 'Super Administrateur',
      icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
  };

  const currentConfig = roleConfigs[activeRole] || roleConfigs.ADMIN;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo & Establishment identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3A5C] to-[#0F2338] text-white flex items-center justify-center shadow-md font-extrabold text-sm">
                {schoolSettings.shortName ? schoolSettings.shortName.slice(0, 3).toUpperCase() : <School className="w-6 h-6 text-amber-400" />}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-[#1A3A5C]">
                    {schoolSettings.name || 'Système Scolaire'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    C.O & Humanités
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {schoolSettings.city ? `${schoolSettings.city} (${schoolSettings.province || 'RDC'})` : 'RDC'} • Année Académique {schoolSettings.academicYear || '2026-2027'}
                </p>
              </div>
            </div>

            {/* Authenticated Role Portal Badge (Strict session display, no unauthorized cross-role switching) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50 shadow-2xs">
              <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${currentConfig.badgeClass}`}>
                {currentConfig.icon}
                <span>{currentConfig.roleTag}</span>
              </span>
            </div>

            {/* Right side actions: Notifications, User profile & Disconnect */}
            <div className="flex items-center gap-2.5">
              {/* Reset Data Button */}
              <button
                id="reset-state-btn"
                onClick={() => {
                  if (confirm('Voulez-vous réinitialiser les données de démonstration d’Institut Lisanga ?')) {
                    resetAllData();
                  }
                }}
                title="Réinitialiser les données"
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Données initiales</span>
              </button>

              {/* Notification Button */}
              <button
                id="header-notification-btn"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label="Voir les notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Active Profile Info */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <img
                  src={currentConfig.avatar}
                  alt={currentConfig.label}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentConfig.label}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {currentConfig.subLabel}
                  </div>
                </div>
              </div>

              {/* Deconnexion Button */}
              <button
                id="header-logout-btn"
                onClick={logout}
                title="Se déconnecter"
                className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition border border-rose-200 flex items-center gap-1 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
