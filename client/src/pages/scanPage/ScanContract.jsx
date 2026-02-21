import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { scanContract } from '../../services/api';

const ACCEPTED_TYPES = ['.pdf', '.txt', 'application/pdf', 'text/plain'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// ── Severity styling ──────────────────────────────────────────────────────
const severityConfig = {
    high: { textColor: 'text-[#ef4444]', bgBorder: 'border-[#ef4444]/20', dotExtra: '', label: 'High Risk' },
    medium: { textColor: 'text-[#f59e0b]', bgBorder: 'border-[#f59e0b]/20', dotExtra: '', label: 'Medium' },
    low: { textColor: 'text-[#22c55e]', bgBorder: 'border-[#22c55e]/20', dotExtra: '', label: 'Low' },
};

const overallBadge = {
    high: { bg: 'bg-[#ef4444]/5', border: 'border-[#ef4444]/20', text: 'text-[#ef4444]', label: '⚠ High Risk' },
    medium: { bg: 'bg-[#f59e0b]/5', border: 'border-[#f59e0b]/20', text: 'text-[#f59e0b]', label: '⚡ Medium Risk' },
    low: { bg: 'bg-[#22c55e]/5', border: 'border-[#22c55e]/20', text: 'text-[#22c55e]', label: '✓ Low Risk' },
};

const ScoreRing = ({ score, riskLevel }) => {
    const r = 28, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
    const colors = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
    const col = colors[riskLevel] || colors.low;
    return (
        <svg width="68" height="68" className="flex-shrink-0">
            <circle cx="34" cy="34" r={r} fill="none" stroke="#222" strokeWidth="4" />
            <circle cx="34" cy="34" r={r} fill="none" stroke={col} strokeWidth="4"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                transform="rotate(-90 34 34)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            <text x="34" y="32" textAnchor="middle" className="fill-white text-sm font-bold">{score}</text>
            <text x="34" y="44" textAnchor="middle" className="fill-[#666] text-[7px] font-bold uppercase">/100</text>
        </svg>
    );
};

// ── Left Panel ────────────────────────────────────────────────────────────
const FileUploadPanel = ({ file, setFile, onScan, loading, hasResult }) => {
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileError, setFileError] = useState('');

    const handleFile = (f) => {
        setFileError('');
        const ext = f.name.split('.').pop().toLowerCase();
        if (!['pdf', 'txt'].includes(ext)) {
            setFileError('Only PDF and TXT files are supported.');
            return;
        }
        if (f.size > MAX_SIZE) {
            setFileError(`File too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max is 10 MB.`);
            return;
        }
        setFile(f);
    };

    const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };
    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#222]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/50" />
                </div>
                <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest ml-1">upload_contract</span>
            </div>

            <div
                className={`flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed ${dragOver ? 'border-[#7c5cfc] bg-[#7c5cfc]/5' : file ? 'border-[#222] bg-[#0a0a0a]' : 'border-[#222] bg-[#0a0a0a]'} transition-all cursor-pointer`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    className="hidden"
                    onChange={(e) => { const f = e.target.files[0]; if (f) handleFile(f); e.target.value = ''; }}
                />
                {file ? (
                    <div className="text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-[#7c5cfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-white text-sm font-bold mb-1 truncate max-w-[260px]">{file.name}</p>
                        <p className="text-[#666] text-xs mb-3">
                            {(file.size / 1024).toFixed(1)} KB · {file.name.split('.').pop().toUpperCase()}
                        </p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); setFileError(''); }}
                            className="text-[#ef4444] text-[10px] font-bold uppercase tracking-wider hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="text-[#999] text-sm font-semibold mb-1">
                            {dragOver ? 'Drop your file here' : 'Drag & drop a contract'}
                        </p>
                        <p className="text-[#555] text-xs mb-3">or click to browse</p>
                        <p className="text-[#444] text-[10px] uppercase tracking-wider font-bold">PDF or TXT · max 10 MB</p>
                    </div>
                )}
            </div>

            {fileError && (
                <div className="mt-3 flex items-center gap-2 text-[#ef4444] text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {fileError}
                </div>
            )}

            <div className="pt-5 mt-4 border-t border-[#222]">
                <button
                    onClick={onScan}
                    disabled={!file || loading}
                    className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed text-sm tracking-wide ${hasResult
                        ? 'bg-[#111] border border-[#222] text-white hover:bg-[#1a1a1a] hover:border-[#333]'
                        : 'bg-[#7c5cfc] text-white hover:bg-[#6a4ce0] hover:scale-[1.02]'
                        }`}
                >
                    {loading ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Analyzing…
                        </>
                    ) : hasResult ? (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Re-Scan
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
                <div className="w-16 h-16 rounded-2xl border border-[#222] flex items-center justify-center bg-[#111]">
                    <svg className="w-8 h-8 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <p className="text-[#666] text-sm font-semibold mb-1">No analysis yet</p>
                    <p className="text-[#444] text-xs max-w-[200px] leading-relaxed">
                        Upload a contract file, then click <span className="text-[#999]">Scan Contract</span>
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-5">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-[#7c5cfc]/20 border-t-[#7c5cfc] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#7c5cfc]" />
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-white text-sm font-semibold mb-1">Analyzing contract…</p>
                    <p className="text-[#666] text-xs">Extracting text & scanning for risks</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-[#ef4444] text-sm font-medium text-center max-w-[220px] leading-relaxed">{error}</p>
            </div>
        );
    }

    // RAG returns { clauses, risk: { overallRisk, summary, risks[] } }
    const riskData = results.risk || results;
    const riskMap = { red: 'high', yellow: 'medium', green: 'low' };
    const riskLevel = riskMap[(riskData.overallRisk || '').toLowerCase()] || riskData.overall_risk || 'low';
    const overall = overallBadge[riskLevel] || overallBadge.low;
    const score = typeof riskData.risk_score === 'number' ? riskData.risk_score : null;

    return (
        <div data-lenis-prevent className="h-full overflow-y-auto pr-2 space-y-4">
            {/* Header row */}
            <div className="flex items-start justify-between pb-4 border-b border-[#222] sticky top-0 bg-[#0a0a0a] z-10">
                <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7c5cfc]" />
                        <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest">analysis_report.json</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border self-start ${overall.bg} ${overall.border} ${overall.text}`}>
                        {overall.label}
                    </span>
                    {results._demo_mode && (
                        <span className="text-[9px] font-bold text-[#f59e0b]/70 uppercase tracking-wide">⚠ Demo mode — RAG unavailable</span>
                    )}
                </div>
                {score !== null && (
                    <ScoreRing score={score} riskLevel={riskLevel} />
                )}
            </div>

            {/* Summary */}
            {riskData.summary && (
                <div className={`${overall.bg} border ${overall.border} rounded-xl p-4`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${overall.text}`}>Summary</p>
                    <p className="text-[#999] text-xs leading-relaxed">{riskData.summary}</p>
                </div>
            )}

            {/* Risk count */}
            {riskData.risks?.length > 0 && (
                <p className="text-[#666] text-[10px] font-bold uppercase tracking-widest px-1">
                    {riskData.risks.length} Risk{riskData.risks.length !== 1 ? 's' : ''} Identified
                </p>
            )}

            {/* Risk cards */}
            {riskData.risks?.map((risk, i) => {
                const sev = (risk.severity || 'low').toLowerCase();
                const cfg = severityConfig[sev] || severityConfig.low;
                return (
                    <div key={i} className={`scan-risk-card bg-[#111] border ${cfg.bgBorder} p-5 rounded-xl transition-all hover:border-[#333]`}>
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className={`${cfg.textColor} font-bold text-sm flex items-center gap-2`}>
                                <span className={`w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 ${cfg.dotExtra}`} />
                                {risk.title}
                            </h4>
                            <span className={`text-[9px] font-bold uppercase tracking-tighter ${cfg.textColor} opacity-60 flex-shrink-0`}>
                                {cfg.label}
                            </span>
                        </div>
                        <p className="text-[#999] text-xs leading-relaxed mb-3">{risk.issue}</p>
                        {risk.suggestion && (
                            <div className="bg-[#7c5cfc]/5 border border-[#7c5cfc]/15 rounded-lg p-3">
                                <span className="text-[#7c5cfc] text-[11px] font-bold">🪄 {risk.suggestion}</span>
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
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
            .fromTo(panelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
    }, []);

    const handleScan = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const data = await scanContract(file);
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
            <div className="w-full max-w-container mx-auto flex flex-col flex-1">

                {/* Heading */}
                <div ref={headingRef} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#222] bg-[#111] text-[#999] text-[10px] font-bold mb-5 uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc]" />
                        AI Risk Scanner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter leading-tight mb-3">
                        Scan Your <span className="text-[#7c5cfc]">Contract.</span>
                    </h1>
                    <p className="text-[#999] text-sm md:text-base max-w-xl mx-auto">
                        Upload a PDF or TXT file — risk analysis appears on the right.
                    </p>
                </div>

                {/* Split Panel */}
                <div
                    ref={panelRef}
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-[#222] h-[72vh] min-h-[520px]"
                >
                    {/* LEFT */}
                    <div className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-[#222]">
                        <FileUploadPanel
                            file={file}
                            setFile={setFile}
                            onScan={handleScan}
                            loading={loading}
                            hasResult={!!results}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col overflow-hidden">
                        <ResultsPanel loading={loading} error={error} results={results} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScanContract;
