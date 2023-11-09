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
import { CreationMode } from './models/creation-mode.enum';

@Controller('ffmpeg')
export class ManageVideosController {
  constructor(
    @Inject(MANAGE_VIDEOS_SERVICE_NAME)
    private readonly manageVideosService: ManageVideosService,
    private readonly logger: Logger
  ) {}

  /**
   * Executes the data driven creation
   * @param projectId
   * @param creationMode values: "only-missing" (default), "all". If "all" it will remove all generated videos and it will create them once again
   * @returns
   */
  @Get('create/:projectId/:creationMode?')
  async create(
    @Param('projectId') projectId: number,
    @Param('creationMode') creationMode: CreationMode
  ): Promise<ResponseModel> {
    try {
      creationMode =
        creationMode === CreationMode.All
          ? CreationMode.All
          : CreationMode.OnlyMissing;

      // Remove tmp and videos processed folder
      const videosFolder = `${__dirname}/video/project${projectId
        .toString()
        .padStart(2, '0')}`;
      const tmpFolder = `${__dirname}/tmp/project${projectId
        .toString()
        .padStart(2, '0')}`;

      if (creationMode === CreationMode.All) {
        await fs.promises.rm(videosFolder, { recursive: true, force: true });
      }
      await fs.promises.rm(tmpFolder, { recursive: true, force: true });

      const scenesData = await this.manageVideosService.getVideoScenesData({
        projectId,
      });

      const { audioFile, scenes, fillInData } = scenesData;

      // Already created videos control
      let processedVideos: string[];
      try {
        processedVideos = fs
          .readdirSync(videosFolder)
          .map((video) => video.replace('.mp4', ''));
      } catch (error) {
        processedVideos = [];
      }

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
}
