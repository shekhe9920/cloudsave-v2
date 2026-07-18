import type { FileMetadata } from "../fileTypes.js";
import type { FileRepository } from "./fileRepository.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

/** Stores and retrieves file metadata in a DynamoDB table. */
export class DynamoDbFileRepository implements FileRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(client: DynamoDBDocumentClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  /** Persists file metadata as a DynamoDB item. */
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

  /** Retrieves file metadata by ID from the configured DynamoDB table. */
  async findById(id: string): Promise<FileMetadata | undefined> {
    try {
      const findByIdCmd = new GetCommand({
        TableName: this.tableName,
        Key: {
          id: id,
        },
      });

      const response = await this.client.send(findByIdCmd);

      return response.Item as FileMetadata | undefined;
    } catch (error) {
      console.error("DynamoDbFileRepository findById error: ", error);
      throw error;
    }
  }

  /** Retrieves all file metadata from the configured DynamoDB table. */
  async findAll(): Promise<FileMetadata[]> {
    try {
      const listAllCmd = new ScanCommand({ TableName: this.tableName });

      const response = await this.client.send(listAllCmd);

      // DynamoDB omits Items when a scan has no results.
      if (!response.Items) {
        return [];
      }

      return response.Items as FileMetadata[];
    } catch (error) {
      console.error("DynamoDbFileRepository findAll error: ", error);
      throw error;
    }
  }

  /** Deletes file metadata by ID and returns it if it existed. */
  async deleteFileById(id: string): Promise<FileMetadata | undefined> {
    try {
      const deleteFileByIdCmd = new DeleteCommand({
        TableName: this.tableName,
        Key: {
          id: id,
        },
        // Return the deleted item so callers can detect when the ID did not exist.
        ReturnValues: "ALL_OLD",
      });

      const response = await this.client.send(deleteFileByIdCmd);
      return response.Attributes as FileMetadata | undefined;
    } catch (error) {
      console.error("DynamoDbFileRepository deleteFileById error: ", error);

      throw error;
    }
  }
}
