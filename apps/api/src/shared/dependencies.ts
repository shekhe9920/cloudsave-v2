import { DynamoDbFileRepository } from "../features/files/dynamoDbFileRepository.js";
import { FileService } from "../features/files/fileService.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDbClient = new DynamoDBClient({
  region: "eu-west-1",
  endpoint: "http://host.docker.internal:8000",
  credentials: {
    accessKeyId: "local",
    secretAccessKey: "local",
  },
});

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient);
const fileRepository = new DynamoDbFileRepository(
  documentClient,
  "CloudSaveFiles",
);
const fileService = new FileService(fileRepository);

export { fileService };
