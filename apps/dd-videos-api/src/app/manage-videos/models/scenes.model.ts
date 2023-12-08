export type ScenesModel = Scene[];

export interface Scene {
  id: string;
  projectId: string;
  duration: string;
  source: string;
}
