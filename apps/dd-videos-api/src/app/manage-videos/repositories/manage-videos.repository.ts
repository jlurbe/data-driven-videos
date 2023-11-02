import { VideoScenesModel } from '../models/video-scenes.model';

export interface ManageVideosRepository {
  getVideoScenesData(projectId: number): Promise<VideoScenesModel>;
}
