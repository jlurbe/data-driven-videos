# Data Driven Videos

This repository contains an application called "dd-videos-api" that manages the dynamic creation of videos based on information from a Google Sheets spreadsheet used as a database.

## Scripts

The following scripts are available in this repository:

- `start:api`: Starts the API server for the "dd-videos-api" application. You can run this script with the command `npm run start:api`.
- `build:api`: Builds the "dd-videos-api" application. You can run this script with the command `npm run start:api`.

## Ffmpeg library

This project uses the ffmpeg library. There are two ways of manage this library:

### Ffmpeg from your machine

- Install ffmpeg to your machine. You can install a version that fits you from here: <https://ffmpeg.org/download.html>

### Ffmpeg from node packages

- Install ffmpeg and ffprobe from node packages:

> `npm i -E ffmpeg-static @ffprobe-installer/ffprobe`

- Uncomment the piece of code in the file `apps/dd-videos-api/src/app/manage-videos/services/generate-video.service.ts`

- Set the environment variable FFMPEG_NODE_SOURCES to 'false'
