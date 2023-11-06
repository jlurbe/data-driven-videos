import { Logger } from '@nestjs/common';
import FfmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'node:path';
import fs from 'node:fs';
import config from '../../config';
import { VideoScene } from '../models/video-scenes.model';
import { FormatVideoModel } from '../models/format-video.model';
import { MergeVideosModel } from '../models/merge-videos.model';
import { AddMusicTrackModel } from '../models/add-music-track.model';
import { CreateFolderModel } from '../models/create-folder.model';
import { TransformText } from '../models/transform-text.model';

export class GenerateVideoService {
  private uuid: string;
  private projectId: number;
  private totalTime = 0;

  constructor(private readonly logger: Logger) {
    ffmpeg.setFfmpegPath(FfmpegStatic);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  async formatVideo({
    videoScenes,
    audioFileName,
    data,
    projectId,
    tmpFolder,
  }: FormatVideoModel): Promise<void> {
    const videoScene = videoScenes.shift();
    this.uuid = data.uuid;
    this.projectId = projectId;
    this.totalTime += videoScene.duration;

    const videoPath = `${config.api.pathUrl}/sources/${videoScene.videoSource}`;
    const videoName = 'scene' + videoScene.scene.toString().padStart(2, '0');
    const DS = 1.0; // display start
    const DE = videoScene.duration - 1; // display end
    const FID = 1.5; // fade in duration
    const FOD = 1.5; // fade out duration

    // Create tmp directory
    const projectDir = `project${projectId.toString().padStart(2, '0')}`;
    if (!tmpFolder) {
      tmpFolder = `${config.api.pathUrl}/tmp/${projectDir}/${this.uuid}`;
      await this.createFolder({ folder: `${tmpFolder}/txt` });
    }

    return new Promise((resolve, reject) => {
      const scene = ffmpeg(videoPath);

      let i = 0;
      videoScene.videoTexts.forEach((videoText) => {
        const fontfile =
          videoText.style === 'regular'
            ? `${config.api.pathUrl}/assets/fonts/Nexa-ExtraLight.ttf`
            : `${config.api.pathUrl}/assets/fonts/Nexa-Heavy.ttf`;

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
              fontsize: 25,
              line_spacing: 5,
              fontcolor_expr: `ffffff%{eif\\: clip(255*(1*between(t\\, ${DS} + ${FID}\\, ${DE} - ${FOD}) + ((t - ${DS})/${FID})*between(t\\, ${DS}\\, ${DS} + ${FID}) + (-(t - ${DE})/${FOD})*between(t\\, ${DE} - ${FOD}\\, ${DE}) )\\, 0\\, 255) \\: x\\: 2 }`,
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
        'fade=in:st=0:d=1',
        `fade=out:st=${videoScene.duration - 1}:d=1`,
      ]);
      // Set fps
      scene.fpsOutput(30);
      // Set codec
      scene.videoCodec('libx265');
      scene.addOptions(['-crf 28']);
      // Remove audio
      scene.noAudio();
      // Video length in seconds
      scene.duration(videoScene.duration);
      // Video resolution
      // scene.size('848x480');
      scene.size('1280x720');
      // Output file
      scene.save(`${tmpFolder}/${videoName}.mp4`);
      // The callback that is run when FFmpeg is finished
      scene.on('end', () => {
        this.logger.log(`${this.uuid}: ${videoName}.mp4 created correctly`);

        if (videoScenes.length > 0) {
          resolve(
            this.formatVideo({
              videoScenes,
              audioFileName,
              data,
              projectId,
              tmpFolder,
            })
          );
        } else {
          resolve(this.mergeVideos({ tmpFolder, audioFileName }));
        }
      });
      // The callback that is run when FFmpeg encountered an error
      scene.on('error', (err) => {
        this.logger.error(`${this.uuid}: An error occurred: ${err.message}`);
        reject();
      });
    });
  }

  private videoFromImages(imageArray: string[]): void {
    const imagePath = imageArray.shift();
    const imageName = path.parse(imagePath).name;
    const DS = 1.0; // display start
    const DE = 5.0; // display end
    const FID = 1.5; // fade in duration
    const FOD = 3; // fade out duration

    ffmpeg()
      .input(imagePath)
      .loop(10)
      .fps(60)
      .videoFilters([
        {
          filter: 'drawtext',
          options: {
            fontfile: `${config.api.pathUrl}/assets/fonts/LEMONMILK-Regular.otf`,
            text: 'CUSTOM TEXT',
            fontsize: 24,
            fontcolor_expr: `ffffff%{eif\\: clip(255*(1*between(t\\, ${DS} + ${FID}\\, ${DE} - ${FOD}) + ((t - ${DS})/${FID})*between(t\\, ${DS}\\, ${DS} + ${FID}) + (-(t - ${DE})/${FOD})*between(t\\, ${DE} - ${FOD}\\, ${DE}) )\\, 0\\, 255) \\: x\\: 2 }`,
            // x: '(main_w/2-text_w/2)',
            x: '100+(W/tw)*0.2*n',
            y: 100,
            // shadowcolor: 'black',
            // shadowx: 2,
            // shadowy: 2,
          },
        },
      ])
      .size('1024x768')
      // Output file
      .save(`${config.api.pathUrl}/tmp/${imageName}.mp4`)
      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        this.logger.log(`${imageName}.mp4 created correctly`);

        if (imageArray.length > 0) {
          this.videoFromImages(imageArray);
        } else {
          // this.mergeVideos(tmpFolder);
        }
      })
      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        this.logger.error(error);
      });
  }

  private async mergeVideos({
    tmpFolder,
    audioFileName,
  }: MergeVideosModel): Promise<void> {
    const inputVideoFilePath = `${tmpFolder}/${this.uuid}.mp4`;
    const inputAudioFilePath = `${config.api.pathUrl}/sources/${audioFileName}`;

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
              inputVideoFilePath,
              inputAudioFilePath,
              tmpFolder,
            })
          );
        })
        .mergeToFile(inputVideoFilePath, tmpFolder);
    });
  }

  private async addMusicTrack({
    inputVideoFilePath,
    inputAudioFilePath,
    tmpFolder,
  }: AddMusicTrackModel): Promise<void> {
    const projectDir = `project${this.projectId.toString().padStart(2, '0')}`;
    const projectPath = `${config.api.pathUrl}/video/${projectDir}`;
    const outputVideoFilePath = `${config.api.pathUrl}/video/${projectDir}/${this.uuid}.mp4`;
    await this.createFolder({ folder: projectPath });

    return new Promise((resolve, reject) => {
      ffmpeg(inputVideoFilePath)
        .input(inputAudioFilePath)
        .audioFilters([`afade=t=out:st=${this.totalTime - 5}:d=5`])
        .output(outputVideoFilePath)
        .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
        .on('start', () => {
          this.logger.log(`${this.uuid}: Adding audio track starting...`);
        })
        .on('error', (err) => {
          this.logger.error(`${this.uuid}: An error occurred: ${err.message}`);
          reject;
        })
        .on('end', () => {
          // remove tmp folder
          fs.rmSync(tmpFolder, { recursive: true, force: true });
          this.logger.log(`${this.uuid}: Removed tmp folder - ${tmpFolder}`);
          this.logger.log(`${this.uuid}: Adding audio track completed`);
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
}
