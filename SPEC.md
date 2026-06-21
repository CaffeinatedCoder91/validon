# Validon - Technical Specification

## Overview
A single-page React application that allows users to upload a CSV file,
sends it to an n8n webhook for AI-powered quality analysis via Claude,
and displays a structured report of data quality issues found.

## User Journey
1. User lands on the page and sees an upload form
2. User uploads a CSV file (or drags and drops)
3. User clicks "Analyse" button
4. App shows loading state while n8n processes the data
5. App displays a quality report showing issues per row
6. User can upload another file to start again

---

## Types

```typescript
// A single row from the CSV file
type CSVRow = {
  [key: string]: string
}

// A single quality issue found by Claude
type QualityIssue = {
  row: number
  field: string
  issue: string
  severity: 'low' | 'medium' | 'high'
}

// The full report returned from n8n
type QualityReport = {
  totalRows: number
  issuesFound: number
  results: QualityIssue[]
}

// App state
type AppState = 'idle' | 'loading' | 'success' | 'error'
```

---

## Components

### App.tsx
- Root component
- Holds top level state (appState, report, error)
- Renders FileUpload and ResultsTable conditionally
- Handles the API call to n8n webhook

### components/FileUpload.tsx
Props:
- onFileSelect: (file: File) => void
- onSubmit: () => void
- isLoading: boolean
- selectedFile: File | null

Behaviour:
- File input that accepts .csv only
- Drag and drop support
- Shows selected filename when file chosen
- Analyse button disabled until file selected
- Analyse button shows loading state during request

### components/ResultsTable.tsx
Props:
- report: QualityReport

Behaviour:
- Shows summary at top (total rows, issues found)
- Table with columns: Row, Field, Issue, Severity
- Severity shown as coloured badge (red=high, orange=medium, blue=low)
- If no issues found show success message
- Grouped by row number

### components/SeverityBadge.tsx
Props:
- severity: 'low' | 'medium' | 'high'

Behaviour:
- Renders a small coloured badge
- Red for high
- Orange for medium
- Blue for low

### components/LoadingSpinner.tsx
- Simple CSS spinner
- Shown during API call
- With "Analysing your data..." text

### components/ErrorMessage.tsx
Props:
- message: string

Behaviour:
- Shows error message if n8n call fails
- With retry suggestion

---

## Custom Hooks

### hooks/useFileUpload.ts
Responsibilities:
- Manage selected file state
- Parse CSV file to JSON (before sending to n8n)
- Validate file is actually a CSV
- Return: { file, parsedData, handleFileSelect, error }

### hooks/useQualityCheck.ts
Responsibilities:
- Send parsed CSV data to n8n webhook
- Manage loading/error/success state
- Return: { analyse, report, state, error }

---

## Utils

### utils/csvParser.ts
- Function: parseCSV(file: File): Promise<CSVRow[]>
- Read file as text
- Split by newline
- First row is headers
- Map remaining rows to objects using headers as keys
- Return array of CSVRow objects

### utils/formatters.ts
- Function: formatRowNumber(index: number): string
- Returns "Row 1", "Row 2" etc (1-indexed)

---

## API Integration

### Webhook Request
- Method: POST
- URL: server-side `N8N_WEBHOOK_URL` via `/api/webhook`
- Headers: Content-Type: application/json
- Body:
```json
{
  "rows": [
    { "name": "John", "email": "john@test.com", "age": "25" }
  ],
  "totalRows": 10
}
```

### Webhook Response (from n8n/Claude)
```json
{
  "totalRows": 10,
  "issuesFound": 7,
  "results": [
    {
      "row": 2,
      "field": "email",
      "issue": "Invalid email format",
      "severity": "high"
    }
  ]
}
```

---

## Error Handling
- File too large (over 1MB): Show error before upload
- Wrong file type: Show error on selection
- n8n webhook fails: Show error message with retry option
- n8n returns empty results: Show "No issues found" success state
- Network error: Show friendly error message

---

## Accessibility Requirements
- File input has visible label
- Drag and drop area has keyboard support
- Loading state announced to screen readers (aria-live)
- Results table has proper thead/tbody/th structure
- Error messages linked to inputs via aria-describedby
- Severity badges have aria-label

---

## Environment Variables
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-id
```

---

## What NOT to Build
- User accounts or authentication
- Saving results to a database
- Multiple file uploads at once
- Export to PDF/Excel
- History of previous checks
- These are all out of scope for the demo

---

## Folder Structure
```
validon/
  src/
    components/
      FileUpload.tsx
      ResultsTable.tsx
      SeverityBadge.tsx
      LoadingSpinner.tsx
      ErrorMessage.tsx
    hooks/
      useFileUpload.ts
      useQualityCheck.ts
    types/
      index.ts
    utils/
      csvParser.ts
      formatters.ts
    App.tsx
    main.tsx
    index.css
  .env.local
  CLAUDE.md
  SPEC.md
  README.md
```

---

## Build Order for Claude Code
1. types/index.ts (all types first)
2. utils/csvParser.ts
3. utils/formatters.ts
4. hooks/useFileUpload.ts
5. hooks/useQualityCheck.ts
6. components/SeverityBadge.tsx
7. components/LoadingSpinner.tsx
8. components/ErrorMessage.tsx
9. components/FileUpload.tsx
10. components/ResultsTable.tsx
11. App.tsx
12. index.css

---

## Definition of Done
- [ ] CSV file can be uploaded
- [ ] CSV is parsed correctly into rows
- [ ] Data is sent to n8n webhook
- [ ] Quality report is displayed in a table
- [ ] Severity badges are colour coded
- [ ] Loading state works
- [ ] Error state works
- [ ] Empty/success state works
- [ ] TypeScript has no errors
- [ ] No console errors
- [ ] Works on mobile screen sizes
