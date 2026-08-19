import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MessageCircle, Globe, Phone, MapPin, Database, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { schoolSettings } = useApp();

  const settings = schoolSettings || {};
  const whatsappNumber = settings.supportWhatsApp || '+243 89 60 82 244';
  const cleanWhatsAppNumber = (whatsappNumber || '').replace(/[^0-9]/g, '');
  const facebookUrl = settings.supportFacebook || 'https://www.facebook.com/oromasis.banduenga';

  return (
    <footer id="app-footer" className="mt-12 border-t border-slate-200 bg-white/95 text-slate-700 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        {/* Left: Dynamic Institution Identity */}
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-sm text-[#1A3A5C] tracking-tight">
              {schoolSettings.name || 'Système de Gestion Scolaire'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold">
              v2.5 RDC
            </span>
          </div>
          <p className="text-slate-500 text-[11px] max-w-md">
            {schoolSettings.motto ? `« ${schoolSettings.motto} » • ` : ''}
            {schoolSettings.city ? `${schoolSettings.city}, ${schoolSettings.province || 'RDC'}` : 'République Démocratique du Congo'}
          </p>
        </div>

        {/* Center: Real Security & Architecture Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-[11px]">Backend Persistant</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-[11px]">RBAC Serveur & Hash Bcrypt</span>
          </div>
        </div>

        {/* Right: Contact & Support (WhatsApp & Facebook) */}
        <div className="flex items-center gap-3">
          {/* WhatsApp Support Link */}
          <a
            id="footer-whatsapp-link"
            href={`https://wa.me/${cleanWhatsAppNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition shadow-xs"
            title="Assistance & Support WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp : {whatsappNumber}</span>
          </a>

          {/* Facebook Link */}
          <a
            id="footer-facebook-link"
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold transition shadow-xs"
            title="Page & Profil Facebook Officiel"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Facebook</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center">
        <p>
          Plateforme académique modulaire et personnalisable. Tous droits réservés &copy; {new Date().getFullYear()}.
        </p>
        <p className="flex items-center justify-center gap-1">
          <span>Développé pour l'excellence éducative en RDC</span>
        </p>
      </div>
    </footer>
  );
};
