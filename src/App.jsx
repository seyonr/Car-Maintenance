import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth'
import CarDisplayPage from './CarDisplayPage';
import Maintence from './Maintence'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />  
        <Route path="/cars/:userID" element={<CarDisplayPage />}/>
        <Route path="/cars/maintence/:carID" element={<Maintence />}/>
      </Routes>
    </Router>
  );
}