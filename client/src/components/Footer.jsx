import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative border-t border-white/5 bg-black/60 backdrop-blur-sm">
            {/* Subtle emerald glow at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-white font-black text-base tracking-tighter">
                                Legal-GPT<span className="text-emerald-400">.</span>
                            </span>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed max-w-xs">
                            AI-powered contract intelligence. Identify risks, generate drafts, and protect yourself before you sign.
                        </p>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase">System Operational</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Navigation</h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Generate Contract', to: '/generate' },
                                { label: 'Scan Contract', to: '/scan' },
                            ].map(link => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-white/40 text-sm hover:text-emerald-400 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <h4 className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Powered By</h4>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Node.js', "RAG", "LLM"].map(tech => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-[10px] font-bold text-white/40 border border-white/10 rounded-md uppercase tracking-wider hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-white/20 text-[11px] font-mono">
                        © {new Date().getFullYear()} Enigma · Built for Hackathon
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-white/20 text-[11px]">Privacy Policy</span>
                        <span className="text-white/20 text-[11px]">Terms of Use</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
