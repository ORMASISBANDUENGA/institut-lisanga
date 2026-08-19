import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  GraduationCap,
  CreditCard,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { OfficialDocumentViewer } from '../student/OfficialDocumentViewer';

export const ParentDashboard: React.FC = () => {
  const { setActiveNavTab } = useApp();
  const [selectedChild, setSelectedChild] = useState<'oromasis' | 'sarah' | 'david'>('oromasis');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const childrenData = {
    oromasis: {
      name: 'BAKALAYETO BANDUENGA Oromasis',
      matricule: 'LIS-2023-0123',
      classe: '4ème Commerciale et Gestion A',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      average: 14.2,
      rank: '8ème sur 42',
      status: 'ACTIVE',
      balanceDue: 50,
      attendance: '98% (0 absence non justifiée)',
    },
    sarah: {
      name: 'BAKALAYETO Grace Sarah',
      matricule: 'LIS-2024-0089',
      classe: '8ème Cycle d’Orientation B',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      average: 16.5,
      rank: '2ème sur 45',
      status: 'ACTIVE',
      balanceDue: 0,
      attendance: '100% (Présente)',
    },
    david: {
      name: 'BAKALAYETO David Junior',
      matricule: 'LIS-2025-0210',
      classe: '7ème Cycle d’Orientation A',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      average: 12.8,
      rank: '15ème sur 40',
      status: 'ACTIVE',
      balanceDue: 0,
      attendance: '95% (1 retard excusé)',
    },
  };

  const currentChild = childrenData[selectedChild];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Parent Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#204975] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-semibold backdrop-blur-xs mb-2">
              <Users2 className="w-3.5 h-3.5" />
              <span>Espace Famille • Responsable Légal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour M. Jean BAKALAYETO 👨
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              3 Enfants scolarisés à l’Institut Lisanga • Année Académique 2026-2027
            </p>
          </div>
        </div>
      </div>

      {/* Children Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(childrenData) as Array<'oromasis' | 'sarah' | 'david'>).map((key) => {
          const child = childrenData[key];
          const isSelected = selectedChild === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedChild(key)}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                isSelected
                  ? 'bg-white border-[#1A3A5C] shadow-md ring-2 ring-[#1A3A5C]/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white'
              }`}
            >
              <img
                src={child.photo}
                alt={child.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-sm text-slate-900 truncate">
                  {key === 'oromasis' ? 'Oromasis' : key === 'sarah' ? 'Sarah' : 'David'}
                </div>
                <div className="text-xs text-slate-500 truncate">{child.classe}</div>
                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className="font-bold text-emerald-700 font-mono">{child.average} / 20</span>
                  {child.balanceDue > 0 ? (
                    <span className="text-rose-600 font-bold">Dû: {child.balanceDue}$</span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Soldé ✅</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Child Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={currentChild.photo}
              alt={currentChild.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
            />
            <div>
              <div className="text-xs font-mono font-bold text-blue-900">
                {currentChild.matricule}
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {currentChild.name}
              </h2>
              <p className="text-xs text-slate-500">{currentChild.classe}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDoc('releve')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1A3A5C] text-xs font-bold rounded-xl transition border border-slate-300 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Voir Bulletin</span>
            </button>
            <button
              onClick={() => setSelectedDoc('attestation')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#1A3A5C] text-xs font-bold rounded-xl transition border border-slate-300 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Attestation</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics for Child */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Moyenne Générale</div>
            <div className="text-2xl font-extrabold text-[#1A3A5C] mt-1">
              {currentChild.average} / 20
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              Mention : Bien ✅ ({currentChild.rank})
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Assiduité & Ponctualité</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {currentChild.attendance}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Conduite exemplaire
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold">Frais & Minerval</div>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {currentChild.balanceDue > 0 ? (
                <span className="text-rose-600">Reste {currentChild.balanceDue} $</span>
              ) : (
                <span className="text-emerald-700">À jour (0 $) ✅</span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {currentChild.balanceDue > 0 ? 'Échéance : 30/08/2026' : '3 trimestres soldés'}
            </div>
          </div>
        </div>

        {/* Quick Links for this Child */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveNavTab('student-grades')}
            className="px-4 py-2 bg-[#1A3A5C] text-white text-xs font-bold rounded-xl hover:bg-[#152E4A] transition"
          >
            Consulter les notes détaillées par matière
          </button>
          <button
            onClick={() => setActiveNavTab('student-finances')}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            Payer le minerval & voir les reçus
          </button>
        </div>
      </div>

      {selectedDoc && (
        <OfficialDocumentViewer
          docType={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

    </div>
  );
};
