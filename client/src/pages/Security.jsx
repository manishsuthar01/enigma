import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const securityFeatures = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        color: 'emerald',
        badge: 'Encryption',
        title: '256-bit TLS Encryption in Transit',
        desc: 'Every byte of contract text you paste is transmitted over HTTPS using TLS 1.3. Your data is encrypted end-to-end — unreadable to anyone intercepting the connection.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        ),
        color: 'blue',
        badge: 'Zero Retention',
        title: 'No Contract Data Stored',
        desc: 'We never store, log, or persist your contract text. It is passed directly to the AI model for analysis and discarded immediately. Once your session ends, nothing remains on our servers.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: 'purple',
        badge: 'Input Validation',
        title: 'Server-Side Input Sanitisation',
        desc: 'All contract text is validated server-side before processing — enforcing size limits (300–20,000 characters) to prevent abuse, injection, or resource exhaustion attacks.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
        ),
        color: 'red',
        badge: 'No Training',
        title: 'Your Data Never Trains AI Models',
        desc: 'Contract text you submit is never used to fine-tune, retrain, or improve any AI model. Each request is stateless and independent — your confidential agreements stay confidential.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        color: 'teal',
        badge: 'Privacy First',
        title: 'No Account Required',
        desc: 'We don\'t collect your name, email, or any personal data. There are no cookies tracking your session. You can scan contracts completely anonymously.',
    },
];

const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badgeBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badgeBg: 'bg-red-500/10 border-red-500/20 text-red-400' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400' },
};

const Security = () => {
    const heroRef = useRef(null);
    const cardsRef = useRef(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo('.sec-hero-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 }
        ).fromTo('.sec-card',
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
            '-=0.2'
        );
    }, []);

    return (
        <section className="min-h-screen pt-32 pb-24 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Hero */}
                <div ref={heroRef} className="text-center mb-20">
                    <div className="sec-hero-item inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Security & Privacy
                    </div>

                    <h1 className="sec-hero-item text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                        Your Contracts.<br />
                        <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            Completely Private.
                        </span>
                    </h1>

                    <p className="sec-hero-item text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        We built Legal-GPT with a privacy-first architecture. Your sensitive contract
                        text is processed in memory, never stored, and never used for any other purpose.
                    </p>

                    {/* Trust Strip */}
                    <div className="sec-hero-item flex flex-wrap justify-center gap-6 text-white/50 text-xs font-bold uppercase tracking-widest">
                        {['Zero Data Storage', 'TLS 1.3 Encrypted', 'No Account Needed', 'No AI Training'].map(item => (
                            <div key={item} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Cards Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
                    {securityFeatures.map((feat, i) => {
                        const c = colorMap[feat.color];
                        return (
                            <div
                                key={i}
                                className={`sec-card group bg-black border border-white/10 hover:border-white/20 rounded-2xl p-7 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] relative overflow-hidden`}
                            >
                                {/* Hover glow */}
                                <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${c.bg} border ${c.border} ${c.text} mb-5`}>
                                        {feat.icon}
                                    </div>

                                    {/* Badge */}
                                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-4 ml-3 ${c.badgeBg}`}>
                                        {feat.badge}
                                    </div>

                                    <h3 className="text-white font-black text-base tracking-tight mb-3 leading-snug">
                                        {feat.title}
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        {feat.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Flow Diagram */}
                <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-8 md:p-12 mb-16">
                    <h2 className="text-white font-black text-2xl tracking-tight uppercase mb-2 text-center">
                        How Your Data Flows
                    </h2>
                    <p className="text-white/40 text-sm text-center mb-10">A transparent walkthrough of what happens when you scan a contract.</p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        {[
                            { step: '01', label: 'You paste contract text', sub: 'Client browser only', icon: '📋' },
                            { step: '02', label: 'Encrypted HTTPS request', sub: 'TLS 1.3 in transit', icon: '🔒' },
                            { step: '03', label: 'Server validates & passes to our LLM', sub: 'In-memory only, no write', icon: '⚙️' },
                            { step: '04', label: 'AI returns structured analysis', sub: 'Text discarded immediately', icon: '✅' },
                        ].map((node, i, arr) => (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center text-center max-w-[140px]">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-3">
                                        {node.icon}
                                    </div>
                                    <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mb-1">{node.step}</span>
                                    <p className="text-white text-xs font-bold leading-snug mb-1">{node.label}</p>
                                    <p className="text-white/30 text-[10px]">{node.sub}</p>
                                </div>
                                {i < arr.length - 1 && (
                                    <div className="hidden md:block text-white/20 text-2xl font-thin flex-shrink-0">→</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <p className="text-white/40 text-sm mb-4">
                        Questions about our security practices?
                    </p>
                    <a
                        href="mailto:security@legal-gpt.ai"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:border-emerald-500/30 hover:text-emerald-400 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Security Team
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Security;
