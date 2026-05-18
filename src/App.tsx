import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsTable } from './components/ResultsTable';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useFileUpload } from './hooks/useFileUpload';
import { useQualityCheck } from './hooks/useQualityCheck';

type ApplicationView = 'upload' | 'results';

export function App() {
  const [currentView, setCurrentView] = useState<ApplicationView>('upload');
  const fileUploadHook = useFileUpload();
  const qualityCheckHook = useQualityCheck();

  async function handleFileSelect(file: File): Promise<void> {
    await fileUploadHook.handleFileSelect(file);
  }

  async function handleAnalysisSubmit(): Promise<void> {
    if (!fileUploadHook.file || fileUploadHook.parsedData.length === 0) {
      return;
    }

    await qualityCheckHook.analyse(fileUploadHook.parsedData);
    setCurrentView('results');
  }

  function handleStartOver(): void {
    setCurrentView('upload');
    fileUploadHook.reset();
    qualityCheckHook.reset();
  }

  const renderContent = (): React.ReactNode => {
    if (qualityCheckHook.state === 'loading') {
      return <LoadingSpinner />;
    }

    if (qualityCheckHook.state === 'error') {
      return (
        <div className="app-error-section">
          <ErrorMessage message={qualityCheckHook.error || 'An unexpected error occurred'} />
          <button onClick={handleStartOver} className="start-over-button">
            Upload Another File
          </button>
        </div>
      );
    }

    if (currentView === 'results' && qualityCheckHook.report) {
      return (
        <div className="app-results-section">
          <ResultsTable report={qualityCheckHook.report} />
          <button onClick={handleStartOver} className="start-over-button">
            Analyse Another File
          </button>
        </div>
      );
    }

    return (
      <FileUpload
        onFileSelect={handleFileSelect}
        onSubmit={handleAnalysisSubmit}
        isLoading={false}
        selectedFile={fileUploadHook.file}
        uploadError={fileUploadHook.error || undefined}
      />
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Data Quality Checker</h1>
        <p className="app-description">Upload a CSV file to check data quality with AI-powered analysis</p>
      </header>

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p className="footer-text">Powered by n8n & Claude AI</p>
      </footer>
    </div>
  );
}
