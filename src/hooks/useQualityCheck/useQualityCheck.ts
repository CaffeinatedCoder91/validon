import { useState } from 'react';
import type { CSVRow, QualityReport, AppState } from '../../types';

interface N8NWebhookResponse {
  summary: {
    totalRows: number;
    totalIssues: number;
  };
  findings: Array<{
    rowNumber: number;
    issues: Array<{
      field: string;
      message: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  }>;
}

interface UseQualityCheckResult {
  analyse: (rows: CSVRow[]) => Promise<void>;
  reset: () => void;
  report: QualityReport | null;
  state: AppState;
  error: string | null;
}

export function useQualityCheck(): UseQualityCheckResult {
  const [report, setReport] = useState<QualityReport | null>(null);
  const [state, setState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);

  const analyse = async (rows: CSVRow[]): Promise<void> => {
    setError(null);
    setState('loading');

    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rows,
          totalRows: rows.length,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      const rawData = (await response.json()) as N8NWebhookResponse;

      const qualityIssues: QualityReport['results'] = rawData.findings.flatMap((finding) =>
        finding.issues.map((issue) => ({
          row: finding.rowNumber,
          field: issue.field,
          issue: issue.message,
          severity: issue.severity,
        })),
      );

      const report: QualityReport = {
        totalRows: rawData.summary.totalRows,
        issuesFound: rawData.summary.totalIssues,
        results: qualityIssues,
      };

      setReport(report);
      setState('success');
    } catch (analyseError) {
      const message =
        analyseError instanceof Error ? analyseError.message : 'An error occurred while analysing your data';
      setError(message);
      setState('error');
    }
  };

  const reset = (): void => {
    setReport(null);
    setState('idle');
    setError(null);
  };

  return {
    analyse,
    reset,
    report,
    state,
    error,
  };
}
