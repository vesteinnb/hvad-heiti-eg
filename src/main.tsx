import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LandingPage from './LandingPage';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParentAuthPage from './ParentAuthPage';
import CreateGamePage from './CreateGamePage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game/:gameCode" element={<App />} />
        <Route path="/parent" element={<ParentAuthPage />} />
        <Route path="/parent/create" element={<CreateGamePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
); 