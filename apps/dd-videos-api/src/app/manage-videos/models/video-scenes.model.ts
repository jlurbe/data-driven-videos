export type VideoScenesModel = VideoScene[];

export interface VideoScene {
  scene: number;
  duration: number;
  videoSource: string;
  videoTexts: VideoText[];
}

interface VideoText {
  text: string;
  style: string;
  position: VideoPosition;
}

interface VideoPosition {
  x: string;
  y: string;
}
