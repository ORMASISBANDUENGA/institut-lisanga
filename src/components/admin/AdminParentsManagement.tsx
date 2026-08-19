import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Parent } from '../../types';
import {
  ArrowLeft,
  HeartHandshake,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertTriangle,
  X,
  Users,
  ShieldAlert,
} from 'lucide-react';

export const AdminParentsManagement: React.FC = () => {
  const { parents, addParent, updateParent, deleteParent, allStudents, setActiveNavTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [deletingParentId, setDeletingParentId] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    matricule: '',
    firstName: '',
    lastName: '',
    relationship: 'Père' as 'Père' | 'Mère' | 'Tuteur Légal' | 'Oncle / Tante' | 'Grand-parent',
    phone: '',
    email: '',
    profession: '',
    address: 'Matadi, Kongo Central',
    emergencyContact: true,
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED' | 'INACTIVE',
    linkedStudentIds: [] as string[],
  });

  // Filtered Parents
  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      const matchSearch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.profession || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchRel = filterRelationship === 'ALL' || p.relationship === filterRelationship;
      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;

      return matchSearch && matchRel && matchStatus;
    });
  }, [parents, searchTerm, filterRelationship, filterStatus]);

  // Open add modal
  const handleOpenAdd = () => {
    const nextNum = parents.length + 1;
    setFormState({
      matricule: `PAR-2026-${String(nextNum).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      relationship: 'Père',
      phone: '+243 ',
      email: '',
      profession: 'Cadre Commercial',
      address: 'Matadi, Kongo Central',
      emergencyContact: true,
      status: 'ACTIVE',
      linkedStudentIds: allStudents.length > 0 ? [allStudents[0].id] : [],
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (parent: Parent) => {
    setEditingParent(parent);
    setFormState({
      matricule: parent.matricule,
      firstName: parent.firstName,
      lastName: parent.lastName,
      relationship: (parent.relationship as any) || 'Père',
      phone: parent.phone,
      email: parent.email,
      profession: parent.profession || '',
      address: parent.address || '',
      emergencyContact: parent.emergencyContact,
      status: parent.status,
      linkedStudentIds: [...(parent.linkedStudentIds || [])],
    });
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.firstName || !formState.lastName) return;

    const fullName = `${formState.firstName} ${formState.lastName}`;

    if (editingParent) {
      updateParent(editingParent.id, {
        matricule: formState.matricule,
        firstName: formState.firstName,
        lastName: formState.lastName,
        fullName,
        relationship: formState.relationship,
        phone: formState.phone,
        email: formState.email || `${formState.firstName.toLowerCase()}.${formState.lastName.toLowerCase()}@gmail.com`,
        profession: formState.profession,
        address: formState.address,
        emergencyContact: formState.emergencyContact,
        status: formState.status,
        linkedStudentIds: formState.linkedStudentIds,
      });
      setEditingParent(null);
    } else {
      addParent({
        matricule: formState.matricule,
        firstName: formState.firstName,
        lastName: formState.lastName,
        fullName,
        relationship: formState.relationship,
        phone: formState.phone,
        email: formState.email || `${formState.firstName.toLowerCase()}.${formState.lastName.toLowerCase()}@gmail.com`,
        profession: formState.profession,
        address: formState.address,
        emergencyContact: formState.emergencyContact,
        status: formState.status,
        linkedStudentIds: formState.linkedStudentIds,
      });
      setIsAddModalOpen(false);
    }
  };

  const toggleStudentLink = (studentId: string) => {
    setFormState((prev) => {
      const exists = prev.linkedStudentIds.includes(studentId);
      return {
        ...prev,
        linkedStudentIds: exists
          ? prev.linkedStudentIds.filter((id) => id !== studentId)
          : [...prev.linkedStudentIds, studentId],
      };
    });
  };

  const activeParentsCount = parents.filter((p) => p.status === 'ACTIVE').length;
  const emergencyCount = parents.filter((p) => p.emergencyContact).length;

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
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
              <span>GESTION DES PARENTS & RESPONSABLES LÉGAUX</span>
            </h1>
            <p className="text-xs text-slate-500">
              Contrôle total des tuteurs légaux • Liens de parenté, communications & urgences
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A3A5C] hover:bg-[#122A42] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>Nouveau Parent</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Parents Inscrits
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {parents.length}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            {activeParentsCount} comptes actifs
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Contacts d'Urgence
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
            {emergencyCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Rejoignables 24h/24</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Pères & Mères
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
            {parents.filter((p) => p.relationship === 'Père' || p.relationship === 'Mère').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Géniteurs directs</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Tuteurs & Famille
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-1">
            {parents.filter((p) => p.relationship !== 'Père' && p.relationship !== 'Mère').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Tuteurs légaux & famille</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom de parent, matricule PAR-..., téléphone, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#1A3A5C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterRelationship}
              onChange={(e) => setFilterRelationship(e.target.value)}
              className="text-xs bg-transparent border-none focus:outline-hidden font-medium text-slate-700"
            >
              <option value="ALL">Tous les liens de parenté</option>
              <option value="Père">Père</option>
              <option value="Mère">Mère</option>
              <option value="Tuteur Légal">Tuteur Légal</option>
              <option value="Oncle / Tante">Oncle / Tante</option>
              <option value="Grand-parent">Grand-parent</option>
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
            <option value="INACTIVE">Inactif</option>
          </select>
        </div>
      </div>

      {/* Parents List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <span>Annuaire des Responsables Légaux</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {filteredParents.length}
            </span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Modifiable à 100% par la Direction
          </span>
        </div>

        {filteredParents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <HeartHandshake className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Aucun parent trouvé</p>
            <p className="text-xs text-slate-400 mt-1">
              {parents.length === 0
                ? "L'établissement n'a aucun parent enregistré pour le moment. Cliquez sur 'Nouveau Parent' pour créer un premier compte responsable."
                : 'Modifiez vos filtres ou critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredParents.map((parent) => {
              const linkedStudents = allStudents.filter((s) =>
                (parent.linkedStudentIds || []).includes(s.id)
              );

              return (
                <div
                  key={parent.id}
                  className="p-4.5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                      {parent.firstName.charAt(0)}
                      {parent.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {parent.fullName}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {parent.matricule}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {parent.relationship}
                        </span>
                        {parent.emergencyContact && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Urgence
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            parent.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {parent.status === 'ACTIVE' ? 'ACTIF' : parent.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                        {parent.profession && (
                          <>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Briefcase className="w-3 h-3 text-slate-400" />
                              {parent.profession}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        {parent.address && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {parent.address}
                          </span>
                        )}
                      </div>

                      {/* Linked Children Chips */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Élèves rattachés :
                        </span>
                        {linkedStudents.length > 0 ? (
                          linkedStudents.map((stud) => (
                            <span
                              key={stud.id}
                              className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold"
                            >
                              {stud.name} ({stud.currentClassName || 'Sans classe'})
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Aucun élève rattaché pour l'instant
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {parent.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {parent.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEdit(parent)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>

                    <button
                      onClick={() => setDeletingParentId(parent.id)}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-300 text-red-600 transition cursor-pointer"
                      title="Supprimer le responsable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Parent Modal */}
      {(isAddModalOpen || editingParent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingParent ? `Modifier le parent : ${editingParent.fullName}` : 'Ajouter un Nouveau Responsable Légal'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingParent(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              {/* Row 1: Matricule & Lien & Statut */}
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
                  <label className="font-bold text-slate-700 block mb-1">Lien de Parenté</label>
                  <select
                    value={formState.relationship}
                    onChange={(e) => setFormState({ ...formState, relationship: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Père">Père</option>
                    <option value="Mère">Mère</option>
                    <option value="Tuteur Légal">Tuteur Légal</option>
                    <option value="Oncle / Tante">Oncle / Tante</option>
                    <option value="Grand-parent">Grand-parent</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Statut du Compte</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="INACTIVE">Inactif</option>
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
                    placeholder="ex: Pierre"
                    value={formState.firstName}
                    onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

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
              </div>

              {/* Row 3: Téléphone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Téléphone Mobile (SMS / Appel)</label>
                  <input
                    type="text"
                    required
                    placeholder="+243 89 000 0000"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adresse Email</label>
                  <input
                    type="email"
                    placeholder="parent@gmail.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Profession & Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Profession / Activité</label>
                  <input
                    type="text"
                    placeholder="ex: Fonctionnaire ONATRA / Cadre Bancaire"
                    value={formState.profession}
                    onChange={(e) => setFormState({ ...formState, profession: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adresse Résidentielle</label>
                  <input
                    type="text"
                    placeholder="ex: Quartier Ville Haute, Matadi"
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Row 5: Emergency Contact checkbox */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="emergencyContact"
                  checked={formState.emergencyContact}
                  onChange={(e) => setFormState({ ...formState, emergencyContact: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                <label htmlFor="emergencyContact" className="text-xs font-semibold text-amber-900 cursor-pointer">
                  Définir ce responsable comme contact d'urgence prioritaire (joignable 24h/24 par l'école)
                </label>
              </div>

              {/* Row 6: Multi-select Linked Students */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Élève(s) rattaché(s) à ce responsable ({formState.linkedStudentIds.length})
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50 max-h-36 overflow-y-auto">
                  {allStudents.map((stud) => {
                    const isSelected = formState.linkedStudentIds.includes(stud.id);
                    return (
                      <button
                        type="button"
                        key={stud.id}
                        onClick={() => toggleStudentLink(stud.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span>{stud.name}</span>
                        <span className="text-[10px] opacity-80">({stud.matricule})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingParent(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3A5C] text-white font-bold rounded-xl hover:bg-[#122A42] transition shadow-xs"
                >
                  {editingParent ? 'Enregistrer les Modifications' : 'Créer le Responsable Légal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingParentId && (
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
                  Cette action supprimera le parent et ses liens avec les élèves.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Êtes-vous sûr de vouloir supprimer ce compte responsable de l'Institut Lisanga ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingParentId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteParent(deletingParentId);
                  setDeletingParentId(null);
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
