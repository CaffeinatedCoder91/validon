import type { CommonProps } from '../types';
import type { QualityReport } from '../../types';

export interface ResultsTableProps extends CommonProps {
  report: QualityReport;
}
