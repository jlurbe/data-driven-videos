import { GetVideoScenesDataModel } from '../models/get-video-scenes-data.model';
import { VideoScenesModel } from '../models/video-scenes.model';

export interface ManageVideosRepository {
  getVideoScenesData({
    projectId,
  }: GetVideoScenesDataModel): Promise<VideoScenesModel>;
}
