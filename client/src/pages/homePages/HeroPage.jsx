import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroPage = () => {
    const heroRef = useRef(null);
    const inputRef = useRef(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(".animate-txt",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 0.8 }
        )
            .fromTo(inputRef.current,
                { scale: 0.98, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.6 },
                "-=0.4"
            );
    }, []);

    return (
        <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-20 px-4 overflow-hidden">

            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_40%,_rgba(124,92,252,0.06)_0%,_transparent_70%)] pointer-events-none" />

            {/* Badge */}
            <div className="animate-txt inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#222] bg-[#111] text-[#999] text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc]" />
                AI-Powered Contract Auditor
            </div>

            {/* Main Headline */}
            <h1 className="animate-txt text-5xl md:text-8xl font-extrabold text-center text-white tracking-tighter max-w-5xl mb-8 leading-[0.95]">
                Don't Sign Blindly. <br />
                <span className="text-[#7c5cfc]">Scan for Risks.</span>
            </h1>

            {/* Subtext */}
            <p className="animate-txt text-[#999] text-lg md:text-xl text-center max-w-2xl mb-12 leading-relaxed">
                The AI Legal Co-pilot that audits your contracts for predatory clauses
                and liability gaps in seconds.
            </p>

            {/* CTA Buttons */}
            <div ref={inputRef} className="flex flex-col sm:flex-row items-center gap-4">
                <a
                    href="/scan"
                    className="flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-[#111] hover:scale-[1.02] transition-all duration-300"
                >
                    Scan a Contract
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
                <a
                    href="/generate"
                    className="flex items-center gap-2 bg-[#7c5cfc] border border-[#222] text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-[#111] hover:border-[#333] hover:scale-[1.02] transition-all duration-300"
                >
                    Generate a Contract
                </a>
            </div>

            {/* Trust Badges */}
            <div className="animate-txt mt-14 flex flex-wrap justify-center gap-8 text-[#666] font-semibold text-[10px] tracking-[0.15em] uppercase">
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#333]" />
                    No Credit Card
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#333]" />
                    256-bit Encryption
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#333]" />
                    Zero Data Storage
                </div>
            </div>

        </section>
    );
};

export default HeroPage;