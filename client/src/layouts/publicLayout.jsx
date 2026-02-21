import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DotGrid from '../components/DotGrid';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-[#999] flex flex-col relative">
            {/* Universal DotGrid background */}
            <div className="fixed inset-0 z-0">
                <DotGrid
                    dotSize={4}
                    gap={18}
                    baseColor="#3a2d5c"
                    activeColor="#7c5cfc"
                    proximity={130}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1}
                />
            </div>

            <Navbar />
            <main className="flex-1 relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
