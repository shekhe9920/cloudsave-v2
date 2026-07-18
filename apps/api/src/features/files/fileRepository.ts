import type { FileMetadata } from "./fileTypes.js";

export interface FileRepository {
  save(file: FileMetadata): Promise<FileMetadata>;

  findAll(): Promise<FileMetadata[]>;
}
