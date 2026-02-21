import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const RiskDashboard = () => {
    const dashboardRef = useRef(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: dashboardRef.current,
                start: "top 80%",
            }
        });

        tl.fromTo(dashboardRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
        );
    }, []);

    return (
        <section ref={dashboardRef} className="w-full max-w-container mx-auto py-20 px-6 relative z-10">
            {/* Header / Meta Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#111] border-x border-t border-[#222] rounded-t-2xl px-6 py-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/50" />
                    </div>
                    <span className="text-[#999] font-mono text-xs font-semibold tracking-widest uppercase truncate max-w-[200px]">
                        Freelance_Agreement_v3.pdf
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Scanned 2m ago</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Risk Score:</span>
                        <span className="text-[#ef4444] font-bold text-sm">High (72/100)</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#0a0a0a] border border-[#222] rounded-b-2xl overflow-hidden min-h-[700px]">

                {/* Left: Document Viewer */}
                <div className="lg:col-span-7 p-5 md:p-8 border-r border-[#222] bg-white overflow-y-auto max-h-[700px]">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-black font-extrabold text-2xl md:text-3xl text-center tracking-tighter mb-12">
                            Independent Contractor Agreement
                        </h2>

                        <div className="space-y-10 text-black/80 text-base md:text-lg font-medium leading-relaxed">
                            <p>This Independent Contractor Agreement is entered into as of October 24, 2023, by and between <strong className="text-black">TechGlobal Inc.</strong> and <strong className="text-black">Jane Doe</strong>.</p>

                            <div>
                                <h4 className="text-black font-bold uppercase text-sm mb-4 tracking-widest">2. Term and Termination</h4>
                                <div className="bg-[#ef4444]/5 border-l-4 border-[#ef4444] p-6 rounded-r-xl relative">
                                    <p className="text-black leading-snug italic">
                                        Client may terminate this Agreement at any time without cause and without notice. Consultant must provide 60 days written notice for termination.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-black font-bold uppercase text-sm mb-4 tracking-widest">3. Payment</h4>
                                <div className="bg-[#f59e0b]/5 border-l-4 border-[#f59e0b] p-6 rounded-r-xl italic">
                                    Invoices shall be paid within sixty (60) days of receipt.
                                </div>
                            </div>

                            <div>
                                <h4 className="text-black font-bold uppercase text-sm mb-4 tracking-widest">5. Intellectual Property</h4>
                                <div className="bg-[#ef4444]/5 border-l-4 border-[#ef4444] p-6 rounded-r-xl italic leading-snug">
                                    All work product created prior to this agreement shall be the sole and exclusive property of the Client.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actionable Risk Feed */}
                <div className="lg:col-span-5 p-8 md:p-10 bg-[#0a0a0a] overflow-y-auto max-h-[700px]">
                    <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[#222]">
                        <svg className="w-5 h-5 text-[#7c5cfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        <h3 className="text-white font-bold text-xl tracking-tight">Risk Feed</h3>
                    </div>

                    <div className="space-y-5">
                        {/* High Risk Card */}
                        <div className="analysis-card bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#ef4444]/40 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                                    <h4 className="text-white font-bold text-base tracking-tight">Termination Rights</h4>
                                </div>
                                <span className="text-[9px] font-bold text-white bg-[#ef4444] px-2 py-0.5 rounded uppercase">High</span>
                            </div>
                            <p className="text-[#999] text-sm mb-5 leading-relaxed">Unbalanced termination clause. Client can terminate immediately, while you are bound to 60 days.</p>
                            <button className="w-full bg-[#7c5cfc] text-white py-3 rounded-xl font-bold text-xs uppercase hover:bg-[#6a4ce0] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Generate Neutral Clause
                            </button>
                        </div>

                        {/* Medium Risk Card */}
                        <div className="analysis-card bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#f59e0b]/40 transition-all duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                                    <h4 className="text-white font-bold text-base tracking-tight">Payment Terms</h4>
                                </div>
                                <span className="text-[9px] font-bold text-black bg-[#f59e0b] px-2 py-0.5 rounded uppercase">Medium</span>
                            </div>
                            <p className="text-[#999] text-sm leading-relaxed">Net-60 terms may cause cash flow issues. Industry standard is Net-15 or Net-30.</p>
                        </div>

                        {/* Review Card */}
                        <div className="analysis-card bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#7c5cfc]/40 transition-all duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#7c5cfc]" />
                                    <h4 className="text-white font-bold text-base tracking-tight">IP Assignment</h4>
                                </div>
                                <span className="text-[9px] font-bold text-white bg-[#7c5cfc] px-2 py-0.5 rounded uppercase">Review</span>
                            </div>
                            <p className="text-[#999] text-sm leading-relaxed">Clause claims ownership of "prior work," which could lose you rights to your own portfolio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RiskDashboard;