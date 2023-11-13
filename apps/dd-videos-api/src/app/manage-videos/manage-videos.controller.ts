import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
} from '@nestjs/common';
import fs from 'node:fs';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';
import { GenerateVideoService } from './services/generate-video.service';
import { ResponseModel } from './models/response.model';
import config from '../config';
import { UploadMode } from './models/upload-mode.enum';
import { ManageUploadFiles } from './services/manage-upload-files.service';
import { GetProcessedVideosModel } from './models/get-processed-videos.model';

@Controller('ffmpeg')
export class ManageVideosController {
  constructor(
    @Inject(MANAGE_VIDEOS_SERVICE_NAME)
    private readonly manageVideosService: ManageVideosService,
    private readonly logger: Logger
  ) {}

  /**
   * Executes the data driven creation
   * @param {number} projectId
   * @returns {ResponseModel}
   */
  @Get('create/:projectId')
  async create(@Param('projectId') projectId: number): Promise<ResponseModel> {
    try {
      const projectFolder = `project${projectId.toString().padStart(2, '0')}`;
      const videosFolder = `${__dirname}/video/${projectFolder}`;
      const tmpFolder = `${__dirname}/tmp/${projectFolder}`;

      // Remove tmp and videos processed folder
      await fs.promises.rm(tmpFolder, { recursive: true, force: true });

      const scenesData = await this.manageVideosService.getVideoScenesData({
        projectId,
      });

      const { audioFile, scenes, fillInData } = scenesData;

      // Already created videos control
      const processedVideos = await this.getProcessedVideos({
        videosFolder,
        projectFolder,
      });

      await Promise.allSettled(
        fillInData.map(async (data) => {
          if (!processedVideos.includes(data.uuid)) {
            await new GenerateVideoService(this.logger).formatVideo({
              videoScenes: [...scenes],
              audioFile,
              data,
              projectId,
            });
          }
        })
      );

      return { message: 'success' };
    } catch (error) {
      if (error?.message) this.logger.error(error);
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getProcessedVideos({
    videosFolder,
    projectFolder,
  }: GetProcessedVideosModel): Promise<string[]> {
    let processedVideos: string[];

    switch (config.api.uploadMode) {
      case UploadMode.S3:
        processedVideos = (
          await ManageUploadFiles.getBucketObjects({
            bucketName: config.aws.s3.bucketName,
            prefix: projectFolder,
          })
        ).map((video) =>
          video.replace(`${projectFolder}/`, '').replace('.mp4', '')
        );
        break;
      default:
        try {
          processedVideos = fs
            .readdirSync(videosFolder)
            .map((video) => video.replace('.mp4', ''));
        } catch (error) {
          processedVideos = [];
        }
    }

    return processedVideos;
  }
}
