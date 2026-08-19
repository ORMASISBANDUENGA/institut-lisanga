import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserAccount } from '../../types';
import {
  GraduationCap,
  Lock,
  User,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  School,
  ArrowRight,
  Shield,
  Smartphone,
  HelpCircle,
  UserCheck,
  Users,
  Briefcase,
  Layers,
  ChevronRight,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';

type AuthMode = 'LOGIN' | 'STUDENT_REGISTER' | 'TEACHER_REGISTER' | 'PARENT_REGISTER';
type RolePortal = 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN';

export const LoginScreen: React.FC = () => {
  const {
    loginWithCredentials,
    verify2FACode,
    changeUserPassword,
    requestPasswordReset,
    confirmPasswordReset,
    activateStudentAccount,
    activateTeacherAccount,
    activateParentAccount,
    login,
    schoolSettings,
  } = useApp();

  // Selected Role Portal
  const [selectedRole, setSelectedRole] = useState<RolePortal>('STUDENT');
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');

  // Login Form State - No prefilled password
  const [username, setUsername] = useState('LIS-2023-0123');
  const [password, setPassword] = useState('');
  const [parentName, setParentName] = useState('Jean BAKALAYETO');
  const [childMatricule, setChildMatricule] = useState('LIS-2023-0123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Registration / First-time activation states
  const [regStudentMatricule, setRegStudentMatricule] = useState('');
  const [regStudentPassword, setRegStudentPassword] = useState('');
  const [regStudentConfirmPass, setRegStudentConfirmPass] = useState('');

  const [regTeacherName, setRegTeacherName] = useState('');
  const [regTeacherPassword, setRegTeacherPassword] = useState('');
  const [regTeacherConfirmPass, setRegTeacherConfirmPass] = useState('');

  const [regParentFullName, setRegParentFullName] = useState('');
  const [regParentChildMatricule, setRegParentChildMatricule] = useState('');
  const [regParentPassword, setRegParentPassword] = useState('');
  const [regParentConfirmPass, setRegParentConfirmPass] = useState('');

  // 2FA Modal State
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);

  // Forced Password Change Modal State
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotAccountName, setForgotAccountName] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Handle role switch - Strictly keeps password empty
  const handleSelectRole = (role: RolePortal) => {
    setSelectedRole(role);
    setAuthMode('LOGIN');
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword(''); // Never prefill password
    if (role === 'STUDENT') {
      setUsername('LIS-2023-0123');
    } else if (role === 'ADMIN') {
      setUsername('admin');
    } else if (role === 'TEACHER') {
      setUsername('dr.kabeya@lisanga.edu.cd');
    } else if (role === 'PARENT') {
      setUsername('jean.bakalayeto@email.com');
      setParentName('Jean BAKALAYETO');
      setChildMatricule('LIS-2023-0123');
    }
  };

  // Standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password.trim()) {
      setErrorMessage('Veuillez saisir votre mot de passe pour continuer.');
      return;
    }

    setIsLoading(true);
    const loginId = selectedRole === 'PARENT' ? (parentName.trim() || username.trim()) : username.trim();

    try {
      const result = await loginWithCredentials(loginId, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.message || 'Accès refusé : Identifiant ou mot de passe incorrect.');
        return;
      }

      if (result.requiresPasswordChange && result.user) {
        setPendingUser(result.user);
        setIsPasswordChangeModalOpen(true);
        return;
      }

      if (result.requires2FA) {
        if (result.user) setPendingUser(result.user);
        setIs2FAModalOpen(true);
        return;
      }

      if (result.user) {
        login(result.user);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Erreur lors de la tentative de connexion.');
    }
  };

  // Student First-Time Registration Submit
  const handleStudentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regStudentPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (regStudentPassword !== regStudentConfirmPass) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const result = await activateStudentAccount(regStudentMatricule, '', regStudentPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      if (result.user) {
        setTimeout(() => {
          login(result.user!);
        }, 1200);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  // Teacher First-Time Registration Submit
  const handleTeacherRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regTeacherPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (regTeacherPassword !== regTeacherConfirmPass) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const result = await activateTeacherAccount(regTeacherName, regTeacherPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      if (result.user) {
        setTimeout(() => {
          login(result.user!);
        }, 1200);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  // Parent Registration Submit
  const handleParentRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regParentPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (regParentPassword !== regParentConfirmPass) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const result = await activateParentAccount(regParentFullName, regParentChildMatricule, regParentPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      if (result.user) {
        setTimeout(() => {
          login(result.user!);
        }, 1200);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  // Forgot Password - Step 1: Request code
  const handleForgotRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    setIsLoading(true);

    const result = await requestPasswordReset(forgotIdentifier);
    setIsLoading(false);

    if (result.success) {
      setForgotAccountName(result.accountName || forgotIdentifier);
      setForgotStep(2);
      setForgotSuccess(result.message);
      setForgotCode('123456'); // Pre-fill verification code for smooth UX
    } else {
      setForgotError(result.message);
    }
  };

  // Forgot Password - Step 2: Confirm new password
  const handleForgotConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (forgotNewPassword.length < 6) {
      setForgotError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPass) {
      setForgotError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    const result = await confirmPasswordReset(forgotIdentifier, forgotCode, forgotNewPassword);
    setIsLoading(false);

    if (result.success) {
      setForgotSuccess(result.message);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setForgotIdentifier('');
        setSuccessMessage('Mot de passe mis à jour ! Vous pouvez maintenant vous connecter.');
      }, 1500);
    } else {
      setForgotError(result.message);
    }
  };

  // 2FA Submit
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const valid = await verify2FACode(twoFACode);
    setIsLoading(false);

    if (valid) {
      if (pendingUser) login(pendingUser);
      setIs2FAModalOpen(false);
    } else {
      setErrorMessage('Code 2FA invalide. Saisissez le code à 6 chiffres.');
    }
  };

  // Forced Password Change Submit
  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (pendingUser) {
      setIsLoading(true);
      await changeUserPassword(pendingUser.id, newPassword);
      setIsLoading(false);
      login(pendingUser);
      setIsPasswordChangeModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1A3A5C] to-slate-900 flex flex-col justify-between p-4 sm:p-6 text-slate-100">
      {/* Top Branding Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
            L
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
              <span>INSTITUT LISANGA</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono">MATADI</span>
            </div>
            <p className="text-[11px] text-slate-400">Portail Académique & Espace Numérique Sécurisé • Kongo Central</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vérification Base de Données & Contrôle d'Accès IAM</span>
        </div>
      </div>

      {/* Main Login / Registration Container */}
      <div className="max-w-lg mx-auto w-full my-auto py-6">
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/60 space-y-5">
          
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-extrabold text-[#1A3A5C]">
              Portail Institutionnel Lisanga
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Veuillez sélectionner votre profil pour accéder à votre espace dédié
            </p>
          </div>

          {/* Role Portal Selector ("Se connecter en tant que...") */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
              Se connecter en tant que :
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('STUDENT')}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  selectedRole === 'STUDENT'
                    ? 'bg-[#1A3A5C] text-white border-[#1A3A5C] shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <GraduationCap className={`w-5 h-5 mb-1 ${selectedRole === 'STUDENT' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span className="text-[11px] font-bold">Élève</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('PARENT')}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  selectedRole === 'PARENT'
                    ? 'bg-[#1A3A5C] text-white border-[#1A3A5C] shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <Users className={`w-5 h-5 mb-1 ${selectedRole === 'PARENT' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span className="text-[11px] font-bold">Parent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('TEACHER')}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  selectedRole === 'TEACHER'
                    ? 'bg-[#1A3A5C] text-white border-[#1A3A5C] shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <Briefcase className={`w-5 h-5 mb-1 ${selectedRole === 'TEACHER' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span className="text-[11px] font-bold">Professeur</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN')}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                  selectedRole === 'ADMIN'
                    ? 'bg-[#1A3A5C] text-white border-[#1A3A5C] shadow-md shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <School className={`w-5 h-5 mb-1 ${selectedRole === 'ADMIN' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span className="text-[11px] font-bold">Direction</span>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* MODE 1: STANDARD LOGIN FORM */}
          {authMode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {selectedRole === 'PARENT' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nom complet du Parent / Tuteur :
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Ex : Jean BAKALAYETO"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#1A3A5C] text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">
                        Mot de passe ou Matricule de l'enfant :
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotIdentifier(parentName);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#1A3A5C] font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                        required
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {selectedRole === 'STUDENT' && 'Matricule Scolaire Officiel :'}
                      {selectedRole === 'TEACHER' && 'Email ou Identifiant Enseignant :'}
                      {selectedRole === 'ADMIN' && 'Identifiant de Direction :'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={
                          selectedRole === 'STUDENT'
                            ? 'Ex : LIS-2023-0123'
                            : selectedRole === 'TEACHER'
                            ? 'Ex : dr.kabeya@lisanga.edu.cd ou Prof. TUMBA'
                            : 'Ex : admin'
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#1A3A5C] font-mono text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Mot de Passe :</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotIdentifier(username);
                          setIsForgotModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-blue-700 hover:underline"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-[#1A3A5C] font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-hidden"
                        required
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-login-btn"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1A3A5C] hover:bg-[#12283E] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {isLoading ? 'Vérification en cours...' : `Accéder à l'Espace ${selectedRole === 'STUDENT' ? 'Élève' : selectedRole === 'PARENT' ? 'Parent' : selectedRole === 'TEACHER' ? 'Professeur' : 'Direction'}`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* First-time Registration Activation Links based on Role */}
              <div className="pt-3 border-t border-slate-100 text-center">
                {selectedRole === 'STUDENT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('STUDENT_REGISTER');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-blue-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Première connexion ? Activer mon compte élève</span>
                  </button>
                )}

                {selectedRole === 'TEACHER' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('TEACHER_REGISTER');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-blue-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Nouvel enseignant ? Première inscription & mot de passe privé</span>
                  </button>
                )}

                {selectedRole === 'PARENT' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('PARENT_REGISTER');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-blue-700 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Nouveau parent ? Créer mon compte lié à mon enfant</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* MODE 2: STUDENT FIRST-TIME ACTIVATION */}
          {authMode === 'STUDENT_REGISTER' && (
            <form onSubmit={handleStudentRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200">
                <p className="font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <span>Activation du Compte Élève Officiel</span>
                </p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Seuls les élèves préalablement enregistrés dans la base de données de l'Institut Lisanga peuvent activer leur espace.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Matricule Scolaire Officiel * :
                </label>
                <input
                  type="text"
                  value={regStudentMatricule}
                  onChange={(e) => setRegStudentMatricule(e.target.value)}
                  placeholder="Ex : LIS-2023-0123"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Définir votre Mot de Passe Privé * :
                </label>
                <input
                  type="password"
                  value={regStudentPassword}
                  onChange={(e) => setRegStudentPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirmer le Mot de Passe * :
                </label>
                <input
                  type="password"
                  value={regStudentConfirmPass}
                  onChange={(e) => setRegStudentConfirmPass(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition"
                >
                  {isLoading ? 'Vérification...' : 'Valider & Activer'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: TEACHER FIRST-TIME ACTIVATION */}
          {authMode === 'TEACHER_REGISTER' && (
            <form onSubmit={handleTeacherRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  <span>Première Inscription Enseignant</span>
                </p>
                <p className="text-[11px] text-amber-700 mt-1">
                  Votre nom doit avoir été préalablement ajouté dans la liste officielle des enseignants par la Direction.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nom ou Email Enseignant Répertorié * :
                </label>
                <input
                  type="text"
                  value={regTeacherName}
                  onChange={(e) => setRegTeacherName(e.target.value)}
                  placeholder="Ex : Dr. KABEYA ou Prof. TUMBA"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Définir votre Mot de Passe Privé * :
                </label>
                <input
                  type="password"
                  value={regTeacherPassword}
                  onChange={(e) => setRegTeacherPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirmer le Mot de Passe * :
                </label>
                <input
                  type="password"
                  value={regTeacherConfirmPass}
                  onChange={(e) => setRegTeacherConfirmPass(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-md transition"
                >
                  {isLoading ? 'Vérification...' : 'Valider & Activer'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: PARENT FIRST-TIME ACTIVATION */}
          {authMode === 'PARENT_REGISTER' && (
            <form onSubmit={handleParentRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-700" />
                  <span>Création de Compte Parent / Tuteur</span>
                </p>
                <p className="text-[11px] text-indigo-700 mt-1">
                  Le matricule de votre enfant sera vérifié dans les dossiers scolaires avant d'associer votre compte.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Votre Nom et Prénom complet * :
                </label>
                <input
                  type="text"
                  value={regParentFullName}
                  onChange={(e) => setRegParentFullName(e.target.value)}
                  placeholder="Ex : Jean BAKALAYETO"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Matricule Officiel de l'Élève (Enfant) * :
                </label>
                <input
                  type="text"
                  value={regParentChildMatricule}
                  onChange={(e) => setRegParentChildMatricule(e.target.value)}
                  placeholder="Ex : LIS-2023-0123"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Définir votre Mot de Passe Privé * :
                </label>
                <input
                  type="password"
                  value={regParentPassword}
                  onChange={(e) => setRegParentPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirmer le Mot de Passe * :
                </label>
                <input
                  type="password"
                  value={regParentConfirmPass}
                  onChange={(e) => setRegParentConfirmPass(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('LOGIN')}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold shadow-md transition"
                >
                  {isLoading ? 'Vérification...' : 'Créer & Associer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* MODAL: MOT DE PASSE OUBLIÉ (FORGOT PASSWORD) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Récupération de Mot de Passe
                  </h3>
                  <p className="text-[11px] text-slate-500">Institut Lisanga • Service de Sécurité</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotStep(1);
                  setForgotError(null);
                  setForgotSuccess(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotRequestCode} className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Saisissez votre matricule scolaire officiel, email ou identifiant enregistré.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Matricule / Identifiant :
                  </label>
                  <input
                    type="text"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Ex: LIS-2023-0123, admin, dr.kabeya"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 bg-[#1A3A5C] text-white font-bold rounded-xl shadow-md hover:bg-[#12283E] transition"
                  >
                    {isLoading ? 'Recherche...' : 'Vérifier & Continuer'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotConfirmReset} className="space-y-3.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  Compte identifié : <strong className="text-slate-900">{forgotAccountName}</strong>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Code de Vérification à 6 Chiffres :
                  </label>
                  <input
                    type="text"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-center font-mono font-extrabold text-lg tracking-widest text-[#1A3A5C] focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nouveau Mot de Passe Privé :
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Confirmer le Nouveau Mot de Passe :
                  </label>
                  <input
                    type="password"
                    value={forgotConfirmPass}
                    onChange={(e) => setForgotConfirmPass(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
                  >
                    {isLoading ? 'Mise à jour...' : 'Réinitialiser & Enregistrer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2FA Verification Modal */}
      {is2FAModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Authentification à Deux Facteurs (2FA)
              </h3>
              <p className="text-xs text-slate-500">
                Saisissez le code temporaire envoyé à votre appareil.
              </p>
            </div>

            <form onSubmit={handle2FASubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-center">
                  Code de Sécurité à 6 Chiffres :
                </label>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full p-3 rounded-xl border border-slate-200 text-center font-mono font-extrabold text-xl tracking-widest text-[#1A3A5C]"
                  autoFocus
                  required
                />
                <p className="text-[11px] text-slate-400 text-center mt-1">
                  (Code sécurisé : <strong>123456</strong>)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A3A5C] text-white rounded-xl font-bold shadow-md hover:bg-[#12283E]"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forced Password Change Modal */}
      {isPasswordChangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Activation du Compte & Nouveau Mot de Passe
              </h3>
              <p className="text-xs text-slate-500">
                Première connexion requise : Veuillez définir votre mot de passe personnel sécurisé.
              </p>
            </div>

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nouveau Mot de Passe :</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirmer le Mot de Passe :</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répéter le mot de passe"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A3A5C] text-white rounded-xl font-bold shadow-md hover:bg-[#12283E]"
                >
                  Enregistrer & Accéder au Portail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400 py-3">
        © 2026 Institut Lisanga • Ville de Matadi, Province du Kongo Central, RDC. Tous droits réservés.
      </div>
    </div>
  );
};
