import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  Edit3,
  Calendar,
  Layers,
  Save,
  Sparkles,
} from 'lucide-react';

export const AdminFeeSchedules: React.FC = () => {
  const {
    promotionFeeSchedules,
    updatePromotionFeeSchedule,
    exchangeRateCDF,
    setExchangeRateCDF,
  } = useApp();

  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editUSD, setEditUSD] = useState('');
  const [rateInput, setRateInput] = useState(String(exchangeRateCDF));
  const [successToast, setSuccessToast] = useState(false);

  const handleUpdateFee = (id: string) => {
    const numericUSD = parseFloat(editUSD);
    if (!numericUSD) return;

    updatePromotionFeeSchedule(id, {
      amountUSD: numericUSD,
      amountCDF: Math.round(numericUSD * exchangeRateCDF),
      firstTrimesterUSD: Math.round(numericUSD / 3),
      secondTrimesterUSD: Math.round(numericUSD / 3),
      thirdTrimesterUSD: numericUSD - 2 * Math.round(numericUSD / 3),
    });

    setEditingFeeId(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleUpdateExchangeRate = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = parseInt(rateInput);
    if (newRate > 1000) {
      setExchangeRateCDF(newRate);
      // Auto recalculate all fee schedules in CDF
      promotionFeeSchedules.forEach((fee) => {
        updatePromotionFeeSchedule(fee.id, {
          amountCDF: Math.round(fee.amountUSD * newRate),
        });
      });
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-700 text-white shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>Barème des frais et taux de change mis à jour avec succès !</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Trésorerie & Direction Financière • Institut Lisanga Matadi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>💵 BARÈME OFFICIEL DES FRAIS SCOLAIRES (USD / CDF)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fixation des montants annuels et trimestriels par promotion pour l’année 2026-2027
          </p>
        </div>
      </div>

      {/* Exchange Rate Setting Card */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#0D2238] rounded-2xl p-6 text-white shadow-md">
        <form onSubmit={handleUpdateExchangeRate} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Taux de Change Officiel de l’Établissement</span>
            </div>
            <h2 className="text-xl font-extrabold">
              1 USD = {exchangeRateCDF.toLocaleString('fr-FR')} CDF (Francs Congolais)
            </h2>
            <p className="text-xs text-slate-300">
              Tous les paiements effectués en monnaie locale (CDF) sont instantanément convertis selon ce barème.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20 flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300">Nouveau Taux :</span>
              <input
                type="number"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                className="w-24 p-1 rounded-lg bg-white text-slate-900 font-mono font-bold text-xs text-center"
                min="1000"
                max="5000"
              />
              <span className="text-xs text-slate-300">CDF</span>
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-xs"
            >
              Appliquer
            </button>
          </div>
        </form>
      </div>

      {/* Promotion Fee Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Grille Tarifaire Fixée par Promotion</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {promotionFeeSchedules.length} promotions configurées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Promotion / Cycle</th>
                <th className="px-4 py-3 text-center">Montant Annuel (USD)</th>
                <th className="px-4 py-3 text-center">Montant Annuel (CDF)</th>
                <th className="px-4 py-3 text-center">Trimestre 1</th>
                <th className="px-4 py-3 text-center">Trimestre 2</th>
                <th className="px-4 py-3 text-center">Trimestre 3</th>
                <th className="px-4 py-3 text-center rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promotionFeeSchedules.map((schedule) => {
                const isEditing = editingFeeId === schedule.id;
                return (
                  <tr key={schedule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{schedule.promotionName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Année {schedule.academicYear}</div>
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono font-extrabold text-slate-900 text-sm">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editUSD}
                          onChange={(e) => setEditUSD(e.target.value)}
                          className="w-20 p-1 border border-amber-400 rounded-lg text-center font-mono"
                        />
                      ) : (
                        `${schedule.amountUSD} $`
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-700">
                      {((schedule.amountUSD || 0) * (exchangeRateCDF || 2850)).toLocaleString('fr-FR')} CDF
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                      {schedule.firstTrimesterUSD} $
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                      {schedule.secondTrimesterUSD} $
                    </td>

                    <td className="px-4 py-3.5 text-center font-mono text-slate-600">
                      {schedule.thirdTrimesterUSD} $
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleUpdateFee(schedule.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            title="Sauvegarder"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingFeeId(null)}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingFeeId(schedule.id);
                            setEditUSD(String(schedule.amountUSD));
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#1A3A5C] text-xs font-bold rounded-lg transition inline-flex items-center gap-1 border border-slate-300"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>
                      )}
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
