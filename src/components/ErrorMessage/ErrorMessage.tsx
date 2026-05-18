import type { ErrorMessageProps } from './errorMessage.types';

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={`error-message ${className || ''}`} role="alert">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3 className="error-title">Analysis Failed</h3>
        <p className="error-text">{message}</p>
        <p className="error-suggestion">Please try uploading your file again.</p>
      </div>
    </div>
  );
}
