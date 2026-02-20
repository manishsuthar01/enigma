import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import PublicLayout from './layouts/publicLayout';
import Home from './pages/homePages/Home';
import GenerateContract from './pages/generateContract/GenerateContract';
import ScanContract from './pages/scanPage/ScanContract';
import Security from './pages/Security';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateContract />} />
          <Route path="/scan" element={<ScanContract />} />
          <Route path="/security" element={<Security />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
