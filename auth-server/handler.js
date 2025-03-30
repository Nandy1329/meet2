/* eslint-disable no-undef */
"use strict";

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = ["https://meet2-kappa.vercel.app/"];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

console.log("OAuth2 Client setup:", oAuth2Client);

module.exports.getAuthURL = async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ authUrl }),
  };
};

module.exports.getAccessToken = async (event) => {
  try {
    let code = event.pathParameters?.code;

    if (!code) {
      throw new Error("Authorization code is missing.");
    }

    // Decode only if necessary
    if (code.includes("%")) {
      code = decodeURIComponent(code);
    }

    console.log("Decoded authorization code:", code);

    const { tokens } = await oAuth2Client.getToken(code);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    console.error("Error in getAccessToken:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

mmodule.exports.getCalendarEvents = async (event) => {
  try {
    const authHeader = event.headers?.Authorization || event.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const access_token = authHeader.split(" ")[1];
    oAuth2Client.setCredentials({ access_token });

    const results = await calendar.events.list({
      calendarId: CALENDAR_ID,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ events: results.data.items }),
    };
  } catch (error) {
    console.error("Error in getCalendarEvents:", error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
