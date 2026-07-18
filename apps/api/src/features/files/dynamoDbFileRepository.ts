import type { FileMetadata } from "./fileTypes.js";
import type { FileRepository } from "./fileRepository.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoDbFileRepository implements FileRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(client: DynamoDBDocumentClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async save(file: FileMetadata): Promise<FileMetadata> {
    try {
      const saveCmd = new PutCommand({
        TableName: this.tableName,
        Item: file,
      });

      await this.client.send(saveCmd);

      return file;
    } catch (error) {
      console.error("DynamoDbFileRepository save error: ", error);
      throw error;
    }
  }

  async findAll(): Promise<FileMetadata[]> {
    try {
      const listAllCmd = new ScanCommand({ TableName: this.tableName });

      const response = await this.client.send(listAllCmd);
      if (!response.Items) {
        return [];
      }

      return response.Items as FileMetadata[];
    } catch (error) {
      console.error("DynamoDbFileRepository findAll error: ", error);
      throw error;
    }
  }
}
