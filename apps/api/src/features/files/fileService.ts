import { randomUUID } from "node:crypto";
import type { FileMetadata, CreateFileInput } from "./fileTypes.js";
import { FileRepository } from "./fileRepository.js";

export class FileService {
  private repository: FileRepository;

  constructor(repository: FileRepository) {
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
}
