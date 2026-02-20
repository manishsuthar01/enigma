import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroPage = () => {
    const heroRef = useRef(null);
    const inputRef = useRef(null);

    useLayoutEffect(() => {
        // We use clear() to ensure no ghost opacities remain
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
        // Added a radial gradient to the center so the middle isn't pitch black
        <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-20 px-4 overflow-hidden bg-[#000000] bg-[radial-gradient(circle_at_center,_#111111_0%,_#000000_100%)]">

            {/* Grid Overlay - Increased opacity slightly for visibility */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '50px 50px' }}>
            </div>

            {/* Badge - Forced White Text for visibility */}
            <div className="animate-txt inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/5 text-white text-[10px] font-black mb-8 uppercase tracking-[0.2em]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI-Powered Contract Auditor
            </div>

            {/* Main Headline - Solid White (No transparency) */}
            <h1 className="animate-txt text-5xl md:text-8xl font-black text-center text-white tracking-tighter max-w-5xl mb-8 leading-[0.95]">
                Don't Sign Blindly. <br />
                <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">Scan for Risks.</span>
            </h1>

            {/* Subtext - Increased contrast to 90% White */}
            <p className="animate-txt text-white/90 text-lg md:text-2xl text-center max-w-3xl mb-12 leading-relaxed font-medium">
                The AI Legal Co-pilot that audits your contracts for predatory clauses
                and liability gaps in seconds.
            </p>

            {/* Input Box - Brighter Border */}
            <div ref={inputRef} className="relative w-full max-w-3xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>


            </div>

            {/* Trust Badges - Pure White but smaller */}
            <div className="animate-txt mt-12 flex flex-wrap justify-center gap-10 text-white font-bold text-[10px] tracking-[0.15em] uppercase">
                <div className="flex items-center gap-2">✓ No Credit Card</div>
                <div className="flex items-center gap-2">✓ SOC-2 Compliant</div>
                <div className="flex items-center gap-2">✓ 256-bit Encryption</div>
            </div>

        </section>
    );
};

export default HeroPage;