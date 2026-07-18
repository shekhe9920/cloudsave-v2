import type { FileMetadata } from "../fileTypes.js";
import type { FileRepository } from "./fileRepository.js";

/** In-memory file repository intended for local development and tests. */
export class InMemoryFileRepository implements FileRepository {
  private files: FileMetadata[] = [];

  /** Stores file metadata in memory. */
  async save(file: FileMetadata): Promise<FileMetadata> {
    this.files.push(file);
    return file;
  }

  /** Returns file metadata by ID, or undefined when no file is found. */
  async findById(id: string): Promise<FileMetadata | undefined> {
    return this.files.find((file) => file.id === id);
  }

  /** Returns a copy of all file metadata currently held in memory. */
  async findAll(): Promise<FileMetadata[]> {
    // Return a new array so callers cannot mutate the repository's internal state.
    return [...this.files];
  }
}
