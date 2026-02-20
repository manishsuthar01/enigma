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
        <section ref={dashboardRef} className="w-full max-w-7xl mx-auto py-20 px-6 relative z-10">
            {/* Header / Meta Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#0B1120] border-x border-t border-white/20 rounded-t-2xl px-6 py-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <span className="text-white font-mono text-xs font-bold tracking-widest uppercase truncate max-w-[200px]">
                        Freelance_Agreement_v3.pdf
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Scanned 2m ago</span>
                    <div className="flex items-center gap-2">
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Risk Score:</span>
                        <span className="text-red-500 font-black text-sm uppercase italic">High (72/100)</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-black border border-white/20 rounded-b-2xl overflow-hidden min-h-[700px] shadow-2xl">

                {/* Left: Document Viewer (High Visibility) */}
                <div className="lg:col-span-7 p-8 md:p-12 border-r border-white/10 bg-white overflow-y-auto max-h-[700px] custom-scrollbar">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-black font-black text-2xl md:text-3xl text-center uppercase tracking-tighter mb-12">
                            Independent Contractor Agreement
                        </h2>

                        <div className="space-y-10 text-black/80 text-base md:text-lg font-medium leading-relaxed">
                            <p>This Independent Contractor Agreement is entered into as of October 24, 2023, by and between <strong className="text-black">TechGlobal Inc.</strong> and <strong className="text-black">Jane Doe</strong>.</p>

                            <div>
                                <h4 className="text-black font-black uppercase text-sm mb-4 tracking-widest">2. Term and Termination</h4>
                                <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-xl relative group">
                                    <span className="absolute -right-2 -top-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>
                                    </span>
                                    <p className="text-black leading-snug italic">
                                        Client may terminate this Agreement at any time without cause and without notice. Consultant must provide 60 days written notice for termination.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-black font-black uppercase text-sm mb-4 tracking-widest">3. Payment</h4>
                                <div className="bg-amber-500/10 border-l-4 border-amber-500 p-6 rounded-r-xl italic">
                                    Invoices shall be paid within sixty (60) days of receipt.
                                </div>
                            </div>

                            <div>
                                <h4 className="text-black font-black uppercase text-sm mb-4 tracking-widest">5. Intellectual Property</h4>
                                <div className="bg-red-500/10 border-l-4 border-red-500 p-6 rounded-r-xl italic leading-snug">
                                    All work product created prior to this agreement shall be the sole and exclusive property of the Client.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actionable Risk Feed */}
                <div className="lg:col-span-5 p-8 md:p-10 bg-[#0a0a0a] overflow-y-auto max-h-[700px] custom-scrollbar">
                    <div className="flex items-center gap-2 mb-10 pb-4 border-b border-white/10">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        <h3 className="text-white font-black text-xl tracking-tight uppercase">Risk Feed</h3>
                    </div>

                    <div className="space-y-6">
                        {/* High Risk Card */}
                        <div className="analysis-card bg-black border border-white/20 p-6 rounded-2xl hover:border-red-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                    <h4 className="text-white font-bold text-base uppercase tracking-tight">Termination Rights</h4>
                                </div>
                                <span className="text-[9px] font-black text-white bg-red-600 px-2 py-0.5 rounded uppercase">High Risk</span>
                            </div>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">Unbalanced termination clause. Client can terminate immediately, while you are bound to 60 days.</p>
                            <button className="w-full bg-[#10B981] text-black py-3 rounded-xl font-black text-xs uppercase hover:bg-white transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Generate Neutral Clause
                            </button>
                        </div>

                        {/* Medium Risk Card */}
                        <div className="analysis-card bg-black border border-white/20 p-6 rounded-2xl hover:border-amber-500/50 transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                    <h4 className="text-white font-bold text-base uppercase tracking-tight">Payment Terms</h4>
                                </div>
                                <span className="text-[9px] font-black text-black bg-amber-500 px-2 py-0.5 rounded uppercase font-black">Medium</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed font-medium">Net-60 terms may cause cash flow issues. Industry standard is Net-15 or Net-30.</p>
                        </div>

                        {/* Review Card */}
                        <div className="analysis-card bg-black border border-white/20 p-6 rounded-2xl hover:border-blue-500/50 transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <h4 className="text-white font-bold text-base uppercase tracking-tight">IP Assignment</h4>
                                </div>
                                <span className="text-[9px] font-black text-white bg-blue-600 px-2 py-0.5 rounded uppercase">Review</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed font-medium">Clause claims ownership of "prior work," which could lose you rights to your own portfolio.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RiskDashboard;