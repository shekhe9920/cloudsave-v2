import type { FileMetadata } from "./fileTypes.js";

export interface FileRepository {
  save(file: FileMetadata): FileMetadata;

  findAll(): FileMetadata[];
}
