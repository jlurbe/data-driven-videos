import { GetVideoScenesDataModel } from '../models/get-video-scenes-data.model';
import { VideoScenesModel } from '../models/video-scenes.model';
import { ManageVideosRepository } from '../repositories/manage-videos.repository';

export class ManageVideosService {
  constructor(private manageVideosRepository: ManageVideosRepository) {}

  async getVideoScenesData({
    projectId,
  }: GetVideoScenesDataModel): Promise<VideoScenesModel> {
    return this.manageVideosRepository.getVideoScenesData({ projectId });
  }
}
