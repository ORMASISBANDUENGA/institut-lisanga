import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeBadge } from '../common/GradeBadge';
import {
  BookOpen,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Award,
} from 'lucide-react';

export const TeacherGradebook: React.FC = () => {
  const { classes, saveGrade, grades } = useApp();
  const [selectedClassId, setSelectedClassId] = useState('class-4comm-a');
  const [selectedSubject, setSelectedSubject] = useState('Mathématiques');
  const [trimester, setTrimester] = useState('Trimestre 1');

  // Form states for adding or editing a student's grade
  const [studentName, setStudentName] = useState('BAKALAYETO BANDUENGA Oromasis');
  const [interro, setInterro] = useState(8);
  const [tp, setTp] = useState(10);
  const [exam, setExam] = useState(7);
  const [comment, setComment] = useState('Besoin de soutien en calcul matriciel.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-calculated average with weighting: (interro*1 + tp*1 + exam*2) / 4
  const calculatedAvg = Number(((interro * 1 + tp * 1 + exam * 2) / 4).toFixed(1));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveGrade({
      studentId: 'stud-1',
      studentName: studentName,
      subjectId: 'sub-math',
      subjectName: selectedSubject,
      interro,
      tp,
      exam,
      coefficient: 3,
      trimester,
      academicYear: '2026-2027',
      teacherName: 'Dr. KABEYA',
      teacherComment: comment,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>📝 SAISIE & GESTION DES NOTES PÉDAGOGIQUES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module Enseignant • Calcul automatique des moyennes et coefficients officiels
          </p>
        </div>
      </div>

      {/* Class & Subject Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Classe :
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.currentEnrollment}/{c.capacity} élèves)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Matière :
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
          >
            <option>Mathématiques</option>
            <option>Droit Commercial</option>
            <option>Statistiques Appliquées</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Période :
          </label>
          <select
            value={trimester}
            onChange={(e) => setTrimester(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
          >
            <option>Trimestre 1</option>
            <option>Trimestre 2</option>
            <option>Trimestre 3</option>
          </select>
        </div>
      </div>

      {/* Grade Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Formulaire de saisie individuelle
            </h2>
            <p className="text-xs text-slate-500">
              Barème officiel : Interrogation (Coef 1) + TP (Coef 1) + Examen (Coef 2) / 4
            </p>
          </div>
          <GradeBadge score={calculatedAvg} size="lg" />
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Élève sélectionné :
            </label>
            <select
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
            >
              <option value="BAKALAYETO BANDUENGA Oromasis">
                BAKALAYETO BANDUENGA Oromasis (LIS-2023-0123)
              </option>
              <option value="KAPINGA TSHILOMBO Divine">
                KAPINGA TSHILOMBO Divine (LIS-2023-0124)
              </option>
              <option value="MBAYA ILUNGA Patrick">
                MBAYA ILUNGA Patrick (LIS-2023-0125)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                Interrogation / 20 (Coef 1)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={interro}
                onChange={(e) => setInterro(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded-lg text-base font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                Travaux Pratiques / 20 (Coef 1)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={tp}
                onChange={(e) => setTp(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded-lg text-base font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                Examen de Synthèse / 20 (Coef 2)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={exam}
                onChange={(e) => setExam(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-slate-300 rounded-lg text-base font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Appréciation & Recommandation pédagogique :
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              placeholder="Saisissez une appréciation pour le bulletin scolaire..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Note enregistrée avec succès !
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">
                La moyenne s’actualisera instantanément dans le relevé de l’élève.
              </span>
            )}

            <button
              type="submit"
              id="save-teacher-grade-btn"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer Note</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
