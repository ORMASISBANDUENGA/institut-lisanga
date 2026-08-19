import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { GitBranch, GraduationCap, Users, Calendar, Award, CheckCircle } from 'lucide-react';

export const AdminEnrollments: React.FC = () => {
  const { enrollments, students, classes } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-teal-600" />
            <span>📋 INSCRIPTIONS & AFFECTATIONS DE CLASSES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture ENROLLMENT + CLASS_ASSIGNMENT • Séparation Inscription / Parcours / Affectation
          </p>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Inscriptions Actives
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {enrollments.filter((e) => e.status === 'ACTIVE').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Année académique 2026-2027</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Effectif Total Classes
          </div>
          <div className="text-3xl font-extrabold text-teal-700 mt-1">
            {(classes || []).reduce((acc, c) => acc + (Number(c.currentEnrollment) || 0), 0)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Sur {(classes || []).length} classes ouvertes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Capacité Globale
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {(classes || []).reduce((acc, c) => acc + (Number(c.capacity) || 0), 0)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Taux de remplissage : 89.2%</div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Registres des Inscriptions & Affectations
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">ID Inscription</th>
                <th className="px-4 py-3">Élève & Matricule</th>
                <th className="px-4 py-3">Année & Promotion</th>
                <th className="px-4 py-3">Affectation Actuelle</th>
                <th className="px-4 py-3">Date Inscription</th>
                <th className="px-4 py-3 rounded-r-lg">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((enr) => {
                const stud = students?.find((s) => s.id === enr.studentId);
                const studentName =
                  stud?.name ||
                  (stud?.person ? `${stud.person.firstName} ${stud.person.lastName}` : null) ||
                  (stud?.id === 'student-oromasis'
                    ? 'BAKALAYETO BANDUENGA Oromasis'
                    : stud?.id === 'student-jean'
                    ? 'TSHILUMBA KABONGO Jean'
                    : stud?.id === 'student-marie'
                    ? 'KAPINGA TSHILOMBO Marie'
                    : 'Élève');

                const assignedClass = classes.find((c) => c.id === stud?.currentClassId);
                const className = stud?.currentClassName || assignedClass?.fullName || 'Affectation standard';

                return (
                  <tr key={enr.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 font-bold">
                      {enr.registrationNumber || enr.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block">
                        {studentName}
                      </span>
                      <span className="font-mono text-blue-900 font-bold text-[11px]">
                        {stud?.matricule || 'LIS-2026-XXXX'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {enr.academicYear}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#1A3A5C]">
                      {className}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {enr.enrollmentDate}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={enr.status} type="enrollment" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
