import { describe, it, expect, beforeEach } from "vitest";
import { FileService } from "../../../../../../apps/api/src/features/files/fileService.js";
import { InMemoryFileRepository } from "../../../../../../apps/api/src/features/files/repositories/inMemoryFileRepository.js";
import type { CreateFileInput } from "../../../../../../apps/api/src/features/files/fileTypes.js";

let repository: InMemoryFileRepository;
let fileService: FileService;

describe("Test createFile", () => {
  it("should successfully create file", async () => {
    repository = new InMemoryFileRepository();
    fileService = new FileService(repository);

    const file: CreateFileInput = {
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 2,
    };

    const createdFile = await fileService.createFile(file);
    expect(typeof createdFile.id).toBe("string");
    expect(createdFile).toMatchObject({
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 2,
    });
  });
});

describe("Test findById", () => {
  beforeEach(() => {
    repository = new InMemoryFileRepository();
    fileService = new FileService(repository);
  });

  it("should successfully find file by id", async () => {
    const file: CreateFileInput = {
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 2,
    };

    const createdFile = await fileService.createFile(file);
    const savedFile = await fileService.findById(createdFile.id);

    expect(savedFile).toMatchObject(createdFile);
  });

  it("should return 'undefined' if file is not found", async () => {
    const searchFile = await fileService.findById("not-a-file");
    expect(searchFile).toBeUndefined();
  });
});

describe("Test listFiles", () => {
  it("should successfully list all files", async () => {
    repository = new InMemoryFileRepository();
    fileService = new FileService(repository);

    const file0: CreateFileInput = {
      fileName: "a.pdf",
      contentType: "application/pdf",
      size: 1,
    };

    const file1: CreateFileInput = {
      fileName: "b.pdf",
      contentType: "application/pdf",
      size: 2,
    };

    const createdFile0 = await fileService.createFile(file0);
    const createdFile1 = await fileService.createFile(file1);

    const savedFiles = await fileService.listFiles();

    expect(savedFiles).toHaveLength(2);
    expect(savedFiles).toContain(createdFile0);
    expect(savedFiles).toContain(createdFile1);
  });
});

describe("Test deleteFileById", () => {
  beforeEach(() => {
    repository = new InMemoryFileRepository();
    fileService = new FileService(repository);
  });

  it("should successfully delete file by id all files", async () => {
    const file0: CreateFileInput = {
      fileName: "a.pdf",
      contentType: "application/pdf",
      size: 1,
    };

    const file1: CreateFileInput = {
      fileName: "b.pdf",
      contentType: "application/pdf",
      size: 2,
    };

    const createdFile0 = await fileService.createFile(file0);
    const createdFile1 = await fileService.createFile(file1);
    await fileService.deleteFileById(createdFile0.id);
    const savedFiles = await fileService.listFiles();

    expect(savedFiles).toHaveLength(1);
    expect(savedFiles).toContain(createdFile1);
    expect(await fileService.findById(createdFile0.id)).toBeUndefined();
  });
});
