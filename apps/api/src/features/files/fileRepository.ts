import type { FileMetadata } from "./fileTypes.js";

/** Defines the persistence operations required by the file service. */
export interface FileRepository {
  /** Persists file metadata and returns the stored value. */
  save(file: FileMetadata): Promise<FileMetadata>;

  /** Returns all stored file metadata. */
  findAll(): Promise<FileMetadata[]>;
}
