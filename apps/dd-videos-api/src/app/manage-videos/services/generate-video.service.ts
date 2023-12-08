import { Logger } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'node:fs';
import { FormatVideoModel } from '../models/format-video.model';
import { MergeVideosModel } from '../models/merge-videos.model';
import { AddMusicTrackModel } from '../models/add-music-track.model';
import { CreateFolderModel } from '../models/create-folder.model';
import { TransformText } from '../models/transform-text.model';
import { ManageUploadFiles } from './manage-upload-files.service';
import config from '../../config';
import { UploadMode } from '../models/upload-mode.enum';
import { VIDEO_DEFAULTS } from '../constants/video-defaults.contants';
// FFMPEG FROM NODE. UNCOMMENT FOR ACTIVATE
// if (config.api.ffmpegNodeSources) {
//   import('ffmpeg-static').then((ffmpegStatic) => {
//     ffmpeg.setFfmpegPath(ffmpegStatic.default);
//   });
//   import('@ffprobe-installer/ffprobe').then((ffprobeInstaller) => {
//     ffmpeg.setFfprobePath(ffprobeInstaller.path);
//   });
// }

export class GenerateVideoService {
  private uuid: string;
  private projectId: number;
  private totalTime = 0;

  constructor(private readonly logger: Logger) {}

  async formatVideo({
    videoScenes,
    audioFile,
    data,
    projectId,
    tmpFolder,
  }: FormatVideoModel): Promise<void> {
    const videoScene = videoScenes.shift();
    this.uuid = data.uuid;
    this.projectId = projectId;
    this.totalTime += videoScene.duration;

    const videoName = 'scene' + videoScene.scene.toString().padStart(2, '0');

    // Create tmp directory
    const projectDir = `project${projectId.toString().padStart(2, '0')}`;
    if (!tmpFolder) {
      tmpFolder = `${config.api.tmpPath}/${projectDir}/tmp/${this.uuid}`;
      await this.createFolder({ folder: `${tmpFolder}/txt` });
    }

    return new Promise((resolve, reject) => {
      const scene = ffmpeg(videoScene.source);
      const FID = VIDEO_DEFAULTS.TEXT_FADE_IN_DURATION; // fade in duration
      const FOD = VIDEO_DEFAULTS.TEXT_FADE_OUT_DURATION; // fade out duration

      let i = 0;
      videoScene.videoTexts.forEach((videoText) => {
        const color = videoText.color || VIDEO_DEFAULTS.TEXT_COLOR;
        const DS =
          videoText?.time?.start || VIDEO_DEFAULTS.TEXT_DISPLAY_IN_TIME; // display start
        const DE =
          videoText?.time?.end ||
          videoScene.duration - VIDEO_DEFAULTS.TEXT_DISPLAY_OUT_TIME; // display end

        const fontfile =
          videoText.style === 'regular'
            ? `${__dirname}/assets/fonts/${
                videoScene.regularFont || VIDEO_DEFAULTS.REGULAR_FONT
              }`
            : `${__dirname}/assets/fonts/${
                videoScene.boldFont || VIDEO_DEFAULTS.BOLD_FONT
              }`;

        // Create file with text to display
        // Needed to avoid the special characters issue in drawtext
        const textfile = `${tmpFolder}/txt/${videoName}-${i++}.txt`;
        fs.writeFileSync(
          textfile,
          this.transformTextWithFields({
            textToTransform: videoText.text,
            fields: data,
          })
        );

        scene.videoFilters([
          {
            filter: 'drawtext',
            options: {
              fontfile,
              textfile,
              fontsize: videoText.size || VIDEO_DEFAULTS.TEXT_SIZE,
              line_spacing: VIDEO_DEFAULTS.TEXT_LINE_SPACING,
              fontcolor: color,
              alpha: `min(max(0, (t - ${DS}) / ${FID}), max(0, (${DE} - t) / ${FOD}))`,
              // x: '(main_w/2-text_w/2)',
              // x: '100+(W/tw)*0.2*n',
              x: videoText.position.x,
              y: videoText.position.y,
            },
          },
        ]);
      });
      // Video transition
      scene.videoFilters([
        `fade=in:st=0:d=${VIDEO_DEFAULTS.SCENE_FADE_IN}`,
        `fade=out:st=${videoScene.duration - VIDEO_DEFAULTS.SCENE_FADE_OUT}:d=${
          VIDEO_DEFAULTS.SCENE_FADE_OUT
        }`,
      ]);
      // Set fps
      scene.fpsOutput(videoScene.fps || VIDEO_DEFAULTS.FPS);
      // Set codec
      scene.videoCodec('libx265');
      scene.addOptions(['-crf 28']);
      // Remove audio
      scene.noAudio();
      // Video length in seconds
      if (!this.isVideo(videoScene.source)) {
        scene.loop(videoScene.duration);
      } else {
        scene.duration(videoScene.duration);
      }
      // Video resolution
      scene.size(videoScene.resolution);
      // Output file
      scene.save(`${tmpFolder}/${videoName}.mp4`);
      // The callback that is run when FFmpeg is finished
      scene.on('end', () => {
        this.logger.log(`${this.uuid}: ${videoName}.mp4 created correctly`);

        if (videoScenes.length > 0) {
          resolve(
            this.formatVideo({
              videoScenes,
              audioFile,
              data,
              projectId,
              tmpFolder,
            })
          );
        } else {
          resolve(this.mergeVideos({ tmpFolder, audioFile }));
        }
      });
      // The callback that is run when FFmpeg encountered an error
      scene.on('error', (err) => {
        this.logger.error(`${this.uuid}: An error occurred: ${err.message}`);
        reject();
      });
    });
  }

  private async mergeVideos({
    tmpFolder,
    audioFile,
  }: MergeVideosModel): Promise<void> {
    const inputVideoFilePath = `${tmpFolder}/${this.uuid}.mp4`;

    return new Promise((resolve, reject) => {
      const mergedVideo = ffmpeg();
      const tmpVideos = fs.readdirSync(tmpFolder);
      tmpVideos.forEach(function (tmpVideo) {
        if (tmpVideo.includes('scene')) {
          mergedVideo.addInput(`${tmpFolder}/${tmpVideo}`);
        }
      });

      mergedVideo
        .on('start', () => {
          this.logger.log(`${this.uuid}: Merging ${this.uuid}.mp4 start...`);
        })
        .on('error', (err) => {
          this.logger.error(`${this.uuid}: An error occurred: ${err.message}`);
          reject();
        })
        .on('end', () => {
          this.logger.log(`${this.uuid}: Merging ${this.uuid}.mp4 finished`);

          // Add audio track
          resolve(
            this.addMusicTrack({
              audioFile,
              tmpFolder,
            })
          );
        })
        .mergeToFile(inputVideoFilePath, tmpFolder);
    });
  }

  private async addMusicTrack({
    audioFile,
    tmpFolder,
  }: AddMusicTrackModel): Promise<void> {
    const projectDir = `project${this.projectId.toString().padStart(2, '0')}`;
    const inputVideoFilePath = `${tmpFolder}/${this.uuid}.mp4`;
    const projectPath = `${config.api.tmpPath}/${projectDir}/processed`;
    const outputVideoFilePath = `${projectPath}/${this.uuid}.mp4`;
    await this.createFolder({ folder: projectPath });

    return new Promise((resolve, reject) => {
      const fadeOutStartTime =
        this.totalTime - VIDEO_DEFAULTS.MUSIC_FADE_OUT_TIME;
      ffmpeg(inputVideoFilePath)
        .input(audioFile)
        .audioFilters([
          `afade=t=out:st=${fadeOutStartTime > 0 ? fadeOutStartTime : 0}:d=${
            VIDEO_DEFAULTS.MUSIC_FADE_OUT_TIME
          }`,
        ])
        .output(outputVideoFilePath)
        .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
        .on('start', () => {
          this.logger.log(`${this.uuid}: Adding audio track starting...`);
        })
        .on('error', (err) => {
          this.logger.error(`${this.uuid}: An error occurred: ${err.message}`);
          reject;
        })
        .on('end', async () => {
          // remove tmp folder
          fs.rmSync(tmpFolder, { recursive: true, force: true });
          this.logger.log(`${this.uuid}: Removed tmp folder - ${tmpFolder}`);
          this.logger.log(`${this.uuid}: Adding audio track completed`);

          if (config.api.uploadMode === UploadMode.S3) {
            await ManageUploadFiles.uploadToS3({
              filePath: outputVideoFilePath,
              objectKey: `${projectDir}/${this.uuid}.mp4`,
              bucketName: config.aws.s3.bucketName,
            });
          }
          resolve();
        })
        .run();
    });
  }

  private transformTextWithFields({
    textToTransform,
    fields,
  }: TransformText): string {
    Object.keys(fields).forEach((field) => {
      textToTransform = textToTransform.replace(
        new RegExp(`__${field}__`, 'g'),
        fields[field]
      );
    });

    Object.keys(fields).forEach((field) => {
      textToTransform = textToTransform.replace(
        new RegExp(`_up_${field}_up_`, 'g'),
        fields[field].toString().toUpperCase()
      );
    });

    return textToTransform;
  }

  private async createFolder({ folder }: CreateFolderModel): Promise<void> {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  private isVideo(sourcePath: string): boolean {
    const extension = sourcePath.split('.').pop();
    const videoExtensions = [
      'mp4',
      'mkv',
      'flv',
      'mov',
      'wmv',
      'avi',
      'avchd',
      'f4v',
      'swf',
      'webm',
      'mts',
    ];

    return videoExtensions.includes(extension);
  }
}
