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
      loggerLevel: process.env.LOG_LEVEL || 'info',
      api: {
        uploadMode: process.env.UPLOAD_MODE || '',
        ffmpegNodeSources: process.env.FFMPEG_NODE_SOURCES === 'true',
        spreadsheetId: process.env.SPREADSHEET_ID,
        tmpPath: process.env.TMP_PATH,
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
