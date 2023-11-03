import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
} from '@nestjs/common';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';
import { GenerateVideoService } from './services/generate-video.service';
import { ResponseModel } from './models/response.model';

@Controller('ffmpeg')
export class ManageVideosController {
  constructor(
    @Inject(MANAGE_VIDEOS_SERVICE_NAME)
    private readonly manageVideosService: ManageVideosService,
    private readonly logger: Logger
  ) {}

  @Get('create/:projectId')
  async create(@Param('projectId') projectId: number): Promise<ResponseModel> {
    try {
      const scenesData = await this.manageVideosService.getVideoScenesData(
        projectId
      );

      const { audioTrack, scenes, fillInData } = scenesData;

      await Promise.all(
        fillInData.map(async (data) => {
          await new GenerateVideoService(this.logger).formatVideo(
            [...scenes],
            audioTrack,
            data
          );
        })
      );

      return { message: 'success' };
    } catch (error) {
      if (error?.message) this.logger.error(error.message);
      throw new HttpException(
        error?.message ?? 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
