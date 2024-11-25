import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import AppDemo from './pages/AppDemo';
import Offers from './pages/Offers';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/" element={<Dashboard />} />  
                    <Route path="/demo" element={<AppDemo />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};
export default App