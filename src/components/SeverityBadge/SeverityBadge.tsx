import type { SeverityBadgeProps, SeverityColorMap, SeverityLabelMap } from './severityBadge.types';

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const severityColors: SeverityColorMap = {
    low: '#3b82f6',
    medium: '#f97316',
    high: '#ef4444',
  };

  const severityLabels: SeverityLabelMap = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <span
      className={`severity-badge ${className || ''}`}
      style={{
        backgroundColor: severityColors[severity],
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        display: 'inline-block',
      }}
      aria-label={`Severity: ${severityLabels[severity]}`}
    >
      {severityLabels[severity]}
    </span>
  );
}
