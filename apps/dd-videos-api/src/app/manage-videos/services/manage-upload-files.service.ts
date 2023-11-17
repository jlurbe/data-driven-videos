import * as fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { UploadToS3Model } from '../models/upload-to-s3.model';
import { GetBucketFilesModel } from '../models/get-bucket-files.model';

export class ManageUploadFiles {
  public static async uploadToS3({
    filePath,
    objectKey,
    bucketName,
  }: UploadToS3Model): Promise<PutObjectCommandOutput> {
    const s3Client = new S3Client();
    const readStream = fs.createReadStream(`${filePath}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: readStream,
    });

    return new Promise((resolve, reject) => {
      s3Client.send(command, function (err, data) {
        readStream.destroy();

        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  }

  public static async getBucketObjects({
    bucketName,
    prefix,
  }: GetBucketFilesModel): Promise<string[]> {
    let isTruncated = true;
    const s3Client = new S3Client();
    const contents: string[] = [];
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await s3Client.send(command);

      if (!Contents) break;

      Contents.map((content) => {
        contents.push(content.Key);
      });

      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }

    return contents;
  }
}
