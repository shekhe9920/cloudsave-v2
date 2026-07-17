import type { FileMetadata } from "../files/fileTypes.js";

export function successResponse(statusCode: number, data: FileMetadata) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  };
}

export function errorResponse(statusCode: number, err: string, msg: string) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: err,
      message: msg,
    }),
  };
}
