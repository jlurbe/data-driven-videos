export type SceneTextsModel = SceneText[];

export interface SceneText {
  id: string;
  projectId: string;
  sceneId: string;
  style: string;
  size?: string;
  color?: string;
  x: string;
  y: string;
  start_time?: string;
  end_time?: string;
  text: string;
}
