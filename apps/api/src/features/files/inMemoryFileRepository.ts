import type { FileMetadata } from "./fileTypes.js";
import type { FileRepository } from "./fileRepository.js";

export class InMemoryFileRepository implements FileRepository {
  private files: FileMetadata[] = []; // fake database for now

  async save(file: FileMetadata): Promise<FileMetadata> {
    this.files.push(file);
    return file;
  }

  async findAll(): Promise<FileMetadata[]> {
    return [...this.files];
  }
}
