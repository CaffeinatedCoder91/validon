import { SeverityBadge } from '../SeverityBadge';
import { formatRowNumber } from '../../utils/formatters';
import type { ResultsTableProps } from './resultsTable.types';

export function ResultsTable({ report, className }: ResultsTableProps) {
  const hasIssues = report.issuesFound > 0;

  if (!hasIssues) {
    return (
      <div className={`results-container no-issues ${className || ''}`}>
        <div className="success-message">
          <p className="success-icon">✓</p>
          <h2 className="success-title">No Issues Found</h2>
          <p className="success-text">Your data passed all quality checks across {report.totalRows} rows.</p>
        </div>
      </div>
    );
  }

  const issuesByRow: Record<number, typeof report.results> = {};
  report.results.forEach((issue) => {
    if (!issuesByRow[issue.row]) {
      issuesByRow[issue.row] = [];
    }
    issuesByRow[issue.row].push(issue);
  });

  const sortedRowNumbers = Object.keys(issuesByRow)
    .map(Number)
    .sort((rowA, rowB) => rowA - rowB);

  return (
    <div className={`results-container with-issues ${className || ''}`}>
      <div className="results-summary">
        <div className="summary-item">
          <span className="summary-label">Total Rows:</span>
          <span className="summary-value">{report.totalRows}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Issues Found:</span>
          <span className="summary-value highlight">{report.issuesFound}</span>
        </div>
      </div>

      <div className="results-table-wrapper">
        <table className="results-table" role="table">
          <thead>
            <tr>
              <th scope="col" className="column-row">Row</th>
              <th scope="col" className="column-field">Field</th>
              <th scope="col" className="column-issue">Issue</th>
              <th scope="col" className="column-severity">Severity</th>
            </tr>
          </thead>
          <tbody>
            {sortedRowNumbers.map((rowNumber) => {
              const rowIssues = issuesByRow[rowNumber];
              return rowIssues.map((issue, issueIndex) => (
                <tr key={`${rowNumber}-${issueIndex}`} className={`severity-${issue.severity}`}>
                  <td className="column-row" data-label="Row">
                    {formatRowNumber(issue.row)}
                  </td>
                  <td className="column-field" data-label="Field">
                    {issue.field}
                  </td>
                  <td className="column-issue" data-label="Issue">
                    {issue.issue}
                  </td>
                  <td className="column-severity" data-label="Severity">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
