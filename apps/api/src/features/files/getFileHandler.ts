import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { errorResponse, successResponse } from "../utils/httpResponse.js";
import { fileService } from "../../shared/dependencies.js";

/**
 * Retrieves metadata for a single file.
 *
 * @param event - The API Gateway event containing the file ID.
 * @returns An API Gateway response containing the file or an error message.
 */
export async function getFileHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse(400, "Bad Request", "Missing file ID in path");
    }

    const file = await fileService.findById(id);

    if (!file) {
      return errorResponse(404, "Not Found", `File with ${id} was not found`);
    }

    return successResponse(200, file);
  } catch (error) {
    console.error("getFileHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
