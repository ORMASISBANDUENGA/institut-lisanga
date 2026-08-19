import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  School,
  Clock,
  User,
} from 'lucide-react';

export const AdminTeacherDistribution: React.FC = () => {
  const {
    teacherCourseAssignments,
    classes,
    assignCourseToTeacher,
    removeTeacherAssignment,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-4-comm-a');
  const [subjectName, setSubjectName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('4');
  const [coefficient, setCoefficient] = useState('3');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const teachersList = [
    'Dr. KABEYA Tshilumba (Docteur en Sciences)',
    'Prof. TUMBA Mukendi (Comptabilité & Gestion)',
    'Prof. MAVUNGU Nzita (Mathématiques Appliquées)',
    'Prof. LUKOKI Masamba (Français & Littérature)',
    'Prof. MATONDO Kianza (Informatique & TIC)',
    'Prof. NDOMBELE Vangu (Histoire & Civisme)',
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !teacherName.trim()) return;

    const targetClass = classes.find((c) => c.id === selectedClassId);
    const className = targetClass ? targetClass.fullName : 'Classe';

    assignCourseToTeacher({
      classId: selectedClassId,
      className,
      subjectName: subjectName.trim(),
      teacherId: `teacher-${Date.now()}`,
      teacherName: teacherName.split('(')[0].trim(),
      weeklyHours: parseInt(weeklyHours) || 4,
      coefficient: parseInt(coefficient) || 3,
      academicYear,
      isTitulaire: true,
    });

    setSubjectName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Direction des Études • Institut Lisanga Matadi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>👨‍🏫 ATTRIBUTION DES COURS PAR PROMOTION</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Affectation nominative des professeurs titulaires par matière et par classe
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#1A3A5C] hover:bg-[#12283E] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Attribuer un Nouveau Cours</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Cours Attribués
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {teacherCourseAssignments.length} Matières
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Réparties sur {classes.length} classes
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Corps Enseignant Actif
          </div>
          <div className="text-3xl font-extrabold text-blue-900 mt-1">
            {new Set(teacherCourseAssignments.map((a) => a.teacherName)).size} Enseignants
          </div>
          <div className="text-xs text-blue-700 mt-1">
            Titulaires & Chargés de cours à Matadi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Couverture Pédagogique
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 mt-1">
            100% Validé
          </div>
          <div className="text-xs text-emerald-700 mt-1">
            Aucun cours vacant non attribué
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Tableau des Attributions Enseignants / Promotions</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {teacherCourseAssignments.length} affectations actives
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Promotion / Classe</th>
                <th className="px-4 py-3">Matière Enseignée</th>
                <th className="px-4 py-3">Enseignant Titulaire</th>
                <th className="px-4 py-3 text-center">Volume Hebdo</th>
                <th className="px-4 py-3 text-center">Coefficient</th>
                <th className="px-4 py-3 text-center rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teacherCourseAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4 text-slate-400" />
                      <span>{assignment.className}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-[#1A3A5C]">
                    {assignment.subjectName}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>{assignment.teacherName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">
                    {assignment.weeklyHours}h / sem.
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900">
                    Coef. {assignment.coefficient}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => removeTeacherAssignment(assignment.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Retirer cette affectation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Affecter un Enseignant Titulaire (Matadi)
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Promotion / Classe :</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.fullName} ({cls.optionName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière / Cours :</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Ex : Comptabilité Générale, Mathématiques, Économie..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enseignant Titulaire :</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  required
                >
                  <option value="">-- Sélectionner un Enseignant --</option>
                  {teachersList.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume Hebdomadaire :</label>
                  <input
                    type="number"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coefficient :</label>
                  <input
                    type="number"
                    value={coefficient}
                    onChange={(e) => setCoefficient(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                    min="1"
                    max="5"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A3A5C] hover:bg-[#12283E] text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Enregistrer l’Affectation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
