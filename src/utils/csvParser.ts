import type { CSVRow } from '../types';

export async function parseCSV(file: File): Promise<CSVRow[]> {
  const text = await file.text();
  const lines = text.trim().split('\n');

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(headerValue => headerValue.trim());
  const rows: CSVRow[] = [];

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
    const values = lines[lineIndex].split(',').map(cellValue => cellValue.trim());
    const row: CSVRow = {};

    headers.forEach((header, columnIndex) => {
      row[header] = values[columnIndex] || '';
    });

    rows.push(row);
  }

  return rows;
}
