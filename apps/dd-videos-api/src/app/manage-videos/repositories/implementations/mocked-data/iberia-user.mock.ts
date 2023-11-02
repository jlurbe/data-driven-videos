interface IberiaUser {
  uuid: string;
  name: string;
  firstFlightDate: string;
  firstFlightFrom: string;
  firstFlightTo: string;
  firstFlightClass: string;
  yearsTogether: number;
  favouriteDestinations: string;
  visitedCountries: number;
  traveledKms: string;
  traveledAroundEarth: number;
  traveledHours: number;
  traveledTime: number;
  traveledUnitTime: string;
  mostUsedPlane: string;
  mostTraveledZones: string;
  lastFlightTime: number;
  lastFlightUnitTime: string;
  lastFlightDate: string;
  lastFlightTo: string;
  totalAvios: string;
}

export const iberiaUser: IberiaUser[] = [
  {
    uuid: '4cd094ae-0a32-4f77-b0cb-9a93aa3abdd0',
    name: 'Pablo',
    firstFlightDate: '26 de mayo de 1996',
    firstFlightFrom: 'Madrid',
    firstFlightTo: 'Londres',
    firstFlightClass: 'Business',
    yearsTogether: 27,
    favouriteDestinations: 'Nueva York, Buenos Aires y Bogotá',
    visitedCountries: 12,
    traveledKms: '500.000',
    traveledAroundEarth: 7,
    traveledHours: 681,
    traveledTime: 2,
    traveledUnitTime: 'meses',
    mostUsedPlane: 'Airbus A350',
    mostTraveledZones: 'Norteamérica y América del Sur',
    lastFlightTime: 2,
    lastFlightUnitTime: 'meses',
    lastFlightDate: '1 de enero de 2023',
    lastFlightTo: 'Nueva York',
    totalAvios: '334.000',
  },
];
