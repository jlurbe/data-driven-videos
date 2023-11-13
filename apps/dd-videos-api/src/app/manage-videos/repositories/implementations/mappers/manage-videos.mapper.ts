import { SceneText } from '../../../models/scene-texts.model';
import { Scene } from '../../../models/scenes.model';
import { VideoScene, VideoText } from '../../../models/video-scenes.model';

/**
 * Mapper of manage videos
 */
export class ManageVideosMapper {
  public static async mapScenes(
    scenesData: Scene[],
    sceneTextsData: SceneText[]
  ): Promise<VideoScene[]> {
    const scenes: VideoScene[] = scenesData.map((scene) => {
      return {
        scene: scene.id,
        duration: parseInt(scene.duration.toString()),
        source: scene.source,
        videoTexts: this.mapSceneTexts(sceneTextsData, scene.id),
      };
    });

    return scenes;
  }

  public static mapSceneTexts(
    sceneTextsData: SceneText[],
    sceneId: number
  ): VideoText[] {
    const sceneTexts: VideoText[] = sceneTextsData
      .filter((scene) => scene.sceneId === sceneId)
      .map((scene) => {
        return {
          text: scene.text,
          style: scene.style,
          position: {
            x: scene.x,
            y: scene.y,
          },
        };
      });

    return sceneTexts;
  }
}
