import React from 'react';
import { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showDot = true
}) => {
  const styles: Record<Severity, { container: string; dot: string; label: string }> = {
    CRITICAL: {
      container: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      label: 'Critical'
    },
    HIGH: {
      container: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
      label: 'High'
    },
    MEDIUM: {
      container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      dot: 'bg-yellow-500',
      label: 'Medium'
    },
    LOW: {
      container: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-500',
      label: 'Low'
    }
  };

  const current = styles[severity] || styles.LOW;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border tracking-normal ${current.container} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
      <span>{current.label}</span>
    </span>
  );
};
