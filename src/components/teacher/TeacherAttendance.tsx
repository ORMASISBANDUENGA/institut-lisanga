import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Save,
  Users,
  Calendar,
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  matricule: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT_JUSTIFIED' | 'ABSENT_UNJUSTIFIED';
  note: string;
}

export const TeacherAttendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('4ème Commerciale et Gestion A');
  const [sessionDate, setSessionDate] = useState('2026-08-16');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [students, setStudents] = useState<AttendanceRecord[]>([
    {
      id: '1',
      name: 'BAKALAYETO BANDUENGA Oromasis',
      matricule: 'LIS-2023-0123',
      status: 'PRESENT',
      note: 'À l’heure, attentif',
    },
    {
      id: '2',
      name: 'KAPINGA TSHILOMBO Divine',
      matricule: 'LIS-2023-0124',
      status: 'PRESENT',
      note: '',
    },
    {
      id: '3',
      name: 'MBAYA ILUNGA Patrick',
      matricule: 'LIS-2023-0125',
      status: 'LATE',
      note: 'Retard de 10 min (embouteillages)',
    },
    {
      id: '4',
      name: 'TSHIBOLA MUKENDI Grace',
      matricule: 'LIS-2023-0126',
      status: 'ABSENT_JUSTIFIED',
      note: 'Certificat médical transmis',
    },
    {
      id: '5',
      name: 'KAZADI MWAMBA Kevin',
      matricule: 'LIS-2023-0127',
      status: 'PRESENT',
      note: '',
    },
  ]);

  const updateStatus = (id: string, status: AttendanceRecord['status']) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const safeStudents = students || [];
  const presentCount = safeStudents.filter((s) => s.status === 'PRESENT').length;
  const lateCount = safeStudents.filter((s) => s.status === 'LATE').length;
  const absentCount = safeStudents.filter((s) => s.status.includes('ABSENT')).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-emerald-600" />
            <span>📋 FEUILLE DE PRÉSENCE & APPEL EN DIRECT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pointage journalier • Synchronisation avec les alertes parents
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Valider l’Appel</span>
        </button>
      </div>

      {/* Class & Date Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Classe :</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          >
            <option>4ème Commerciale et Gestion A</option>
            <option>7ème Cycle d'Orientation A</option>
            <option>8ème Cycle d'Orientation B</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Date de la séance :</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          />
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-3 text-xs font-bold">
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>Présents</span>
          <span className="text-base">{presentCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-between">
          <span>En retard</span>
          <span className="text-base">{lateCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between">
          <span>Absents</span>
          <span className="text-base">{absentCount}</span>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Feuille de présence enregistrée. Les parents d’élèves absents sont automatiquement notifiés.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-3.5 py-3 rounded-l-lg">Élève & Matricule</th>
                <th className="px-3.5 py-3 text-center">Statut d'Appel</th>
                <th className="px-3.5 py-3 rounded-r-lg">Remarque / Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-3.5 py-3.5">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <span className="font-mono text-[11px] text-slate-400">{s.matricule}</span>
                  </td>
                  <td className="px-3.5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'PRESENT')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          s.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Présent
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'LATE')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          s.status === 'LATE'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Retard
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'ABSENT_JUSTIFIED')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          s.status === 'ABSENT_JUSTIFIED'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Abs. Just.
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(s.id, 'ABSENT_UNJUSTIFIED')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          s.status === 'ABSENT_UNJUSTIFIED'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Abs. Non Just.
                      </button>
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5">
                    <input
                      type="text"
                      value={s.note}
                      placeholder="Observation..."
                      onChange={(e) => {
                        const val = e.target.value;
                        setStudents((prev) =>
                          prev.map((item) => (item.id === s.id ? { ...item, note: val } : item))
                        );
                      }}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
