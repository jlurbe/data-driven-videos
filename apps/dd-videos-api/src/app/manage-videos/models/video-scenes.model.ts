export interface VideoScenesModel {
  audioFile: string;
  scenes: VideoScene[];
  fillInData: Record<string, any>[];
}

export interface VideoScene {
  scene: number;
  duration: number;
  source: string;
  resolution: string;
  fps: number;
  regularFont: string;
  boldFont: string;
  videoTexts: VideoText[];
}

export interface VideoText {
  text: string;
  style: string;
  position: VideoPosition;
  time?: VideoTime;
  size: number;
  color: string;
}

export interface VideoPosition {
  x: string;
  y: string;
}

export interface VideoTime {
  start?: number;
  end?: number;
}
