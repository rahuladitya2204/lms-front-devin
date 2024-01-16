import './index.css';
import '@Utils/index'
import '@Network/index'

import * as Sentry from "@sentry/react";

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime';
import reportWebVitals from './reportWebVitals';

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat);
// Sentry.init({
//   dsn: "https://9acdc59d411d61ce8a852ae8aabd2cbb@o4506265026428928.ingest.sentry.io/4506265039339520",
//   integrations: [
//     new Sentry.BrowserTracing({
//       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ["localhost",/^https:\/\/api\.nimblebee\.io/],
//     }),
//     new Sentry.Replay(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, // Capture 100% of the transactions
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
