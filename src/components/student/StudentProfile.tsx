import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  Eye,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  FileText,
  Camera,
  Edit3,
  Save,
  X,
  UploadCloud,
} from 'lucide-react';
import { OfficialDocumentViewer } from './OfficialDocumentViewer';
import { FaceVerificationResult } from '../../types';

export const StudentProfile: React.FC = () => {
  const { currentStudent, currentPerson, academicHistory, updateStudentProfile, updateStudentPhoto, verifyUploadedFace, schoolSettings } = useApp();
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Profile Edit State
  const [phone, setPhone] = useState(currentPerson.phone || '+243 89 123 4567');
  const [email, setEmail] = useState(currentPerson.email || 'oromasis.bakalayeto@lisanga.edu.cd');
  const [address, setAddress] = useState(currentPerson.address || 'Av. Mobutu n° 45, Commune de Matadi, Ville de Matadi');
  const [emergencyName, setEmergencyName] = useState(currentPerson.emergencyContact?.fullName || 'Jean BAKALAYETO');
  const [emergencyPhone, setEmergencyPhone] = useState(currentPerson.emergencyContact?.phone || '+243 81 555 6789');
  const [emergencyRelation, setEmergencyRelation] = useState(currentPerson.emergencyContact?.relationship || 'Père');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // AI Facial Verification State
  const [isVerifyingFace, setIsVerifyingFace] = useState(false);
  const [faceResult, setFaceResult] = useState<FaceVerificationResult | null>(null);
  const [pendingUploadDataUrl, setPendingUploadDataUrl] = useState<string | null>(null);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPendingUploadDataUrl(base64);
      setIsVerifyingFace(true);
      setFaceResult(null);

      const result = await verifyUploadedFace(base64);
      setIsVerifyingFace(false);
      setFaceResult(result);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmVerifiedPhoto = () => {
    if (pendingUploadDataUrl) {
      updateStudentPhoto(pendingUploadDataUrl);
      setIsPhotoModalOpen(false);
      setPendingUploadDataUrl(null);
      setFaceResult(null);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const handleSaveCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      phone,
      email,
      address,
      emergencyContact: {
        fullName: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRelation,
      },
    });
    setIsEditingProfile(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleSelectPresetPhoto = (url: string) => {
    updateStudentPhoto(url);
    setIsPhotoModalOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleCustomPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPhotoUrl.trim()) {
      updateStudentPhoto(customPhotoUrl.trim());
      setIsPhotoModalOpen(false);
      setCustomPhotoUrl('');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-700 text-white shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>Vos coordonnées et profil ont été mis à jour avec succès !</span>
        </div>
      )}

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            <span>👤 MON PROFIL ÉLÈVE & COORDONNÉES</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dossier académique, coordonnées personnelles et photo officielle • Institut Lisanga Matadi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1A3A5C] hover:bg-[#12283E] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Modifier Coordonnées</span>
          </button>
          <button
            onClick={() => setSelectedDocType('carte')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1A3A5C] text-xs font-bold transition border border-slate-300 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Carte d’Élève</span>
          </button>
        </div>
      </div>

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group">
            <img
              src={currentPerson.photoUrl}
              alt={currentPerson.fullName}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-100 shadow-md group-hover:opacity-90 transition"
            />
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              title="Changer ma photo de profil"
              className="absolute inset-0 bg-slate-950/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] font-bold transition backdrop-blur-xs gap-1"
            >
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Changer Photo</span>
            </button>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-emerald-600 text-white font-bold text-[11px] rounded-full border-2 border-white shadow-xs">
              ACTIF ✅
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentPerson.fullName}
              </h2>
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-bold rounded-lg self-center sm:self-auto">
                Matricule : {currentStudent.matricule}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#1A3A5C]">
              Classe : {currentStudent.currentClassName}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Année Académique : <strong>2026-2027</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Statut Dossier : <strong className="text-emerald-700">ACTIVE ✅</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Téléphone : <strong>{currentPerson.phone || phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Email Institutionnel : <strong>{currentPerson.email || email}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Coordonnées & Personne de Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3A5C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Résidence & Adresse à Matadi</span>
            </h3>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Éditer
            </button>
          </div>
          <div className="text-xs space-y-2 text-slate-700">
            <p className="leading-relaxed">
              <strong>Adresse de domicile :</strong><br />
              {currentPerson.address || address}
            </p>
            <p>
              <strong>Ville :</strong> Matadi (Kongo Central, RDC)
            </p>
            <p>
              <strong>Nationalité :</strong> {currentPerson.nationality || 'Congolaise (RDC)'}
            </p>
            <p>
              <strong>Lieu de Naissance :</strong> {currentPerson.birthPlace || 'Matadi'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3A5C] flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Contact d’Urgence / Responsable</span>
            </h3>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Éditer
            </button>
          </div>
          <div className="text-xs space-y-2 text-slate-700">
            <p>
              <strong>Nom du Responsable :</strong><br />
              {currentPerson.emergencyContact?.fullName || emergencyName}
            </p>
            <p>
              <strong>Lien de parenté :</strong> {currentPerson.emergencyContact?.relationship || emergencyRelation}
            </p>
            <p>
              <strong>Téléphone d'urgence :</strong><br />
              <span className="font-mono font-bold text-slate-900">{currentPerson.emergencyContact?.phone || emergencyPhone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Official Documents & History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Documents Administratifs & Scolaires Officiels (Matadi)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedDocType('carte')}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition text-left space-y-1"
          >
            <span className="text-xs font-bold text-slate-900 block">🪪 Carte d’Élève Biométrique</span>
            <span className="text-[11px] text-slate-500 block">Avec QR code, matricule permanent et photo</span>
          </button>

          <button
            onClick={() => setSelectedDocType('attestation')}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition text-left space-y-1"
          >
            <span className="text-xs font-bold text-slate-900 block">📜 Attestation de Fréquentation</span>
            <span className="text-[11px] text-slate-500 block">Signée par le Chef d’Établissement</span>
          </button>

          <button
            onClick={() => setSelectedDocType('releve')}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition text-left space-y-1"
          >
            <span className="text-xs font-bold text-slate-900 block">📊 Relevé Trimestriel</span>
            <span className="text-[11px] text-slate-500 block">Bulletin synthétique certifié</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Mettre à jour mes Coordonnées (Élève)
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoordinates} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone de l'Élève :</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email :</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Adresse de Domicile à Matadi :</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-800 text-[11px] uppercase">
                  Contact Responsable / Urgence
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nom :</label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Lien :</label>
                    <input
                      type="text"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Téléphone :</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1A3A5C] hover:bg-[#12283E] text-white rounded-xl font-bold shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Enregistrer Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Picker Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Changer ma Photo de Profil Officielle
                </h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option 1: File Upload & Biometric Check */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    <span>1. Importer un fichier photo (Vérification Biométrique IA)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    IA Active
                  </span>
                </label>
                
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1A3A5C] file:text-white hover:file:bg-[#12283E] file:cursor-pointer cursor-pointer"
                />

                {isVerifyingFace && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold text-[11px]">Vérification du visage par le modèle biométrique en cours...</span>
                  </div>
                )}

                {faceResult && (
                  <div
                    className={`p-3.5 rounded-xl border ${
                      faceResult.isValidFace
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {faceResult.isValidFace ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Camera className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{faceResult.isValidFace ? 'Visage Valide Conforme' : 'Avertissement Biomécanique'}</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/90 border border-slate-200">
                        Score : {typeof faceResult.confidenceScore === 'number' && !isNaN(faceResult.confidenceScore) ? Math.round(faceResult.confidenceScore * 100) : 95}%
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-[11px] leading-relaxed font-medium">
                      {faceResult.message || (faceResult.isValidFace ? 'Photo conforme aux standards biométriques scolaires.' : 'La photo ne satisfait pas tous les critères de cadrage.')}
                    </p>

                    {/* Breakdown Badges */}
                    {faceResult.details && (
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 font-semibold text-slate-700">
                          Éclairage : {faceResult.details.lighting === 'GOOD' ? 'Optimal' : faceResult.details.lighting === 'ACCEPTABLE' ? 'Acceptable' : 'Faible'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 font-semibold text-slate-700">
                          Cadrage : {faceResult.details.framing === 'GOOD' ? 'Centré' : faceResult.details.framing === 'TOO_FAR' ? 'Trop éloigné' : 'À ajuster'}
                        </span>
                        {faceResult.details.expression && (
                          <span className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 font-semibold text-slate-700">
                            Expression : {faceResult.details.expression}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Preview & Action */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200/60">
                      {pendingUploadDataUrl && (
                        <div className="flex items-center gap-2">
                          <img
                            src={pendingUploadDataUrl}
                            alt="Aperçu"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-300"
                          />
                          <span className="text-[10px] text-slate-600 font-medium">Aperçu prêt</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleConfirmVerifiedPhoto}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Adopter cette photo officielle</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Option 2: Presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  2. Ou sélectionner parmi les photos de profil disponibles :
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarPresets.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPresetPhoto(url)}
                      className="group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-amber-500 focus:border-amber-500 transition aspect-square"
                    >
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-[10px]">
                        Choisir
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Custom URL */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 mb-1">
                  3. Ou saisir une URL d'image directe :
                </label>
                <form onSubmit={handleCustomPhotoSubmit} className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#1A3A5C] text-white rounded-xl font-bold hover:bg-[#12283E] transition"
                  >
                    Valider
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Document Viewer Modal */}
      {selectedDocType && (
        <OfficialDocumentViewer
          docType={selectedDocType}
          onClose={() => setSelectedDocType(null)}
        />
      )}
    </div>
  );
};
