import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './components/MainLayout';

import Home from './pages/Home';
import Adopted from './pages/Adopted';
import Hospitals from './pages/Hospitals';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdoptionGallery from './pages/AdoptionGallery';
import Gallery from './pages/Gallery';

function App() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', colorInfo: '#1677ff', borderRadius: 8 } }}>
            <Router>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/adopted" element={<Adopted />} />
                        <Route path="/hospitals" element={<Hospitals />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/adoption" element={<AdoptionGallery />} />
                        <Route path="/gallery" element={<Gallery />} />
                    </Routes>
                </MainLayout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
