import React from 'react';

const Header = () => {
    return (
        <header className="h-16 border-b border-border bg-white flex items-center px-4 md:px-8">
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-navy">Enigma</span>
                    <span className="text-muted text-sm font-medium">Risk Scanner</span>
                </div>
                <div className="text-muted text-sm italic">
                    Hackathon Edition
                </div>
            </div>
        </header>
    );
};

export default Header;
