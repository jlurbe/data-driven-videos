import { VIDEO_DEFAULTS } from '../../../constants/video-defaults.contants';
import { SceneText } from '../../../models/scene-texts.model';
import { Scene } from '../../../models/scenes.model';
import { VideoScene, VideoText } from '../../../models/video-scenes.model';

/**
 * Mapper of manage videos
 */
export class ManageVideosMapper {
  public static async mapScenes(
    scenesData: Scene[],
    sceneTextsData: SceneText[],
    regularFont: string,
    boldFont: string,
    resolution: string,
    fps: string
  ): Promise<VideoScene[]> {
    const scenes: VideoScene[] = scenesData.map((scene) => {
      return {
        scene: parseInt(scene.id),
        duration: parseInt(scene.duration.toString()),
        boldFont: boldFont || VIDEO_DEFAULTS.BOLD_FONT,
        regularFont: regularFont || VIDEO_DEFAULTS.REGULAR_FONT,
        source: scene.source,
        resolution,
        fps: fps !== '' ? parseInt(fps) : VIDEO_DEFAULTS.FPS,
        videoTexts: this.mapSceneTexts(sceneTextsData, scene.id),
      };
    });

    return scenes;
  }

  public static mapSceneTexts(
    sceneTextsData: SceneText[],
    sceneId: string
  ): VideoText[] {
    const sceneTexts: VideoText[] = sceneTextsData
      .filter((scene) => scene.sceneId === sceneId)
      .map((scene) => {
        return {
          text: scene.text,
          style: scene.style,
          size:
            scene.size !== '' ? parseInt(scene.size) : VIDEO_DEFAULTS.TEXT_SIZE,
          color: scene.color || VIDEO_DEFAULTS.TEXT_COLOR,
          position: {
            x: scene.x,
            y: scene.y,
          },
          time: {
            ...(scene?.start_time !== '' && {
              start: parseInt(scene.start_time),
            }),
            ...(scene?.end_time !== '' && { end: parseInt(scene.end_time) }),
          },
        };
      });

    return sceneTexts;
  }
}
