import { randomUUID } from "node:crypto";
import type { FileMetadata, CreateFileInput } from "./fileTypes.js";
import type { FileRepository } from "./fileRepository.js";

/** Provides application-level operations for file metadata. */
export class FileService {
  private repository: FileRepository;

  constructor(repository: FileRepository) {
    this.repository = repository;
  }

  /**
   * Creates file metadata and persists it through the configured repository.
   *
   * @param input - The file details supplied by the client.
   * @returns The persisted file metadata.
   */
  async createFile(input: CreateFileInput): Promise<FileMetadata> {
    // Generate server-owned metadata instead of accepting it from the client.
    const fileMetadata: FileMetadata = {
      id: randomUUID(),
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.size,
      uploadedAt: new Date().toISOString(),
    };

    const savedFile = await this.repository.save(fileMetadata);

    return savedFile;
  }

  /** Returns all persisted file metadata. */
  async listFiles(): Promise<FileMetadata[]> {
    return this.repository.findAll();
  }
}
