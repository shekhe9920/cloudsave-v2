import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockApiGatewayEvent } from "../../../../../../helpers/mockApiGatewayEvent";

const { findByIdMock } = vi.hoisted(() => ({
  findByIdMock: vi.fn(),
}));

vi.mock("../../../../../../../apps/api/src/shared/dependencies", () => ({
  fileService: {
    findById: findByIdMock,
  },
}));

import { getFileHandler } from "../../../../../../../apps/api/src/features/files/handlers/getFileHandler";
import { fileService } from "../../../../../../../apps/api/src/shared/dependencies";

describe("Test getFileHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully retrieve file", async () => {
    findByIdMock.mockResolvedValue({
      id: "test-id-1",
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 1,
      uploadedAt: "2026-07-21T12:00:00.000Z",
    });

    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "GET",
      path: "/files",
      pathParameters: {
        id: "test-id-1",
      },
      body: null,
    });

    const res = await getFileHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(fileService.findById).toHaveBeenCalledWith("test-id-1");
    expect(fileService.findById).toHaveBeenCalledOnce();
    expect(body.data).toEqual({
      id: "test-id-1",
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 1,
      uploadedAt: "2026-07-21T12:00:00.000Z",
    });
  });

  it("should return 400 Bad Request if 'id' is missing from path parameter", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "GET",
      path: "/files",
    });

    const res = await getFileHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(fileService.findById).not.toHaveBeenCalled();

    expect(res.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Missing file ID in path",
    });
  });

  it("should return 404 Not Found if the file does not exist", async () => {
    findByIdMock.mockResolvedValue(undefined);

    const id = "test-id-404";

    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "GET",
      path: "/files",
      pathParameters: {
        id: id,
      },
      body: null,
    });

    const res = await getFileHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(404);

    expect(fileService.findById).toHaveBeenCalledOnce();
    expect(fileService.findById).toHaveBeenCalledWith("test-id-404");

    expect(body).toEqual({
      error: "Not Found",
      message: `File with ${id} was not found`,
    });
  });

  it("should return 500 Internal Server Error if the service fails", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "GET",
      path: "/files",
      pathParameters: {
        id: "test-id-500",
      },
      body: null,
    });

    vi.mocked(findByIdMock).mockRejectedValue(new Error("Failed to find file"));

    const res = await getFileHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);

    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
