import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  CheckCircle,
  Building,
  School,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const AdminAcademicStructure: React.FC = () => {
  const {
    cycles,
    levels,
    options,
    promotions,
    classes,
    schoolSettings,
    setActiveNavTab
  } = useApp();

  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-com');

  const activeOption = (options && options.length > 0)
    ? (options.find(o => o.id === selectedOptionId) || options[0])
    : {
        id: 'opt-com',
        code: 'COM',
        name: 'Commerciale et Gestion',
        description: 'Comptabilité générale, économie, droit des affaires et informatique',
        isActive: true,
        subjects: ['Comptabilité', 'Économie', 'Informatique de gestion', 'Droit'],
        createdAt: ''
      };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-1.5">
            <School className="w-3.5 h-3.5 text-blue-700" />
            <span>{schoolSettings.name} • {schoolSettings.city}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>🏛️ STRUCTURE ACADÉMIQUE, PROMOTIONS & HORAIRES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture pédagogique officielle : Cycle d'Orientation (7e-8e) & Humanités (1ère, 2ème, 3ème, 4ème) avec horaires propres par classe
          </p>
        </div>

        <button
          onClick={() => setActiveNavTab('schedule')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A3A5C] text-white hover:bg-[#12283E] transition flex items-center gap-2 shadow-xs"
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Consulter les Horaires des Classes</span>
        </button>
      </div>

      {/* Overview Cards: Cycles Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cycle 1: Cycle d'Orientation */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                1. Cycle d'Orientation (C.O - 2 Ans)
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold">
              Session Après-midi (12h30 - 17h15)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Tronc commun de base préparatoire (7ème et 8ème C.O) débouchant sur l'examen national d'orientation vers les filières des Humanités.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block text-xs">7ème Année C.O (7e C.O)</span>
                <span className="text-[11px] text-slate-500">2 classes (7ème A, 7ème B) • Horaires propres (6 périodes/jour)</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                Actif
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block text-xs">8ème Année C.O (8e C.O)</span>
                <span className="text-[11px] text-slate-500">2 classes (8ème A, 8ème B) • Orientation vers les Humanités</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                Actif
              </span>
            </div>
          </div>
        </div>

        {/* Cycle 2: Humanités avec Promotions 1ère, 2ème, 3ème, 4ème */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                2. Humanités (1ère, 2ème, 3ème, 4ème - 4 Ans)
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">
              Session Matin (07h30 - 12h15)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Dans chaque option des humanités, le cursus s'échelonne sur 4 promotions successives avec leurs propres classes et grilles d'horaires.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">
              <span className="text-[10px] text-indigo-600 block uppercase font-mono">1ère Humanité</span>
              <span>Initiation Spécialisée</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">
              <span className="text-[10px] text-indigo-600 block uppercase font-mono">2ème Humanité</span>
              <span>Approfondissement</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-800">
              <span className="text-[10px] text-indigo-600 block uppercase font-mono">3ème Humanité</span>
              <span>Maîtrise Technique</span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 font-extrabold text-indigo-950">
              <span className="text-[10px] text-amber-600 block uppercase font-mono">4ème Humanité (Terminale)</span>
              <span>Diplôme d'État (EXETAT)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Promotion & Classes Matrix by Option */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Matrice des Promotions (1ère, 2ème, 3ème, 4ème) par Option</span>
            </h2>
            <p className="text-xs text-slate-500">
              Chaque promotion regroupe ses classes (A, B) et possède un horaire distinct avec des professeurs de branche assignés
            </p>
          </div>

          {/* Option Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedOptionId === opt.id
                    ? 'bg-[#1A3A5C] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.name.split(' ')[0]} ({opt.code})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Option Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">{activeOption.name}</span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                Code : {activeOption.code}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{activeOption.description}</p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Matières clés : <strong className="text-slate-800">{(activeOption.subjects || []).join(', ')}</strong>
          </div>
        </div>

        {/* 4 Promotions for this Option: 1ère, 2ème, 3ème, 4ème */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['1ère', '2ème', '3ème', '4ème'].map((prefix, idx) => {
            const promoLevelCode = `lvl-${idx + 1}h`;
            const promo = promotions.find(p => p.optionId === activeOption.id && (p.levelId === promoLevelCode || p.name.startsWith(prefix)));
            const promoClasses = classes.filter(c => promo && c.promotionId === promo.id);

            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 text-xs font-black">
                    {prefix} Humanité
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {idx === 3 ? 'EXETAT' : `Niveau ${idx + 1}`}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {prefix} {activeOption.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Promotion 2026-2027
                  </span>
                </div>

                {/* Classes in this promotion */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Classes & Horaires Dédiés :
                  </span>
                  {promoClasses.length > 0 ? (
                    <div className="space-y-1">
                      {promoClasses.map(cls => (
                        <div
                          key={cls.id}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-bold text-slate-800">Classe {cls.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {cls.capacity} places
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
                      Classe A (40 places) • Horaire configuré
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
