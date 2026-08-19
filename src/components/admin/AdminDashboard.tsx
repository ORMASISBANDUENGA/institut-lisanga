import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Building2,
  FolderKanban,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { admissions, rooms, students, classes, setActiveNavTab } = useApp();

  const safeAdmissions = admissions || [];
  const safeRooms = rooms || [];
  const safeStudents = students || [];
  const safeClasses = classes || [];

  const pendingAdmissions = safeAdmissions.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
  );
  const approvedAdmissions = safeAdmissions.filter((a) => a.status === 'APPROVED');
  const availableRooms = safeRooms.filter((r) => r.status === 'AVAILABLE');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#0D1F33] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direction Générale & Administration Scolaire</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de Bord Administratif
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Institut Lisanga • Année Académique 2026-2027 • MATADI (Kongo Central)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveNavTab('admin-admissions')}
              className="px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-300 transition shadow-xs flex items-center gap-2"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Traiter Admissions ({pendingAdmissions.length + approvedAdmissions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Élèves Inscrits
            </span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            1 240
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            +5.2% vs 2025-2026
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Salles Gérées (ROOM)
            </span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {safeRooms.length}
          </div>
          <div className="text-xs text-blue-700 font-semibold mt-1">
            {availableRooms.length} actuellement libres
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recouvrement Frais
            </span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            94.2%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Frais trimestriels régularisés
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Corps Enseignant
            </span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            48
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Professeurs & Titulaires
          </div>
        </div>

      </div>

      {/* Workflow Admissions Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Admissions Spotlight */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-600" />
              <h2 className="font-extrabold text-sm text-slate-900">
                Workflow des Admissions en cours
              </h2>
            </div>
            <button
              onClick={() => setActiveNavTab('admin-admissions')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {admissions.slice(0, 3).map((adm) => (
              <div
                key={adm.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {adm.candidateName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Candidature pour : <strong>{adm.desiredCycle} - {adm.desiredLevel}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                    {adm.code}
                  </span>
                  <button
                    onClick={() => setActiveNavTab('admin-admissions')}
                    className="px-2.5 py-1 bg-[#1A3A5C] text-white text-[11px] font-bold rounded-lg hover:bg-[#122A42]"
                  >
                    Examiner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Management Hub */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <h2 className="font-extrabold text-sm text-slate-900">
                Administration Rapide des Modules
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveNavTab('admin-rooms')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-left transition flex flex-col justify-between"
            >
              <Building2 className="w-5 h-5 text-blue-600 mb-2" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Gestion des Salles</span>
                <span className="text-[11px] text-slate-500">Occupation, conflits & matériel</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNavTab('admin-enrollments')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 text-left transition flex flex-col justify-between"
            >
              <GraduationCap className="w-5 h-5 text-teal-600 mb-2" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Inscriptions</span>
                <span className="text-[11px] text-slate-500">Affectations & Matricules</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNavTab('admin-structure')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 text-left transition flex flex-col justify-between"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-600 mb-2" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Structure & Options</span>
                <span className="text-[11px] text-slate-500">C.O (7e-8e) & Humanités</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNavTab('admin-users')}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-left transition flex flex-col justify-between"
            >
              <Users className="w-5 h-5 text-purple-600 mb-2" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Comptes Utilisateurs</span>
                <span className="text-[11px] text-slate-500">Statuts, invitations & rôles</span>
              </div>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
