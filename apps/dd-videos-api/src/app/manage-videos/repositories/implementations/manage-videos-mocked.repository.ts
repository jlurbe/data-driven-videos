import { Injectable } from '@nestjs/common';
import { VideoScenesModel } from '../../models/video-scenes.model';
import { ManageVideosRepository } from '../manage-videos.repository';
import { videoScenes } from './mocked-data/video-scenes.mock';

@Injectable()
export class ManageVideosMockedRepository implements ManageVideosRepository {
  async getVideoScenesData(): Promise<VideoScenesModel> {
    return JSON.parse(JSON.stringify(videoScenes));
  }
}
