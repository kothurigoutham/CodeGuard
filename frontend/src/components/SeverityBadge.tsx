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
      container: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      dot: 'bg-rose-400',
      label: 'Critical'
    },
    HIGH: {
      container: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      dot: 'bg-amber-400',
      label: 'High'
    },
    MEDIUM: {
      container: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
      dot: 'bg-yellow-400',
      label: 'Medium'
    },
    LOW: {
      container: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      dot: 'bg-sky-400',
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
