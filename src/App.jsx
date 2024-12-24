import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth/Auth'
import CarDisplayPage from './pages/CarDisplay/CarDisplayPage';
import Maintence from './pages/Maintence/Maintence'
import Test from './test';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />  
        <Route path="/cars/:userID" element={<CarDisplayPage />}/>
        <Route path="/cars/maintence/:carID" element={<Maintence />}/>
      </Routes>
    </Router>
  );
}