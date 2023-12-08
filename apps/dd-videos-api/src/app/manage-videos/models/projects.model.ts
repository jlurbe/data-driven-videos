export type ProjectsModel = Project[];

export interface Project {
  id: string;
  name: string;
  audioFile: string;
  dataTable: string;
  resolution: string;
  fps: string;
  regularFont: string;
  boldFont: string;
}
