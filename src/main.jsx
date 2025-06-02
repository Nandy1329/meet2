import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";


import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
serviceWorkerRegistration.register();


// Atatus import and config
import * as atatus from "atatus-spa";
atatus.config("46c58a2bf95144398429b9c01636de57").install(); // Replace with your actual key
atatus.notify(new Error("Test Atatus Setup")); // Optional: test integration

// Your existing React app render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
