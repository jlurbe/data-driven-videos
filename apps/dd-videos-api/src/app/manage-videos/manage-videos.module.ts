import { Logger, Module } from '@nestjs/common';
import { ManageVideosController } from './manage-videos.controller';
import { ManageVideosRepository } from './repositories/manage-videos.repository';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';
import { ManageVideosGsheetsRepository } from './repositories/implementations/manage-videos-gsheets.repository';

@Module({
  controllers: [ManageVideosController],
  providers: [
    Logger,
    ManageVideosGsheetsRepository,
    {
      provide: MANAGE_VIDEOS_SERVICE_NAME,
      useFactory(manageVideosRepository: ManageVideosRepository) {
        return new ManageVideosService(manageVideosRepository);
      },
      inject: [ManageVideosGsheetsRepository],
    },
  ],
  exports: [MANAGE_VIDEOS_SERVICE_NAME],
})
export class ManageVideosModule {}
