import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { generateContract as generateContractApi } from '../../services/api';
import { jsPDF } from 'jspdf';

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

    const inputCls = 'w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white text-sm placeholder-[#555] focus:outline-none focus:border-[#7c5cfc]/40 transition-colors';
    const labelCls = 'block text-[#666] text-[10px] font-bold uppercase tracking-widest mb-2';

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Panel header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#222]">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/50" />
                </div>
                <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest ml-1">contract_params.json</span>
            </div>

            <div className="flex-1 space-y-5 pr-1">
                {/* Contract Type */}
                <div>
                    <label className={labelCls}>Contract Type <span className="text-[#ef4444]">*</span></label>
                    <div className="relative">
                        <select
                            required
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value)}
                            className={`${inputCls} appearance-none`}
                        >
                            <option value="" disabled className="text-[#555] bg-[#0a0a0a]">Select a contract type…</option>
                            {CONTRACT_TYPES.map(t => (
                                <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Party A — Name / Company <span className="text-[#ef4444]">*</span></label>
                        <input
                            required type="text" value={party1}
                            onChange={(e) => setParty1(e.target.value)}
                            placeholder="e.g. Acme Corp Ltd."
                            className={inputCls}
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Party B — Name / Company <span className="text-[#ef4444]">*</span></label>
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
            <div className="pt-5 mt-4 border-t border-[#222]">
                <button
                    type="submit"
                    disabled={!isValid || loading}
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
                <div className="w-16 h-16 rounded-2xl border border-[#222] flex items-center justify-center bg-[#111]">
                    <svg className="w-8 h-8 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <p className="text-[#666] text-sm font-semibold mb-1">No contract yet</p>
                    <p className="text-[#444] text-xs max-w-[200px] leading-relaxed">
                        Fill the form on the left and click <span className="text-[#999]">Generate Contract</span>
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
                    <p className="text-white text-sm font-semibold mb-1">Drafting contract…</p>
                    <p className="text-[#666] text-xs">Our AI is generating your document</p>
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

    const rawText = result.contract || result.contract_text || result.text || result.content || JSON.stringify(result, null, 2);
    const [editableText, setEditableText] = useState(rawText);
    const [isEdited, setIsEdited] = useState(false);
    const contractText = editableText;
    const meta = result.metadata;

    return (
        <div className="flex flex-col h-full">
            {/* Output panel header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222] mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#7c5cfc]" />
                    <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest">
                        {meta?.contract_type?.toLowerCase().replace(/\s+/g, '_') || 'contract'}.txt
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {result._demo_mode && (
                        <span className="text-[9px] font-bold text-[#f59e0b]/70 uppercase tracking-wide">⚠ Demo</span>
                    )}
                    <span className="text-[9px] font-bold text-[#7c5cfc] border border-[#7c5cfc]/20 bg-[#7c5cfc]/5 px-2 py-1 rounded-full uppercase tracking-wider">
                        ✓ Generated
                    </span>
                    {isEdited && (
                        <span className="text-[9px] font-bold text-[#f59e0b] border border-[#f59e0b]/20 bg-[#f59e0b]/5 px-2 py-1 rounded-full uppercase tracking-wider">
                            ✎ Edited
                        </span>
                    )}
                </div>
            </div>

            {/* Editable contract text */}
            <div className="flex-1 flex flex-col mb-4 min-h-0">
                <p className="text-[#444] text-[10px] uppercase tracking-widest font-bold mb-2 flex-shrink-0">✎ Click below to edit before downloading</p>
                <textarea
                    data-lenis-prevent
                    value={editableText}
                    onChange={(e) => { setEditableText(e.target.value); setIsEdited(true); }}
                    className="w-full flex-1 min-h-[300px] bg-transparent text-[#ccc] text-[12px] leading-relaxed font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#7c5cfc]/30 rounded-lg p-2 transition-all overflow-y-auto"
                    spellCheck={false}
                />
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#222] flex-shrink-0">
                <button
                    onClick={() => {
                        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
                        const pageW = doc.internal.pageSize.getWidth();
                        const pageH = doc.internal.pageSize.getHeight();
                        const margin = 20;
                        const usable = pageW - margin * 2;
                        let y = margin;

                        const title = meta?.contract_type || 'Legal Contract';
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(18);
                        const titleLines = doc.splitTextToSize(title.toUpperCase(), usable);
                        doc.text(titleLines, pageW / 2, y, { align: 'center' });
                        y += titleLines.length * 8 + 4;

                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(9);
                        doc.setTextColor(120);
                        doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageW / 2, y, { align: 'center' });
                        y += 8;

                        doc.setDrawColor(200);
                        doc.line(margin, y, pageW - margin, y);
                        y += 10;

                        const lineH = 5;
                        const blankGap = 3;
                        const paragraphs = contractText.split('\n');
                        const headingRe = /^\d+\.\s+[A-Z]/;
                        let lastWasBlank = false;

                        for (const rawLine of paragraphs) {
                            const trimmed = rawLine.trim();
                            if (!trimmed) {
                                if (!lastWasBlank) { y += blankGap; lastWasBlank = true; }
                                continue;
                            }
                            lastWasBlank = false;

                            const isHeading = headingRe.test(trimmed);
                            if (isHeading) { y += 2; doc.setFont('helvetica', 'bold'); }
                            else { doc.setFont('helvetica', 'normal'); }
                            doc.setFontSize(11);
                            doc.setTextColor(30);

                            const wrapped = doc.splitTextToSize(trimmed, usable);
                            for (const wl of wrapped) {
                                if (y + lineH > pageH - margin) { doc.addPage(); y = margin; }
                                doc.text(wl, margin, y);
                                y += lineH;
                            }
                        }

                        doc.setFontSize(8);
                        doc.setTextColor(160);
                        doc.text('Generated by Legal-GPT', pageW / 2, pageH - 10, { align: 'center' });

                        const fileName = (meta?.contract_type || 'contract').toLowerCase().replace(/[^a-z0-9]+/g, '_');
                        doc.save(`${fileName}_${Date.now()}.pdf`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#7c5cfc] text-white font-bold py-3 rounded-xl hover:bg-[#6a4ce0] hover:scale-[1.02] transition-all duration-300 text-sm tracking-wide"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>

                <button
                    onClick={() => navigator.clipboard?.writeText(contractText)}
                    className="flex items-center gap-2 border border-[#222] text-[#999] font-bold py-3 px-5 rounded-xl hover:border-[#333] hover:text-white transition-all duration-200 text-sm"
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
        <section className="min-h-screen pt-28 pb-10 px-4 flex flex-col z-10">
            <div className="w-full max-w-container mx-auto flex flex-col flex-1">

                {/* Heading */}
                <div ref={headingRef} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#222] bg-[#111] text-[#999] text-[10px] font-bold mb-5 uppercase tracking-[0.2em]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                        Contract Generator
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter leading-tight mb-3">
                        Generate a <span className="text-[#7c5cfc]">Legal Contract.</span>
                    </h1>
                    <p className="text-[#999] text-sm md:text-base max-w-lg mx-auto">
                        Fill the form on the left — your AI-drafted contract appears on the right instantly.
                    </p>
                </div>

                {/* Split Panel */}
                <div
                    ref={panelRef}
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-[#222] h-[82vh] min-h-[600px]"
                >
                    {/* LEFT — Form */}
                    <div className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-[#222]">
                        <FormPanel onGenerate={handleGenerate} loading={loading} hasResult={!!result} />
                    </div>

                    {/* RIGHT — Output */}
                    <div className="bg-[#0a0a0a] p-6 md:p-8 flex flex-col overflow-hidden">
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
