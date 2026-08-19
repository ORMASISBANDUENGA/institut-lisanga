import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  HeartHandshake,
  Building2,
  CheckCircle,
  ArrowRight,
  UserPlus,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  DollarSign,
  UserCheck,
  History,
  Lock,
  ChevronRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    teachers,
    allStudents,
    parents,
    classes,
    rooms,
    resetSchoolToZeroData,
    setActiveNavTab,
  } = useApp();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');

  const activeTeachersCount = teachers.filter((t) => t.status === 'ACTIVE').length;
  const activeStudentsCount = allStudents.filter((s) => s.status === 'ACTIVE').length;
  const activeParentsCount = parents.filter((p) => p.status === 'ACTIVE').length;

  const handleConfirmReset = () => {
    resetSchoolToZeroData();
    setIsResetModalOpen(false);
    setResetConfirmationText('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Direction Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#0D1F33] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direction Générale & Administration Scolaire</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tableau de Bord Administratif
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
              Institut Lisanga • Année Académique 2026-2027 • MATADI (Kongo Central)
            </p>
          </div>

          {/* Reset App Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2 border border-rose-500/50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-rose-200" />
              <span>Réinitialiser l'Application à Zéro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Corps Enseignant
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-1">
            {teachers.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeTeachersCount} professeurs actifs
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Élèves Inscrits
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
            {allStudents.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeStudentsCount} élèves réguliers
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Parents & Tuteurs
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {parents.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {activeParentsCount} comptes responsables
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Classes Actives
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1A3A5C] mt-1">
            {classes.length}
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            C.O (7e-8e) & Humanités
          </div>
        </div>
      </div>

      {/* 3 CORE MANAGEMENT CONTAINERS (Clickable Containers as requested) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>LES 3 MODULES MAÎTRES D'ADMINISTRATION</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cliquez sur n'importe quel conteneur pour gérer, créer, modifier ou supprimer en totalité.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CONTAINER 1: GESTION DES ENSEIGNANTS */}
          <div
            onClick={() => setActiveNavTab('admin-teachers')}
            className="group bg-white rounded-3xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <Users className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
                Conteneur 1
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                Gestion des Enseignants
              </h3>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Contrôle absolu sur le corps professoral : matricules, spécialités, qualifications, salaires mensuels et affectations pédagogiques.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Effectif total</span>
                  <span className="font-bold text-slate-900">{teachers.length} professeurs</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">En service actif</span>
                  <span className="font-bold text-purple-700">{activeTeachersCount} actifs</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Droits administratifs</span>
                  <span className="font-semibold text-emerald-600">CRUD Illimité</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 group-hover:underline">
                Ouvrir la gestion des enseignants
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-700 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* CONTAINER 2: GESTION DES ÉLÈVES */}
          <div
            onClick={() => setActiveNavTab('admin-students')}
            className="group bg-white rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                Conteneur 2
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                Gestion des Élèves
              </h3>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Registre matricule complet : inscriptions, affectations de classe, informations d'état civil, bulletins, documents et statuts scolaires.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Effectif total</span>
                  <span className="font-bold text-slate-900">{allStudents.length} élèves</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Inscrits & Actifs</span>
                  <span className="font-bold text-blue-700">{activeStudentsCount} élèves</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Droits administratifs</span>
                  <span className="font-semibold text-emerald-600">CRUD Illimité</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 group-hover:underline">
                Ouvrir la gestion des élèves
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* CONTAINER 3: GESTION DES PARENTS */}
          <div
            onClick={() => setActiveNavTab('admin-parents')}
            className="group bg-white rounded-3xl border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <div className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                Conteneur 3
              </div>

              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Gestion des Parents
              </h3>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Annuaire officiel des tuteurs et responsables légaux : liens de parenté, téléphones d'urgence, enfants rattachés et droits d'accès.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Responsables inscrits</span>
                  <span className="font-bold text-slate-900">{parents.length} parents</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Contacts d'urgence</span>
                  <span className="font-bold text-emerald-700">
                    {parents.filter((p) => p.emergencyContact).length} configurés
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Droits administratifs</span>
                  <span className="font-semibold text-emerald-600">CRUD Illimité</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 group-hover:underline">
                Ouvrir la gestion des parents
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Quick Access Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1A3A5C]" />
            <h2 className="font-extrabold text-sm text-slate-900">
              Autres Outils & Configurations de l'Établissement
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveNavTab('admin-structure')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-[#1A3A5C] hover:bg-slate-50 text-left transition flex flex-col justify-between cursor-pointer"
          >
            <CheckCircle className="w-5 h-5 text-[#1A3A5C] mb-2" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">Classes & Structure</span>
              <span className="text-[11px] text-slate-500">CRUD complet des classes</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNavTab('admin-teachers-distribution')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition flex flex-col justify-between cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-purple-600 mb-2" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">Attribution des Cours</span>
              <span className="text-[11px] text-slate-500">Volume horaire & charges</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNavTab('admin-rooms')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition flex flex-col justify-between cursor-pointer"
          >
            <Building2 className="w-5 h-5 text-blue-600 mb-2" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">Salles & Horaires</span>
              <span className="text-[11px] text-slate-500">{rooms.length} salles configurées</span>
            </div>
          </button>

          <button
            onClick={() => setActiveNavTab('admin-fee-schedules')}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition flex flex-col justify-between cursor-pointer"
          >
            <DollarSign className="w-5 h-5 text-amber-600 mb-2" />
            <div>
              <span className="font-bold text-xs text-slate-900 block">Barème des Frais</span>
              <span className="text-[11px] text-slate-500">Minerval & taux CDF</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal Confirmation for Hard Reset to 0 */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Réinitialisation Totale de l'Application
                </h3>
                <p className="text-xs text-rose-600 font-bold">
                  Remise à Zéro Complète de l'Établissement
                </p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-bold">
                Attention : Cette opération est irréversible et effacera instantanément :
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Tous les élèves enregistrés (0 élève restant)</li>
                <li>Tous les enseignants et professeurs (0 enseignant restant)</li>
                <li>Tous les parents et tuteurs (0 parent restant)</li>
                <li>Toutes les notes, feuilles de présence, bulletins et paiements</li>
                <li>Toutes les attributions de cours et plannings</li>
              </ul>
              <p className="text-[11px] font-bold text-emerald-800 pt-1 border-t border-rose-200">
                ✓ Seuls les comptes ADMINISTRATEURS et la configuration de l'école seront conservés pour vous permettre de tout recommencer à zéro.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pour confirmer, tapez le mot <span className="font-mono text-rose-600 uppercase">ZERO</span> ci-dessous :
              </label>
              <input
                type="text"
                value={resetConfirmationText}
                onChange={(e) => setResetConfirmationText(e.target.value)}
                placeholder="Tapez ZERO"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold text-center uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsResetModalOpen(false);
                  setResetConfirmationText('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={resetConfirmationText.trim().toUpperCase() !== 'ZERO'}
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
              >
                Tout Réinitialiser à Zéro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
