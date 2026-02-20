import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { scanContract } from '../../services/api';

const MIN_CHARS = 300;
const MAX_CHARS = 20000;

// ── One-click demo contract ───────────────────────────────────────────────
const SAMPLE_CONTRACT = `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into as of January 1, 2025, by and between TechCorp Inc. ("Client") and the undersigned consultant ("Consultant").

1. SERVICES. Consultant agrees to provide software development services as directed by Client from time to time.

2. COMPENSATION. Client shall pay Consultant $150 per hour, invoiced monthly.

3. TERM. This Agreement commences on the date above and continues until terminated.

4. TERMINATION. Client may terminate this Agreement at any time with 7 days written notice, with no kill fee or severance obligation.

5. INTELLECTUAL PROPERTY. All work product, inventions, software, and deliverables created by Consultant during the term of this Agreement — including pre-existing tools and frameworks used by Consultant — shall be the exclusive property of Client.

6. NON-COMPETE. For a period of 24 months following termination, Consultant shall not directly or indirectly engage in any business that competes with Client in North America, Europe, or Asia Pacific.

7. NON-SOLICITATION. For a period of 18 months after termination, Consultant shall not solicit or hire any of Client's employees or contractors.

8. INDEMNIFICATION. Consultant agrees to indemnify, defend, and hold harmless Client, its affiliates, officers, and employees from any and all claims, losses, damages, and liabilities, including attorneys' fees, arising from any act or omission of Consultant, regardless of negligence.

9. LIMITATION OF LIABILITY. In no event shall Client be liable to Consultant for any indirect, incidental, or consequential damages. Client's total liability shall not exceed $500.

10. CONFIDENTIALITY. Consultant shall maintain strict confidentiality of all Client information in perpetuity, even after termination of this Agreement.

11. MODIFICATION. Client reserves the right to modify the terms of this Agreement, including compensation rates, with 7 days notice.

12. GOVERNING LAW. This Agreement shall be governed by the laws of Delaware.`;

const severityConfig = {
    high: { bgBorder: 'border-red-500/30 hover:border-red-500/60', textColor: 'text-red-400', dotExtra: 'animate-pulse', label: 'High Risk' },
    medium: { bgBorder: 'border-amber-500/30 hover:border-amber-500/60', textColor: 'text-amber-400', dotExtra: '', label: 'Medium Risk' },
    low: { bgBorder: 'border-emerald-500/30', textColor: 'text-emerald-400', dotExtra: '', label: 'Low Risk' },
};

const overallBadge = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', scoreColor: 'text-red-400', label: 'High Risk' },
    medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', scoreColor: 'text-amber-400', label: 'Medium Risk' },
    low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', scoreColor: 'text-emerald-400', label: 'Low Risk' },
};

// ── Risk Score Ring ────────────────────────────────────────────────────────
const ScoreRing = ({ score, riskLevel }) => {
    const cfg = overallBadge[riskLevel] || overallBadge.low;
    const radius = 28;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;
    const strokeColor = riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f59e0b' : '#10b981';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-[72px] h-[72px]">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                    <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                    <circle
                        cx="36" cy="36" r={radius} fill="none"
                        stroke={strokeColor} strokeWidth="5"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${strokeColor}80)` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-black text-lg leading-none ${cfg.scoreColor}`}>{score}</span>
                    <span className="text-white/30 text-[8px] uppercase tracking-wider">/ 100</span>
                </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest mt-1.5 ${cfg.text}`}>{cfg.label}</span>
        </div>
    );
};

// ── Left Panel ─────────────────────────────────────────────────────────────
const InputPanel = ({ contractText, setContractText, onScan, loading, onLoadSample }) => {
    const charCount = contractText.length;
    const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

    return (
        <div className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest ml-1">contract_input.txt</span>
                </div>
                <button
                    onClick={onLoadSample}
                    className="text-[10px] font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 transition-all uppercase tracking-wider"
                >
                    ⚡ Load Sample
                </button>
            </div>

            {/* Textarea */}
            <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder={"Paste your contract text here…\n\nOr click ⚡ Load Sample to try with a demo contract."}
                className="flex-1 w-full bg-transparent text-white text-sm placeholder-white/20 focus:outline-none resize-none leading-relaxed font-mono"
            />

            {/* Footer */}
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

// ── Right Panel ────────────────────────────────────────────────────────────
const ResultsPanel = ({ loading, error, results }) => {
    if (!loading && !error && !results) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-5">
                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/2">
                    <svg className="w-8 h-8 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <p className="text-white/25 text-sm font-bold mb-1">No analysis yet</p>
                    <p className="text-white/15 text-xs max-w-[200px] leading-relaxed">
                        Load a sample or paste your contract, then click <span className="text-white/30">Scan Contract</span>
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
                    <p className="text-white text-sm font-bold mb-1">Analyzing contract…</p>
                    <p className="text-white/30 text-xs">Usually takes 5–15 seconds</p>
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

    const overall = overallBadge[results.overall_risk] || overallBadge.low;
    const score = typeof results.risk_score === 'number' ? results.risk_score : null;

    return (
        <div className="h-full overflow-y-auto pr-1 space-y-4">
            {/* Header row: filename + score ring */}
            <div className={`flex items-start justify-between pb-4 border-b border-white/8 sticky top-0 bg-[#0B1120] z-10`}>
                <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">analysis_report.json</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border self-start ${overall.bg} ${overall.border} ${overall.text}`}>
                        {overall.label}
                    </span>
                    {results._demo_mode && (
                        <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-wide">⚠ Demo mode — API unavailable</span>
                    )}
                </div>
                {score !== null && (
                    <ScoreRing score={score} riskLevel={results.overall_risk} />
                )}
            </div>

            {/* Summary */}
            {results.summary && (
                <div className={`${overall.bg} border ${overall.border} rounded-xl p-4`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${overall.text}`}>Summary</p>
                    <p className="text-white/70 text-xs leading-relaxed">{results.summary}</p>
                </div>
            )}

            {/* Risk count */}
            {results.risks?.length > 0 && (
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest px-1">
                    {results.risks.length} Risk{results.risks.length !== 1 ? 's' : ''} Identified
                </p>
            )}

            {/* Risk cards */}
            {results.risks?.map((risk, i) => {
                const cfg = severityConfig[risk.severity] || severityConfig.low;
                return (
                    <div key={i} className={`scan-risk-card bg-black border ${cfg.bgBorder} p-5 rounded-xl transition-colors`}>
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className={`${cfg.textColor} font-bold text-sm flex items-center gap-2`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 ${cfg.dotExtra}`} />
                                {risk.title}
                            </h4>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${cfg.textColor} opacity-60 flex-shrink-0`}>
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

// ── Main Page ──────────────────────────────────────────────────────────────
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

                {/* Heading */}
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
                        Paste a contract on the left — risk analysis appears on the right.
                    </p>
                </div>

                {/* Split Panel */}
                <div
                    ref={panelRef}
                    className="flex-1 grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[600px]"
                >
                    {/* LEFT */}
                    <div className="bg-[#080e1a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/8 min-h-[340px] lg:min-h-0">
                        <InputPanel
                            contractText={contractText}
                            setContractText={setContractText}
                            onScan={handleScan}
                            loading={loading}
                            onLoadSample={() => setContractText(SAMPLE_CONTRACT)}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="bg-[#0B1120] p-6 md:p-8 flex flex-col min-h-[340px] lg:min-h-0">
                        <ResultsPanel loading={loading} error={error} results={results} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScanContract;
