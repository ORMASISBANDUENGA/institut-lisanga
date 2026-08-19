import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicClass, Option } from '../../types';
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
  ArrowLeft,
  ShieldCheck,
  Award,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  DoorClosed,
  UserCheck,
  AlertTriangle,
  X,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

const TEACHERS_CATALOG = [
  { id: 'teacher-kabeya', name: 'Dr. KABEYA Tshilumba', specialty: 'Mathématiques & Droit' },
  { id: 'teacher-tumba', name: 'Prof. TUMBA Lukoki', specialty: 'Comptabilité Générale' },
  { id: 'teacher-kalala', name: 'Prof. KALALA Mukendi', specialty: 'Économie & Finance' },
  { id: 'teacher-mbaya', name: 'Prof. MBAYA Mwamba', specialty: 'Informatique & Bureautique' },
  { id: 'teacher-lumande', name: 'Mme LUMANDE Kapinga', specialty: 'Français & Pédagogie' },
  { id: 'teacher-mpoyi', name: 'Prof. MPOYI Kazadi', specialty: 'Anglais & Communication' },
];

export const AdminAcademicStructure: React.FC = () => {
  const {
    cycles,
    levels,
    options,
    promotions,
    classes,
    rooms,
    allStudents,
    schoolSettings,
    setActiveNavTab,
    addClass,
    updateClass,
    deleteClass,
    addOption,
  } = useApp();

  const safeCycles = cycles || [];
  const safeLevels = levels || [];
  const safeOptions = options || [];
  const safePromotions = promotions || [];
  const safeClasses = classes || [];
  const safeRooms = rooms || [];
  const safeStudents = allStudents || [];

  const [activeTab, setActiveTab] = useState<'classes' | 'matrix' | 'options'>('classes');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-com');
  const [searchTerm, setSearchTerm] = useState('');
  const [cycleFilter, setCycleFilter] = useState<'ALL' | 'CYCLE_ORIENTATION' | 'HUMANITES'>('ALL');
  const [optionFilter, setOptionFilter] = useState<string>('ALL');

  // Modal State for Add / Edit Class
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form fields for Class Modal
  const [formPromotionId, setFormPromotionId] = useState<string>('');
  const [formClassName, setFormClassName] = useState<string>('A');
  const [formFullName, setFormFullName] = useState<string>('');
  const [formCapacity, setFormCapacity] = useState<number>(45);
  const [formRoomId, setFormRoomId] = useState<string>('');
  const [formTeacherId, setFormTeacherId] = useState<string>('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Delete Confirmation State
  const [classToDelete, setClassToDelete] = useState<AcademicClass | null>(null);

  // Modal State for New Option
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [newOptionCode, setNewOptionCode] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionDesc, setNewOptionDesc] = useState('');
  const [newOptionSubjects, setNewOptionSubjects] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const activeOption = safeOptions.find((o) => o.id === selectedOptionId) || safeOptions[0] || {
    id: 'opt-com',
    code: 'COM',
    name: 'Commerciale et Gestion',
    description: 'Comptabilité générale, économie, droit des affaires et informatique',
    isActive: true,
    subjects: ['Comptabilité', 'Économie', 'Informatique de gestion', 'Droit'],
    createdAt: '',
  };

  // Open Modal for Creating a New Class
  const handleOpenAddClass = () => {
    setEditingClassId(null);
    const defaultPromo = safePromotions[0]?.id || '';
    setFormPromotionId(defaultPromo);
    setFormClassName('A');
    const promoObj = safePromotions.find((p) => p.id === defaultPromo);
    const generatedName = promoObj ? `${promoObj.name.replace(/ 2026-2027$/, '')} A` : 'Nouvelle Classe A';
    setFormFullName(generatedName);
    setFormCapacity(45);
    setFormRoomId(safeRooms[0]?.id || '');
    setFormTeacherId(TEACHERS_CATALOG[0]?.id || '');
    setFormIsActive(true);
    setIsClassModalOpen(true);
  };

  // Open Modal for Editing an Existing Class
  const handleOpenEditClass = (cls: AcademicClass) => {
    setEditingClassId(cls.id);
    setFormPromotionId(cls.promotionId || (safePromotions[0]?.id || ''));
    setFormClassName(cls.name || 'A');
    setFormFullName(cls.fullName || `${cls.name}`);
    setFormCapacity(cls.capacity || 45);
    setFormRoomId(cls.roomId || '');
    setFormTeacherId(cls.teacherId || '');
    setFormIsActive(cls.isActive !== false);
    setIsClassModalOpen(true);
  };

  // Auto-update full name when promotion or letter changes if user hasn't heavily custom-edited
  const handlePromotionChange = (newPromoId: string) => {
    setFormPromotionId(newPromoId);
    const promoObj = safePromotions.find((p) => p.id === newPromoId);
    if (promoObj) {
      const cleanPromo = promoObj.name.replace(/ 2026-2027$/, '');
      setFormFullName(`${cleanPromo} ${formClassName}`);
    }
  };

  const handleClassNameChange = (newLetter: string) => {
    setFormClassName(newLetter);
    const promoObj = safePromotions.find((p) => p.id === formPromotionId);
    if (promoObj) {
      const cleanPromo = promoObj.name.replace(/ 2026-2027$/, '');
      setFormFullName(`${cleanPromo} ${newLetter}`);
    }
  };

  // Save Class (Add or Edit)
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTeacher = TEACHERS_CATALOG.find((t) => t.id === formTeacherId);
    const selectedRoom = safeRooms.find((r) => r.id === formRoomId);

    const classData = {
      promotionId: formPromotionId,
      name: formClassName.trim().toUpperCase() || 'A',
      fullName: formFullName.trim() || `Classe ${formClassName}`,
      capacity: Number(formCapacity) || 45,
      teacherId: formTeacherId,
      teacherName: selectedTeacher?.name,
      roomId: formRoomId,
      roomName: selectedRoom ? `${selectedRoom.name} (${selectedRoom.code})` : undefined,
      isActive: formIsActive,
    };

    if (editingClassId) {
      updateClass(editingClassId, classData);
      showToast(`✅ La classe "${classData.fullName}" et tout son contexte ont été modifiés avec succès.`);
    } else {
      addClass(classData);
      showToast(`🎉 La nouvelle classe "${classData.fullName}" a été créée avec succès.`);
    }

    setIsClassModalOpen(false);
  };

  // Confirm Delete Class
  const handleConfirmDeleteClass = () => {
    if (!classToDelete) return;
    const res = deleteClass(classToDelete.id);
    if (res.success) {
      showToast(`🗑️ La classe "${classToDelete.fullName}" a été supprimée.`);
    }
    setClassToDelete(null);
  };

  // Save New Option
  const handleSaveOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim() || !newOptionCode.trim()) return;

    const subjectsArr = newOptionSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addOption({
      code: newOptionCode.trim().toUpperCase(),
      name: newOptionName.trim(),
      description: newOptionDesc.trim() || 'Filière d’enseignement secondaire',
      isActive: true,
      subjects: subjectsArr.length > 0 ? subjectsArr : ['Général'],
    });

    showToast(`✨ La filière "${newOptionName}" (${newOptionCode.toUpperCase()}) a été ajoutée.`);
    setIsOptionModalOpen(false);
    setNewOptionCode('');
    setNewOptionName('');
    setNewOptionDesc('');
    setNewOptionSubjects('');
  };

  // Filtered Classes
  const filteredClasses = useMemo(() => {
    return safeClasses.filter((cls) => {
      const promo = safePromotions.find((p) => p.id === cls.promotionId);
      const isCO = promo?.name.includes('C.O') || cls.fullName.includes('C.O');

      // Cycle filter
      if (cycleFilter === 'CYCLE_ORIENTATION' && !isCO) return false;
      if (cycleFilter === 'HUMANITES' && isCO) return false;

      // Option filter
      if (optionFilter !== 'ALL' && promo?.optionId !== optionFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = cls.fullName.toLowerCase().includes(term) || cls.name.toLowerCase().includes(term);
        const matchesRoom = cls.roomId?.toLowerCase().includes(term) || (cls.roomName && cls.roomName.toLowerCase().includes(term));
        const matchesTeacher = cls.teacherName?.toLowerCase().includes(term) || cls.teacherId?.toLowerCase().includes(term);
        if (!matchesName && !matchesRoom && !matchesTeacher) return false;
      }

      return true;
    });
  }, [safeClasses, safePromotions, cycleFilter, optionFilter, searchTerm]);

  // Statistics
  const totalCapacity = safeClasses.reduce((acc, c) => acc + (c.capacity || 0), 0);
  const activeClassesCount = safeClasses.filter((c) => c.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A3A5C] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-indigo-300 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setActiveNavTab('admin-dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Retour au Tableau de Bord</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
              <School className="w-3.5 h-3.5 text-blue-700" />
              <span>{schoolSettings.name} • {schoolSettings.city}</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1A3A5C] flex items-center gap-2">
            <span>🏛️ STRUCTURE ACADÉMIQUE & GESTION INTÉGRALE DES CLASSES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Gestion complète des classes, filières et promotions : modification du nom, de la capacité, des salles de cours et des enseignants titulaires en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-add-class-btn"
            onClick={handleOpenAddClass}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Nouvelle Classe</span>
          </button>

          <button
            id="admin-add-option-btn"
            onClick={() => setIsOptionModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Nouvelle Filière / Option</span>
          </button>

          <button
            id="admin-goto-schedule-btn"
            onClick={() => setActiveNavTab('schedule')}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#1A3A5C] text-white hover:bg-[#12283E] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Grille des Horaires</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Classes Actives</div>
            <div className="text-xl font-black text-slate-900">{activeClassesCount} / {safeClasses.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Capacité Globale</div>
            <div className="text-xl font-black text-slate-900">{totalCapacity} <span className="text-xs font-normal text-slate-500">places</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filières / Options</div>
            <div className="text-xl font-black text-slate-900">{safeOptions.length} <span className="text-xs font-normal text-slate-500">sections</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Salles Assignées</div>
            <div className="text-xl font-black text-slate-900">{safeRooms.length} <span className="text-xs font-normal text-slate-500">locaux</span></div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeTab === 'classes'
              ? 'bg-[#1A3A5C] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Gestion des Classes ({safeClasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-[#1A3A5C] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Matrice Pédagogique des Promotions</span>
        </button>

        <button
          onClick={() => setActiveTab('options')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeTab === 'options'
              ? 'bg-[#1A3A5C] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Filières & Cursus ({safeOptions.length})</span>
        </button>
      </div>

      {/* TAB 1: GESTION DES CLASSES */}
      {activeTab === 'classes' && (
        <div className="space-y-5">
          {/* Filters and Search Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom de classe, salle, titulaire..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Cycle Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setCycleFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    cycleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tous Cycles
                </button>
                <button
                  onClick={() => setCycleFilter('CYCLE_ORIENTATION')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    cycleFilter === 'CYCLE_ORIENTATION' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  C.O (7e-8e)
                </button>
                <button
                  onClick={() => setCycleFilter('HUMANITES')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    cycleFilter === 'HUMANITES' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Humanités (1ère-4ème)
                </button>
              </div>

              {/* Option Dropdown */}
              <select
                value={optionFilter}
                onChange={(e) => setOptionFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Toutes les Filières</option>
                {safeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name} ({opt.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => {
              const promo = safePromotions.find((p) => p.id === cls.promotionId);
              const room = safeRooms.find((r) => r.id === cls.roomId);
              const teacher = TEACHERS_CATALOG.find((t) => t.id === cls.teacherId);
              const isCO = promo?.name.includes('C.O') || cls.fullName.includes('C.O');

              // Count students enrolled in this class
              const enrolledStudents = safeStudents.filter(
                (s) => s.currentClassId === cls.id || s.currentClassName === cls.fullName
              );
              const occupancyRate = Math.min(100, Math.round(((enrolledStudents.length || 38) / (cls.capacity || 45)) * 100));

              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-2xl border-2 transition p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                    cls.isActive !== false ? 'border-slate-200 hover:border-blue-400' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              isCO ? 'bg-blue-100 text-blue-900' : 'bg-indigo-100 text-indigo-900'
                            }`}
                          >
                            {isCO ? "Cycle d'Orientation" : 'Humanités'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            Section {cls.name}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">
                          {cls.fullName}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {promo?.name || 'Promotion 2026-2027'}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cls.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {cls.isActive !== false ? 'Active' : 'Fermée'}
                      </span>
                    </div>

                    {/* Context Details */}
                    <div className="space-y-2 pt-3 text-xs">
                      {/* Room Assignment */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <DoorClosed className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-700">Salle assignée :</span>
                        </div>
                        <span className="font-extrabold text-slate-900 text-right">
                          {room ? `${room.name} (${room.code})` : cls.roomId || 'Salle 12 (Bloc A)'}
                        </span>
                      </div>

                      {/* Teacher Titulaire */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="font-bold text-slate-700">Titulaire :</span>
                        </div>
                        <span className="font-extrabold text-indigo-950 text-right">
                          {teacher ? teacher.name : cls.teacherName || 'Dr. KABEYA Tshilumba'}
                        </span>
                      </div>

                      {/* Capacity & Occupancy Bar */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 font-medium">Effectif / Capacité :</span>
                          <span className="font-black text-slate-900">
                            {enrolledStudents.length || 38} / {cls.capacity || 45} élèves ({occupancyRate}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              occupancyRate > 90
                                ? 'bg-amber-500'
                                : occupancyRate > 75
                                ? 'bg-blue-600'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditClass(cls)}
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Modifier le nom et tout le contexte de cette classe"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>Modifier le contexte</span>
                    </button>

                    <button
                      onClick={() => setClassToDelete(cls)}
                      className="p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                      title="Supprimer la classe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClasses.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-extrabold text-slate-800 text-sm">Aucune classe trouvée</h4>
              <p className="text-xs text-slate-500 mt-1">Ajustez vos filtres ou créez une nouvelle classe.</p>
              <button
                onClick={handleOpenAddClass}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                + Ajouter une Classe
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATRICE PÉDAGOGIQUE */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
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
                    <span className="text-[11px] text-slate-500">Classes actives : {safeClasses.filter((c) => c.fullName.includes('7ème')).map((c) => c.name).join(', ') || 'A, B'} • 6 périodes/jour</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                    Actif
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">8ème Année C.O (8e C.O)</span>
                    <span className="text-[11px] text-slate-500">Classes actives : {safeClasses.filter((c) => c.fullName.includes('8ème')).map((c) => c.name).join(', ') || 'A, B'} • Examen ENAFEP</span>
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
                {safeOptions.map((opt) => (
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
                const promo = safePromotions.find(
                  (p) => p.optionId === activeOption.id && (p.levelId === promoLevelCode || p.name.startsWith(prefix))
                );
                const promoClasses = safeClasses.filter((c) => promo && c.promotionId === promo.id);

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
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Classes Rattachées :
                        </span>
                        <button
                          onClick={handleOpenAddClass}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                        >
                          + Ajouter
                        </button>
                      </div>

                      {promoClasses.length > 0 ? (
                        <div className="space-y-1">
                          {promoClasses.map((cls) => (
                            <div
                              key={cls.id}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-indigo-50/50 transition cursor-pointer"
                              onClick={() => handleOpenEditClass(cls)}
                            >
                              <span className="font-bold text-slate-800">Classe {cls.name}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono text-slate-500">
                                  {cls.capacity} pl.
                                </span>
                                <Edit2 className="w-3 h-3 text-slate-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
                          Classe A (45 places) • Configurée
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FILIÈRES & OPTIONS */}
      {activeTab === 'options' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Filières & Options Officielles de l'Établissement
              </h2>
              <p className="text-xs text-slate-500">
                Chaque option définit les matières fondamentales et structure le parcours des élèves.
              </p>
            </div>
            <button
              onClick={() => setIsOptionModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une Filière</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeOptions.map((opt) => {
              const optClasses = safeClasses.filter((c) => {
                const promo = safePromotions.find((p) => p.id === c.promotionId);
                return promo?.optionId === opt.id || c.fullName.includes(opt.name);
              });

              return (
                <div
                  key={opt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-mono font-black text-xs">
                        {opt.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Filière Active
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{opt.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{opt.description}</p>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Matières Principales :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(opt.subjects || []).map((sub, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {optClasses.length} classe(s) ouverte(s)
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        setActiveTab('classes');
                        setOptionFilter(opt.id);
                      }}
                      className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Voir les classes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJOUTER / MODIFIER UNE CLASSE (TOUT LE CONTEXTE)                  */}
      {/* ========================================================================= */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {editingClassId ? 'Modifier le contexte complet de la classe' : 'Créer une Nouvelle Classe'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Définissez la promotion, le nom complet, la salle, le titulaire et la capacité
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
              {/* Promotion / Level Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Promotion / Niveau de rattachement <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formPromotionId}
                  onChange={(e) => handlePromotionChange(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {safePromotions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Sélectionnez le niveau académique (Cycle d'Orientation ou Humanités avec option).
                </span>
              </div>

              {/* Class Letter & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Section / Lettre <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formClassName}
                    onChange={(e) => handleClassNameChange(e.target.value)}
                    required
                    placeholder="Ex: A, B, C"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-center uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Nom complet officiel de la classe <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    required
                    placeholder="Ex: 4ème Commerciale et Gestion A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Room & Teacher Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Room */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <DoorClosed className="w-3.5 h-3.5 text-blue-600" />
                    <span>4. Salle de classe assignée</span>
                  </label>
                  <select
                    value={formRoomId}
                    onChange={(e) => setFormRoomId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Aucune salle assignée --</option>
                    {safeRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code}) • Capacité: {r.capacity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher Titulaire */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>5. Enseignant Titulaire</span>
                  </label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Aucun titulaire assigné --</option>
                    {TEACHERS_CATALOG.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    6. Capacité maximale (Élèves) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    7. Statut de fonctionnement
                  </label>
                  <select
                    value={formIsActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setFormIsActive(e.target.value === 'ACTIVE')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active (Inscriptions & Cours autorisés)</option>
                    <option value="INACTIVE">Fermée / En veille</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1.5">
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">
                  Aperçu de la fiche de classe générée :
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">{formFullName || 'Nom de la classe'}</span>
                    <div className="text-[11px] text-slate-600">
                      Salle : {safeRooms.find((r) => r.id === formRoomId)?.name || 'Non définie'} • Titulaire : {TEACHERS_CATALOG.find((t) => t.id === formTeacherId)?.name || 'Non défini'}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white text-blue-900 border border-blue-200 rounded-lg text-xs font-mono font-bold">
                    {formCapacity} places
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-extrabold bg-[#1A3A5C] text-white hover:bg-[#12283E] transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{editingClassId ? 'Enregistrer les modifications' : 'Créer la classe'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOUVELLE FILIÈRE / OPTION                                         */}
      {/* ========================================================================= */}
      {isOptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">
                  Créer une Nouvelle Filière / Option
                </h3>
              </div>
              <button
                onClick={() => setIsOptionModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOption} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Code officiel (Abréviation) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOptionCode}
                  onChange={(e) => setNewOptionCode(e.target.value)}
                  placeholder="Ex: ELEC, AGRI, NUTR"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intitulé complet de la filière <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  placeholder="Ex: Électricité Générale"
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description pédagogique
                </label>
                <textarea
                  value={newOptionDesc}
                  onChange={(e) => setNewOptionDesc(e.target.value)}
                  rows={2}
                  placeholder="Description des compétences et débouchés..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Matières principales (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={newOptionSubjects}
                  onChange={(e) => setNewOptionSubjects(e.target.value)}
                  placeholder="Ex: Électrotechnique, Schémas, Mesures, Mathématiques"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-xs"
                >
                  Ajouter la filière
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMATION SUPPRESSION DE CLASSE                                  */}
      {/* ========================================================================= */}
      {classToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Supprimer la classe ?
                </h3>
                <p className="text-xs text-slate-500">Cette opération est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-rose-50/70 p-3 rounded-xl border border-rose-200">
              Êtes-vous sûr de vouloir supprimer définitivement la classe{' '}
              <strong className="text-slate-900">"{classToDelete.fullName}"</strong> ?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setClassToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeleteClass}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

