import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { CreateFileInput } from "./fileTypes.js";
import { successResponse, errorResponse } from "../utils/httpResponse.js";
import { fileService } from "../../shared/dependencies.js";

export async function createFileHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return errorResponse(400, "bad Request", "Missing body in request");
  }

  try {
    const parsedBody = JSON.parse(event.body);
    if (
      typeof parsedBody !== "object" ||
      parsedBody === null ||
      !("fileName" in parsedBody) ||
      !("contentType" in parsedBody) ||
      !("size" in parsedBody)
    ) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must contain fileName, contentType and size",
      );
    }
    const fileName = parsedBody.fileName;
    const contentType = parsedBody.contentType;
    const size = parsedBody.size;

    if (
      typeof fileName !== "string" ||
      fileName === "" ||
      typeof contentType !== "string" ||
      contentType === "" ||
      typeof size !== "number" ||
      !Number.isFinite(size) ||
      size < 0
    ) {
      return errorResponse(
        400,
        "bad Request",
        "fileName and contentType must be non-empty strings, and size must be a non-negative number",
      );
    }

    const file: CreateFileInput = {
      fileName,
      contentType,
      size,
    };

    const createdFile = await fileService.createFile(file);

    return successResponse(201, createdFile);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(
        400,
        "Bad Request",
        "Request body must contain valid JSON",
      );
    }

    console.log("createdFileHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
