import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockApiGatewayEvent } from "../../../../../../helpers/mockApiGatewayEvent";

const { createFileMock } = vi.hoisted(() => ({
  createFileMock: vi.fn(),
}));

vi.mock("../../../../../../../apps/api/src/shared/dependencies", () => ({
  fileService: {
    createFile: createFileMock,
  },
}));

import { createFileHandler } from "../../../../../../../apps/api/src/features/files/handlers/createFileHandler.js";

describe("Test createFileHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully create file", async () => {
    createFileMock.mockResolvedValue({
      id: "test-id",
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 1,
      uploadedAt: "2026-07-21T12:00:00.000Z",
    });

    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: JSON.stringify({
        fileName: "test.pdf",
        contentType: "application/pdf",
        size: 1,
      }),
    });

    const res = await createFileHandler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.data).toEqual({
      id: "test-id",
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 1,
      uploadedAt: "2026-07-21T12:00:00.000Z",
    });

    expect(createFileMock).toHaveBeenCalledOnce();
    expect(createFileMock).toHaveBeenCalledWith({
      fileName: "test.pdf",
      contentType: "application/pdf",
      size: 1,
    });
  });

  it("should return 400 if body is missing from the request", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing body in request",
      }),
    });
  });

  it("should return 400 if body is not type of 'object'", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: '"not a object"',
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain fileName, contentType and size",
      }),
    });
  });

  it("should return 400 if body is null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: "null",
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain fileName, contentType and size",
      }),
    });
  });

  it("should return 400 when 'fileName' is missing from body", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: JSON.stringify({
        contentType: "application/pdf",
        size: 1,
      }),
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain fileName, contentType and size",
      }),
    });
  });

  it("should return 400 when 'contentType' is missing from body", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: JSON.stringify({
        fileName: "test.pdf",
        size: 1,
      }),
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain fileName, contentType and size",
      }),
    });
  });

  it("should return 400 when 'size' is missing from body", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: JSON.stringify({
        fileName: "test.pdf",
        contentType: "application/pdf",
      }),
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain fileName, contentType and size",
      }),
    });
  });

  it("should return 400 when invalid/broken JSON is given", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: "{ ",
    });

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Request body must contain valid JSON",
      }),
    });
  });

  it("should give '500' when handler throws error", async () => {
    const mockEvent = createMockApiGatewayEvent({
      httpMethod: "POST",
      path: "/files",
      body: JSON.stringify({
        fileName: "test.pdf",
        contentType: "application/pdf",
        size: 1,
      }),
    });

    vi.mocked(createFileMock).mockRejectedValue(new Error("Failed"));

    const res = await createFileHandler(mockEvent);

    expect(res).toEqual({
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      }),
    });
  });
});
