import { Module } from '@nestjs/common';
import { ManageVideosModule } from './manage-videos/manage-videos.module';

@Module({
  imports: [ManageVideosModule],
})
export class AppModule {}
