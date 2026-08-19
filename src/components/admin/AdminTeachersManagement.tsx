import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  DollarSign,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  X,
  Plus,
} from 'lucide-react';

export const AdminTeachersManagement: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, classes, setActiveNavTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    matricule: '',
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    phone: '',
    email: '',
    specialty: '',
    qualification: '',
    contractType: 'PERMANENT' as 'PERMANENT' | 'TEMPORAIRE' | 'VACATAIRE',
    baseSalaryUSD: 400,
    status: 'ACTIVE' as 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'SUSPENDED',
    assignedClasses: [] as string[],
    assignedSubjects: [] as string[],
    hireDate: new Date().toISOString().split('T')[0],
    address: '',
  });

  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // Available subjects presets
  const availableSubjectPresets = [
    'Mathématiques',
    'Comptabilité Générale',
    'Comptabilité Analytique',
    'Économie Politique',
    'Informatique de Gestion',
    'Français & Grammaire',
    'Droit Commercial OHADA',
    'Physique',
    'Chimie Générale',
    'Anglais Commercial',
    'Géographie du Congo',
    'Histoire',
    'Éducation Civique & Morale',
  ];

  // Specialties list
  const specialties = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => {
      if (t.specialty) set.add(t.specialty);
    });
    return Array.from(set);
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSpec = filterSpecialty === 'ALL' || t.specialty === filterSpecialty;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;

      return matchSearch && matchSpec && matchStatus;
    });
  }, [teachers, searchTerm, filterSpecialty, filterStatus]);

  // Open add modal
  const handleOpenAdd = () => {
    const nextNum = teachers.length + 1;
    setFormState({
      matricule: `ENS-2026-${String(nextNum).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      gender: 'M',
      phone: '+243 ',
      email: '',
      specialty: 'Mathématiques & Sciences',
      qualification: 'Licencié en Sciences / ISP',
      contractType: 'PERMANENT',
      baseSalaryUSD: 400,
      status: 'ACTIVE',
      assignedClasses: [],
      assignedSubjects: ['Mathématiques'],
      hireDate: new Date().toISOString().split('T')[0],
      address: 'Matadi, Kongo Central',
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormState({
      matricule: teacher.matricule,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      gender: teacher.gender || 'M',
      phone: teacher.phone,
      email: teacher.email,
      specialty: teacher.specialty,
      qualification: teacher.qualification,
      contractType: teacher.contractType,
      baseSalaryUSD: teacher.baseSalaryUSD || 400,
      status: teacher.status,
      assignedClasses: [...(teacher.assignedClasses || [])],
      assignedSubjects: [...(teacher.assignedSubjects || [])],
      hireDate: teacher.hireDate || new Date().toISOString().split('T')[0],
      address: teacher.address || '',
    });
  };

  // Handle Save (Add or Edit)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.firstName || !formState.lastName) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        matricule: formState.matricule,
        firstName: formState.firstName,
        lastName: formState.lastName,
        gender: formState.gender,
        phone: formState.phone,
        email: formState.email || `${formState.firstName.toLowerCase()}.${formState.lastName.toLowerCase()}@lisanga.edu.cd`,
        specialty: formState.specialty,
        qualification: formState.qualification,
        contractType: formState.contractType,
        baseSalaryUSD: Number(formState.baseSalaryUSD),
        status: formState.status,
        assignedClasses: formState.assignedClasses,
        assignedSubjects: formState.assignedSubjects,
        hireDate: formState.hireDate,
        address: formState.address,
      });
      setEditingTeacher(null);
    } else {
      addTeacher({
        matricule: formState.matricule,
        firstName: formState.firstName,
        lastName: formState.lastName,
        fullName: `${formState.gender === 'F' ? 'Mme' : 'Prof.'} ${formState.firstName} ${formState.lastName}`,
        gender: formState.gender,
        phone: formState.phone,
        email: formState.email || `${formState.firstName.toLowerCase()}.${formState.lastName.toLowerCase()}@lisanga.edu.cd`,
        specialty: formState.specialty,
        qualification: formState.qualification,
        contractType: formState.contractType,
        baseSalaryUSD: Number(formState.baseSalaryUSD),
        status: formState.status,
        assignedClasses: formState.assignedClasses,
        assignedSubjects: formState.assignedSubjects,
        hireDate: formState.hireDate,
        address: formState.address,
      });
      setIsAddModalOpen(false);
    }
  };

  const toggleClassAssignment = (className: string) => {
    setFormState((prev) => {
      const exists = prev.assignedClasses.includes(className);
      return {
        ...prev,
        assignedClasses: exists
          ? prev.assignedClasses.filter((c) => c !== className)
          : [...prev.assignedClasses, className],
      };
    });
  };

  const toggleSubjectAssignment = (subj: string) => {
    setFormState((prev) => {
      const exists = prev.assignedSubjects.includes(subj);
      return {
        ...prev,
        assignedSubjects: exists
          ? prev.assignedSubjects.filter((s) => s !== subj)
          : [...prev.assignedSubjects, subj],
      };
    });
  };

  const handleAddCustomSubject = () => {
    if (!customSubjectInput.trim()) return;
    if (!formState.assignedSubjects.includes(customSubjectInput.trim())) {
      setFormState((prev) => ({
        ...prev,
        assignedSubjects: [...prev.assignedSubjects, customSubjectInput.trim()],
      }));
    }
    setCustomSubjectInput('');
  };

  const totalPayroll = teachers.reduce((acc, t) => acc + (t.baseSalaryUSD || 0), 0);
  const activeTeachersCount = teachers.filter((t) => t.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar with Return Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNavTab('admin-dashboard')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#1A3A5C] transition shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Retour au Tableau de Bord</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>GESTION DES ENSEIGNANTS & CORPS PROFESSORAL</span>
            </h1>
            <p className="text-xs text-slate-500">
              Contrôle total du corps enseignant • Qualifications, salaires, affectations & cours
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A3A5C] hover:bg-[#122A42] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>Nouvel Enseignant</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Enseignants
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {teachers.length}
          </div>
          <div className="text-xs text-purple-700 font-semibold mt-1">
            {activeTeachersCount} actifs en service
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Masse Salariale Base
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            ${totalPayroll.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Mensuel budgétisé</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Classes Desservies
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
            {classes.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Cycle d'Orientation & Humanités</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Statut des Contrats
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-1">
            {teachers.filter((t) => t.contractType === 'PERMANENT').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Permanents & Titulaires</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, matricule, spécialité, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#1A3A5C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-hidden font-medium text-slate-700"
            >
              <option value="ALL">Toutes les spécialités</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="ON_LEAVE">En congé</option>
            <option value="SUSPENDED">Suspendus</option>
            <option value="RESIGNED">Démissionnaires</option>
          </select>
        </div>
      </div>

      {/* Teachers List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span>Liste Complète des Enseignants</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              {filteredTeachers.length}
            </span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Modifiable à 100% par la Direction
          </span>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Aucun enseignant trouvé</p>
            <p className="text-xs text-slate-400 mt-1">
              {teachers.length === 0
                ? "L'établissement n'a aucun enseignant enregistré pour le moment. Cliquez sur 'Nouvel Enseignant' pour commencer."
                : 'Modifiez vos filtres ou critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-4.5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1A3A5C] to-[#2E5B88] text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                    {teacher.firstName.charAt(0)}
                    {teacher.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {teacher.fullName}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        {teacher.matricule}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          teacher.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : teacher.status === 'ON_LEAVE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {teacher.status === 'ACTIVE'
                          ? 'ACTIF'
                          : teacher.status === 'ON_LEAVE'
                          ? 'EN CONGÉ'
                          : teacher.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-purple-700">
                        {teacher.specialty}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">{teacher.qualification}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        ${teacher.baseSalaryUSD || 0}/mois
                      </span>
                    </div>

                    {/* Classes and Subjects tags */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                        teacher.assignedClasses.map((cls) => (
                          <span
                            key={cls}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold"
                          >
                            {cls}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          Aucune classe assignée
                        </span>
                      )}
                      {teacher.assignedSubjects &&
                        teacher.assignedSubjects.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {teacher.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {teacher.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(teacher)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => setDeletingTeacherId(teacher.id)}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-red-600 transition cursor-pointer"
                    title="Supprimer l'enseignant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      {(isAddModalOpen || editingTeacher) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1A3A5C]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingTeacher ? `Modifier l'enseignant : ${editingTeacher.fullName}` : 'Ajouter un Nouvel Enseignant'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingTeacher(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              {/* Row 1: Matricule & Genre & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Matricule</label>
                  <input
                    type="text"
                    required
                    value={formState.matricule}
                    onChange={(e) => setFormState({ ...formState, matricule: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Genre</label>
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value as 'M' | 'F' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="M">Masculin (M)</option>
                    <option value="F">Féminin (F)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Statut d'Activité</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="ACTIVE">Actif en service</option>
                    <option value="ON_LEAVE">En congé</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="RESIGNED">Démissionnaire</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Prénom & Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dieudonné"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nom / Post-nom</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: KABEYA"
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white uppercase font-bold"
                  />
                </div>
              </div>

              {/* Row 3: Spécialité & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Spécialité & Domaine</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mathématiques & Informatique"
                    value={formState.specialty}
                    onChange={(e) => setFormState({ ...formState, specialty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diplôme & Qualification</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Licencié en Sciences Commerciales (ISC)"
                    value={formState.qualification}
                    onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Salaire & Contrat & Tél */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Salaire de Base (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formState.baseSalaryUSD}
                    onChange={(e) => setFormState({ ...formState, baseSalaryUSD: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type de Contrat</label>
                  <select
                    value={formState.contractType}
                    onChange={(e) => setFormState({ ...formState, contractType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="PERMANENT">Permanent (Titulaire)</option>
                    <option value="TEMPORAIRE">Temporaire</option>
                    <option value="VACATAIRE">Vacataire / Horaire</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+243 89 000 0000"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 5: Email & Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Institutionnel</label>
                  <input
                    type="email"
                    placeholder="enseignant@lisanga.edu.cd"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adresse Résidentielle (Matadi)</label>
                  <input
                    type="text"
                    placeholder="Av. Mobutu N° 12, Matadi"
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 6: Assigned Classes Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Classes Assignées ({formState.assignedClasses.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50 max-h-32 overflow-y-auto">
                  {classes.map((c) => {
                    const isSelected = formState.assignedClasses.includes(c.fullName);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleClassAssignment(c.fullName)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A3A5C] text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {c.fullName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 7: Assigned Subjects Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Matières / Cours Enseignés ({formState.assignedSubjects.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50 max-h-32 overflow-y-auto mb-2">
                  {availableSubjectPresets.map((subj) => {
                    const isSelected = formState.assignedSubjects.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        onClick={() => toggleSubjectAssignment(subj)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-purple-700 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une autre matière..."
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3A5C] text-white font-bold rounded-xl hover:bg-[#122A42] transition shadow-xs"
                >
                  {editingTeacher ? 'Enregistrer les Modifications' : 'Créer l’Enseignant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTeacherId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Confirmer la suppression
                </h3>
                <p className="text-xs text-slate-500">
                  Cette action supprimera l'enseignant et ses affectations.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Êtes-vous sûr de vouloir supprimer cet enseignant de l'Institut Lisanga ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingTeacherId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteTeacher(deletingTeacherId);
                  setDeletingTeacherId(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Confirmer la Suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
