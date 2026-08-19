import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getGradeVisual, GradeBadge } from '../common/GradeBadge';
import {
  GraduationCap,
  Download,
  TrendingUp,
  Award,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Info,
} from 'lucide-react';
import { OfficialDocumentViewer } from './OfficialDocumentViewer';

export const StudentGrades: React.FC = () => {
  const { grades, currentStudent, currentPerson } = useApp();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(grades[0]?.id || 'gr-1');
  const [showDocModal, setShowDocModal] = useState(false);

  const filteredGrades = grades.filter((g) => g.trimester === selectedTrimester || !g.trimester);
  const selectedGrade = filteredGrades.find((g) => g.id === selectedSubjectId) || filteredGrades[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Institut Lisanga • Direction des Études (Matadi)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>📝 CONTENEUR : RÉSULTATS & NOTES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentStudent.currentClassName} • Notes encodées par les professeurs titulaires
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Trimester Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedTrimester(1)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTrimester === 1 ? 'bg-white text-[#1A3A5C] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              1er Trimestre
            </button>
            <button
              onClick={() => setSelectedTrimester(2)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTrimester === 2 ? 'bg-white text-[#1A3A5C] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              2ème Trimestre
            </button>
            <button
              onClick={() => setSelectedTrimester(3)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedTrimester === 3 ? 'bg-white text-[#1A3A5C] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              3ème Trimestre
            </button>
          </div>

          <button
            id="export-bulletin-pdf"
            onClick={() => setShowDocModal(true)}
            className="px-4 py-2 bg-[#1A3A5C] text-white text-xs font-bold rounded-xl hover:bg-[#152E4A] transition shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Bulletin Officiel (PDF)</span>
          </button>
        </div>
      </div>

      {/* 📊 RÉSUMÉ CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>SYNTHÈSE DU TRIMESTRE 1</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-xs text-emerald-800 font-semibold">Moyenne Générale Pondérée</div>
            <div className="text-3xl font-extrabold text-emerald-800 mt-1">14.2 / 20</div>
            <div className="text-xs font-bold text-emerald-700 mt-1">✅ Mention : Bien</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Rang dans la Promotion</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">8ème sur 42</div>
            <div className="text-xs text-slate-500 mt-1">4ème Commerciale et Gestion A</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-xs text-blue-800 font-semibold">Progression Trimestrielle</div>
            <div className="text-2xl font-bold text-blue-800 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>+1.5 pts</span>
            </div>
            <div className="text-xs text-blue-700 mt-1">Par rapport à la 3ème Commerciale</div>
          </div>
        </div>
      </div>

      {/* 📚 MATIÈRES DU TRIMESTRE TABLE (Exact spec table layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>TABLEAU RÉCAPITULATIF DES MATIÈRES</span>
          </h3>
          <span className="text-xs text-slate-500">Cliquez sur une ligne pour voir le détail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Matière</th>
                <th className="px-4 py-3 text-center">Interro /20</th>
                <th className="px-4 py-3 text-center">TP /20</th>
                <th className="px-4 py-3 text-center">Exam /20</th>
                <th className="px-4 py-3 text-center">Moy /20</th>
                <th className="px-4 py-3 text-center">Coef</th>
                <th className="px-4 py-3 text-center rounded-r-lg">Appréciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.map((g) => {
                const visual = getGradeVisual(g.average);
                const isSelected = selectedGrade?.id === g.id;
                return (
                  <tr
                    key={g.id}
                    onClick={() => setSelectedSubjectId(g.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <span>{g.subjectName}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-700">{g.interro}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-700">{g.tp}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-700">{g.exam}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-sm text-slate-900">
                      {g.average}
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-600">
                      {g.coefficient}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${visual.bg} ${visual.text} ${visual.border}`}
                      >
                        <span>{visual.icon}</span>
                        <span>{visual.label}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📈 DÉTAIL MATIÈRE SÉLECTIONNÉE */}
      {selectedGrade && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                ZOOM SUR L’ÉVALUATION
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {selectedGrade.subjectName} — Note finale : {selectedGrade.average} / 20
              </h3>
              <p className="text-xs text-slate-500">
                Enseignant titulaire du cours : <strong>{selectedGrade.teacherName}</strong>
              </p>
            </div>
            <GradeBadge score={selectedGrade.average} size="lg" />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Interrogation journalière</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {selectedGrade.interro} / 20 <span className="text-xs font-normal text-slate-400">(Coef 1)</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Travaux Pratiques (TP)</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {selectedGrade.tp} / 20 <span className="text-xs font-normal text-slate-400">(Coef 1)</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Examen de synthèse</span>
              <span className="text-base font-bold text-slate-900 mt-1 block">
                {selectedGrade.exam} / 20 <span className="text-xs font-normal text-slate-400">(Coef 2)</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="text-indigo-800 font-semibold block">Moyenne Pondérée</span>
              <span className="text-lg font-extrabold text-indigo-900 mt-1 block">
                {selectedGrade.average} / 20
              </span>
            </div>
          </div>

          {/* 💬 COMMENTAIRE DU PROFESSEUR */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-amber-950 block mb-1">
                💬 Commentaire pédagogique ({selectedGrade.teacherName}) :
              </span>
              <p className="text-amber-900 italic font-serif text-sm">
                "{selectedGrade.teacherComment || 'Travail conforme aux attentes du programme national.'}"
              </p>
            </div>
          </div>
        </div>
      )}

      {showDocModal && (
        <OfficialDocumentViewer
          docType="releve"
          onClose={() => setShowDocModal(false)}
        />
      )}

    </div>
  );
};
