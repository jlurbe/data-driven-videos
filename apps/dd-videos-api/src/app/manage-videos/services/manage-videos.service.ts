import { ManageVideosRepository } from '../repositories/manage-videos.repository';

export class ManageVideosService {
  constructor(private manageVideosRepository: ManageVideosRepository) {}

  async getVideoScenesData() {
    return this.manageVideosRepository.getVideoScenesData();
  }
}
