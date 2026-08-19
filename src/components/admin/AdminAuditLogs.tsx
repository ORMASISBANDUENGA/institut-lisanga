import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Shield, Search, CheckCircle2, Clock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const safeLogs = auditLogs || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = safeLogs.filter((log) => {
    const author = log.performedByName || log.userName || '';
    const action = log.action || '';
    const details = log.details || '';
    return (
      action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A3A5C] flex items-center gap-2">
            <History className="w-6 h-6 text-amber-500" />
            <span>🛡️ JOURNAL D'AUDIT, TRAÇABILITÉ & SÉCURITÉ</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique immuable de toutes les actions administratives, validations et attributions de matricules
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filtrer les événements de sécurité (action, auteur, détails)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-slate-300 rounded-xl text-xs w-full sm:w-96 focus:ring-2 focus:ring-amber-500 outline-hidden"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Horodatage</th>
                <th className="px-4 py-3">Auteur & Rôle</th>
                <th className="px-4 py-3">Action Réalisée</th>
                <th className="px-4 py-3">Cible / Entité</th>
                <th className="px-4 py-3">Détails & Données</th>
                <th className="px-4 py-3 rounded-r-lg">IP Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <div>{log.performedByName || log.userName || 'Admin'}</div>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {log.performedByRole || log.userRole || 'ADMIN'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-mono font-bold text-[11px]">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-semibold text-slate-700">
                    {log.targetEntity || log.entity} #{log.targetId || log.entityId}
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 text-[11px] max-w-xs">
                    {log.details}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                    {log.ipAddress || '197.234.221.14'}
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
