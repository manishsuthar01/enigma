import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { scanContract } from '../../services/api';

const ACCEPTED_TYPES = ['.pdf', '.txt'];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

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

// ── File type icons ────────────────────────────────────────────────────────
const FileIcon = ({ ext }) => {
    if (ext === 'pdf') {
        return (
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <text x="7" y="17" className="text-[7px] font-black fill-red-400" stroke="none">PDF</text>
            </svg>
        );
    }
    return (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
};

// ── Left Panel: File Upload ────────────────────────────────────────────────
const FileUploadPanel = ({ file, setFile, onScan, loading, hasResult }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const validateFile = useCallback((f) => {
        const ext = f.name.split('.').pop().toLowerCase();
        if (!['pdf', 'txt'].includes(ext)) {
            return `Unsupported file type: .${ext} — Only PDF and TXT are accepted.`;
        }
        if (f.size > MAX_SIZE_BYTES) {
            return `File too large: ${(f.size / (1024 * 1024)).toFixed(1)} MB. Max is ${MAX_SIZE_MB} MB.`;
        }
        return null;
    }, []);

    const [fileError, setFileError] = useState('');

    const handleFile = useCallback((f) => {
        const err = validateFile(f);
        if (err) {
            setFileError(err);
            setFile(null);
            return;
        }
        setFileError('');
        setFile(f);
    }, [validateFile, setFile]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => setIsDragOver(false), []);

    const ext = file?.name?.split('.').pop().toLowerCase();

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
                    <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest ml-1">upload_contract</span>
                </div>
            </div>

            {/* Drop zone */}
            <div
                className={`flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragOver
                    ? 'border-emerald-400/60 bg-emerald-500/5'
                    : file
                        ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                    }`}
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
                    onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) handleFile(f);
                        e.target.value = '';
                    }}
                />

                {file ? (
                    /* ── File selected state ── */
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                            <FileIcon ext={ext} />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                            <p className="text-white/30 text-xs mt-0.5">
                                {(file.size / 1024).toFixed(1)} KB · {ext?.toUpperCase()}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                setFileError('');
                            }}
                            className="text-[10px] font-bold text-white/40 hover:text-red-400 uppercase tracking-wider transition-colors"
                        >
                            ✕ Remove
                        </button>
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                            <svg className="w-7 h-7 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white/40 text-sm font-bold">
                                {isDragOver ? 'Drop your file here' : 'Drop contract file here'}
                            </p>
                            <p className="text-white/20 text-xs mt-1">
                                or <span className="text-emerald-400/60 font-bold">browse</span> · PDF, TXT · max {MAX_SIZE_MB}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* File error */}
            {fileError && (
                <p className="text-red-400 text-xs font-medium mt-2 px-1">{fileError}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end mt-4 pt-4 border-t border-white/8">
                <button
                    onClick={onScan}
                    disabled={!file || loading}
                    className={`flex items-center gap-2 font-black px-7 py-2.5 rounded-xl text-sm tracking-wide transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed ${hasResult
                        ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        : 'bg-white text-black hover:bg-emerald-400'
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
                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center bg-white/2">
                    <svg className="w-8 h-8 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <p className="text-white/25 text-sm font-bold mb-1">No analysis yet</p>
                    <p className="text-white/15 text-xs max-w-[200px] leading-relaxed">
                        Upload a contract file, then click <span className="text-white/30">Scan Contract</span>
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
                    <p className="text-white/30 text-xs">Extracting text & scanning for risks</p>
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

    // RAG returns { clauses, risk: { overallRisk, summary, risks[] } }
    const riskData = results.risk || results;
    const riskMap = { red: 'high', yellow: 'medium', green: 'low' };
    const riskLevel = riskMap[(riskData.overallRisk || '').toLowerCase()] || riskData.overall_risk || 'low';
    const overall = overallBadge[riskLevel] || overallBadge.low;
    const score = typeof riskData.risk_score === 'number' ? riskData.risk_score : null;

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-4">
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
                        <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-wide">⚠ Demo mode — RAG unavailable</span>
                    )}
                </div>
                {score !== null && (
                    <ScoreRing score={score} riskLevel={riskLevel} />
                )}
            </div>

            {/* Summary */}
            {riskData.summary && (
                <div className={`${overall.bg} border ${overall.border} rounded-xl p-4`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${overall.text}`}>Summary</p>
                    <p className="text-white/70 text-xs leading-relaxed">{riskData.summary}</p>
                </div>
            )}

            {/* Risk count */}
            {riskData.risks?.length > 0 && (
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest px-1">
                    {riskData.risks.length} Risk{riskData.risks.length !== 1 ? 's' : ''} Identified
                </p>
            )}

            {/* Risk cards */}
            {riskData.risks?.map((risk, i) => {
                const sev = (risk.severity || 'low').toLowerCase();
                const cfg = severityConfig[sev] || severityConfig.low;
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
                        Upload a PDF or TXT file — risk analysis appears on the right.
                    </p>
                </div>

                {/* Split Panel */}
                <div
                    ref={panelRef}
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[72vh] min-h-[520px]"
                >
                    {/* LEFT */}
                    <div className="bg-[#080e1a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-white/8">
                        <FileUploadPanel
                            file={file}
                            setFile={setFile}
                            onScan={handleScan}
                            loading={loading}
                            hasResult={!!results}
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="bg-[#0B1120] p-6 md:p-8 flex flex-col overflow-hidden">
                        <ResultsPanel loading={loading} error={error} results={results} />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ScanContract;
