import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DotGrid from '../components/DotGrid';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-[#999] flex flex-col relative">
            {/* Universal DotGrid background */}
            <div className="fixed inset-0 z-0 opacity-40">
                <DotGrid
                    dotSize={5}
                    gap={15}
                    baseColor="#271E37"
                    activeColor="#5227FF"
                    proximity={70}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={950}
                    returnDuration={0.5}
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
