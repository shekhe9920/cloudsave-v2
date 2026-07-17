import type { FileMetadata } from "./fileTypes.js";
import type { FileRepository } from "./fileRepository.js";

export class InMemoryFileRepository implements FileRepository {
  private files: FileMetadata[] = []; // fake database for now

  save(file: FileMetadata): FileMetadata {
    this.files.push(file);
    return file;
  }

  findAll(): FileMetadata[] {
    return [...this.files];
  }
}
