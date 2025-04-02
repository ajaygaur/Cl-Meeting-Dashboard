import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";
import './styles.css';
import { preSaveSend } from "./eventHandlers";

const root = createRoot(document.getElementById('root')); 
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );