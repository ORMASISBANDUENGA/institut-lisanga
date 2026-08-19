import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Building,
  Info,
  BookOpen,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Layers,
  Printer,
  ChevronRight,
  Filter,
  Check,
  List,
  Grid3X3,
  School
} from 'lucide-react';
import { ScheduleSlot } from '../../types';

export const StudentSchedule: React.FC = () => {
  const {
    scheduleSlots,
    rooms,
    currentStudent,
    promotions,
    classes,
    options,
    levels,
    schoolSettings
  } = useApp();

  // Find active student's class
  const safeClasses = classes || [];
  const safePromotions = promotions || [];
  const safeOptions = options || [];
  const safeLevels = levels || [];
  const safeScheduleSlots = scheduleSlots || [];
  const safeRooms = rooms || [];

  const defaultClassId = useMemo(() => {
    const found = safeClasses.find(c => c.id === currentStudent?.currentClassId || c.fullName === currentStudent?.currentClassName);
    return found ? found.id : (safeClasses[0]?.id || 'cls-4com-a');
  }, [safeClasses, currentStudent]);

  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId);
  const [selectedDay, setSelectedDay] = useState<string>('Lundi');
  const [viewMode, setViewMode] = useState<'DAY' | 'WEEK'>('DAY');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Current selected class & promotion object
  const selectedClass = useMemo(() => {
    return safeClasses.find(c => c.id === selectedClassId) || safeClasses[0];
  }, [safeClasses, selectedClassId]);

  const selectedPromotion = useMemo(() => {
    if (!selectedClass) return safePromotions[0];
    return safePromotions.find(p => p.id === selectedClass.promotionId) || safePromotions[0];
  }, [safePromotions, selectedClass]);

  const selectedLevel = useMemo(() => {
    if (!selectedPromotion) return safeLevels[0];
    return safeLevels.find(l => l.id === selectedPromotion.levelId) || safeLevels[0];
  }, [safeLevels, selectedPromotion]);

  const selectedOption = useMemo(() => {
    if (!selectedPromotion?.optionId) return null;
    return safeOptions.find(o => o.id === selectedPromotion.optionId) || null;
  }, [safeOptions, selectedPromotion]);

  const isHumanites = selectedPromotion?.levelId?.includes('h') || selectedPromotion?.optionId !== null;
  const cycleType = isHumanites ? 'HUMANITES' : 'CO';

  // Generate robust, authentic schedule for any class if not explicitly seeded
  const computedClassSlots = useMemo(() => {
    if (!selectedClass) return [];

    // Check if slots already exist in database for this specific classId
    const existing = safeScheduleSlots.filter(s => s.classId === selectedClass.id);
    if (existing.length >= 6) {
      return existing;
    }

    // Otherwise generate the official Congolese curriculum schedule for this specific class
    const generated: ScheduleSlot[] = [];
    const room = safeRooms.find(r => r.id === selectedClass.roomId) || safeRooms[0] || {
      id: 'room-12',
      code: 'SAL-12',
      name: 'Salle 12',
      building: 'Bloc A'
    };

    // Humanités morning timing (07h30 -> 12h15) vs C.O afternoon timing (12h30 -> 17h15)
    const timeSlots = isHumanites
      ? [
          { period: 1, start: '07:30', end: '08:15', name: '1ère Période' },
          { period: 2, start: '08:15', end: '09:00', name: '2ème Période' },
          { period: 3, start: '09:00', end: '09:45', name: '3ème Période' },
          { period: 0, start: '09:45', end: '10:00', name: 'Pause / Récréation', isBreak: true },
          { period: 4, start: '10:00', end: '10:45', name: '4ème Période' },
          { period: 5, start: '10:45', end: '11:30', name: '5ème Période' },
          { period: 6, start: '11:30', end: '12:15', name: '6ème Période' }
        ]
      : [
          { period: 1, start: '12:30', end: '13:15', name: '1ère Période' },
          { period: 2, start: '13:15', end: '14:00', name: '2ème Période' },
          { period: 3, start: '14:00', end: '14:45', name: '3ème Période' },
          { period: 0, start: '14:45', end: '15:00', name: 'Pause / Récréation', isBreak: true },
          { period: 4, start: '15:00', end: '15:45', name: '4ème Période' },
          { period: 5, start: '15:45', end: '16:30', name: '5ème Période' },
          { period: 6, start: '16:30', end: '17:15', name: '6ème Période' }
        ];

    // Course matrix by option and level
    const optCode = selectedOption?.code || 'CO';
    const lvlOrder = selectedLevel?.levelOrder || 3;

    const subjectsByDay: Record<string, string[]> = {
      COM: [
        'Comptabilité Générale', 'Comptabilité des Sociétés', 'Économie Politique',
        'Mathématiques Financières', 'Droit Commercial OHADA', 'Informatique de Gestion',
        'Fiscalité & Douanes', 'Anglais des Affaires', 'Correspondance Commerciale',
        'Statistique Appliquée', 'Éducation Civique & Morale', 'Éducation Physique'
      ],
      SCI: [
        'Mathématiques (Algèbre/Analyse)', 'Physique Générale', 'Chimie Organique/Minérale',
        'Biologie Cellulaire & Génétique', 'Géologie & Sciences Terre', 'Informatique & Algorithmique',
        'Français & Dissertation', 'Anglais Scientifique', 'Dessin Scientifique',
        'Philosophie des Sciences', 'Éducation Civique', 'Éducation Physique'
      ],
      PED: [
        'Psychologie Générale & Enfant', 'Pédagogie Générale', 'Didactique des Disciplines',
        'Français & Expression Orale', 'Histoire de l’Éducation', 'Législation Scolaire',
        'Mathématiques Générales', 'Sciences Naturelles', 'Hygiène Scolaire',
        'Éthique & Déontologie', 'Dessin & Travaux Manuels', 'Éducation Physique'
      ],
      LIT: [
        'Latin (Textes & Grammaire)', 'Philosophie & Logique', 'Littérature Française & Africaine',
        'Histoire Générale & Afrique', 'Géographie Économique', 'Anglais Littéraire',
        'Mathématiques Générales', 'Civisme & Droits Humains', 'Expression Écrite',
        'Initiation à la Recherche', 'Histoire de l’Art', 'Éducation Physique'
      ],
      TECH: [
        'Électricité & Électronique', 'Mécanique Appliquée', 'Dessin Industriel & DAO',
        'Technologie des Métaux', 'Mathématiques Appliquées', 'Physique Industrielle',
        'Sécurité & Prévention Atelier', 'Automatisme & Régulation', 'Français Technique',
        'Anglais Technique', 'Organisation d’Atelier', 'Éducation Physique'
      ],
      CO: [
        'Français (Grammaire & Textes)', 'Mathématiques Fondamentales', 'Sciences de la Vie & Terre',
        'Physique & Chimie Élémentaires', 'Histoire & Géographie', 'Éducation Civique & Morale',
        'Anglais Élémentaire', 'Informatique & TIC', 'Dessin & Éducation Plastique',
        'Initiation Agricole/Technologique', 'Musique & Culture', 'Éducation Physique'
      ]
    };

    const courseList = subjectsByDay[optCode] || subjectsByDay.COM;

    // Faculty pool
    const teachers = [
      'Prof. TUMBA Jean-Marie',
      'Dr. KABEYA Patient',
      'Prof. KALALA Emmanuel',
      'Prof. LUMANDE Michel',
      'Prof. MBAYA François',
      'Prof. NGALULA Christine',
      'Prof. DIKETE Robert'
    ];

    days.forEach((day, dayIndex) => {
      timeSlots.forEach((slot, slotIndex) => {
        if (slot.isBreak) {
          generated.push({
            id: `gen-slot-${selectedClass.id}-${dayIndex}-break`,
            cycleType,
            dayOfWeek: day as any,
            periodNumber: 0,
            periodName: 'Récréation / Pause',
            startTime: slot.start,
            endTime: slot.end,
            classId: selectedClass.id,
            className: selectedClass.fullName,
            roomId: room.id,
            roomCode: room.code,
            roomName: 'Cour Principale / Préau',
            courseName: 'Pause Pédagogique',
            subject: 'Pause Pédagogique',
            teacherName: 'Surveillance Générale & Direction de Discipline',
            isBreak: true
          });
        } else {
          const subjectIndex = (dayIndex * 2 + slot.period) % courseList.length;
          const teacherIndex = (dayIndex + slot.period + (selectedClass.name === 'B' ? 2 : 0)) % teachers.length;
          const course = courseList[subjectIndex];
          const teacher = teachers[teacherIndex];

          generated.push({
            id: `gen-slot-${selectedClass.id}-${dayIndex}-${slot.period}`,
            cycleType,
            dayOfWeek: day as any,
            periodNumber: slot.period,
            periodName: `${slot.period}e Période`,
            startTime: slot.start,
            endTime: slot.end,
            classId: selectedClass.id,
            className: selectedClass.fullName,
            roomId: slot.period === 4 && (optCode === 'COM' || optCode === 'TECH') ? 'room-15' : room.id,
            roomCode: slot.period === 4 && (optCode === 'COM' || optCode === 'TECH') ? 'LAB-15' : room.code,
            roomName: slot.period === 4 && (optCode === 'COM' || optCode === 'TECH') ? 'Laboratoire Informatique 15 (Bloc C)' : `${room.name} (${room.building || 'Bloc A'})`,
            courseName: course,
            subject: course,
            teacherName: teacher,
            isBreak: false
          });
        }
      });
    });

    return generated;
  }, [selectedClass, scheduleSlots, rooms, isHumanites, selectedOption, selectedLevel, cycleType, days]);

  // Daily filtered slots
  const dailySlots = useMemo(() => {
    return computedClassSlots.filter(s => s.dayOfWeek === selectedDay);
  }, [computedClassSlots, selectedDay]);

  // Group promotions by Option/Cycle for organized navigation
  const groupedPromotions = useMemo(() => {
    const groups: { title: string; cycle: 'CO' | 'HUMANITES'; promos: typeof promotions }[] = [];

    // 1. Cycle d'Orientation
    const coPromos = safePromotions.filter(p => p.levelId === 'lvl-7' || p.levelId === 'lvl-8' || p.optionId === null);
    if (coPromos.length > 0) {
      groups.push({
        title: "Cycle d'Orientation (7e & 8e C.O)",
        cycle: 'CO',
        promos: coPromos
      });
    }

    // 2. Humanités Options
    safeOptions.forEach(opt => {
      const optPromos = safePromotions.filter(p => p.optionId === opt.id);
      if (optPromos.length > 0) {
        groups.push({
          title: `Humanités ${opt.name} (${opt.code})`,
          cycle: 'HUMANITES',
          promos: optPromos
        });
      }
    });

    return groups;
  }, [safePromotions, safeOptions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-1.5">
            <School className="w-3.5 h-3.5 text-blue-700" />
            <span>{schoolSettings.name} • {schoolSettings.city} ({schoolSettings.province})</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <span>📅 HORAIRES DES COURS PAR PROMOTION & CLASSE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisation des Humanités (1ère, 2ème, 3ème, 4ème) et Cycle d'Orientation (7e, 8e) • Périodes de 45 minutes
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => setSelectedClassId(defaultClassId)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition flex items-center gap-1.5"
            title="Revenir à ma classe officielle"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Ma Classe ({currentStudent.currentClassName})</span>
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('DAY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'DAY'
                  ? 'bg-white text-[#1A3A5C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Par Jour</span>
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'WEEK'
                  ? 'bg-white text-[#1A3A5C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Semaine Complète</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1A3A5C] text-white hover:bg-[#12283E] transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Promotion & Class Selector Bar */}
      <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Sélectionnez une Promotion & une Classe pour afficher son horaire dédié
            </h2>
          </div>
          <span className="text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {classes.length} Classes Configurées
          </span>
        </div>

        {/* Promotion Tree Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {groupedPromotions.map((group, gIdx) => (
            <div key={gIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-900 flex items-center gap-1.5">
                  {group.cycle === 'CO' ? (
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>{group.title}</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {group.cycle === 'CO' ? '12h30 - 17h15' : '07h30 - 12h15'}
                </span>
              </div>

              {/* Promotion Level Buttons */}
              <div className="space-y-1.5">
                {group.promos.map(promo => {
                  const promoClasses = safeClasses.filter(c => c.promotionId === promo.id);
                  const isPromoActive = promoClasses.some(c => c.id === selectedClassId);

                  return (
                    <div
                      key={promo.id}
                      className={`p-2 rounded-lg border transition ${
                        isPromoActive
                          ? 'bg-indigo-50/70 border-indigo-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-800 text-[11px] truncate">
                          {(promo.name || '').replace(' 2026-2027', '') || promo.code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {promo.code}
                        </span>
                      </div>

                      {/* Class pills within promotion */}
                      <div className="flex flex-wrap gap-1.5">
                        {promoClasses.map(cls => {
                          const isSelected = cls.id === selectedClassId;
                          return (
                            <button
                              key={cls.id}
                              onClick={() => setSelectedClassId(cls.id)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#1A3A5C] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                              <span>Classe {cls.name}</span>
                            </button>
                          );
                        })}
                        {promoClasses.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">Aucune classe créée</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Class Highlight Card */}
      <div className="bg-gradient-to-r from-[#1A3A5C] to-[#0D2238] rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
            {isHumanites ? 'Cycle des Humanités • Session Matinée' : "Cycle d'Orientation • Session Après-midi"}
          </div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <span>{selectedClass?.fullName || 'Classe'}</span>
          </h2>
          <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Horaire Officiel : <strong>{isHumanites ? '07h30 à 12h15 (6 Périodes de 45 min)' : '12h30 à 17h15 (6 Périodes de 45 min)'}</strong></span>
            <span>Salle Assignée : <strong>{selectedClass?.roomId ? 'SAL-12 (Bloc A)' : 'Salle Dédiée'}</strong></span>
            <span>Effectif : <strong>{selectedClass?.capacity || 40} Élèves</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
            <div className="text-[10px] uppercase font-bold text-amber-300">Volume Hebdo</div>
            <div className="text-xl font-extrabold text-white">36 Périodes</div>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs (When in Day View Mode) */}
      {viewMode === 'DAY' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 print:hidden">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                id={`schedule-day-${day.toLowerCase()}`}
                onClick={() => setSelectedDay(day)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1A3A5C] text-white shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{day}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* View 1: Day View Slots */}
      {viewMode === 'DAY' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>
                Horaire du {selectedDay} • {selectedClass?.fullName} ({isHumanites ? '07:30 - 12:15' : '12:30 - 17:15'})
              </span>
            </h3>
            <span className="text-xs text-slate-500 font-medium font-mono">
              {dailySlots.filter(s => !s.isBreak).length} cours • 1 récréation
            </span>
          </div>

          <div className="space-y-3">
            {dailySlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  slot.isBreak
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Period Time Badge */}
                  <div className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-center shrink-0 min-w-[110px]">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {slot.periodName}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-slate-900 block mt-0.5">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {slot.subject || slot.courseName}
                      </h4>
                      {slot.isBreak && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-bold">
                          PAUSE PÉDAGOGIQUE
                        </span>
                      )}
                    </div>

                    {!slot.isBreak && (
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Professeur : <strong>{slot.teacherName}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>Salle : <strong>{slot.roomName}</strong></span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Confirmé</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Full Week Grid Table */}
      {viewMode === 'WEEK' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Grille Hebdomadaire Complète • {selectedClass?.fullName}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              6 jours ouvrables (Lundi au Samedi)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 border-r border-slate-200 w-28 text-center">Tranche</th>
                  {days.map(d => (
                    <th key={d} className="p-3 border-r border-slate-200 text-center min-w-[150px]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[1, 2, 3, 0, 4, 5, 6].map(periodNum => {
                  const isBreak = periodNum === 0;
                  const sampleSlot = computedClassSlots.find(s => s.periodNumber === periodNum);

                  return (
                    <tr
                      key={periodNum}
                      className={isBreak ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3 font-mono font-bold text-center border-r border-slate-200 bg-slate-50">
                        <span className="block text-[10px] text-slate-500 uppercase">
                          {isBreak ? 'Pause' : `${periodNum}e Période`}
                        </span>
                        <span className="text-[11px] text-slate-900">
                          {sampleSlot ? `${sampleSlot.startTime}-${sampleSlot.endTime}` : ''}
                        </span>
                      </td>

                      {days.map(d => {
                        const slot = computedClassSlots.find(
                          s => s.dayOfWeek === d && s.periodNumber === periodNum
                        );

                        if (isBreak) {
                          return (
                            <td
                              key={d}
                              className="p-2.5 text-center text-[11px] text-amber-900 border-r border-slate-200 font-bold"
                            >
                              Récréation / Pause
                            </td>
                          );
                        }

                        return (
                          <td key={d} className="p-2.5 border-r border-slate-200 align-top">
                            {slot ? (
                              <div className="space-y-1">
                                <div className="font-extrabold text-slate-900 leading-tight">
                                  {slot.subject || slot.courseName}
                                </div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <User className="w-2.5 h-2.5" />
                                  <span>{(slot.teacherName || 'Enseignant').replace('Prof. ', '').replace('Dr. ', '')}</span>
                                </div>
                                <div className="text-[9px] text-slate-400 flex items-center gap-1">
                                  <Building className="w-2.5 h-2.5" />
                                  <span>{slot.roomCode || 'SAL-12'}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300 italic text-[10px]">Libre</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
