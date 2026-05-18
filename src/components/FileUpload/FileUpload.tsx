import { useRef } from 'react';
import type { FileUploadProps, FileUploadState } from './fileUpload.types';

export function FileUpload({
  onFileSelect,
  onSubmit,
  isLoading,
  selectedFile,
  uploadError,
  className,
}: FileUploadProps) {
  const fileInputReference = useRef<HTMLInputElement>(null);
  const dropZoneReference = useRef<HTMLDivElement>(null);

  const currentState: FileUploadState = isLoading ? 'loading' : selectedFile ? 'selected' : 'idle';

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneReference.current) {
      dropZoneReference.current.classList.add('drag-over');
    }
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneReference.current) {
      dropZoneReference.current.classList.remove('drag-over');
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (dropZoneReference.current) {
      dropZoneReference.current.classList.remove('drag-over');
    }

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }

  function handleDropZoneClick(): void {
    fileInputReference.current?.click();
  }

  return (
    <div className={`file-upload-container ${className || ''}`}>
      <h2 className="file-upload-title">Upload CSV File</h2>

      <div
        ref={dropZoneReference}
        className="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleDropZoneClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleDropZoneClick();
          }
        }}
        aria-label="Drag and drop CSV file here or click to select"
      >
        <input
          ref={fileInputReference}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="file-input"
          aria-label="Select CSV file"
        />
        <div className="drop-zone-content">
          <p className="drop-zone-icon">📁</p>
          <p className="drop-zone-text">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Drag and drop your CSV file here'}
          </p>
          <p className="drop-zone-subtext">or click to browse</p>
        </div>
      </div>

      {uploadError && (
        <div className="file-upload-error" role="alert" aria-describedby="error-message">
          <p id="error-message">{uploadError}</p>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!selectedFile || isLoading}
        className="analyse-button"
        aria-busy={isLoading}
      >
        {isLoading ? 'Analysing...' : 'Analyse'}
      </button>
    </div>
  );
}
