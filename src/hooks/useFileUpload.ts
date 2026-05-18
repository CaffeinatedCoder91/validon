import { useState } from 'react';
import type { CSVRow } from '../types';
import { parseCSV } from '../utils/csvParser';

interface UseFileUploadResult {
  file: File | null;
  parsedData: CSVRow[];
  handleFileSelect: (selectedFile: File) => Promise<void>;
  error: string | null;
}

export function useFileUpload(): UseFileUploadResult {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File): Promise<void> => {
    setError(null);

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please select a valid CSV file');
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      setError('File is too large (maximum 1MB)');
      return;
    }

    try {
      const data = await parseCSV(selectedFile);
      setFile(selectedFile);
      setParsedData(data);
    } catch {
      setError('Failed to parse CSV file. Please check the format.');
      setFile(null);
      setParsedData([]);
    }
  };

  return {
    file,
    parsedData,
    handleFileSelect,
    error,
  };
}
