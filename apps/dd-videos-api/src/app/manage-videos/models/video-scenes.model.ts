export interface VideoScenesModel {
  audioTrack: string;
  scenes: VideoScene[];
  fillInData: Record<string, any>[];
}

export interface VideoScene {
  scene: number;
  duration: number;
  videoSource: string;
  videoTexts: VideoText[];
}

export interface VideoText {
  text: string;
  style: string;
  position: VideoPosition;
}

export interface VideoPosition {
  x: string;
  y: string;
}
