import { google } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { Compute } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getAuthToken(): Promise<JSONClient | Compute> {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();

  return authToken;
}

export async function getSpreadSheetValues({
  spreadsheetId,
  auth,
  sheetName,
}): Promise<Record<string, any>[]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });

  return formatResponse(res);
}

async function formatResponse(
  response: GaxiosResponse
): Promise<Record<string, any>[]> {
  const content = response.data.values;
  const headers = content[0];
  const data = content.slice(1);

  const formatContent = await data.map((row) => {
    const objet = {};
    headers.forEach((header, index) => {
      objet[header] = row[index];
    });
    return objet;
  });

  return formatContent;
}
