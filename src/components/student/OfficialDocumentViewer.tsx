import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck, School } from 'lucide-react';

interface OfficialDocumentViewerProps {
  docType: string;
  onClose: () => void;
}

export const OfficialDocumentViewer: React.FC<OfficialDocumentViewerProps> = ({ docType, onClose }) => {
  const { currentStudent, currentPerson, grades } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              Document Officiel • Institut Lisanga
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Document Body */}
        <div className="p-8 overflow-y-auto bg-slate-50 flex justify-center">
          
          {/* Document Sheet */}
          <div className="bg-white border border-slate-300 p-8 shadow-md rounded-lg w-full max-w-2xl text-slate-900 font-serif text-xs leading-relaxed space-y-6">
            
            {/* Republic & School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1 font-sans">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                MINISTÈRE DE L’ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ
              </div>
              <div className="text-xl font-extrabold text-[#1A3A5C] tracking-tight pt-1">
                INSTITUT LISANGA
              </div>
              <div className="text-[11px] text-slate-600">
                Cycle d’Orientation & Humanités (Commerciale, Pédagogique, Scientifique, Littéraire, Technique)
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Matadi / Kongo Central • Code Établissement : 100452-LIS
              </div>
            </div>

            {/* Document Content Based on Type */}
            {docType === 'attestation' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="text-center py-2">
                  <span className="inline-block px-4 py-1.5 border-2 border-slate-900 font-extrabold text-sm uppercase tracking-wider bg-slate-100">
                    ATTESTATION DE SCOLARITÉ
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    N° LIS/DIR/ATT/2026-0418
                  </p>
                </div>

                <p className="text-justify text-slate-800 leading-relaxed text-sm">
                  Le Chef d’Établissement de l’<strong>Institut Lisanga</strong> soussigné, atteste par la présente que l’élève :
                </p>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs font-sans">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-semibold">Nom & Prénoms :</span>
                    <span className="col-span-2 font-bold text-slate-900">{currentPerson.fullName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-semibold">Matricule Permanent :</span>
                    <span className="col-span-2 font-mono font-bold text-blue-900">{currentStudent.matricule}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-semibold">Né(e) le :</span>
                    <span className="col-span-2">15/03/2005 à {currentPerson.birthPlace}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-semibold">Classe fréquentée :</span>
                    <span className="col-span-2 font-bold text-emerald-800">{currentStudent.currentClassName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-semibold">Année scolaire :</span>
                    <span className="col-span-2 font-bold">2026-2027</span>
                  </div>
                </div>

                <p className="text-justify text-slate-800 leading-relaxed text-xs">
                  Est régulièrement inscrit(e) et suit assidûment les cours dispensés au sein de notre établissement pour l’année académique 2026-2027.
                </p>
                <p className="text-justify text-slate-800 text-xs">
                  En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.
                </p>
              </div>
            )}

            {docType === 'carte' && (
              <div className="p-4 bg-gradient-to-br from-[#1A3A5C] to-[#0A1828] text-white rounded-2xl shadow-lg border-2 border-amber-400/60 font-sans space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-2">
                  <div>
                    <div className="font-extrabold text-sm text-amber-300">INSTITUT LISANGA</div>
                    <div className="text-[10px] text-slate-300">CARTE D’ÉLÈVE BIOMÉTRIQUE</div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded">
                    2026-2027
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src={currentPerson.photoUrl}
                    alt={currentPerson.fullName}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/80"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="font-extrabold text-base text-white">{currentPerson.fullName}</div>
                    <div className="text-amber-200 text-xs font-semibold">{currentStudent.currentClassName}</div>
                    <div className="font-mono text-xs text-slate-300">Matricule : <strong>{currentStudent.matricule}</strong></div>
                    <div className="text-[11px] text-slate-300">Né le 15/03/2005 à Matadi</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                  <span>Signée par le Chef d’Établissement</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-300">LIS-SEC-BIOM-2026</span>
                </div>
              </div>
            )}

            {docType === 'releve' && (
              <div className="space-y-3 font-sans text-xs">
                <div className="text-center py-1">
                  <span className="font-extrabold text-sm uppercase tracking-wider text-[#1A3A5C]">
                    RELEVÉ DE NOTES OFFICIEL - 1er TRIMESTRE
                  </span>
                  <p className="text-[10px] text-slate-500">Année Académique 2026-2027 • 4ème Commerciale et Gestion A</p>
                </div>

                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="border border-slate-300 p-2">Matière</th>
                      <th className="border border-slate-300 p-2 text-center">Interro /20</th>
                      <th className="border border-slate-300 p-2 text-center">TP /20</th>
                      <th className="border border-slate-300 p-2 text-center">Exam /20</th>
                      <th className="border border-slate-300 p-2 text-center">Moy /20</th>
                      <th className="border border-slate-300 p-2 text-center">Coef</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => (
                      <tr key={g.id}>
                        <td className="border border-slate-300 p-2 font-semibold">{g.subjectName}</td>
                        <td className="border border-slate-300 p-2 text-center">{g.interro}</td>
                        <td className="border border-slate-300 p-2 text-center">{g.tp}</td>
                        <td className="border border-slate-300 p-2 text-center">{g.exam}</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{g.average}</td>
                        <td className="border border-slate-300 p-2 text-center">{g.coefficient}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold">
                    <tr>
                      <td colSpan={4} className="border border-slate-300 p-2 text-right">MOYENNE GÉNÉRALE :</td>
                      <td colSpan={2} className="border border-slate-300 p-2 font-bold text-emerald-800 text-sm">
                        14.2 / 20 (Bien)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {docType === 'recu' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="text-center py-1">
                  <span className="font-extrabold text-sm uppercase tracking-wider text-emerald-800">
                    QUITTANCE & REÇU DE PAIEMENT SCOLARITÉ
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">RÉF : LIS-REC-2027-0108</p>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Élève :</span>
                    <span className="font-bold text-slate-900">{currentPerson.fullName} ({currentStudent.matricule})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Classe :</span>
                    <span className="font-semibold">{currentStudent.currentClassName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Motif :</span>
                    <span className="font-semibold">Frais de scolarité & Minerval - Trimestre 2</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-emerald-800 pt-2 border-t border-emerald-200">
                    <span>Montant Perçu :</span>
                    <span>150.00 USD</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Mode : Airtel Money (+243 81 987 6543)</span>
                    <span>Date : 12/01/2027</span>
                  </div>
                </div>
              </div>
            )}

            {/* Official Stamp & Signatures */}
            <div className="pt-6 flex justify-between items-end font-sans text-[11px]">
              <div className="text-center space-y-8">
                <p className="text-slate-600">Le Secrétaire Général</p>
                <div className="font-bold text-slate-800">M. LUBOYA</div>
              </div>

              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#1A3A5C] flex items-center justify-center text-center text-[9px] font-extrabold text-[#1A3A5C] uppercase tracking-tighter rotate-[-12deg]">
                INSTITUT LISANGA<br />SCEAU OFFICIEL<br />MATADI
              </div>

              <div className="text-center space-y-8">
                <p className="text-slate-600">Fait à Matadi, le 15/08/2026<br />Le Préfet des Études</p>
                <div className="font-bold text-[#1A3A5C]">P. KABANGA (PhD)</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
