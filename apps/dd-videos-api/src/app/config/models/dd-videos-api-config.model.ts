export interface DDVideosApiConfigModel {
  loggerLevel: string;
  development: boolean;
  api: {
    version: string;
    prefix: string;
    envPrefix: string;
    uploadMode: string;
  };
  aws: {
    s3: {
      bucketName: string;
    };
  };
}
