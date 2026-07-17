import type { APIGatewayProxyResult } from "aws-lambda";
import { errorResponse, successResponse } from "../utils/httpResponse.js";
import { InMemoryFileRepository } from "./inMemoryFileRepository.js";
import { FileService } from "./fileService.js";

const fileRepository = new InMemoryFileRepository();
const fileService = new FileService(fileRepository);

export async function getFilesHandler(): Promise<APIGatewayProxyResult> {
  try {
    const allFiles = fileService.listFiles();

    return successResponse(200, allFiles);
  } catch (error) {
    console.error("getFilesHandler error: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
