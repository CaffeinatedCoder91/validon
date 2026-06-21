# Validon

A demo application for checking data quality in CSV files using AI-powered analysis with Claude and n8n.

## Features

- **CSV File Upload** — Drag-and-drop or click to select CSV files (max 1MB)
- **AI-Powered Analysis** — Claude analyzes each row for quality issues via n8n
- **Quality Report** — View issues organized by row and field with severity levels
- **Accessible UI** — ARIA labels, keyboard navigation, screen reader support
- **Responsive Design** — Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+
- n8n instance with Claude/Anthropic integration
- Claude API access

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file with your n8n webhook URL:

```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing

```bash
npm test
npm test:ui        # interactive test UI
npm test:coverage  # coverage report
```

### Build

```bash
npm run build
```

## Important: Rate Limits

This is a **demo application**. The default Claude API plan has a **5 requests per minute limit**.

- Each CSV row is analyzed in a separate request
- A 10-row CSV = 10 requests → **exceeds the 5/min limit**
- Test with **3-4 rows max** to stay under the limit

To use with larger files:
1. **Upgrade your Claude API rate limit** — Contact Anthropic sales
2. **Batch rows in n8n** — Analyze multiple rows per request
3. **Add delays in n8n** — Space requests out over time

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Plain CSS (no frameworks)
- **State**: React hooks (useState)
- **HTTP**: Native fetch API
- **Testing**: Vitest + @testing-library/react
- **Analysis**: Claude AI via n8n webhook

## File Structure

```
src/
  components/          ← UI components (FileUpload, ResultsTable, etc.)
  hooks/               ← Custom hooks (useFileUpload, useQualityCheck)
  types/               ← TypeScript type definitions
  utils/               ← Helper functions (csvParser, formatters)
  App.tsx              ← Main application component
  index.css            ← Global styles
```

## Code Standards

- TypeScript strict mode
- Functional components only
- No external UI libraries
- No abbreviations in variable/function names
- Full test coverage
- Accessible HTML

## License

MIT
