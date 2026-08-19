import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolSettings } from '../../types';
import {
  Building2,
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  Globe,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  Info,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export const SchoolSettingsManager: React.FC = () => {
  const { schoolSettings, updateSchoolSettings, setExchangeRateCDF } = useApp();
  const [formData, setFormData] = useState<SchoolSettings>({ ...schoolSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'officialExchangeRate' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateSchoolSettings(formData);
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleClearBranding = () => {
    if (confirm('Voulez-vous réinitialiser et blanchir le nom pour livrer une version neutre/personnalisée ?')) {
      const cleanData: SchoolSettings = {
        ...formData,
        name: 'Établissement Scolaire',
        shortName: 'ÉCOLE',
        motto: 'Discipline - Travail - Réussite',
        city: 'Kinshasa',
        province: 'Kinshasa',
        address: 'Avenue Principale n° 01',
      };
      setFormData(cleanData);
      updateSchoolSettings(cleanData);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-700 text-white shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>Paramètres de l'établissement enregistrés avec succès dans la base de données !</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            <span>CONFIGURATION DE L'ÉTABLISSEMENT & COORDONNÉES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnalisation dynamique du nom, coordonnées de support (WhatsApp/Facebook), taux CDF et devise
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearBranding}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 border border-slate-300"
          title="Réinitialiser vers des valeurs neutres"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Modèle Vierge / Neutre</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Identité de l'école */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Identité Officielle de l'Établissement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nom complet de l'établissement :
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Institut Lisanga"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sigle / Nom court :
              </label>
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                placeholder="Ex: LISANGA"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Devise / Slogan éducatif :
              </label>
              <input
                type="text"
                name="motto"
                value={formData.motto}
                onChange={handleChange}
                placeholder="Ex: Discipline • Travail • Excellence"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contact, WhatsApp & Réseaux */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              2. Support & Coordonnées Officielles (Affichées dans le pied de page)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Numéro de Support WhatsApp (avec indicatif) :</span>
              </label>
              <input
                type="text"
                name="supportWhatsApp"
                value={formData.supportWhatsApp}
                onChange={handleChange}
                placeholder="+243 89 60 82 244"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Lien Profil / Page Facebook :</span>
              </label>
              <input
                type="url"
                name="supportFacebook"
                value={formData.supportFacebook}
                onChange={handleChange}
                placeholder="https://www.facebook.com/oromasis.banduenga"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email officiel de direction :</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="direction@lisanga.edu.cd"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Ville & Province :</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Matadi"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Kongo Central"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Adresse physique complète :
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Avenue de la Paix, Ville Basse, Matadi, RDC"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Paramètres Financiers & Année Académique */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              3. Taux de Change Officiel & Année Scolaire
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Taux officiel (1 USD = X Francs Congolais) :
              </label>
              <input
                type="number"
                name="officialExchangeRate"
                value={formData.officialExchangeRate}
                onChange={handleChange}
                min={500}
                max={10000}
                step={50}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Année Académique Active :</span>
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="2026-2027"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Devise de Facturation Principale :
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold"
              >
                <option value="USD">USD ($ Dollar Américain)</option>
                <option value="CDF">CDF (FC Franc Congolais)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-[#1A3A5C] hover:bg-[#12283E] text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>Enregistrer dans la Base de Données</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
