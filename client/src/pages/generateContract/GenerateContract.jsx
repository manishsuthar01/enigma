import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { generateContract as generateContractApi } from '../../services/api';

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

// ── Left Panel: Form ────────────────────────────────────────────────────────
const FormPanel = ({ onGenerate, loading, hasResult }) => {
    const [contractType, setContractType] = useState('');
    const [party1, setParty1] = useState('');
    const [party2, setParty2] = useState('');
    const [details, setDetails] = useState('');

    const isValid = contractType && party1.trim() && party2.trim();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid || loading) return;
        onGenerate({ contractType, party1: party1.trim(), party2: party2.trim(), details: details.trim() });
    };

    const inputCls = 'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-colors';
    const labelCls = 'block text-white/50 text-[10px] font-black uppercase tracking-widest mb-2';

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full ">
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/8">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest ml-1">contract_params.json</span>
            </div>

            <div className="flex-1 space-y-5 pr-1">
                {/* Contract Type */}
                <div>
                    <label className={labelCls}>Contract Type <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <select
                            required
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value)}
                            className={`${inputCls} appearance-none`}
                        >
                            <option value="" disabled className="text-white/30 bg-black">Select a contract type…</option>
                            {CONTRACT_TYPES.map(t => (
                                <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Party A — Name / Company <span className="text-red-400">*</span></label>
                        <input
                            required type="text" value={party1}
                            onChange={(e) => setParty1(e.target.value)}
                            placeholder="e.g. Acme Corp Ltd."
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Party B — Name / Company <span className="text-red-400">*</span></label>
                        <input
                            required type="text" value={party2}
                            onChange={(e) => setParty2(e.target.value)}
                            placeholder="e.g. John Doe"
                            className={inputCls}
                        />
                    </div>
                </div>

                {/* Key Terms */}
                <div>
                    <label className={labelCls}>Key Terms & Details</label>
                    <textarea
                        rows={5}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe scope of work, payment terms, deliverables, confidentiality requirements, IP ownership, non-compete clauses…"
                        className={`${inputCls} resize-none leading-relaxed`}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-5 mt-4 border-t border-white/8">
                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className={`w-full flex items-center justify-center gap-2 font-black py-3.5 rounded-xl transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed text-sm tracking-wide ${hasResult
                        ? 'bg-white/8 border border-white/15 text-white hover:bg-white/15 hover:border-white/25'
                        : 'bg-white text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Generating…
                        </>
                    ) : hasResult ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Regenerate
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
        </form>
    );
};

// ── Right Panel: Contract Output ────────────────────────────────────────────
const OutputPanel = ({ loading, error, result, onScanClick }) => {
    if (!loading && !error && !result) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/2">
                    <svg className="w-8 h-8 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-white/25 text-sm font-bold mb-1">No contract yet</p>
                    <p className="text-white/15 text-xs max-w-[200px] leading-relaxed">
                        Fill the form on the left and click <span className="text-white/30">Generate Contract</span>
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-white text-sm font-bold mb-1">Drafting contract…</p>
                    <p className="text-white/30 text-xs">Our AI is generating your document</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-red-400 text-sm font-medium text-center max-w-[220px] leading-relaxed">{error}</p>
            </div>
        );
    }

    const contractText = result.contract || result.contract_text || result.text || result.content || JSON.stringify(result, null, 2);
    const meta = result.metadata;

    return (
        <div className="flex flex-col h-full">
            {/* Output panel header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                        {meta?.contract_type?.toLowerCase().replace(/\s+/g, '_') || 'contract'}.txt
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {result._demo_mode && (
                        <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-wide">⚠ Demo</span>
                    )}
                    <span className="text-[9px] font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 rounded-full uppercase tracking-wider">
                        ✓ Generated
                    </span>
                </div>
            </div>

            {/* Scrollable contract text */}
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                <pre className="text-white/75 text-[12px] leading-relaxed font-mono whitespace-pre-wrap break-words">
                    {contractText}
                </pre>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/8 flex-shrink-0">
                <button
                    onClick={onScanClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-400 text-black font-black py-3 rounded-xl hover:bg-white transition-all duration-300 text-sm tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Scan for Risks
                </button>
                <button
                    onClick={() => navigator.clipboard?.writeText(contractText)}
                    className="flex items-center gap-2 border border-white/10 text-white/60 font-bold py-3 px-5 rounded-xl hover:border-white/20 hover:text-white transition-all duration-200 text-sm"
                    title="Copy to clipboard"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                </button>
            </div>
        </div>
    );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const GenerateContract = () => {
    const headingRef = useRef(null);
    const panelRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
            .fromTo(panelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    }, []);

    const handleGenerate = async (payload) => {
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await generateContractApi(payload);
            setResult(data);
            setTimeout(() => {
                gsap.from('.gen-output-panel', { opacity: 0, x: 10, duration: 0.5, ease: 'power3.out' });
            }, 80);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Generation failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleScanClick = () => {
        if (result?.contract_text) {
            sessionStorage.setItem('scan_prefill', result.contract_text);
        }
        navigate('/scan');
    };

    return (
        <section className="min-h-screen pt-28 pb-10 px-4 flex flex-col">
            <div className="w-full max-w-7xl mx-auto flex flex-col flex-1">

                {/* Heading */}
                <div ref={headingRef} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black mb-5 uppercase tracking-[0.2em]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Contract Generator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-3">
                        Generate a <span className="text-emerald-400">Legal Contract.</span>
                    </h1>
                    <p className="text-white/45 text-sm md:text-base max-w-lg mx-auto">
                        Fill the form on the left — your AI-drafted contract appears on the right instantly.
                    </p>
                </div>

                {/* Split Panel */}
                <div
                    ref={panelRef}
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[82vh] min-h-[600px]"
                >
                    {/* LEFT — Form */}
                    <div className="bg-[#080e1a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/8">
                        <FormPanel onGenerate={handleGenerate} loading={loading} hasResult={!!result} />
                    </div>

                    {/* RIGHT — Output */}
                    <div className="gen-output-panel bg-[#0B1120] p-6 md:p-8 flex flex-col overflow-hidden">
                        <OutputPanel
                            loading={loading}
                            error={error}
                            result={result}
                            onScanClick={handleScanClick}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GenerateContract;
