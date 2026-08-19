import React from 'react';

interface GradeBadgeProps {
  score: number;
  maxScore?: number;
  showAppreciation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const getGradeVisual = (score: number) => {
  if (score >= 16) {
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-950/50',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      barColor: 'bg-emerald-500',
      label: 'Très bien',
      icon: '✅',
      hex: '#00B894',
    };
  } else if (score >= 14) {
    return {
      bg: 'bg-teal-100 dark:bg-teal-950/50',
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border-teal-300 dark:border-teal-700',
      barColor: 'bg-teal-400',
      label: 'Bien',
      icon: '✅',
      hex: '#55EFC4',
    };
  } else if (score >= 12) {
    return {
      bg: 'bg-amber-100 dark:bg-amber-950/50',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
      barColor: 'bg-amber-400',
      label: 'Assez bien',
      icon: '✅',
      hex: '#FDCB6E',
    };
  } else if (score >= 10) {
    return {
      bg: 'bg-orange-100 dark:bg-orange-950/50',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      barColor: 'bg-orange-500',
      label: 'Passable',
      icon: '⚠️',
      hex: '#F39C12',
    };
  } else if (score >= 8) {
    return {
      bg: 'bg-orange-200 dark:bg-orange-950/80',
      text: 'text-orange-900 dark:text-orange-200',
      border: 'border-orange-400 dark:border-orange-600',
      barColor: 'bg-orange-600',
      label: 'À améliorer',
      icon: '⚠️',
      hex: '#E17055',
    };
  } else {
    return {
      bg: 'bg-rose-100 dark:bg-rose-950/60',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-700',
      barColor: 'bg-rose-600',
      label: 'Insuffisant',
      icon: '❌',
      hex: '#D63031',
    };
  }
};

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  score = 0,
  maxScore = 20,
  showAppreciation = true,
  size = 'md',
}) => {
  const safeScore = typeof score === 'number' && !isNaN(score) ? score : 0;
  const visual = getGradeVisual(safeScore);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-sm font-semibold',
    lg: 'px-3.5 py-1.5 text-base font-bold',
  };

  return (
    <span
      id={`grade-badge-${safeScore}`}
      className={`inline-flex items-center gap-1.5 rounded-md border ${visual.bg} ${visual.text} ${visual.border} ${sizeClasses[size]}`}
    >
      <span>
        {safeScore.toFixed(1).replace('.0', '')}/{maxScore}
      </span>
      {showAppreciation && (
        <span className="text-xs font-normal opacity-90">({visual.label})</span>
      )}
    </span>
  );
};
