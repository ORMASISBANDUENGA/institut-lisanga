import React from 'react';
import { useApp } from '../../context/AppContext';
import { getGradeVisual } from '../common/GradeBadge';
import {
  TrendingUp,
  Award,
  Calendar,
  CreditCard,
  GraduationCap,
  Clock,
  MapPin,
  FileCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, currentPerson, grades, payments, reservations, setActiveNavTab } = useApp();

  const todaySchedule = reservations
    .filter((r) => r.dayOfWeek === 'Lundi')
    .slice(0, 4);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#254F7D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Année Académique 2026-2027</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour {currentPerson.firstName} 👋
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              {currentStudent.currentClassName} • Matricule :{' '}
              <span className="font-mono text-amber-300 font-bold">{currentStudent.matricule}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="student-view-profile-btn"
              onClick={() => setActiveNavTab('student-profile')}
              className="px-4 py-2 bg-white text-[#1A3A5C] text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-xs flex items-center gap-1.5"
            >
              <span>Mon Profil Complet</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Average Card (Exact visual from specification) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                📊 MA MOYENNE GÉNÉRALE
              </h2>
              <p className="text-xs text-slate-400">Trimestre 1 & 2 • 4ème Commerciale et Gestion A</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Statut : Bien ✅
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1A3A5C] tracking-tight">
              14.2 <span className="text-lg font-normal text-slate-500">/ 20</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>+1.5 pts vs trimestre précédent</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Classement en Classe
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              8<sup className="text-xs">ème</sup> sur 42 élèves
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Option Commerciale et Gestion
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assiduité & Conduite
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              Très Bonne (98%)
            </div>
            <div className="text-xs text-slate-500 mt-1">
              0 absence non justifiée
            </div>
          </div>
        </div>
      </div>

      {/* 3 Quick Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Today Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  📅 Emploi du temps
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Aujourd’hui</span>
            </div>
            <div className="space-y-2 mt-2">
              {todaySchedule.map((s, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{s.subject}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {s.startTime} - {s.endTime}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {s.roomId === 'room-12' ? 'Salle 12' : s.roomId === 'room-8' ? 'Salle 8' : s.roomId === 'room-15' ? 'Labo 15' : 'Salle 10'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveNavTab('student-schedule')}
            className="mt-3 text-xs font-bold text-[#1A3A5C] hover:underline flex items-center gap-1"
          >
            <span>Voir planning complet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Recent Grades */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  📝 Notes récentes
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Trimestre 1</span>
            </div>
            <div className="space-y-2 mt-2">
              {grades.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800">{g.subjectName}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">{g.average}/20</span>
                    <span className="text-xs">✅</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveNavTab('student-grades')}
            className="mt-3 text-xs font-bold text-[#1A3A5C] hover:underline flex items-center gap-1"
          >
            <span>Voir relevé détaillé</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Payments Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  💰 Paiements & Minerval
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                Solde restant
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5 mt-2">
              <div className="flex justify-between font-bold text-amber-900">
                <span>Trimestre 3 (Frais d’État) :</span>
                <span>150 $</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Montant payé :</span>
                <span className="font-semibold text-emerald-700">100 $</span>
              </div>
              <div className="flex justify-between text-amber-800 font-bold pt-1 border-t border-amber-200">
                <span>Reste à payer :</span>
                <span className="text-rose-600">50 $</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                ⏳ Échéance : <strong>30/08/2026</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveNavTab('student-finances')}
            className="mt-3 text-xs font-bold text-[#1A3A5C] hover:underline flex items-center gap-1"
          >
            <span>Voir mes quittances & reçus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Latest Grades Detail Section (Exact visual with colored progression bars from spec v1.1) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              📝 DERNIÈRES NOTES - RÉSULTATS PAR MATIÈRE
            </h3>
            <p className="text-xs text-slate-500">
              Évaluations du 1er Trimestre • Coefficient pris en compte
            </p>
          </div>
          <button
            id="export-grades-quick"
            onClick={() => setActiveNavTab('student-grades')}
            className="text-xs font-bold text-[#1A3A5C] hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition"
          >
            Détail complet
          </button>
        </div>

        <div className="space-y-3.5">
          {grades.map((g) => {
            const avg = typeof g.average === 'number' && !isNaN(g.average) ? g.average : 0;
            const visual = getGradeVisual(avg);
            const percentage = Math.min(100, Math.max(0, (avg / 20) * 100));
            return (
              <div
                key={g.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors bg-slate-50/50"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 w-36 truncate">
                      {g.subjectName}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Coef. {g.coefficient}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {avg.toFixed(1).replace('.0', '')}/20
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${visual.bg} ${visual.text} ${visual.border}`}
                    >
                      {visual.label} {visual.icon}
                    </span>
                  </div>
                </div>

                {/* Progress bar visual matching spec */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${visual.barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
