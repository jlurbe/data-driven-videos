export interface DDVideosApiConfigModel {
  loggerLevel: string;
  development: boolean;
  api: {
    version: string;
    prefix: string;
    envPrefix: string;
  };
}
