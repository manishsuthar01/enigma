import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

const CONTRACT_TYPES = [
    'Non-Disclosure Agreement (NDA)',
    'Freelance Service Agreement',
    'Employment Contract',
    'Software License Agreement',
    'Consulting Agreement',
    'Sales Contract',
    'Partnership Agreement',
    'Lease Agreement',
];

const GenerateContract = () => {
    const headingRef = useRef(null);
    const formRef = useRef(null);
    const [contractType, setContractType] = useState('');
    const [party1, setParty1] = useState('');
    const [party2, setParty2] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
            .fromTo(formRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    }, []);

    const handleGenerate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate generation then redirect to scan with a sample text
        setTimeout(() => {
            setLoading(false);
            setGenerated(true);
        }, 1500);
    };

    return (
        <section className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div ref={headingRef} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Contract Generator
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-4">
                        Generate a<br />
                        <span className="text-emerald-400">Legal Contract.</span>
                    </h1>
                    <p className="text-white/50 text-base max-w-xl mx-auto">
                        Fill in the details below. Our AI will draft a solid contract
                        that you can then scan for risks.
                    </p>
                </div>

                {/* Form */}
                <div ref={formRef} className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl blur-xl" />
                    <form
                        onSubmit={handleGenerate}
                        className="relative bg-[#0B1120] border border-white/10 rounded-2xl p-8 space-y-6"
                    >
                        {/* Contract Type */}
                        <div>
                            <label className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">
                                Contract Type
                            </label>
                            <select
                                required
                                value={contractType}
                                onChange={(e) => setContractType(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-colors appearance-none"
                            >
                                <option value="" disabled className="text-white/30">Select a contract type...</option>
                                {CONTRACT_TYPES.map(t => (
                                    <option key={t} value={t} className="bg-black">{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Parties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Party 1 (Full Name / Company)</label>
                                <input
                                    required type="text" value={party1}
                                    onChange={(e) => setParty1(e.target.value)}
                                    placeholder="e.g. Acme Corp Ltd."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Party 2 (Full Name / Company)</label>
                                <input
                                    required type="text" value={party2}
                                    onChange={(e) => setParty2(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Key Details */}
                        <div>
                            <label className="block text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">
                                Key Terms & Details
                            </label>
                            <textarea
                                required value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={5}
                                placeholder="Describe the scope of work, payment terms, duration, confidentiality requirements, etc."
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors resize-none leading-relaxed"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center gap-4 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Contract
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Post-generate actions */}
                        {generated && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-emerald-400 text-sm font-bold">Contract Generated!</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/scan')}
                                    className="text-[11px] font-black text-black bg-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-300 transition-all uppercase tracking-wide"
                                >
                                    Scan It Now →
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default GenerateContract;
