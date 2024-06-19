import React, { useState, useEffect } from 'react';
import { PertPage, Home, GraphPages, SimplexePage } from './pages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/GraphPage" element={<GraphPages />} />
        <Route path="/PertPage" element={<PertPage />} />
        <Route path="/SimplexePage" element={<SimplexePage />} />
      </Routes>
    </Router>
  );
}

export default App;
