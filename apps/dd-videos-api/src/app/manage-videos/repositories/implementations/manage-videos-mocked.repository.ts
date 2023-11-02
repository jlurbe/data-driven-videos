import { Injectable } from '@nestjs/common';
import { VideoScenesModel } from '../../models/video-scenes.model';
import { ManageVideosRepository } from '../manage-videos.repository';
import { videoScenes } from './mocked-data/video-scenes.mock';
import { iberiaUser } from './mocked-data/iberia-user.mock';

@Injectable()
export class ManageVideosMockedRepository implements ManageVideosRepository {
  async getVideoScenesData(): Promise<VideoScenesModel> {
    return {
      audioTrack: 'Spirit of Fire.mp3',
      scenes: videoScenes,
      fillInData: iberiaUser,
    };
  }
}
