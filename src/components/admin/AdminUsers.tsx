import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { UserStatus } from '../../types';
import {
  ShieldCheck,
  Users,
  Search,
  Lock,
  Unlock,
  Mail,
  UserX,
  UserCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { userAccounts, updateUserStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredAccounts = userAccounts.filter((u) => {
    const pName = u.personName || u.username || '';
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>🔐 COMPTES UTILISATEURS & CONTRÔLE D'ACCÈS</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion des statuts officiels : PENDING, INVITED, ACTIVE, SUSPENDED, LOCKED, DELETED
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs w-full sm:w-72 focus:ring-2 focus:ring-purple-500 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">Tous les Rôles</option>
            <option value="STUDENT">Élèves</option>
            <option value="TEACHER">Enseignants</option>
            <option value="PARENT">Parents / Tuteurs</option>
            <option value="ADMIN">Administrateurs</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Utilisateur</th>
                <th className="px-4 py-3">Rôle & Identifiant</th>
                <th className="px-4 py-3">Statut Compte</th>
                <th className="px-4 py-3">Dernière Connexion</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Actions Administratives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{acc.personName || acc.username}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{acc.email}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[11px] border border-slate-200">
                      {acc.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <StatusBadge status={acc.status} type="user" />
                  </td>

                  <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                    {acc.lastLogin || acc.lastLoginAt || 'Jamais connecté'}
                  </td>

                  <td className="px-4 py-3.5 text-right space-x-1">
                    {acc.status === 'INVITED' && (
                      <button
                        onClick={() => updateUserStatus(acc.id, 'ACTIVE')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold border border-emerald-200"
                      >
                        Activer
                      </button>
                    )}

                    {acc.status === 'ACTIVE' && (
                      <button
                        onClick={() => updateUserStatus(acc.id, 'SUSPENDED')}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-bold border border-rose-200"
                      >
                        Suspendre
                      </button>
                    )}

                    {acc.status === 'SUSPENDED' && (
                      <button
                        onClick={() => updateUserStatus(acc.id, 'ACTIVE')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold border border-emerald-200"
                      >
                        Réactiver
                      </button>
                    )}

                    {acc.status === 'LOCKED' && (
                      <button
                        onClick={() => updateUserStatus(acc.id, 'ACTIVE')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-bold border border-blue-200"
                      >
                        Déverrouiller
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
