import { useState } from 'react';
import type { CSVRow, QualityReport, AppState } from '../types';

interface UseQualityCheckResult {
  analyse: (rows: CSVRow[]) => Promise<void>;
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
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error('Webhook URL not configured');
      }

      const response = await fetch(webhookUrl, {
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

      const data = (await response.json()) as QualityReport;
      setReport(data);
      setState('success');
    } catch (analyseError) {
      const message =
        analyseError instanceof Error ? analyseError.message : 'An error occurred while analysing your data';
      setError(message);
      setState('error');
    }
  };

  return {
    analyse,
    report,
    state,
    error,
  };
}
