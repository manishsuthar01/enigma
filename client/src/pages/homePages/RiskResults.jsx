import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RiskResults = () => {
    const resultsRef = useRef(null);

    // useEffect(() => {
    //     gsap.fromTo(resultsRef.current,
    //         { y: 50, opacity: 0 },
    //         { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    //     );

    //     gsap.from(".risk-card", {
    //         x: 30,
    //         opacity: 0,
    //         stagger: 0.2,
    //         duration: 0.8,
    //         ease: "back.out(1.7)",
    //         delay: 0.5
    //     });
    // }, []);

    return (
        <section ref={resultsRef} className="w-full max-w-7xl mx-auto mt-20 px-4 mb-20">
            {/* Header Bar - Increased Contrast */}
            <div className="flex items-center justify-between bg-[#111827] border-x border-t border-white/20 rounded-t-2xl px-6 py-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-white font-mono text-xs font-bold tracking-widest uppercase">contract_analysis_v2.pdf</span>
                <div className="w-10"></div>
            </div>

            {/* Main Content Area - Darker base, whiter text */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a] border border-white/20 rounded-b-2xl overflow-hidden min-h-[650px] shadow-2xl">

                {/* Left Side: Original Contract View */}
                <div className="p-10 border-r border-white/10 bg-black overflow-y-auto max-h-[650px] custom-scrollbar">
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded mb-8">
                        Original Document
                    </button>

                    <div className="space-y-8 text-white text-base font-medium leading-relaxed">
                        <p className="opacity-90">14.2 INDEMNIFICATION. Consultant agrees to indemnify, defend, and hold harmless client and its affiliates, officers, agents, employees...</p>

                        {/* Highlighting - Solid Red Border for visibility */}
                        <div className="bg-red-950/40 border-l-4 border-red-600 p-6 text-white rounded-r-lg ring-1 ring-red-500/20">
                            <span className="font-bold">...permitted successors and assigns against any and all claims, losses, damages, liabilities, penalties, punitive damages, expenses, reasonable legal fees...</span>
                        </div>

                        <p className="opacity-90">15.1 NON-COMPETE. For a period of twenty-four (24) months following the termination of this Agreement, Consultant shall not, directly or indirectly...</p>

                        <div className="bg-amber-950/40 border-l-4 border-amber-500 p-6 text-white rounded-r-lg ring-1 ring-amber-500/20">
                            <span className="font-bold">...engage in any business that competes with the client's business within the territory of North America.</span>
                        </div>

                    </div>
                </div>

                {/* Right Side: Risk Analysis Feed */}
                <div className="p-10 bg-[#0f172a] overflow-y-auto max-h-[650px] custom-scrollbar">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-white font-black text-2xl tracking-tighter uppercase">Risk Analysis</h2>
                        <span className="bg-red-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                            3 Critical Risks Found
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* High Risk Card - High Contrast */}
                        <div className="risk-card group  border border-white/10 p-6 rounded-2xl hover:border-red-500 transition-all duration-300 shadow-xl">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-red-500 font-black text-lg flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                                    Uncapped Indemnification
                                </h3>
                                <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded tracking-tighter uppercase">
                                    High Risk
                                </span>
                            </div>
                            <p className="text-white/80 text-sm mb-6 font-medium leading-snug">
                                You are liable for unlimited damages, including legal fees, for any "act or omission," even if not negligent.
                            </p>
                            <div className="bg-emerald-500 text-black p-4 rounded-xl flex items-center justify-between font-black text-xs hover:scale-[1.02] transition-transform cursor-pointer">
                                <span>🪄 AI FIX: LIMIT LIABILITY TO FEES PAID</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="4" /></svg>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        </section>
    );
};

export default RiskResults;