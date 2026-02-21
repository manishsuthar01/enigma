import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Generate', to: '/generate' },
        { label: 'Security', to: '/security' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-[#222]'
            : 'bg-transparent'
            }`}>
            <div className="max-w-container mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2.5 group"
                >
                    <div className="w-7 h-7 rounded-lg bg-[#7c5cfc] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-white font-extrabold text-lg tracking-tight">
                        Legal-GPT<span className="text-[#7c5cfc]">.</span>
                    </span>
                </button>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-[13px] font-semibold tracking-wide transition-all duration-200 ${isActive
                                    ? 'text-white bg-white/5'
                                    : 'text-[#999] hover:text-white'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <NavLink
                        to="/scan"
                        className="flex items-center gap-2 bg-[#7c5cfc] text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-[#6a4ce0] transition-all duration-300 hover:scale-[1.02]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Scan Now
                    </NavLink>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-[#999] hover:text-white transition-colors p-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-[#222] px-6 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/'}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                                    ? 'text-white bg-white/5'
                                    : 'text-[#999] hover:text-white'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/scan"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-2 mt-3 bg-[#7c5cfc] text-white text-sm font-bold px-5 py-3 rounded-lg hover:bg-[#6a4ce0] transition-all duration-300"
                    >
                        Scan Now →
                    </NavLink>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
