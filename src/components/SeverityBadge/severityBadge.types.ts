import type { CommonProps } from '../types';

type SeverityLevel = 'low' | 'medium' | 'high';

type SeverityColor = '#3b82f6' | '#f97316' | '#ef4444';
type SeverityLabel = 'Low' | 'Medium' | 'High';

type SeverityColorMap = {
  low: SeverityColor;
  medium: SeverityColor;
  high: SeverityColor;
};

type SeverityLabelMap = {
  low: SeverityLabel;
  medium: SeverityLabel;
  high: SeverityLabel;
};

export interface SeverityBadgeProps extends CommonProps {
  severity: SeverityLevel;
}

export type { SeverityLevel, SeverityColor, SeverityLabel, SeverityColorMap, SeverityLabelMap };
