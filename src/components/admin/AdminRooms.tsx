import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Room, RoomStatus, RoomType } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  Tv,
  Wifi,
  Sparkles,
  X,
  Edit3,
  Trash2,
  Wind,
  Layers,
  Users,
  Info,
  Check,
} from 'lucide-react';

export const AdminRooms: React.FC = () => {
  const { rooms, reservations, addReservation, addRoom, updateRoom, deleteRoom } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Reservation Modal State
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'room-12');
  const [reservationDay, setReservationDay] = useState('Lundi');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [subject, setSubject] = useState('Comptabilité Générale');
  const [teacherName, setTeacherName] = useState('Mme. TSHALA');
  const [reserveResult, setReserveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Edit / Create Room Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState<{
    code: string;
    name: string;
    building: string;
    floor: string;
    capacity: number;
    roomType: RoomType;
    status: RoomStatus;
    hasProjector: boolean;
    hasWhiteboard: boolean;
    hasComputers: boolean;
    hasAirConditioning: boolean;
    hasWifi: boolean;
    description: string;
  }>({
    code: '',
    name: '',
    building: 'Bâtiment Principal',
    floor: 'Rez-de-chaussée',
    capacity: 40,
    roomType: 'COURSE',
    status: 'AVAILABLE',
    hasProjector: true,
    hasWhiteboard: true,
    hasComputers: false,
    hasAirConditioning: false,
    hasWifi: true,
    description: '',
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = filterBuilding === 'ALL' || r.building === filterBuilding;
    const matchesType = filterType === 'ALL' || r.roomType === filterType || (r as any).type === filterType;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingRoomId(null);
    setRoomFormData({
      code: `SAL-${String(rooms.length + 1).padStart(2, '0')}`,
      name: `Salle ${rooms.length + 1}`,
      building: 'Bloc A',
      floor: '1er étage',
      capacity: 45,
      roomType: 'COURSE',
      status: 'AVAILABLE',
      hasProjector: true,
      hasWhiteboard: true,
      hasComputers: false,
      hasAirConditioning: true,
      hasWifi: true,
      description: 'Salle de cours climatisée avec vidéoprojecteur.',
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoomId(room.id);
    setRoomFormData({
      code: room.code,
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity || 30,
      roomType: room.roomType || (room as any).type || 'COURSE',
      status: room.status || 'AVAILABLE',
      hasProjector: !!room.hasProjector,
      hasWhiteboard: !!room.hasWhiteboard,
      hasComputers: !!room.hasComputers,
      hasAirConditioning: !!room.hasAirConditioning,
      hasWifi: !!room.hasWifi,
      description: room.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name.trim() || !roomFormData.code.trim()) {
      showNotification('error', 'Le nom et le code de la salle sont obligatoires.');
      return;
    }

    if (editingRoomId) {
      // Update existing room
      updateRoom(editingRoomId, {
        name: roomFormData.name.trim(),
        code: roomFormData.code.trim().toUpperCase(),
        building: roomFormData.building.trim(),
        floor: roomFormData.floor.trim(),
        capacity: Number(roomFormData.capacity) || 30,
        roomType: roomFormData.roomType,
        status: roomFormData.status,
        hasProjector: roomFormData.hasProjector,
        hasWhiteboard: roomFormData.hasWhiteboard,
        hasComputers: roomFormData.hasComputers,
        hasAirConditioning: roomFormData.hasAirConditioning,
        hasWifi: roomFormData.hasWifi,
        description: roomFormData.description.trim(),
      });
      showNotification('success', `La salle "${roomFormData.name}" a été modifiée avec succès.`);
    } else {
      // Create new room
      addRoom({
        name: roomFormData.name.trim(),
        code: roomFormData.code.trim().toUpperCase(),
        building: roomFormData.building.trim(),
        floor: roomFormData.floor.trim(),
        capacity: Number(roomFormData.capacity) || 30,
        roomType: roomFormData.roomType,
        status: roomFormData.status,
        hasProjector: roomFormData.hasProjector,
        hasWhiteboard: roomFormData.hasWhiteboard,
        hasComputers: roomFormData.hasComputers,
        hasAirConditioning: roomFormData.hasAirConditioning,
        hasWifi: roomFormData.hasWifi,
        description: roomFormData.description.trim(),
      });
      showNotification('success', `Nouvelle salle "${roomFormData.name}" (${roomFormData.code}) créée avec succès.`);
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteOrClose = (roomId: string, roomName: string) => {
    if (window.confirm(`Confirmez-vous la fermeture / archivage de la salle "${roomName}" ?`)) {
      deleteRoom(roomId);
      showNotification('success', `La salle "${roomName}" a été fermée.`);
    }
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addReservation({
      roomId: selectedRoomId,
      dayOfWeek: reservationDay as any,
      startTime,
      endTime,
      subject,
      teacherName,
      type: 'COURSE',
    });
    setReserveResult(res);
    if (res.success) {
      setTimeout(() => {
        setIsReserveModalOpen(false);
        setReserveResult(null);
        showNotification('success', `Créneau validé pour ${subject} en ${rooms.find(r => r.id === selectedRoomId)?.name || 'salle'}`);
      }, 1500);
    }
  };

  // Distinct buildings list for filter
  const allBuildings = Array.from(new Set(rooms.map((r) => r.building).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-rose-600 text-white shadow-rose-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-200" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Gestion des Salles & Infrastructures</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administration complète des locaux, affectations de bâtiments et détection automatique des conflits d'horaires
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreateModal}
            id="add-room-btn"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Salle</span>
          </button>

          <button
            onClick={() => setIsReserveModalOpen(true)}
            id="reserve-room-btn"
            className="px-4 py-2 bg-[#1A3A5C] text-white hover:bg-[#152E4A] text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Programmer un Cours</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full lg:w-auto flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher par nom de salle, code, bâtiment (ex: Salle 12, Bloc A, Labo)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs w-full focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Tous les Bâtiments</option>
            {allBuildings.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Tous les Types</option>
            <option value="COURSE">Salles de cours standard</option>
            <option value="LAB">Laboratoires Informatique / Sciences</option>
            <option value="CONFERENCE">Salles de conférence</option>
            <option value="EXAM">Salles d'examen</option>
            <option value="OFFICE">Bureaux administratifs</option>
            <option value="OTHER">Autres espaces</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="OCCUPIED">Occupée</option>
            <option value="MAINTENANCE">En maintenance</option>
            <option value="CLOSED">Fermée / Archivée</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const roomReservations = reservations.filter((r) => r.roomId === room.id);
          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">
                    {room.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={room.status} type="room" />
                    <button
                      onClick={() => handleOpenEditModal(room)}
                      title="Modifier les informations de cette salle"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{room.name}</h3>
                
                <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    <strong>{room.building}</strong> • {room.floor}
                  </span>
                </div>

                {room.description && (
                  <p className="text-[11px] text-slate-500 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {room.description}
                  </p>
                )}

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Capacité d'accueil :
                  </span>
                  <span className="font-bold text-slate-900">{room.capacity} places assises</span>
                </div>

                {/* Equipment Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {room.hasProjector && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold flex items-center gap-1 border border-blue-100">
                      <Tv className="w-3 h-3 text-blue-500" />
                      <span>Projecteur HD</span>
                    </span>
                  )}
                  {room.hasWhiteboard && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-semibold flex items-center gap-1 border border-indigo-100">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>Tableau Blanc</span>
                    </span>
                  )}
                  {room.hasComputers && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-semibold flex items-center gap-1 border border-emerald-100">
                      <Laptop className="w-3 h-3 text-emerald-500" />
                      <span>Postes PC</span>
                    </span>
                  )}
                  {room.hasAirConditioning && (
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-md text-[10px] font-semibold flex items-center gap-1 border border-cyan-100">
                      <Wind className="w-3 h-3 text-cyan-500" />
                      <span>Climatisation</span>
                    </span>
                  )}
                  {room.hasWifi && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-[10px] font-semibold flex items-center gap-1 border border-amber-100">
                      <Wifi className="w-3 h-3 text-amber-600" />
                      <span>Wi-Fi Haut Débit</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Reservations count and quick trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">
                  {roomReservations.length} créneau{roomReservations.length > 1 ? 'x' : ''} assigné{roomReservations.length > 1 ? 's' : ''}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(room)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setIsReserveModalOpen(true);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-[#1A3A5C] hover:bg-[#122A42] rounded-lg transition shadow-xs"
                  >
                    Planifier
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <Building2 className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold">Aucune salle ne correspond à vos critères de recherche.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterBuilding('ALL');
              setFilterType('ALL');
              setFilterStatus('ALL');
            }}
            className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* EDIT / CREATE ROOM MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingRoomId ? 'Modifier les Informations de la Salle' : 'Ajouter une Nouvelle Salle'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configuration des caractéristiques physiques, du bâtiment et des équipements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom de la Salle * :</label>
                  <input
                    type="text"
                    value={roomFormData.name}
                    onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                    placeholder="Ex: Salle 12 (Bloc A), Labo Informatique"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code / Référence * :</label>
                  <input
                    type="text"
                    value={roomFormData.code}
                    onChange={(e) => setRoomFormData({ ...roomFormData, code: e.target.value })}
                    placeholder="Ex: SAL-12, LAB-INFO-01"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bâtiment / Emplacement * :</label>
                  <input
                    type="text"
                    value={roomFormData.building}
                    onChange={(e) => setRoomFormData({ ...roomFormData, building: e.target.value })}
                    placeholder="Ex: Bloc A, Bâtiment Principal, Bloc C"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Étage :</label>
                  <select
                    value={roomFormData.floor}
                    onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option>Rez-de-chaussée</option>
                    <option>1er étage</option>
                    <option>2ème étage</option>
                    <option>3ème étage</option>
                    <option>Sous-sol</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacité (Places assises) * :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={roomFormData.capacity}
                    onChange={(e) => setRoomFormData({ ...roomFormData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type d'Espace :</label>
                  <select
                    value={roomFormData.roomType}
                    onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value as RoomType })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="COURSE">Salle de cours standard</option>
                    <option value="LAB">Laboratoire (Info / Sciences)</option>
                    <option value="CONFERENCE">Salle de conférence / Réunion</option>
                    <option value="EXAM">Salle d'évaluation / Examen</option>
                    <option value="OFFICE">Bureau administratif / Direction</option>
                    <option value="OTHER">Autre usage pédagogique</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut Opérationnel :</label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value as RoomStatus })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="AVAILABLE">🟢 Disponible</option>
                    <option value="OCCUPIED">🟡 Occupée</option>
                    <option value="MAINTENANCE">🟠 En maintenance</option>
                    <option value="CLOSED">🔴 Fermée / Inactive</option>
                  </select>
                </div>
              </div>

              {/* Equipment Checkboxes */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Équipements et Commodités Disponibles :</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={roomFormData.hasProjector}
                      onChange={(e) => setRoomFormData({ ...roomFormData, hasProjector: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">Projecteur HD</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={roomFormData.hasWhiteboard}
                      onChange={(e) => setRoomFormData({ ...roomFormData, hasWhiteboard: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">Tableau Blanc</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={roomFormData.hasComputers}
                      onChange={(e) => setRoomFormData({ ...roomFormData, hasComputers: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">Postes PC / Ordinateurs</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={roomFormData.hasAirConditioning}
                      onChange={(e) => setRoomFormData({ ...roomFormData, hasAirConditioning: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">Climatisation</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={roomFormData.hasWifi}
                      onChange={(e) => setRoomFormData({ ...roomFormData, hasWifi: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">Wi-Fi Haut Débit</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes et Description Complémentaire :</label>
                <textarea
                  rows={2}
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                  placeholder="Détails supplémentaires sur l'accès, le mobilier ou les consignes d'entretien..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingRoomId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteOrClose(editingRoomId, roomFormData.name)}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Fermer cette salle</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1A3A5C] hover:bg-[#122A42] text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>{editingRoomId ? 'Enregistrer les Modifications' : 'Créer la Salle'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Modal with Conflict Checking */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Affectation & Réservation d’une Salle
                  </h3>
                  <p className="text-[11px] text-slate-500">Planification des cours et examens</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsReserveModalOpen(false);
                  setReserveResult(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reserveResult && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  reserveResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {reserveResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{reserveResult.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateReservation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Salle concernée :</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} - {r.name} ({r.building}, {r.capacity} places)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jour :</label>
                  <select
                    value={reservationDay}
                    onChange={(e) => setReservationDay(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option>Lundi</option>
                    <option>Mardi</option>
                    <option>Mercredi</option>
                    <option>Jeudi</option>
                    <option>Vendredi</option>
                    <option>Samedi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Début :</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fin :</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière / Événement :</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Mathématiques Générales, Économie"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enseignant responsable :</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Ex: Dr. KABEYA, Prof. TUMBA"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-[11px] leading-relaxed border border-blue-200">
                🛡️ Le moteur Lisanga vérifie en temps réel qu'aucun autre cours ou examen n'occupe cette salle sur le même créneau horaire.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A3A5C] hover:bg-[#122A42] text-white font-bold rounded-xl shadow-xs transition"
                >
                  Vérifier & Valider Créneau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
