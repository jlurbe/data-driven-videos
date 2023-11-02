import { VideoScenesModel } from '../models/video-scenes.model';
import { ManageVideosRepository } from '../repositories/manage-videos.repository';

export class ManageVideosService {
  constructor(private manageVideosRepository: ManageVideosRepository) {}

  async getVideoScenesData(projectId: number): Promise<VideoScenesModel> {
    return this.manageVideosRepository.getVideoScenesData(projectId);
  }
}
