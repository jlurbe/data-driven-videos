export type SceneTextsModel = SceneText[];

export interface SceneText {
  id: number;
  projectId: number;
  sceneId: number;
  style: string;
  x: string;
  y: string;
  text: string;
}
