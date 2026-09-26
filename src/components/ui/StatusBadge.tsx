import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, AlertOctagon, ShieldCheck } from 'lucide-react';

interface StatusBadgeProps {
  category?: string;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ReadinessBadge({ category = 'PRIORITAS', score, showScore = true, size = 'md' }: StatusBadgeProps) {
  let bgClass = 'bg-red-50 text-red-800 border-red-200';
  let Icon = AlertOctagon;
  let label = 'Prioritas Intervensi';

  switch (category) {
    case 'SIAP':
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle2;
      label = 'Kesiapan Lengkap';
      break;
    case 'HAMPIR_SIAP':
      bgClass = 'bg-blue-50 text-blue-800 border-blue-300';
      Icon = Clock;
      label = 'Hampir Siap';
      break;
    case 'PERLU_TINDAK_LANJUT':
      bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = AlertTriangle;
      label = 'Perlu Tindak Lanjut';
      break;
    default:
      bgClass = 'bg-red-50 text-red-800 border-red-300';
      Icon = AlertOctagon;
      label = 'Prioritas Intervensi';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${bgClass} ${sizeClasses}`}
      role="status"
      aria-label={`Status Kesiapan: ${label} ${score !== undefined ? `Skor: ${score}%` : ''}`}
    >
      <Icon className={`${iconSizes} shrink-0`} />
      <span className="font-semibold">{label}</span>
      {showScore && score !== undefined && (
        <span className="bg-white/80 px-1.5 py-0.2 rounded font-mono font-bold text-xs ml-0.5 border border-black/10">
          {score.toFixed(1)}%
        </span>
      )}
    </span>
  );
}

export function DataSourceBadge({ source = 'INTERNAL' }: { source?: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    DEMO: { bg: 'bg-amber-100 text-amber-900 border-amber-300', text: 'DEMO', label: 'Data Demo Sintetis' },
    INTERNAL: { bg: 'bg-slate-100 text-slate-800 border-slate-300', text: 'INTERNAL', label: 'Data Operasional Internal' },
    VERIFIED: { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', text: 'VERIFIED', label: 'Terverifikasi Faktual' },
    OFFICIAL_EXTERNAL: { bg: 'bg-purple-100 text-purple-900 border-purple-300', text: 'OFFICIAL', label: 'Resmi Nasional (External)' },
  };

  const current = styles[source] || styles.INTERNAL;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border tracking-wider ${current.bg}`}
      title={current.label}
    >
      <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
      {current.text}
    </span>
  );
}
