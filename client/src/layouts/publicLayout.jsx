import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
    return (
        <div className="relative min-h-screen w-full bg-black">
            {/* Fixed Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Emerald top glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,_rgba(16,185,129,0.12)_0%,_transparent_50%)]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="relative z-10">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
