import { Injectable } from '@nestjs/common';
import { VideoScenesModel } from '../../models/video-scenes.model';
import { ManageVideosRepository } from '../manage-videos.repository';
import {
  getAuthToken,
  getSpreadSheetValues,
} from '../../../shared/services/google-sheets.service';
import { ProjectsModel } from '../../models/projects.model';
import { ScenesModel } from '../../models/scenes.model';
import { SceneTextsModel } from '../../models/scene-texts.model';
import { ManageVideosMapper } from './mappers/manage-videos.mapper';
import { GSheetsError } from '../../../shared/errors/errors';
import { GetVideoScenesDataModel } from '../../models/get-video-scenes-data.model';

const spreadsheetId = '14E65Z7M22MEEP_3IUqBQqHU6IuXqA7HBxiJFToTRP6U';

@Injectable()
export class ManageVideosGsheetsRepository implements ManageVideosRepository {
  private authToken;

  async getToken(): Promise<void> {
    if (!this.authToken) {
      this.authToken = await getAuthToken();
    }
  }

  async getVideoScenesData({
    projectId,
  }: GetVideoScenesDataModel): Promise<VideoScenesModel> {
    // Gets the token if it's not ready
    await this.getToken();

    // Get project data
    const projectsData = (await getSpreadSheetValues({
      auth: this.authToken,
      spreadsheetId,
      sheetName: 'projects',
    })) as ProjectsModel;
    const selectedProject = projectsData.find(
      (project) => project.id === projectId
    );

    if (!selectedProject) {
      throw new GSheetsError('Project id not found');
    }

    // Get scenes data
    const scenesData = (await getSpreadSheetValues({
      auth: this.authToken,
      spreadsheetId,
      sheetName: 'scenes',
    })) as ScenesModel;
    const selectedScenes = scenesData.filter(
      (scene) => scene.projectId === selectedProject.id
    );

    if (!selectedScenes || selectedScenes.length === 0) {
      throw new GSheetsError('Scenes not found');
    }

    // Get text scenes data
    const textScenesData = (await getSpreadSheetValues({
      auth: this.authToken,
      spreadsheetId,
      sheetName: 'scene_texts',
    })) as SceneTextsModel;
    const selectedTextScenes = textScenesData.filter(
      (scene) => scene.projectId === selectedProject.id
    );

    // Get data to fill in
    const fillInData = await getSpreadSheetValues({
      auth: this.authToken,
      spreadsheetId,
      sheetName: selectedProject.dataTable,
    });

    return {
      audioFileName: selectedProject.audioFileName,
      scenes: await ManageVideosMapper.mapScenes(
        selectedScenes,
        selectedTextScenes
      ),
      fillInData,
    };
  }
}
