import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Info,
  Scale,
  Award,
} from 'lucide-react';

export const StudentDiscipline: React.FC = () => {
  const { disciplineSanctions, currentStudent, currentPerson } = useApp();

  const studentSanctions = disciplineSanctions.filter((s) => s.studentId === currentStudent.id);
  const activeSanctions = studentSanctions.filter((s) => !s.isResolved);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold mb-1">
            <Scale className="w-3.5 h-3.5 text-[#1A3A5C]" />
            <span>Direction de Discipline • Institut Lisanga Matadi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>⚖️ CONTENEUR : DISCIPLINE & SANCTIONS (R.O.I)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossier de comportement, assiduité et respect du Règlement Intérieur • {currentStudent.currentClassName}
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Note de Conduite : <strong>Très Bonne (B+)</strong></span>
        </div>
      </div>

      {/* Discipline Status Summary */}
      {activeSanctions.length > 0 ? (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-rose-950">
              Attention : {activeSanctions.length} sanction active enregistrée dans votre dossier
            </h2>
            <p className="text-xs text-rose-800 leading-relaxed">
              Toute sanction disciplinaire non levée peut impacter la délivrance de l'attestation de bonne conduite, vie et mœurs à la fin de l'année scolaire à Matadi.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-emerald-950">
              Dossier Disciplinaire Exemplaire
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Aucune infraction grave ni sanction active n'est répertoriée pour <strong>{currentPerson.fullName}</strong>. Merci de maintenir ce niveau d'exemplarité au sein de l'établissement.
            </p>
          </div>
        </div>
      )}

      {/* Sanctions List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Historique des Notations & Avertissements</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {studentSanctions.length} enregistrements
          </span>
        </div>

        {studentSanctions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Aucun incident disciplinaire signalé.
          </div>
        ) : (
          <div className="space-y-3">
            {studentSanctions.map((sanction) => (
              <div
                key={sanction.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        sanction.severity === 'CRITIQUE'
                          ? 'bg-rose-600 text-white'
                          : sanction.severity === 'GRAVE'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {sanction.type ? String(sanction.type).replace(/_/g, ' ') : 'SANCTION'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {sanction.reason}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                    <span>Émis par : <strong>{sanction.issuedBy}</strong></span>
                    <span>• Date : {sanction.issuedAt.split('T')[0]}</span>
                    {sanction.durationDays && (
                      <span className="text-rose-600 font-bold">• Durée : {sanction.durationDays} jour(s)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      sanction.isResolved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sanction.isResolved ? 'Régularisé ✅' : 'En Cours ⏳'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Règlement d'Ordre Intérieur (R.O.I) */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-md space-y-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Scale className="w-4 h-4" />
          <span>Extraits du Règlement d’Ordre Intérieur (R.O.I) - Institut Lisanga Matadi</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="font-bold text-amber-300">Article 1 : Ponctualité & Présence</h4>
            <p>
              Tout élève des Humanités doit être présent au rassemblement à 07h15 (début des cours à 07h30). Pour le Cycle d'Orientation, rassemblement à 12h15 (début des cours à 12h30). 3 retards non motivés entraînent une retenue d'une heure.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="font-bold text-amber-300">Article 2 : Tenue & Uniforme Officiel</h4>
            <p>
              Uniforme réglementaire obligatoire : chemise bleu ciel impeccable et pantalon/jupe bleu marine. Tout port d'effets non conformes est passible de renvoi temporaire pour régularisation immédiate.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="font-bold text-amber-300">Article 3 : Respect du Corps Enseignant</h4>
            <p>
              Tout acte d'indiscipline caractérisé, insolence ou refus d'obtempérer envers un membre du personnel enseignant ou administratif de Matadi donne lieu à la convocation immédiate des parents.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <h4 className="font-bold text-amber-300">Article 4 : Téléphones & Objets Connectés</h4>
            <p>
              L'utilisation des téléphones portables est strictement interdite dans les salles de cours durant les périodes de 45 minutes, sauf autorisation expresse pour les travaux pratiques informatiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
