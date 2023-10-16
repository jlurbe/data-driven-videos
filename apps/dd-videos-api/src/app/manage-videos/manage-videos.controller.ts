import { Controller, Get } from '@nestjs/common';
import FfmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import config from '../config';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'node:path';
import fs from 'node:fs';

@Controller('ffmpeg')
export class ManageVideosController {
  constructor() {
    ffmpeg.setFfmpegPath(FfmpegStatic);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  @Get('create')
  async create(): Promise<void> {
    await this.videoFromImages([
      `${config.api.pathUrl}/origin/frame001.jpg`,
      `${config.api.pathUrl}/origin/frame002.jpg`,
    ]);
  }

  private videoFromImages(imageArray: string[]): void {
    const imagePath = imageArray.shift();
    const imageName = path.parse(imagePath).name;

    ffmpeg()
      .input(imagePath)
      .loop(5)
      .fps(30)
      .size('1024x768')
      // Output file
      .save(`${config.api.pathUrl}/tmp/${imageName}.mp4`)
      // Log the percentage of work completed
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processing ${imageName}.mp4: ${progress.percent}% done`);
        }
      })
      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        console.log(`${imageName}.mp4 created correctly`);

        if (imageArray.length > 0) {
          this.videoFromImages(imageArray);
        } else {
          this.mergeVideos();
        }
      })
      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        console.error(error);
      });
  }

  private mergeVideos() {
    const tmpVideos = fs.readdirSync(`${config.api.pathUrl}/tmp`);

    const mergedVideo = ffmpeg();
    tmpVideos.forEach(function (tmpVideo) {
      mergedVideo.addInput(`${config.api.pathUrl}/tmp/${tmpVideo}`);
    });

    mergedVideo
      .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', function () {
        console.log('Merging finished !');
      })
      .mergeToFile(
        `${config.api.pathUrl}/results/result.mp4`,
        `${config.api.pathUrl}/tmp`
      );
  }
}
