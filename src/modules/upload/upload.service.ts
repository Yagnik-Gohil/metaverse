import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  S3Client,
  PutObjectCommandInput,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    endpoint: process.env.AWS_ENDPOINT,
    folder: process.env.AWS_FOLDER_NAME,
  };
  private s3Client = new S3Client({
    region: this.awsConfig.region,
    endpoint: this.awsConfig.endpoint,
    credentials: {
      accessKeyId: this.awsConfig.accessKeyId,
      secretAccessKey: this.awsConfig.secretAccessKey,
    },
  });

  async uploadFileFromDisk(
    filePath: string,
    mimeType: string,
    folder: string,
  ): Promise<{
    base_url: string;
    folder: string;
    image: string;
  }> {
    const fileName = path.basename(filePath);

    const params: PutObjectCommandInput = {
      Bucket: this.awsConfig.bucketName,
      Key: `${this.awsConfig.folder}/${folder}/${fileName}`,
      Body: await fs.readFile(filePath),
      ContentType: mimeType,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);

      return {
        base_url: process.env.CDN_ENDPOINT,
        folder: `${this.awsConfig.folder}/${folder}/`,
        image: fileName,
      };
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }
}
