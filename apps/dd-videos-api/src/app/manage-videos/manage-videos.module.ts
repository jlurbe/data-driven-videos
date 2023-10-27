import { Logger, Module } from '@nestjs/common';
import { ManageVideosController } from './manage-videos.controller';
import { ManageVideosMockedRepository } from './repositories/implementations/manage-videos-mocked.repository';
import { ManageVideosRepository } from './repositories/manage-videos.repository';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';

@Module({
  controllers: [ManageVideosController],
  providers: [
    Logger,
    ManageVideosMockedRepository,
    {
      provide: MANAGE_VIDEOS_SERVICE_NAME,
      useFactory(manageVideosRepository: ManageVideosRepository) {
        return new ManageVideosService(manageVideosRepository);
      },
      inject: [ManageVideosMockedRepository],
    },
  ],
  exports: [MANAGE_VIDEOS_SERVICE_NAME],
})
export class ManageVideosModule {}
