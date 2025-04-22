import mockData from "./mock-data";
import NProgress from "nprogress";

// Format the date to a readable format
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Extract unique locations from events
export const extractLocations = (events) => {
  const locations = [...new Set(events.map((event) => event.location))];
  return locations;
};

// Get the access token from localStorage or fetch a new one
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      const response = await fetch(
        "https://ck8f5q1a3d.execute-api.us-west-2.amazonaws.com/dev/api/get-auth-url"
      );
      const { authUrl } = await response.json();
      window.location.href = authUrl;
      return;
    }

    return code && getToken(code);
  }

  return accessToken;
};

// Check if the token is valid
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  return await response.json();
};

// Fetch a new token using the authorization code
const getToken = async (code) => {
  try {
    const encodeCode = encodeURIComponent(code);
    const response = await fetch(
      "https://ck8f5q1a3d.execute-api.us-west-2.amazonaws.com/dev/api/token/{code}".replace("{code}", encodeCode), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: encodeCode }),
    }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { access_token } = await response.json();
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      return access_token;
    }
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};

// Fetch events from the API or local mock data
export const getEvents = async () => {
  NProgress.start();

  if (window.location.href.startsWith("http://localhost")) {
    NProgress.done();
    return mockData;
  }

  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    NProgress.done();
    return events ? JSON.parse(events) : [];
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url = "https://ck8f5q1a3d.execute-api.us-west-2.amazonaws.com/dev/api/get-calendar-events/{access_token}".replace("{access_token}", token);
    const response = await fetch(url);
    const result = await response.json();

    if (result && result.events) {
      localStorage.setItem("lastEvents", JSON.stringify(result.events));
      NProgress.done();
      return result.events;
    }
  }

  NProgress.done();
  return [];
};

// Extract event details
export const getEventDetails = (events) => {
  return events.map((event) => ({
    summary: event.summary,
    start: event.created,
    location: event.location,
    htmlLink: event.htmlLink,
    description: event.description,
  }));
};

// Remove the code parameter from the URL
const removeQuery = () => {
  const newUrl = window.location.pathname
    ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    : `${window.location.protocol}//${window.location.host}`;
window.history.pushState("", "", newUrl);
};