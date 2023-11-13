import { DDVideosApiConfigModel } from './models/dd-videos-api-config.model';

export class DDVideosApiConfigService {
  private config: DDVideosApiConfigModel;
  static instance: DDVideosApiConfigService;

  static getInstance(): DDVideosApiConfigService {
    if (!this.instance) {
      this.instance = new DDVideosApiConfigService();
    }
    return this.instance;
  }

  constructor() {
    this.config = {
      development: Boolean(process.env.DEVELOPMENT),
      loggerLevel: process.env.LOG_LEVEL,
      api: {
        version: process.env.API_VERSION || 'v1',
        prefix: process.env.API_PREFIX || '',
        envPrefix: process.env.ENV_PREFIX || '',
        uploadMode: process.env.UPLOAD_MODE || '',
      },
      aws: {
        s3: {
          bucketName: process.env.S3_BUCKET,
        },
      },
    };
  }

  getConfig(): DDVideosApiConfigModel {
    return this.config;
  }
}
