import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  ArrowLeft,
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  X,
  BookOpen,
} from 'lucide-react';

export const AdminStudentsManagement: React.FC = () => {
  const { allStudents, addStudent, updateStudent, deleteStudent, classes, setActiveNavTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    matricule: '',
    firstName: '',
    lastName: '',
    gender: 'M' as 'M' | 'F',
    birthDate: '2008-04-15',
    birthPlace: 'Matadi, RDC',
    nationality: 'Congolaise (RDC)',
    currentClassId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'EXPELLED' | 'TRANSFERRED' | 'GRADUATED',
    enrollmentYear: '2026-2027',
    parentName: '',
    parentPhone: '+243 ',
    address: 'Matadi, Kongo Central',
  });

  // Filtered students
  const filteredStudents = useMemo(() => {
    return allStudents.filter((s) => {
      const matchSearch =
        (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.currentClassName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = filterClass === 'ALL' || s.currentClassId === filterClass || s.currentClassName === filterClass;
      const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;

      return matchSearch && matchClass && matchStatus;
    });
  }, [allStudents, searchTerm, filterClass, filterStatus]);

  // Open add modal
  const handleOpenAdd = () => {
    const nextNum = allStudents.length + 1;
    const defaultClass = classes[0];
    setFormState({
      matricule: `LIS-2026-${String(nextNum).padStart(4, '0')}`,
      firstName: '',
      lastName: '',
      gender: 'M',
      birthDate: '2008-05-12',
      birthPlace: 'Matadi',
      nationality: 'Congolaise (RDC)',
      currentClassId: defaultClass?.id || '',
      status: 'ACTIVE',
      enrollmentYear: '2026-2027',
      parentName: '',
      parentPhone: '+243 ',
      address: 'Matadi, Kongo Central',
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    const parts = (student.name || '').split(' ');
    const first = parts.slice(1).join(' ') || parts[0] || '';
    const last = parts[0] || '';

    setFormState({
      matricule: student.matricule,
      firstName: first,
      lastName: last,
      gender: (student.gender as any) || 'M',
      birthDate: student.birthDate || '2008-04-15',
      birthPlace: student.birthPlace || 'Matadi',
      nationality: student.nationality || 'Congolaise (RDC)',
      currentClassId: student.currentClassId || '',
      status: student.status,
      enrollmentYear: student.enrollmentYear || '2026-2027',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '+243 ',
      address: student.address || '',
    });
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.lastName) return;

    const assignedClass = classes.find((c) => c.id === formState.currentClassId);
    const resolvedClassName = assignedClass?.fullName || 'Non assigné';
    const fullName = formState.firstName ? `${formState.lastName} ${formState.firstName}` : formState.lastName;

    if (editingStudent) {
      updateStudent(
        editingStudent.id,
        {
          matricule: formState.matricule,
          name: fullName,
          currentClassId: formState.currentClassId,
          currentClassName: resolvedClassName,
          status: formState.status,
          gender: formState.gender,
          birthDate: formState.birthDate,
          birthPlace: formState.birthPlace,
          nationality: formState.nationality,
          parentName: formState.parentName,
          parentPhone: formState.parentPhone,
          address: formState.address,
          enrollmentYear: formState.enrollmentYear,
        },
        {
          firstName: formState.firstName,
          lastName: formState.lastName,
          gender: formState.gender,
          birthDate: formState.birthDate,
          birthPlace: formState.birthPlace,
          nationality: formState.nationality,
          address: formState.address,
        }
      );
      setEditingStudent(null);
    } else {
      addStudent(
        {
          personId: `person-${Date.now()}`,
          matricule: formState.matricule,
          name: fullName,
          currentClassId: formState.currentClassId,
          currentClassName: resolvedClassName,
          status: formState.status,
          gender: formState.gender,
          birthDate: formState.birthDate,
          birthPlace: formState.birthPlace,
          nationality: formState.nationality,
          parentName: formState.parentName,
          parentPhone: formState.parentPhone,
          address: formState.address,
          enrollmentYear: formState.enrollmentYear,
        },
        {
          firstName: formState.firstName,
          lastName: formState.lastName,
          gender: formState.gender,
          birthDate: formState.birthDate,
          birthPlace: formState.birthPlace,
          nationality: formState.nationality,
          address: formState.address,
        }
      );
      setIsAddModalOpen(false);
    }
  };

  const activeCount = allStudents.filter((s) => s.status === 'ACTIVE').length;
  const boysCount = allStudents.filter((s) => s.gender === 'M' || !s.gender).length;
  const girlsCount = allStudents.filter((s) => s.gender === 'F').length;

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
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span>GESTION DES ÉLÈVES & EFFECTIFS SCOLAIRES</span>
            </h1>
            <p className="text-xs text-slate-500">
              Contrôle total du registre matricule • Inscriptions, affectations de classe & statuts
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A3A5C] hover:bg-[#122A42] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>Nouvel Élève</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Élèves Inscrits
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {allStudents.length}
          </div>
          <div className="text-xs text-blue-700 font-semibold mt-1">
            {activeCount} élèves actifs
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Garçons / Filles
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-1">
            {boysCount}G / {girlsCount}F
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {allStudents.length > 0 ? `${Math.round((girlsCount / allStudents.length) * 100)}% de filles` : '0%'}
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Classes Actives
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
            {classes.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Salles de classe configurées</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Année Académique
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1A3A5C] mt-1">
            2026-2027
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">En cours (Trimestre 1)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom d'élève, matricule LIS-..., classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#1A3A5C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-hidden font-medium text-slate-700 max-w-[200px]"
            >
              <option value="ALL">Toutes les classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName}
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
            <option value="ACTIVE">Actif</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="EXPELLED">Exclu</option>
            <option value="TRANSFERRED">Transféré</option>
            <option value="GRADUATED">Diplômé</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span>Registre Officiel des Élèves</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              {filteredStudents.length}
            </span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Modifiable à 100% par la Direction
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Aucun élève trouvé</p>
            <p className="text-xs text-slate-400 mt-1">
              {allStudents.length === 0
                ? "L'établissement n'a aucun élève enregistré pour le moment. Cliquez sur 'Nouvel Élève' pour inscrire le premier élève."
                : 'Modifiez vos filtres ou critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="p-4.5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                    {(student.name || 'E').charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {student.name || 'Élève Sans Nom'}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                        {student.matricule}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          student.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : student.status === 'SUSPENDED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status === 'ACTIVE' ? 'INSCRIT & ACTIF' : student.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1A3A5C] bg-slate-100 px-2 py-0.5 rounded-md">
                        {student.currentClassName || 'Classe non assignée'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        Genre : {student.gender === 'F' ? 'Féminin' : 'Masculin'}
                      </span>
                      {student.birthDate && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">Né(e) le {student.birthDate}</span>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-4 flex-wrap">
                      {student.parentName && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-slate-600">Tuteur :</span> {student.parentName}
                        </span>
                      )}
                      {student.parentPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {student.parentPhone}
                        </span>
                      )}
                      {student.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {student.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleOpenEdit(student)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => setDeletingStudentId(student.id)}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-red-600 transition cursor-pointer"
                    title="Supprimer l'élève"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#1A3A5C]" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingStudent ? `Modifier l'élève : ${editingStudent.name || editingStudent.matricule}` : 'Inscrire un Nouvel Élève'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              {/* Row 1: Matricule & Statut & Année */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Matricule Scolaire</label>
                  <input
                    type="text"
                    required
                    value={formState.matricule}
                    onChange={(e) => setFormState({ ...formState, matricule: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Statut Scolaire</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="ACTIVE">Actif / En Règle</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="EXPELLED">Exclu</option>
                    <option value="TRANSFERRED">Transféré</option>
                    <option value="GRADUATED">Diplômé</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Année Scolaire</label>
                  <input
                    type="text"
                    value={formState.enrollmentYear}
                    onChange={(e) => setFormState({ ...formState, enrollmentYear: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Row 2: Nom & Prénom & Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nom de Famille / Post-nom</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: KINKELA"
                    value={formState.lastName}
                    onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prénom(s)</label>
                  <input
                    type="text"
                    placeholder="ex: Oromasis Junior"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Genre</label>
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value as 'M' | 'F' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="M">Masculin (Garçon)</option>
                    <option value="F">Féminin (Fille)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Classe d'affectation */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Affectation dans une Classe
                </label>
                <select
                  value={formState.currentClassId}
                  onChange={(e) => setFormState({ ...formState, currentClassId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-[#1A3A5C]"
                >
                  <option value="">Sélectionner une classe...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} (Capacité : {c.capacity} places)
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Naissance & Nationalité */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date de Naissance</label>
                  <input
                    type="date"
                    value={formState.birthDate}
                    onChange={(e) => setFormState({ ...formState, birthDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lieu de Naissance</label>
                  <input
                    type="text"
                    placeholder="Matadi, Kongo Central"
                    value={formState.birthPlace}
                    onChange={(e) => setFormState({ ...formState, birthPlace: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nationalité</label>
                  <input
                    type="text"
                    value={formState.nationality}
                    onChange={(e) => setFormState({ ...formState, nationality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 5: Parents / Tuteur & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nom du Parent / Responsable</label>
                  <input
                    type="text"
                    placeholder="M. Pierre KINKELA"
                    value={formState.parentName}
                    onChange={(e) => setFormState({ ...formState, parentName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Téléphone d'Urgence / Parent</label>
                  <input
                    type="text"
                    placeholder="+243 89 000 0000"
                    value={formState.parentPhone}
                    onChange={(e) => setFormState({ ...formState, parentPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 6: Adresse */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Adresse de Résidence (Matadi)</label>
                <input
                  type="text"
                  placeholder="ex: Quartier Ville Haute, Av. du Port N° 45, Matadi"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3A5C] text-white font-bold rounded-xl hover:bg-[#122A42] transition shadow-xs"
                >
                  {editingStudent ? 'Enregistrer les Modifications' : 'Confirmer l’Inscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingStudentId && (
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
                  Cette action supprimera l'élève et ses dossiers scolaires.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Êtes-vous sûr de vouloir supprimer cet élève du registre de l'Institut Lisanga ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteStudent(deletingStudentId);
                  setDeletingStudentId(null);
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
