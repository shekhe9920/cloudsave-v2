import type { APIGatewayProxyResult } from "aws-lambda";

/**
 * AWS Lambda handler for the health endpoint.
 *
 * Expected API Gateway route:
 * GET /health
 */
export async function handler(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "ok",
      uploadedAt: new Date().toISOString(),
    }),
  };
}
