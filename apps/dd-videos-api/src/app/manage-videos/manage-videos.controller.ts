import { Controller, Get, Inject } from '@nestjs/common';
import FfmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import config from '../config';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'node:path';
import fs from 'node:fs';
import { VideoScenesModel } from './models/video-scenes.model';
import { iberiaUser } from './repositories/implementations/mocked-data/iberia-user.mock';
import { ManageVideosService } from './services/manage-videos.service';
import { MANAGE_VIDEOS_SERVICE_NAME } from './constants/manage-videos.constants';

@Controller('ffmpeg')
export class ManageVideosController {
  private uuid: string;
  private totalTime = 0;

  constructor(
    @Inject(MANAGE_VIDEOS_SERVICE_NAME)
    private manageVideosService: ManageVideosService
  ) {
    ffmpeg.setFfmpegPath(FfmpegStatic);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  @Get('create')
  async create(): Promise<void> {
    // await this.videoFromImages([
    //   `${config.api.pathUrl}/sources/frame001.jpg`,
    //   `${config.api.pathUrl}/sources/frame002.jpg`,
    // ]);
    const videoScenes = await this.manageVideosService.getVideoScenesData();

    await this.formatVideo(videoScenes);
  }

  private formatVideo(videoScenes: VideoScenesModel, tmpFolder?: string): void {
    const videoScene = videoScenes.shift();

    this.uuid = iberiaUser.uuid;
    this.totalTime += videoScene.duration;

    const videoPath = `${config.api.pathUrl}/sources/${videoScene.videoSource}`;
    const videoName = 'scene' + videoScene.scene.toString().padStart(2, '0');
    const DS = 1.0; // display start
    const DE = videoScene.duration - 1; // display end
    const FID = 1.5; // fade in duration
    const FOD = 1.5; // fade out duration

    // Create tmp directory
    if (!tmpFolder) {
      tmpFolder = `${config.api.pathUrl}/tmp/${this.uuid}`;
      if (!fs.existsSync(tmpFolder)) {
        fs.mkdirSync(tmpFolder);
        fs.mkdirSync(`${tmpFolder}/txt`);
      }
    }

    const scene = ffmpeg(videoPath);

    let i = 1;
    videoScene.videoTexts.forEach((videoText) => {
      const fontfile =
        videoText.style === 'regular'
          ? `${config.api.pathUrl}/assets/fonts/Nexa-ExtraLight.ttf`
          : `${config.api.pathUrl}/assets/fonts/Nexa-Heavy.ttf`;

      // Create file with text to display
      // Needed to avoit the special characters issue in drawtext
      const textfile = `${tmpFolder}/txt/${videoName}-${i}.txt`;
      i++;
      fs.writeFileSync(
        textfile,
        this.transformTextWithFields(videoText.text, iberiaUser)
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
    scene.size('848x480');
    // scene.size('1280x720');
    // Output file
    scene.save(`${tmpFolder}/${videoName}.mp4`);
    // The callback that is run when FFmpeg starts
    scene.on('start', () => {
      console.log(`Processing ${videoName}.mp4`);
    });
    // Log the percentage of work completed
    // scene.on('progress', (progress) => {
    //   if (progress.percent) {
    //     console.log(`Processing ${videoName}.mp4: ${progress.percent}% done`);
    //   }
    // });
    // The callback that is run when FFmpeg is finished
    scene.on('end', () => {
      console.log(`${videoName}.mp4 created correctly`);

      if (videoScenes.length > 0) {
        this.formatVideo(videoScenes, tmpFolder);
      } else {
        this.mergeVideos(tmpFolder);
      }
    });
    // The callback that is run when FFmpeg encountered an error
    scene.on('error', (error) => {
      console.error(error);
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
          // this.mergeVideos(tmpFolder);
        }
      })
      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        console.error(error);
      });
  }

  private mergeVideos(tmpFolder: string) {
    const outputFile = `${tmpFolder}/${this.uuid}.mp4`;
    const audioFile = `${config.api.pathUrl}/sources/Spirit of fire.mp3`;

    const mergedVideo = ffmpeg();
    const tmpVideos = fs.readdirSync(tmpFolder);
    tmpVideos.forEach(function (tmpVideo) {
      if (tmpVideo.includes('scene')) {
        mergedVideo.addInput(`${tmpFolder}/${tmpVideo}`);
      }
    });

    mergedVideo
      .on('start', function () {
        console.log('Merging start...');
      })
      // Log the percentage of work completed
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Meging result.mp4: ${progress.percent}% done`);
        }
      })
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', () => {
        console.log('Merging finished');

        // Add audio track
        this.addMusicTrack(outputFile, audioFile, tmpFolder);
      })
      .mergeToFile(outputFile, tmpFolder);
  }

  private addMusicTrack(
    inputVideoFilePath: string,
    inputAudioFilePath: string,
    tmpFolder: string
  ) {
    const outputVideoFilePath = `${config.api.pathUrl}/video/${this.uuid}.mp4`;
    this.totalTime;
    ffmpeg(inputVideoFilePath)
      .input(inputAudioFilePath)
      .audioFilters([`afade=t=out:st=${this.totalTime - 5}:d=5`])
      .output(outputVideoFilePath)
      .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
      .on('start', function () {
        console.log('Adding audio track starting...');
      })
      // Log the percentage of work completed
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Adding audio track: ${progress.percent}% done`);
        }
      })
      .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', () => {
        // remove tmp folder
        fs.rmSync(tmpFolder, { recursive: true, force: true });
        console.log(`Removed tmp folder: ${tmpFolder}`);
        console.log('Adding audio track completed');
      })
      .run();
  }

  private transformTextWithFields(textToTransform: string, fields): string {
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

    // Transform special characters
    // textToTransform = this.escape(textToTransform);
    // .replace('\\', '\\\\\\\\\\\\\\\\')
    // .replace("'", "\\\\\\'")
    // .replaceAll('%', '\\\\\\\\%')
    //.replaceAll(/:/g, '\u003A');

    // console.log(textToTransform);
    return textToTransform;
  }

  private escape(text) {
    return text
      .replaceAll('\\', '\\\\\\\\\\\\\\\\')
      .replaceAll("'", "\\\\\\'")
      .replaceAll('%', '\\\\\\\\\\%')
      .replaceAll(':', '\\\\\\\\\\\\:');
  }
}
