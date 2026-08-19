import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { AdmissionApplication } from '../../types';
import {
  FolderKanban,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  UserCheck,
  FileText,
  Sparkles,
  ShieldCheck,
  Plus,
  Search,
  Filter,
} from 'lucide-react';

export const AdminAdmissions: React.FC = () => {
  const { admissions, updateAdmissionStatus, enrollCandidate, classes } = useApp();
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(admissions[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class-7co-a');
  const [showSuccessBanner, setShowSuccessBanner] = useState<string | null>(null);

  const filteredAdmissions = admissions.filter((app) => {
    const candidateFullName = `${app.candidateFirstName} ${app.candidateLastName}`;
    const matchesFilter = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch =
      candidateFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (app: AdmissionApplication) => {
    updateAdmissionStatus(app.id, 'APPROVED', 'Dossier académique et documents civils vérifiés et validés.');
    setSelectedApp({ ...app, status: 'APPROVED' });
  };

  const handleReject = (app: AdmissionApplication) => {
    const reason = prompt('Motif du rejet de la candidature :') || 'Dossier incomplet ou critères non atteints.';
    updateAdmissionStatus(app.id, 'REJECTED', reason);
    setSelectedApp({ ...app, status: 'REJECTED' });
  };

  const handleEnroll = (app: AdmissionApplication) => {
    const res = enrollCandidate(app.id, selectedClassId);
    const matricule = typeof res === 'string' ? res : res?.matricule || app.generatedMatricule || 'LIS-2026-0001';
    setShowSuccessBanner(
      `🎉 Félicitations ! L'élève ${app.candidateFirstName} ${app.candidateLastName} est officiellement inscrit(e) avec le matricule permanent : ${matricule}. Un compte utilisateur INVITED a été créé.`
    );
    setTimeout(() => setShowSuccessBanner(null), 8000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600" />
            <span>📋 WORKFLOW ADMISSIONS & VALIDATION ADMINISTRATIVE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossiers de candidature • Validation des pièces • Attribution du Matricule Permanent (LIS-2026-NNNN)
          </p>
        </div>
      </div>

      {showSuccessBanner && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{showSuccessBanner}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par candidat ou code dossier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs w-full sm:w-72 focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'ENROLLED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#1A3A5C] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'Tous les dossiers' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Stage Visualizer */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-3">
          CYCLE DE VIE OFFICIEL D'UNE ADMISSION :
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-mono text-slate-400 block text-[10px]">Étape 1</span>
            <span className="font-bold text-slate-200">1. DRAFT / Saisie</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-mono text-slate-400 block text-[10px]">Étape 2</span>
            <span className="font-bold text-sky-300">2. SUBMITTED</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
            <span className="font-mono text-slate-400 block text-[10px]">Étape 3</span>
            <span className="font-bold text-purple-300">3. UNDER_REVIEW</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50">
            <span className="font-mono text-indigo-300 block text-[10px]">Étape 4 (Clé)</span>
            <span className="font-bold text-amber-300">4. VALIDATION ADMIN</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
            <span className="font-mono text-emerald-300 block text-[10px]">Étape 5</span>
            <span className="font-bold text-emerald-300">5. ENROLLED (Matricule)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: List & Selected App Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Candidates List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Candidatures ({filteredAdmissions.length})
          </h2>

          <div className="space-y-2">
            {filteredAdmissions.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              const fullName = `${app.candidateFirstName} ${app.candidateLastName}`;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#1A3A5C] shadow-md ring-2 ring-[#1A3A5C]/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {fullName}
                    </span>
                    <StatusBadge status={app.status} type="admission" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dossier : <span className="font-mono font-bold text-slate-700">{app.applicationNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {app.targetLevel} {app.targetOption && `• ${app.targetOption}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Application Detail & Validation Actions */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedApp.applicationNumber}
                    </span>
                    <StatusBadge status={selectedApp.status} type="admission" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {selectedApp.candidateFirstName} {selectedApp.candidateLastName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Soumis le {selectedApp.submittedAt} • Réf : {selectedApp.applicationNumber}
                  </p>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Niveau & Option souhaités :</span>
                  <span className="font-bold text-slate-900">
                    {selectedApp.targetLevel}
                    {selectedApp.targetOption && ` (${selectedApp.targetOption})`}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Établissement d'origine :</span>
                  <span className="font-bold text-slate-900">{selectedApp.previousSchool || 'Non spécifié'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Responsable Légal :</span>
                  <span className="font-bold text-slate-900">{selectedApp.parentName} ({selectedApp.parentPhone})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-0.5">Email tuteur :</span>
                  <span className="font-bold text-slate-900">{selectedApp.parentEmail}</span>
                </div>
              </div>

              {/* Submitted Documents & Verification Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  📁 PIÈCES JUSTIFICATIVES FOURNIES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Validation Section */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Décision Administrative & Inscription Finale
                  </h3>
                </div>

                {selectedApp.status === 'APPROVED' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                      ✅ Candidature administrativement validée. Veuillez sélectionner la classe d'affectation pour générer le <strong>Matricule Permanent LIS-2026-NNNN</strong> et le compte utilisateur.
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            Affecter en : {c.name} ({c.currentEnrollment}/{c.capacity} élèves)
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEnroll(selectedApp)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Confirmer l’Inscription & Générer Matricule</span>
                      </button>
                    </div>
                  </div>
                ) : selectedApp.status === 'ENROLLED' ? (
                  <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Élève inscrit définitivement. Matricule : {selectedApp.generatedMatricule || 'Généré'}. Dossier archivé avec succès.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valider Administrativement (Approuver)</span>
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Rejeter la candidature</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">Sélectionnez une candidature dans la liste.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
