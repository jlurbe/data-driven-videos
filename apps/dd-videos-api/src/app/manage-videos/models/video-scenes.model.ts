export interface VideoScenesModel {
  audioFile: string;
  scenes: VideoScene[];
  fillInData: Record<string, any>[];
}

export interface VideoScene {
  scene: number;
  duration: number;
  source: string;
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
