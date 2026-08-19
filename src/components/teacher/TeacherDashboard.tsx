import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Users,
  Award,
  ClipboardCheck,
  Calendar,
  Lock,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { setActiveNavTab } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#1E4B7A] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <span>Portail Pédagogique • Enseignant Titulaire</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour Dr. KABEYA 👨🏫
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Mathématiques & Droit Commercial • 3 classes • 85 élèves assignés
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="teacher-quick-grade-btn"
              onClick={() => setActiveNavTab('teacher-gradebook')}
              className="px-4 py-2 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-300 transition shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Saisir des Notes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 VUE D'ENSEMBLE (Exact 4 Metrics from spec) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Élèves
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            85
          </div>
          <div className="text-xs text-slate-500 mt-1">
            3 classes assignées
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Moyenne Globale
          </div>
          <div className="text-3xl font-extrabold text-[#1A3A5C] mt-1">
            14.5 <span className="text-sm font-normal text-slate-500">/ 20</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            ✅ Niveau satisfaisant
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Taux Présence
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1">
            92%
          </div>
          <div className="text-xs text-emerald-800 font-semibold mt-1">
            Assiduité générale
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/40 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Taux Absence
          </div>
          <div className="text-3xl font-extrabold text-rose-700 mt-1">
            8%
          </div>
          <div className="text-xs text-rose-600 mt-1">
            Majoritairement justifiées
          </div>
        </div>

      </div>

      {/* 📝 MES COURS ET SALLES ASSIGNÉES */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>MES COURS DU JOUR & PERFORMANCE</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Lundi 16/08/2026</span>
        </div>

        <div className="space-y-3">
          
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">7ème C.O A</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  Mathématiques
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> 08:00 - 10:00
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Salle 7A (Bloc B)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Moyenne classe</span>
                <span className="font-mono font-bold text-sm text-emerald-700">15.0 / 20</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs">
                ✅ Très bon
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">8ème C.O B</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                  Mathématiques
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> 10:00 - 12:00
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Salle 8 (Bloc B)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Moyenne classe</span>
                <span className="font-mono font-bold text-sm text-emerald-700">14.0 / 20</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs">
                ✅ Bon
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">4ème Commerciale A</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">
                  Mathématiques & Droit
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> 16:00 - 17:30
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Salle 10 (Bloc A)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Moyenne classe</span>
                <span className="font-mono font-bold text-sm text-amber-700">12.0 / 20</span>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-bold text-xs">
                ⚠️ À renforcer
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ✏️ ACTIONS RAPIDES */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
          ✏️ ACTIONS RAPIDES PÉDAGOGIQUES
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveNavTab('teacher-gradebook')}
            className="p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 text-left transition flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-sm text-indigo-950 block">📝 Saisir des notes</span>
              <span className="text-xs text-slate-500">Interro, TP, Examen</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-600" />
          </button>

          <button
            onClick={() => setActiveNavTab('teacher-attendance')}
            className="p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 text-left transition flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-sm text-emerald-950 block">✅ Faire la présence</span>
              <span className="text-xs text-slate-500">Appel et pointage en direct</span>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-600" />
          </button>

          <button
            onClick={() => setActiveNavTab('student-schedule')}
            className="p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 bg-blue-50/40 text-left transition flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-sm text-blue-950 block">📅 Planning des salles</span>
              <span className="text-xs text-slate-500">Occupation et horaires</span>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* 🔒 ZONES RESTREINTES (Respecting Spec 5.2/5.3 Permission Control) */}
      <div className="bg-slate-100 rounded-2xl border border-slate-200 p-5 text-slate-500 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Lock className="w-4 h-4 text-slate-500" />
          <span>Zones restreintes par le profil Enseignant :</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Conformément au modèle de sécurité d’Institut Lisanga, la gestion financière, la création des comptes utilisateurs et les validations administratives des admissions sont gérées exclusivement par la Direction.
        </p>
      </div>

    </div>
  );
};
