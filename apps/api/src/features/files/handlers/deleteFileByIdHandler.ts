import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { errorResponse, successResponse } from "../../utils/httpResponse.js";
import { fileService } from "../../../shared/dependencies.js";

/**
 * Deletes the file metadata identified by the ID in the request path.
 *
 * @param event - The API Gateway event containing the file ID.
 * @returns An API Gateway response containing the deleted file or an error message.
 */
export async function deleteFileByIdHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return errorResponse(400, "Bad Request", "Missing file ID in path");
    }

    const deletedFile = await fileService.deleteFileById(id);
    if (deletedFile === undefined) {
      return errorResponse(
        404,
        "Not Found",
        `Could not find file with id = '${id}'`,
      );
    }
    return successResponse(200, deletedFile);
  } catch (error) {
    console.error("deleteFileByIdHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
