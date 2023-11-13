import { VideoScene } from '../../../models/video-scenes.model';
import { VideoStyle } from '../../../models/video-style.enum';

export const videoScenes: VideoScene[] = [
  {
    scene: 1,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
¡Hola __name__!
    `,
        style: VideoStyle.Bold,
        position: { x: '125', y: '90' },
      },
      {
        text: `    
Te damos la bienvenida a tu historia con Iberia.

¿Quieres recordar los momentos que hemos compartido?
    `,
        style: VideoStyle.Regular,
        position: { x: '125', y: '150' },
      },
    ],
  },
  {
    scene: 2,
    duration: 8,
    source: 'iberia_002.mp4',
    videoTexts: [
      {
        text: `
Todo empezó el __firstFlightDate__,
con un vuelo __firstFlightFrom__-__firstFlightTo__ en clase __firstFlightClass__...
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
_up_firstFlightFrom_up_-_up_firstFlightTo_up_
_up_firstFlightClass_up_
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '180' },
      },
    ],
  },
  {
    scene: 3,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
En estos __yearsTogether__ años hemos volado juntos a varios destinos fascinantes.
Entre ellos, tus favoritos han sido:
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
__favouriteDestinations__.
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '180' },
      },
    ],
  },
  {
    scene: 4,
    duration: 8,
    source: 'iberia_002.mp4',
    videoTexts: [
      {
        text: `
Has visitado un total de
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
__visitedCountries__ países
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '150' },
      },
      {
        text: `
¡Examen sorpresa! A ver si te acuerdas de todos...
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '210' },
      },
    ],
  },
  {
    scene: 5,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
¿Te imaginas cuántos hemos recorrido juntos?
Nada más y nada menos que
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
__traveledKms__ kilómetros
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '180' },
      },
      {
        text: `
Lo que equivale a __traveledAroundEarth__ vueltas a la tierra
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '240' },
      },
    ],
  },
  {
    scene: 6,
    duration: 8,
    source: 'iberia_002.mp4',
    videoTexts: [
      {
        text: `
Hemos pasado un total de __traveledHours__ horas en el aire:
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
Más de __traveledTime__ __traveledUnitTime__ volando
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '160' },
      },
      {
        text: `
Ojalá hayas disfrutado del viaje...
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '210' },
      },
    ],
  },
  {
    scene: 7,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
El __mostUsedPlane__
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
es el avión en el que más has volado,
utilizándolo en tus vuelos a __mostTraveledZones__.
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '120' },
      },
    ],
  },
  {
    scene: 8,
    duration: 8,
    source: 'iberia_002.mp4',
    videoTexts: [
      {
        text: `
Y nuestro último viaje juntos ha sido hace __lastFlightTime__ __lastFlightUnitTime__
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
Cuando volaste a __lastFlightTo__ el __lastFlightDate__.

Esperamos que todo fuera de tu agrado.
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '150' },
      },
    ],
  },
  {
    scene: 9,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
En este momento dispones de un total de:
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
__totalAvios__ Avios
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '160' },
      },
      {
        text: `
que puedes canjear por vuelos y otras experiencias.
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '210' },
      },
    ],
  },
  {
    scene: 10,
    duration: 8,
    source: 'iberia_002.mp4',
    videoTexts: [
      {
        text: `
Queremos que continúes disfrutando de tus viajes,
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
mientras recorres el mundo con nosotros...
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '120' },
      },
    ],
  },
  {
    scene: 11,
    duration: 8,
    source: 'iberia_001.mp4',
    videoTexts: [
      {
        text: `
Ha sido un placer acompañarte en tus vuelos todo este tiempo y
`,
        style: VideoStyle.Regular,
        position: { x: '125', y: '90' },
      },
      {
        text: ` 
te esperamos de nuevo a bordo, ¡muy pronto!
`,
        style: VideoStyle.Bold,
        position: { x: '125', y: '120' },
      },
    ],
  },
];
