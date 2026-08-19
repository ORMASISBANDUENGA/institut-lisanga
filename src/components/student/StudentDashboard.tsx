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
  ChevronRight,
  AlertTriangle,
  Scale,
  FileText,
  CheckCircle2,
  Download,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    currentPerson,
    grades,
    payments,
    reservations,
    disciplineSanctions,
    promotionFeeSchedules,
    allStudents,
    schoolSettings,
    setActiveNavTab,
  } = useApp();

  const safeGrades = grades || [];
  const safePayments = payments || [];
  const safeReservations = reservations || [];
  const safeSanctions = disciplineSanctions || [];
  const safeFeeSchedules = promotionFeeSchedules || [];
  const safeStudents = allStudents || [];

  // 1. Dynamic Grade Calculations
  const totalCoeff = safeGrades.reduce((sum, g) => sum + (g.coefficient || 1), 0);
  const weightedSum = safeGrades.reduce((sum, g) => sum + ((g.average || 0) * (g.coefficient || 1)), 0);
  const dynamicAverage = totalCoeff > 0 ? weightedSum / totalCoeff : 0;
  const gradeVisual = getGradeVisual(dynamicAverage);

  // Identify subjects with average < 10/20 (requiring 2nd session / repêchage)
  const failingSubjects = safeGrades.filter((g) => (g.average || 0) < 10);
  const isRepechageEligible = failingSubjects.length > 0;

  // Class size and ranking
  const classStudentsCount = safeStudents.filter(
    (s) => s.currentClassId === currentStudent?.currentClassId
  ).length || 42;

  // 2. Dynamic Schedule for Today
  const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;
  const currentDayIndex = new Date().getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  const activeDay = (currentDayName === 'Dimanche' || currentDayName === 'Samedi') ? 'Lundi' : currentDayName;

  const todaySchedule = safeReservations
    .filter((r) => r.dayOfWeek === activeDay || r.dayOfWeek === 'Lundi')
    .slice(0, 4);

  // 3. Dynamic Financial Calculation
  const totalPaidUSD = safePayments
    .filter((p) => p.studentId === currentStudent?.id && p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amountPaidUSD || 0), 0);

  const studentFeeSchedules = safeFeeSchedules.filter(
    (f) => !f.promotionId || f.promotionId === 'promo-4-com-2026' || f.promotionId.includes('4')
  );
  const totalScheduledUSD = studentFeeSchedules.length > 0
    ? studentFeeSchedules.reduce((sum, f) => sum + f.amountUSD, 0)
    : 150;

  const remainingBalanceUSD = Math.max(0, totalScheduledUSD - totalPaidUSD);
  const exchangeRate = schoolSettings?.officialExchangeRate || 2850;
  const remainingBalanceCDF = remainingBalanceUSD * exchangeRate;

  // 4. Dynamic Discipline Sanctions
  const activeSanctions = safeSanctions.filter(
    (s) => s.studentId === currentStudent?.id && !s.isResolved
  );
  const disciplineScore = Math.max(0, 20 - activeSanctions.length * 2);

  // 5. Dynamic Documents count
  const availableDocumentsCount = 4;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1A3A5C] via-[#1E456E] to-[#254F7D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Année Scolaire {schoolSettings?.academicYear || '2026-2027'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour, {currentPerson.firstName} 👋
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
              className="px-4 py-2 bg-white text-[#1A3A5C] text-xs font-bold rounded-xl hover:bg-slate-100 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Mon Profil</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Repêchage Notice Banner if student has failing grades */}
      {isRepechageEligible && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveNavTab('student-repechage')}
          onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-repechage')}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-100/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-200 text-amber-900 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-amber-950">
                  Rattrapage & Repêchage (2e Session) Requis
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {failingSubjects.length} matière(s) &lt; 50%
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Vous avez {failingSubjects.length} branche(s) sous la moyenne ({failingSubjects.map(f => f.subjectName).join(', ')}). Cliquez pour consulter le calendrier et vous inscrire.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-900 shrink-0">
            <span>Accéder au dossier</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* MAIN MOYENNE GÉNÉRALE - FULLY CLICKABLE CONTAINER */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setActiveNavTab('student-grades')}
        onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-grades')}
        className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-[#1A3A5C]/40 hover:shadow-md transition-all cursor-pointer group relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  📊 MA MOYENNE GÉNÉRALE
                </h2>
                <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 group-hover:underline">
                  Voir relevé détaillé <ArrowUpRight className="w-3 h-3 inline" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Moyenne pondérée (Trimestre 1) • {currentStudent.currentClassName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${gradeVisual.bg} ${gradeVisual.text} ${gradeVisual.border}`}>
              Statut : {gradeVisual.label} {gradeVisual.icon}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-center group-hover:bg-blue-50/30 transition-colors">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1A3A5C] tracking-tight font-mono">
              {dynamicAverage.toFixed(1)} <span className="text-lg font-normal text-slate-500">/ 20</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>{dynamicAverage >= 10 ? 'Moyenne satisfaisante' : 'En session de repêchage'}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Classement en Classe
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              8<sup className="text-xs">ème</sup> sur {classStudentsCount} élèves
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
              {disciplineScore}/20 • 98%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {activeSanctions.length === 0 ? '0 incident disciplinaire' : `${activeSanctions.length} remarque(s)`}
            </div>
          </div>
        </div>
      </div>

      {/* 4 INTERACTIVE CLICKABLE SERVICE CONTAINERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Container 1: Emploi du temps du jour */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveNavTab('student-schedule')}
          onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-schedule')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Emploi du temps
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Aujourd’hui
              </span>
            </div>

            <div className="text-xs text-slate-500 mb-2 font-medium">
              {todaySchedule.length} cours programmés
            </div>

            <div className="space-y-2 mt-2">
              {todaySchedule.slice(0, 2).map((s, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="font-bold text-slate-900 truncate">{s.subject}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> {s.startTime}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-[10px]">
                      {s.roomId === 'room-12' ? 'Salle 12' : s.roomId === 'room-8' ? 'Salle 8' : 'Salle 10'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
            <span>Voir tout l’horaire</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Container 2: Résultats & Notes */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveNavTab('student-grades')}
          onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-grades')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Résultats & Cotes
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                T1
              </span>
            </div>

            <div className="text-xs text-slate-500 mb-2 font-medium">
              {grades.length} cours évalués
            </div>

            <div className="space-y-2 mt-2">
              {grades.slice(0, 2).map((g) => (
                <div
                  key={g.id}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-slate-800 truncate pr-2">{g.subjectName}</span>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {g.average}/20
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Bulletin complet</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Container 3: Frais & Finances */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveNavTab('student-finances')}
          onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-finances')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Finances & Minerval
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                USD / CDF
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1 mt-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Payé :</span>
                <span className="font-bold text-emerald-700">{totalPaidUSD} $</span>
              </div>
              <div className="flex justify-between text-amber-900 font-bold pt-1 border-t border-amber-200">
                <span>Reste à payer :</span>
                <span className="text-rose-600 font-mono">{remainingBalanceUSD} $</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-0.5">
                ≈ {remainingBalanceCDF.toLocaleString('fr-FR')} CDF (Taux {exchangeRate})
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>Mes quittances & reçus</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Container 4: Discipline & Documents */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveNavTab('student-documents')}
          onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-documents')}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Documents
                </h3>
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                {availableDocumentsCount} dispos
              </span>
            </div>

            <div className="space-y-1.5 mt-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-800 font-medium">Attestation de scolarité</span>
                <span className="text-emerald-600 text-xs">Prêt</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-800 font-medium">Règlement Intérieur (R.O.I)</span>
                <span className="text-emerald-600 text-xs">Signé</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
            <span>Télécharger attestations</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* DETAILED GRADES & PROGRESSION LIST - CLICKABLE FOR DETAILS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              📝 DERNIÈRES NOTES - RÉSULTATS PAR MATIÈRE
            </h3>
            <p className="text-xs text-slate-500">
              Évaluations du 1er Trimestre • Cliquez sur une matière pour le détail complet
            </p>
          </div>
          <button
            id="export-grades-quick"
            onClick={() => setActiveNavTab('student-grades')}
            className="text-xs font-bold text-[#1A3A5C] hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ouvrir le relevé complet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {grades.map((g) => {
            const avg = typeof g.average === 'number' && !isNaN(g.average) ? g.average : 0;
            const visual = getGradeVisual(avg);
            const percentage = Math.min(100, Math.max(0, (avg / 20) * 100));
            return (
              <div
                key={g.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveNavTab('student-grades')}
                onKeyDown={(e) => e.key === 'Enter' && setActiveNavTab('student-grades')}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 w-44 truncate">
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

                {/* Progress bar visual */}
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
