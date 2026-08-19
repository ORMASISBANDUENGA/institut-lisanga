import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  KeyRound,
  Smartphone,
  Laptop,
  CheckCircle2,
  Lock,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const StudentSecurity: React.FC = () => {
  const { currentUser, changeUserPassword, terminateUserSession, logout } = useApp();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const defaultSessions = currentUser.sessions || [
    {
      id: 'sess-1',
      deviceType: 'MOBILE',
      deviceName: 'Samsung Galaxy A54 • Matadi',
      ipAddress: '102.164.12.89 (Vodacom RDC)',
      location: 'Matadi, Kongo Central',
      lastActive: 'En ligne maintenant',
      isActive: true,
    },
    {
      id: 'sess-2',
      deviceType: 'DESKTOP',
      deviceName: 'Chrome sur Windows 11 • Salle Informatique Lisanga',
      ipAddress: '41.243.18.5 (Rawbank ISP Matadi)',
      location: 'Matadi, Kongo Central',
      lastActive: 'Hier à 16:45',
      isActive: true,
    },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPass.length < 8) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    changeUserPassword(currentUser.id, newPass);
    setSuccessMsg('Mot de passe mis à jour avec succès avec le chiffrement Argon2id !');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>IAM & Sécurité des Comptes • Institut Lisanga Matadi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>🔐 SÉCURITÉ, SESSIONS & MOT DE PASSE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Protection du compte élève, chiffrement Argon2id et contrôle des sessions actives
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Se déconnecter de cette session</span>
        </button>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>Modifier mon Mot de Passe Institutionnel</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-bold">
            Argon2id Sécurisé
          </span>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-xl">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mot de passe actuel (ou mot de passe temporaire) :
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nouveau mot de passe :
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 8 caractères"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Confirmer nouveau mot de passe :
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Répéter le mot de passe"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1A3A5C] hover:bg-[#12283E] text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Valider le nouveau mot de passe</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions & Connected Devices */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>Appareils & Sessions Connectées</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium font-mono">
            {defaultSessions.filter((s) => s.isActive).length} session(s) active(s)
          </span>
        </div>

        <div className="space-y-3">
          {defaultSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                session.isActive
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-100/60 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {session.deviceType === 'MOBILE' ? (
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Laptop className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-xs">
                      {session.deviceName}
                    </h4>
                    {session.isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ACTIF
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location} ({session.ipAddress})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              </div>

              {session.isActive && (
                <button
                  onClick={() => terminateUserSession(currentUser.id, session.id)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 self-end sm:self-center"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnecter cet appareil</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
