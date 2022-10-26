import { DynamoDB } from 'aws-sdk';
import { document } from 'src/shared/dynamodbClient';
import { v4 as uuidv4 } from 'uuid';
import { UserFilesExportDTO } from './user-files-export.interface';


export class UserFilesExportService {
  readonly document: DynamoDB.DocumentClient;
  readonly tableName: string;

  constructor() {
    this.document = document;
    this.tableName = 'user_files_export'
  }

  async create(userFile: UserFilesExportDTO) {
    const id = uuidv4()

    await document.put({
      TableName: this.tableName,
      Item: {
        id,
        userId: userFile.userId,
        url_file: `${process.env.AWS_URL_BUCKET}/${userFile.key}`,
        created_at: new Date().getTime()
      }
    }).promise()

    const userFileCreated = await this.findOne(id);

    return userFileCreated
  }
  
  async findOne(id: string): Promise<DynamoDB.DocumentClient.ItemList> | undefined {
    try {
      const userFileExport = await document.scan({
        TableName: this.tableName,
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id":  id
        }
      }).promise()

      return userFileExport.Items;

    } catch (error) {
      console.log(error)
      return
    } 
  }
} 