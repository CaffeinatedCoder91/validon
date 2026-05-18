import type { CommonProps } from '../types';

type FileUploadState = 'idle' | 'selected' | 'loading';

export interface FileUploadProps extends CommonProps {
  onFileSelect: (file: File) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedFile: File | null;
  uploadError?: string;
}

export type { FileUploadState };
