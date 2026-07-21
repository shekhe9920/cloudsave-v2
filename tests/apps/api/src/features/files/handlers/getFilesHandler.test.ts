import { describe, it, expect, vi, beforeEach } from "vitest";

const { listFilesMock } = vi.hoisted(() => ({
  listFilesMock: vi.fn(),
}));

vi.mock("../../../../../../../apps/api/src/shared/dependencies", () => ({
  fileService: {
    listFiles: listFilesMock,
  },
}));

import { getFilesHandler } from "../../../../../../../apps/api/src/features/files/handlers/getFilesHandler";

describe("Test getFilesHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully list all files", async () => {
    listFilesMock.mockResolvedValue([
      {
        id: "test-id-1",
        fileName: "test.pdf",
        contentType: "application/pdf",
        size: 1,
        uploadedAt: "2026-07-21T12:00:00.000Z",
      },
      {
        id: "test-id-2",
        fileName: "image.png",
        contentType: "image/png",
        size: 2,
        uploadedAt: "2026-07-21T13:00:00.000Z",
      },
      {
        id: "test-id-3",
        fileName: "text.docs",
        contentType: "image/docs",
        size: 55,
        uploadedAt: "2026-07-21T13:00:05.000Z",
      },
    ]);

    const res = await getFilesHandler();
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(listFilesMock).toHaveBeenCalledOnce();
    expect(body.data).toHaveLength(3);
    expect(body.data).toEqual([
      {
        id: "test-id-1",
        fileName: "test.pdf",
        contentType: "application/pdf",
        size: 1,
        uploadedAt: "2026-07-21T12:00:00.000Z",
      },
      {
        id: "test-id-2",
        fileName: "image.png",
        contentType: "image/png",
        size: 2,
        uploadedAt: "2026-07-21T13:00:00.000Z",
      },
      {
        id: "test-id-3",
        fileName: "text.docs",
        contentType: "image/docs",
        size: 55,
        uploadedAt: "2026-07-21T13:00:05.000Z",
      },
    ]);
  });

  it("should return 200 even if there is no files", async () => {
    listFilesMock.mockResolvedValue([]);

    const res = await getFilesHandler();
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(listFilesMock).toHaveBeenCalledOnce();
    expect(body.data).toHaveLength(0);
    expect(body.data).toEqual([]);
  });

  it("should return 500 Internal Server Error when getFilesHandler fails", async () => {
    vi.mocked(listFilesMock).mockRejectedValue(
      new Error("Failed to list all files"),
    );

    const res = await getFilesHandler();
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);
    expect(listFilesMock).toHaveBeenCalledOnce();
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
