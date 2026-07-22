import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockApiGatewayEvent } from "../../../../../../helpers/mockApiGatewayEvent";

const { deleteFileByIdMock } = vi.hoisted(() => ({
  deleteFileByIdMock: vi.fn(),
}));

vi.mock("../../../../../../../apps/api/src/shared/dependencies", () => ({
  fileService: {
    deleteFileById: deleteFileByIdMock,
  },
}));

import { deleteFileByIdHandler } from "../../../../../../../apps/api/src/features/files/handlers/deleteFileByIdHandler";
import { fileService } from "../../../../../../../apps/api/src/shared/dependencies";

describe("Test deleteFileById", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return 200 and the deleted file when the file exists", async () => {
    deleteFileByIdMock.mockResolvedValue({
      id: "test-id-200",
      fileName: "text.docs",
      contentType: "image/docs",
      size: 55,
      uploadedAt: "2026-07-21T13:00:05.000Z",
    });
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "DELETE",
      path: "/files",
      pathParameters: {
        id: "test-id-200",
      },
    });

    const res = await deleteFileByIdHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);

    expect(fileService.deleteFileById).toHaveBeenCalledOnce();
    expect(fileService.deleteFileById).toHaveBeenCalledWith("test-id-200");

    expect(body.data).toEqual({
      id: "test-id-200",
      fileName: "text.docs",
      contentType: "image/docs",
      size: 55,
      uploadedAt: "2026-07-21T13:00:05.000Z",
    });
  });

  it("should return 400 when the file ID is missing from the path", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "DELETE",
      path: "/files",
    });

    const res = await deleteFileByIdHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);

    expect(fileService.deleteFileById).not.toHaveBeenCalled();

    expect(body).toEqual({
      error: "Bad Request",
      message: "Missing file ID in path",
    });
  });

  it("should return 404 when the file does not exist", async () => {
    const id = "test-id-404";

    deleteFileByIdMock.mockResolvedValue(undefined);

    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "DELETE",
      path: "/files",
      pathParameters: {
        id: id,
      },
    });

    const res = await deleteFileByIdHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(404);

    expect(fileService.deleteFileById).toHaveBeenCalledOnce();
    expect(fileService.deleteFileById).toHaveBeenCalledWith(id);

    expect(body).toEqual({
      error: "Not Found",
      message: `Could not find file with id = '${id}'`,
    });
  });

  it("should return 500 when the service throws an error", async () => {
    vi.mocked(deleteFileByIdMock).mockRejectedValue(new Error("Failed"));

    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "DELETE",
      path: "/files",
      pathParameters: {
        id: "test-id-500",
      },
    });

    const res = await deleteFileByIdHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);

    expect(fileService.deleteFileById).toHaveBeenCalledOnce();

    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
