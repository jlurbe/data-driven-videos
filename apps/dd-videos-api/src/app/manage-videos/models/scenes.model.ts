export type ScenesModel = Scene[];

export interface Scene {
  id: number;
  projectId: number;
  duration: string;
  videoSource: string;
}
