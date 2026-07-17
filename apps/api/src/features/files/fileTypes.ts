export interface FileMetadata {
  id: string;
  fileName: string;
  contentType: string;
  size: number; // bytes
  uploadedAt: string;
}

export interface CreateFileInput {
  fileName: string;
  contentType: string;
  size: number; // bytes
}
