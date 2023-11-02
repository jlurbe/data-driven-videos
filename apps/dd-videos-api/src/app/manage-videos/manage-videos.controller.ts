import { Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';
import { GenerateVideoService } from './services/generate-video.service';

@Controller('ffmpeg')
export class ManageVideosController {
  constructor(
    @Inject(MANAGE_VIDEOS_SERVICE_NAME)
    private readonly manageVideosService: ManageVideosService,
    private readonly logger: Logger
  ) {}

  @Get('create/:projectId')
  async create(@Param('projectId') projectId: number): Promise<void> {
    // await this.manageVideosService.videoFromImages([
    //   `${config.api.pathUrl}/sources/frame001.jpg`,
    //   `${config.api.pathUrl}/sources/frame002.jpg`,
    // ]);
    const { audioTrack, scenes, fillInData } =
      await this.manageVideosService.getVideoScenesData(projectId);

    await Promise.all(
      fillInData.map(async (data) => {
        await new GenerateVideoService(this.logger).formatVideo(
          [...scenes],
          audioTrack,
          data
        );
      })
    );
    // for (const data of fillInData) {
    //   await new GenerateVideoService(this.logger).formatVideo(
    //     [...scenes],
    //     audioTrack,
    //     data
    //   );
    // }
  }
}
