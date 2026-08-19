import React from 'react';
import { UserStatus, AdmissionStatus, RoomStatus, EnrollmentStatus } from '../../types';

interface StatusBadgeProps {
  status: UserStatus | AdmissionStatus | RoomStatus | EnrollmentStatus | 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | string;
  type?: 'user' | 'admission' | 'room' | 'enrollment' | 'payment';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'user' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      // User & Enrollment
      case 'ACTIVE':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Actif', dot: 'bg-emerald-500' };
      case 'INVITED':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Invité', dot: 'bg-blue-500' };
      case 'PENDING':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'En attente', dot: 'bg-amber-500' };
      case 'SUSPENDED':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Suspendu', dot: 'bg-rose-500' };
      case 'LOCKED':
        return { bg: 'bg-red-50 text-red-700 border-red-200', label: 'Verrouillé', dot: 'bg-red-600' };
      case 'DELETED':
        return { bg: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Supprimé', dot: 'bg-gray-400' };

      // Admission
      case 'DRAFT':
        return { bg: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Brouillon', dot: 'bg-gray-400' };
      case 'SUBMITTED':
        return { bg: 'bg-sky-50 text-sky-700 border-sky-200', label: 'Soumis', dot: 'bg-sky-500' };
      case 'UNDER_REVIEW':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'En révision', dot: 'bg-purple-500' };
      case 'APPROVED':
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Approuvé (Valid. Admin)', dot: 'bg-indigo-500' };
      case 'REJECTED':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Rejeté', dot: 'bg-rose-500' };
      case 'ENROLLED':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Inscrit (Matricule généré)', dot: 'bg-emerald-500' };

      // Room
      case 'AVAILABLE':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Disponible', dot: 'bg-emerald-500' };
      case 'OCCUPIED':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Occupée', dot: 'bg-amber-500' };
      case 'MAINTENANCE':
        return { bg: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Maintenance', dot: 'bg-orange-500' };
      case 'CLOSED':
        return { bg: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Fermée', dot: 'bg-gray-400' };

      // Payment
      case 'PAID':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Payé', dot: 'bg-emerald-500' };
      case 'PARTIAL':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Partiel', dot: 'bg-amber-500' };
      case 'OVERDUE':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'En retard', dot: 'bg-rose-500' };

      default:
        return { bg: 'bg-gray-100 text-gray-700 border-gray-300', label: status, dot: 'bg-gray-400' };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      id={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
