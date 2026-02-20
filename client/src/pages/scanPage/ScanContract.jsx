import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { scanContract } from '../../services/api';

const MIN_CHARS = 300;
const MAX_CHARS = 20000;

const severityConfig = {
    high: { color: 'red', bgBorder: 'border-red-500/30 hover:border-red-500/60', textColor: 'text-red-400', dotExtra: 'animate-pulse', label: 'High Risk' },
    medium: { color: 'amber', bgBorder: 'border-amber-500/30 hover:border-amber-500/60', textColor: 'text-amber-400', dotExtra: '', label: 'Medium Risk' },
    low: { color: 'emerald', bgBorder: 'border-emerald-500/30', textColor: 'text-emerald-400', dotExtra: '', label: 'Low Risk' },
};

const overallBadge = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'High Risk' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Medium Risk' },
    low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Low Risk' },
};

// ── Left Panel: Contract Input ──────────────────────────────────────────────
const InputPanel = ({ contractText, setContractText, onScan, loading }) => {
    const charCount = contractText.length;
    const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

    return (
        <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/8">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest ml-1">contract_input.txt</span>
            </div>

            {/* Textarea — grows to fill available space */}
            <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract text here (minimum 300 characters)..."
                className="flex-1 w-full bg-transparent text-white text-sm placeholder-white/20 focus:outline-none resize-none leading-relaxed font-mono"
            />

            {/* Footer bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
                <span className={`text-[11px] font-bold transition-colors ${charCount === 0 ? 'text-white/20' :
                        charCount < MIN_CHARS ? 'text-white/40' :
                            charCount > MAX_CHARS ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                    {charCount > 0 && charCount < MIN_CHARS && ` · ${MIN_CHARS - charCount} more needed`}
                </span>

                <button
                    onClick={onScan}
                    disabled={!isValid || loading}
                    className="flex items-center gap-2 bg-white text-black font-black px-7 py-2.5 rounded-xl text-sm tracking-wide hover:bg-emerald-400 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                >
                    {loading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Scan Contract
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// ── Right Panel: AI Results ─────────────────────────────────────────────────
const ResultsPanel = ({ loading, error, results }) => {
    // Empty / loading / error states
    if (!loading && !error && !results) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
                <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <p className="text-white/20 text-sm font-medium max-w-[180px] leading-relaxed">
                    Paste a contract on the left and click <span className="text-white/40 font-bold">Scan Contract</span>
                </p>
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
                    <p className="text-white text-sm font-bold mb-1">Analyzing contract…</p>
                    <p className="text-white/30 text-xs">This usually takes 5–15 seconds</p>
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

    // Full results
    const overall = overallBadge[results.overall_risk] || overallBadge.low;

    return (
        <div className="h-full overflow-y-auto pr-1 space-y-5 scan-results-panel">
            {/* Panel header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/8 sticky top-0 bg-[#0B1120] pt-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-white/50 font-mono text-[10px] uppercase tracking-widest">analysis_report.json</span>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${overall.bg} ${overall.border} ${overall.text}`}>
                    {overall.label}
                </span>
            </div>

            {/* Summary */}
            {results.summary && (
                <div className={`${overall.bg} border ${overall.border} rounded-xl p-4`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${overall.text}`}>Overall Assessment</p>
                    <p className="text-white/70 text-xs leading-relaxed">{results.summary}</p>
                </div>
            )}

            {/* Risk count label */}
            {results.risks?.length > 0 && (
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                    {results.risks.length} Risk{results.risks.length !== 1 ? 's' : ''} Found
                </p>
            )}

            {/* Risk cards */}
            {results.risks?.map((risk, i) => {
                const cfg = severityConfig[risk.severity] || severityConfig.low;
                return (
                    <div key={i} className={`scan-risk-card bg-black border ${cfg.bgBorder} p-5 rounded-xl transition-colors`}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className={`${cfg.textColor} font-bold text-sm flex items-center gap-2`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 ${cfg.dotExtra}`} />
                                {risk.title}
                            </h4>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${cfg.textColor} opacity-60 ml-2 flex-shrink-0`}>
                                {cfg.label}
                            </span>
                        </div>
                        <p className="text-white/55 text-xs leading-relaxed mb-3">{risk.issue}</p>
                        {risk.suggestion && (
                            <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-lg p-3">
                                <span className="text-emerald-400 text-[11px] font-bold">🪄 {risk.suggestion}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const ScanContract = () => {
    const headingRef = useRef(null);
    const panelRef = useRef(null);
    const [contractText, setContractText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
            .fromTo(panelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    }, []);

    const handleScan = async () => {
        const charCount = contractText.length;
        if (charCount < MIN_CHARS || charCount > MAX_CHARS) return;
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const data = await scanContract(contractText);
            setResults(data);
            setTimeout(() => {
                gsap.from('.scan-risk-card', {
                    x: 15, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)',
                });
            }, 80);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen pt-28 pb-10 px-4 flex flex-col">
            <div className="w-full max-w-7xl mx-auto flex flex-col flex-1">

                {/* Page heading */}
                <div ref={headingRef} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black mb-5 uppercase tracking-[0.2em]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        AI Risk Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-3">
                        Scan Your <span className="text-emerald-400">Contract.</span>
                    </h1>
                    <p className="text-white/45 text-sm md:text-base max-w-xl mx-auto">
                        Paste your contract on the left — the AI analysis appears instantly on the right.
                    </p>
                </div>

                {/* ── Split Panel ── */}
                <div
                    ref={panelRef}
                    className="flex-1 grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[600px]"
                >
                    {/* LEFT — Input */}
                    <div className="bg-[#080e1a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 min-h-[340px] lg:min-h-0">
                        <InputPanel
                            contractText={contractText}
                            setContractText={setContractText}
                            onScan={handleScan}
                            loading={loading}
                        />
                    </div>

                    {/* RIGHT — Results */}
                    <div className="bg-[#0B1120] p-6 md:p-8 flex flex-col min-h-[340px] lg:min-h-0">
                        <ResultsPanel loading={loading} error={error} results={results} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScanContract;
