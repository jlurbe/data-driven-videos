import { VideoScene } from './video-scenes.model';

export interface FormatVideoModel {
  videoScenes: VideoScene[];
  audioFile: string;
  data: Record<string, any>;
  projectId: number;
  tmpFolder?: string;
}
