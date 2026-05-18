export function LoadingSpinner() {
  return (
    <div className="loading-spinner-container" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" />
      <p className="loading-text">Analysing your data...</p>
    </div>
  );
}
