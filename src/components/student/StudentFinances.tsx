import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  CreditCard,
  DollarSign,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  FileCheck,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { OfficialDocumentViewer } from './OfficialDocumentViewer';

export const StudentFinances: React.FC = () => {
  const { payments, currentStudent, currentPerson, promotionFeeSchedules, exchangeRateCDF, submitFeePayment } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [paymentAmount, setPaymentAmount] = useState('50');
  const [paymentMethod, setPaymentMethod] = useState('Orange Money (+243 89 123 4567)');
  const [payerPhone, setPayerPhone] = useState('+243 89 123 4567');
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(3);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Current Promotion Fee schedule
  const safeSchedules = promotionFeeSchedules || [];
  const currentFeeSchedule =
    safeSchedules.find((s) => s.promotionName?.toLowerCase().includes('4ème commerciale')) ||
    safeSchedules[0];

  const safePayments = payments || [];
  const totalDueUSD = safePayments.reduce((acc, p) => acc + (Number(p.amountDue) || 0), 0);
  const totalPaidUSD = safePayments.reduce((acc, p) => acc + (Number(p.amountPaid) || 0), 0);
  const totalBalanceUSD = safePayments.reduce((acc, p) => acc + (Number(p.balanceRemaining) || 0), 0);

  const safeRate = Number(exchangeRateCDF) || 2850;
  const totalDueCDF = totalDueUSD * safeRate;
  const totalPaidCDF = totalPaidUSD * safeRate;
  const totalBalanceCDF = totalBalanceUSD * safeRate;

  const percentApuré = totalDueUSD > 0 ? Math.min(100, Math.max(0, Math.round((totalPaidUSD / totalDueUSD) * 100))) : 100;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(paymentAmount) || 0;
    if (numericAmount <= 0) return;

    const result = submitFeePayment({
      studentId: currentStudent.id,
      amount: numericAmount,
      currency,
      method: paymentMethod,
      payerPhone,
      trimester: selectedTrimester,
      title: `Frais Scolaires & Minerval - Trimestre ${selectedTrimester}`,
    });

    if (result.success) {
      setPaymentSuccessMessage(`Paiement de ${numericAmount} ${currency} confirmé par ${paymentMethod} ! Reçu officiel n° ${result.receiptNumber} émis.`);
      setTimeout(() => {
        setPaymentSuccessMessage(null);
        setIsPayModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Institut Lisanga • Trésorerie & Comptabilité (Matadi)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>💰 FRAIS DE SCOLARITÉ & FINANCES (USD / CDF)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tarification fixée par la direction pour la {currentStudent.currentClassName} • Année 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currency === 'USD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('CDF')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currency === 'CDF' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              CDF (FC)
            </button>
          </div>

          {totalBalanceUSD > 0 && (
            <button
              id="pay-balance-btn"
              onClick={() => setIsPayModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Payer en ligne ({currency === 'USD' ? `${totalBalanceUSD} $` : `${totalBalanceCDF.toLocaleString('fr-FR')} CDF`})</span>
            </button>
          )}
        </div>
      </div>

      {/* Exchange Rate & Schedule Notification Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-medium">
          <ArrowRightLeft className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Taux de change officiel appliqué : <strong>1 USD = {exchangeRateCDF.toLocaleString('fr-FR')} CDF</strong> (Fixé par la Direction à Matadi)
          </span>
        </div>
        <div className="text-amber-800 text-[11px] font-semibold">
          Mobile Money accepté : Orange Money, Airtel Money, M-Pesa & Guichet Rawbank
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Minerval Annuel
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {currency === 'USD' ? `${totalDueUSD}.00 $` : `${totalDueCDF.toLocaleString('fr-FR')} CDF`}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Fixé à {currentFeeSchedule ? `${currentFeeSchedule.amountUSD} $` : '450 $'} par élève
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Montant Régularisé
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {currency === 'USD' ? `${totalPaidUSD}.00 $` : `${totalPaidCDF.toLocaleString('fr-FR')} CDF`}
          </div>
          <div className="text-xs text-emerald-800 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{percentApuré}% apuré</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Solde Restant à Payer
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1">
            {currency === 'USD' ? `${totalBalanceUSD}.00 $` : `${totalBalanceCDF.toLocaleString('fr-FR')} CDF`}
          </div>
          <div className="text-xs text-rose-600 font-semibold mt-1">
            {totalBalanceUSD === 0 ? '✅ Tout est en règle' : 'Échéance : 30/08/2026 (Trimestre 3)'}
          </div>
        </div>
      </div>

      {/* Payment History & Quittances */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Historique des Paiements & Reçus Officiels</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {payments.length} quittances enregistrées
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Tranche / Motif</th>
                <th className="px-4 py-3 text-center">Montant Dû</th>
                <th className="px-4 py-3 text-center">Montant Versé</th>
                <th className="px-4 py-3 text-center">Solde</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Mode & Date</th>
                <th className="px-4 py-3 text-center rounded-r-lg">Quittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => {
                const isPaid = p.balanceRemaining === 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      <div>{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.receiptNumber}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-slate-600">
                      {currency === 'USD' ? `${p.amountDue} $` : `${(p.amountDue * exchangeRateCDF).toLocaleString('fr-FR')} CDF`}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-700">
                      {currency === 'USD' ? `${p.amountPaid} $` : `${(p.amountPaid * exchangeRateCDF).toLocaleString('fr-FR')} CDF`}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold text-rose-600">
                      {currency === 'USD' ? `${p.balanceRemaining} $` : `${(p.balanceRemaining * exchangeRateCDF).toLocaleString('fr-FR')} CDF`}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'PAYÉ ✅' : 'PARTIEL ⚠️'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-500 text-[11px]">
                      <div>{p.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">{p.paymentDate}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedReceipt(p.receiptNumber)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#1A3A5C] text-xs font-bold rounded-lg transition inline-flex items-center gap-1 border border-slate-300"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reçu</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Règlement des Frais Scolaires (Matadi)
                </h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                  {paymentSuccessMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tranche à régler :
                  </label>
                  <select
                    value={selectedTrimester}
                    onChange={(e) => setSelectedTrimester(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  >
                    <option value={3}>Trimestre 3 (Solde : 50 USD / 142 500 CDF)</option>
                    <option value={2}>Trimestre 2 (Apuré)</option>
                    <option value={1}>Trimestre 1 (Apuré)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Devise :</label>
                    <select
                      value={currency}
                      onChange={(e) => {
                        const newCurr = e.target.value as 'USD' | 'CDF';
                        setCurrency(newCurr);
                        setPaymentAmount(newCurr === 'USD' ? '50' : '142500');
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="CDF">CDF (Francs Congolais)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Montant à verser :</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de Paiement :</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  >
                    <option value="Orange Money (RDC)">Orange Money (Code Marchand Matadi : 894512)</option>
                    <option value="Airtel Money (RDC)">Airtel Money (+243 81 987 6543)</option>
                    <option value="M-Pesa Vodacom">M-Pesa Vodacom (+243 82 555 1234)</option>
                    <option value="Guichet Rawbank Matadi">Rawbank Agence Matadi (Compte : 0100452-LIS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Numéro de Téléphone Mobile Money / Payeur :
                  </label>
                  <input
                    type="text"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="+243 89 123 4567"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Une notification SMS avec code PIN vous sera transmise pour valider le débit sur votre compte.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmer Paiement ({paymentAmount} {currency})</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Official Receipt Viewer Modal */}
      {selectedReceipt && (
        <OfficialDocumentViewer
          docType="recu"
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};
