export interface DDVideosApiConfigModel {
  loggerLevel: string;
  development: boolean;
  api: {
    uploadMode: string;
    ffmpegNodeSources: boolean;
    spreadsheetId: string;
    tmpPath: string;
  };
  aws: {
    s3: {
      bucketName: string;
    };
  };
}
