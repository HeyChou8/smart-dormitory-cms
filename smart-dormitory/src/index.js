import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'normalize.css'
import './assets/css/index.css'
import theme from './assets/theme'
import { HashRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { ThemeProvider } from 'styled-components'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback={<div className="loading-overlay">
    <div className="loading-spinner"></div>
  </div>}>
          {/* 提供主题，可自定义主题 */}
        <ThemeProvider theme={theme}>
        <HashRouter>
          <App/>
        </HashRouter>
    </ThemeProvider>
    </Suspense>
);
