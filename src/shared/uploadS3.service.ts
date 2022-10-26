import { S3 } from 'aws-sdk';
import { GeneratorService } from './generator.service';

export class UploadS3 {
  readonly s3: S3;
  readonly generator: GeneratorService;

  constructor() {
    this.s3 = new S3();
    this.generator = new GeneratorService();
  }

  async uploadExcel(file: any) {
    const key = this.generator.fileName('xlsm')

    await this.s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `export/${key}`,
      ACL: 'public-read',
      Body:  file,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }).promise();

    return key

  }
}