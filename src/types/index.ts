// A single row from the CSV file
export type CSVRow = {
  [key: string]: string;
};

// A single quality issue found by Claude
export type QualityIssue = {
  row: number;
  field: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
};

// The full report returned from n8n
export type QualityReport = {
  totalRows: number;
  issuesFound: number;
  results: QualityIssue[];
};

// App state
export type AppState = 'idle' | 'loading' | 'success' | 'error';
