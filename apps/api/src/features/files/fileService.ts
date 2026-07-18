import { randomUUID } from "node:crypto";
import type { FileMetadata, CreateFileInput } from "./fileTypes.js";
import type { FileRepository } from "./fileRepository.js";

export class FileService {
  private repository: FileRepository;

  constructor(repository: FileRepository) {
    this.repository = repository;
  }

  async createFile(input: CreateFileInput): Promise<FileMetadata> {
    const fileMetadata: FileMetadata = {
      id: randomUUID(),
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.size,
      uploadedAt: new Date().toISOString(),
    };

    const fileRepo = this.repository;
    const savedFile = await fileRepo.save(fileMetadata);

    return savedFile;
  }

  async listFiles(): Promise<FileMetadata[]> {
    return this.repository.findAll();
  }
}
