import { Module } from '@nestjs/common';
import { ManageVideosController } from './manage-videos.controller';

@Module({
  controllers: [ManageVideosController],
})
export class ManageVideosModule {}
