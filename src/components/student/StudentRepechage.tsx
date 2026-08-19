import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  BookOpen,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Info,
} from 'lucide-react';

export const StudentRepechage: React.FC = () => {
  const { grades, currentStudent, currentPerson } = useApp();

  const safeGrades = grades || [];
  // Filter subjects where average < 10/20 (Repêchage / Seconde session)
  const failedSubjects = safeGrades.filter((g) => (g.average || 0) < 10);
  const passedSubjects = safeGrades.filter((g) => (g.average || 0) >= 10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Direction des Études • Institut Lisanga Matadi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>📋 CONTENEUR : REPÊCHAGE & SECONDE SESSION</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Matières non validées (&lt; 10/20) soumises à la session de rattrapage • {currentStudent.currentClassName}
          </p>
        </div>

        <div className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Session : 25 Août - 02 Septembre 2026</span>
        </div>
      </div>

      {/* Decision Summary Banner */}
      {failedSubjects.length > 0 ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-amber-950">
                Vous avez {failedSubjects.length} matière{failedSubjects.length > 1 ? 's' : ''} à repêcher pour cette session
              </h2>
              <p className="text-xs text-amber-800 leading-relaxed">
                Conformément aux directives de la Direction des Études de l’Institut Lisanga (Matadi), tout cours n’ayant pas atteint la moyenne requise de 50% (10/20) fait l’objet d’une épreuve de seconde session. Veuillez vous conformer au calendrier des épreuves ci-dessous.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-emerald-950">
                Félicitations ! Aucune matière en repêchage
              </h2>
              <p className="text-xs text-emerald-800 leading-relaxed">
                L’élève <strong>{currentPerson.fullName}</strong> a validé l’ensemble des matières avec une note supérieure ou égale à 10/20. Vous êtes admis(e) en classe supérieure sans condition de seconde session.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Repêchage Courses Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Matières à passer au Repêchage</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium font-mono">
            Barème requis : ≥ 10.0 / 20
          </span>
        </div>

        {failedSubjects.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="text-sm font-bold text-slate-700">Dossier académique en règle</p>
            <p className="text-xs text-slate-500 mt-1">Tous les crédits et cours sont validés pour l’année académique en cours.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {failedSubjects.map((subject, idx) => (
              <div
                key={subject.id}
                className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px]">
                      ÉPREUVE 0{idx + 1}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {subject.subjectName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      (Coef. {subject.coefficient})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Titulaire : <strong>{subject.teacherName || 'Professeur assigné'}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Durée : <strong>2h00</strong>
                    </span>
                    <span className="flex items-center gap-1 text-rose-700 font-bold">
                      Note initiale : {subject.average} / 20
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">Statut Épreuve</div>
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg">
                      ⏳ Convoqué(e)
                    </span>
                  </div>
                  <div className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-center text-xs">
                    <span className="text-slate-400 block text-[10px]">Date proposée</span>
                    <span className="font-bold text-slate-800">27 Août 2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Guidelines & Instructions */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-md space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Info className="w-4 h-4" />
          <span>Instructions Administratives pour les Séances de Repêchage (Matadi)</span>
        </div>
        <ul className="space-y-2 text-slate-300 list-disc list-inside leading-relaxed">
          <li>Se présenter 15 minutes avant le début de l’épreuve muni de sa <strong>Carte d’Élève officielle</strong> et de son reçu de scolarité.</li>
          <li>Les épreuves se déroulent exclusivement dans les salles climatisées du Bâtiment Principal (Bloc A) à Matadi.</li>
          <li>Toute absence non justifiée par certificat médical validé entraîne l'ajournement automatique de l'élève.</li>
          <li>La note finale de seconde session remplace la moyenne annuelle de la matière concernée.</li>
        </ul>
      </div>
    </div>
  );
};
