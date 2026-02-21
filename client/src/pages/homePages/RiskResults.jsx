import React, { useRef } from 'react';

const RiskResults = () => {
    const resultsRef = useRef(null);

    return (
        <section ref={resultsRef} className="w-full max-w-container mx-auto mt-20 px-6 mb-20">
            {/* Header Bar */}
            <div className="flex items-center justify-between bg-[#111] border-x border-t border-[#222] rounded-t-2xl px-6 py-4">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                    <div className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
                </div>
                <span className="text-[#999] font-mono text-xs font-semibold tracking-widest uppercase">contract_analysis_v2.pdf</span>
                <div className="w-10" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0a0a0a] border border-[#222] rounded-b-2xl overflow-hidden min-h-[650px]">

                {/* Left Side: Original Contract View */}
                <div className="p-10 border-r border-[#222] bg-[#0a0a0a] overflow-y-auto max-h-[650px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#7c5cfc] border border-[#7c5cfc]/30 px-3 py-1 rounded mb-8 inline-block">
                        Original Document
                    </span>

                    <div className="space-y-8 text-[#ccc] text-base font-medium leading-relaxed">
                        <p>14.2 INDEMNIFICATION. Consultant agrees to indemnify, defend, and hold harmless client and its affiliates, officers, agents, employees...</p>

                        {/* Highlighting */}
                        <div className="bg-[#ef4444]/5 border-l-4 border-[#ef4444] p-6 text-white rounded-r-lg">
                            <span className="font-semibold">...permitted successors and assigns against any and all claims, losses, damages, liabilities, penalties, punitive damages, expenses, reasonable legal fees...</span>
                        </div>

                        <p>15.1 NON-COMPETE. For a period of twenty-four (24) months following the termination of this Agreement, Consultant shall not, directly or indirectly...</p>

                        <div className="bg-[#f59e0b]/5 border-l-4 border-[#f59e0b] p-6 text-white rounded-r-lg">
                            <span className="font-semibold">...engage in any business that competes with the client's business within the territory of North America.</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Risk Analysis Feed */}
                <div className="p-10 bg-[#0a0a0a] overflow-y-auto max-h-[650px]">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-white font-extrabold text-2xl tracking-tighter">Risk Analysis</h2>
                        <span className="bg-[#ef4444] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                            3 Critical Risks
                        </span>
                    </div>

                    <div className="space-y-5">
                        {/* High Risk Card */}
                        <div className="risk-card group bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#ef4444]/40 transition-all duration-300">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-[#ef4444] font-bold text-lg flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                                    Uncapped Indemnification
                                </h3>
                                <span className="text-[10px] font-bold text-white bg-[#ef4444] px-2 py-0.5 rounded tracking-tight uppercase">
                                    High
                                </span>
                            </div>
                            <p className="text-[#999] text-sm mb-5 leading-relaxed">
                                You are liable for unlimited damages, including legal fees, for any "act or omission," even if not negligent.
                            </p>
                            <div className="bg-[#7c5cfc] text-white p-4 rounded-xl flex items-center justify-between font-bold text-xs hover:scale-[1.02] transition-transform cursor-pointer">
                                <span>🪄 AI FIX: LIMIT LIABILITY TO FEES PAID</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RiskResults;