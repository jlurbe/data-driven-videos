# Data Driven Videos

This monorepo contains:

- A NodeJS application called "dd-videos-api" that manages the dynamic creation of videos based on information from a Google Sheets spreadsheet used as a database.
- An angular front-end that shows a landing where a user can login with its Google account and can watch and download the generated video.

## Scripts

The following scripts are available in this repository:

- `start:api`: Starts the API server for the "dd-videos-api" application. You can run this script with the command `npm run start:api`.
- `build:api`: Builds the "dd-videos-api" application. You can run this script with the command `npm run start:api`.
- `start:christmas-video`: Starts the angular front-end. You can run this script with the command `npm run start:christmas-video`.
- `build:api`: Builds the "christmas-video" front-end. You can run this script with the command `npm run start:api`.

## Ffmpeg library

This project uses the ffmpeg library. There are two ways of manage this library:

### Ffmpeg from your machine

- Install ffmpeg to your machine. You can install a version that fits you from here: <https://ffmpeg.org/download.html>

### Ffmpeg from node packages

- Install ffmpeg and ffprobe from node packages:

> `npm i -E ffmpeg-static @ffprobe-installer/ffprobe`

- Uncomment the piece of code in the file `apps/dd-videos-api/src/app/manage-videos/services/generate-video.service.ts`

- Set the environment variable FFMPEG_NODE_SOURCES to 'false'

## Google Spreadsheet - Database

For this version, we use a google spreadsheet as a database. For having permissions to the document we have to create and save a credentials.json in this folder: `apps/dd-videos-api/src`.

For generating this file and link with the google spreadsheet, we can follow the steps from this page: <https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f>

The spreadsheet has the following tabs:

- **projects**: id, name, audioFile, `dataTable` (name of other tab where custom info for each video will be saved)
- **scenes**: id, projectId, duration, source
- **scene_texts**: id, projectId,sceneId, style, x, y, text
- ***data_iberia*** (example of `dataTable`): uuid (mandatory), name, firstFlightDate...

## Google login

For login users in our angular front-end, we use a Google login and we configure it from the Google developers console. Here there is a tutorial using the package we use in our projec, @abacritt/angularx-social-login: <https://dev.to/omamaaslam/angular-16-google-social-login-or-signin-tutorial-46ka>
