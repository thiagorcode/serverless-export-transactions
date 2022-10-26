import { UploadS3 } from './../shared/uploadS3.service';
import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/shared/dynamodbClient";
import { convertObjectInExcel } from "src/utils/convertObjectInExcel";
import { UserFilesExportService } from 'src/modules/user-files-export/user-files-export.service';

type Transactions = {
  description: string,
  value: string,
  
}
interface EventBody {
  transactions: Transactions[],
  userId: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { transactions, userId } = JSON.parse(event.body) as EventBody;

  const transactionsExcel = convertObjectInExcel(transactions)
  
  const uploadS3 = new UploadS3()
  const userFilesExportService = new UserFilesExportService()

  const keyTransaction = await uploadS3.uploadExcel(transactionsExcel)

  const userFiles = await userFilesExportService.create({
    userId,
    key: keyTransaction
  })

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Exportação feita com sucesso.",
      userFiles,
    })
  }
}