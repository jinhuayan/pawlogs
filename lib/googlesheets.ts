import { google } from 'googleapis';
import { readFileSync } from 'fs';
import  path from 'path';



const keyFile = path.resolve(__dirname, 'service-account.json');
const auth = new google.auth.GoogleAuth({
    keyFile, 
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export async function appendDailyLogs(
  spreadsheetId: string,
  sheetName: string,
  logs: Array<{
    petId: string;
    event_time: string;
    category_1: string;
    category_2: string;
    category_3: string;
    comment: string;

  }>
) {
  const values = logs.map(l => [
    l.petId,
    l.event_time,
    l.category_1,
    l.category_2,
    l.category_3,
    l.comment,
    
  ]);

const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:F`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values },
  });
  return res.data.updates;

}