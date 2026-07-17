import { randomUUID } from "node:crypto";
import type { FileMetadata, CreateFileInput } from "./fileTypes.js";
import { InMemoryFileRepository } from "./inMemoryFileRepository.js";

export class FileService {
  private repository: InMemoryFileRepository;

  constructor(repository: InMemoryFileRepository) {
    this.repository = repository;
  }

  createFile(input: CreateFileInput): FileMetadata {
    const fileMetadata: FileMetadata = {
      id: randomUUID(),
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.size,
      uploadedAt: new Date().toISOString(),
    };

    const fileRepo = this.repository;

    fileRepo.save(fileMetadata);

    return fileMetadata;
  }

  listFiles(): FileMetadata[] {
    return this.repository.findAll();
  }
}
