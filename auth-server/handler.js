/* eslint-disable no-undef */
'use strict';

import { google } from 'googleapis';
const calendar = google.calendar('v3');

// You probably want readonly access to *all* events, rather than only “public” events
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

// This must match exactly what you registered in Google Cloud Console:
const REDIRECT_URI = 'https://meet2-kappa.vercel.app';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function getAuthURL() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ authUrl }),
  };
}

export async function getAccessToken(event) {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: 'OK' };
  }

  const code = decodeURIComponent(event.pathParameters.code);
  try {
    // Promisify getToken
    const { tokens } = await oAuth2Client.getToken(code);
    // Optionally store tokens.refresh_token somewhere for offline access

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}

export async function getCalendarEvents(event) {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: 'OK' };
  }

  const access_token = decodeURIComponent(event.pathParameters.access_token);
  oAuth2Client.setCredentials({ access_token });

  try {
    const response = await calendar.events.list({
      auth: oAuth2Client,
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ events: response.data.items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
}
