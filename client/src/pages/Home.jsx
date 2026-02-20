import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Header from '../components/Header';
import TextAreaInput from '../components/TextAreaInput';
import SummaryCard from '../components/SummaryCard';
import RiskCard from '../components/RiskCard';
import { scanContract } from '../services/api';

const Home = () => {
    const [contractText, setContractText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const resultsRef = useRef(null);
    const heroRef = useRef(null);

    useEffect(() => {
        // Hero fade-in animation
        gsap.fromTo(heroRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
    }, []);

    const handleScan = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await scanContract(contractText);
            setResult(data);

            // Animate results entrance
            setTimeout(() => {
                if (resultsRef.current) {
                    gsap.fromTo(resultsRef.current.children,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
                    );
                    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-softwhite">
            <Header />

            <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                {/* Hero Section */}
                <section ref={heroRef} className="text-center mb-16 py-12 bg-navy rounded-3xl text-white shadow-xl px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Understand Contract Risk in Seconds.
                    </h1>
                    <p className="text-muted-foreground text-slate-300 text-lg max-w-2xl mx-auto">
                        Paste your agreement below. Our AI will generate a structured risk report instantly,
                        identifying traps and suggesting improvements.
                    </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input Area */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-navy"></div>
                            <h2 className="text-lg font-bold text-navy uppercase tracking-wider">Contract Input</h2>
                        </div>
                        <TextAreaInput
                            value={contractText}
                            onChange={setContractText}
                            onScan={handleScan}
                            loading={loading}
                        />
                        {error && (
                            <div className="p-4 bg-red-50 border border-risk-high/20 rounded-xl text-risk-high text-sm">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-navy"></div>
                            <h2 className="text-lg font-bold text-navy uppercase tracking-wider">Analysis Results</h2>
                        </div>

                        {!result && !loading && (
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-white/50 text-center">
                                <div className="w-16 h-16 bg-softwhite rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-slate font-medium">No contract analyzed yet.</p>
                                <p className="text-muted text-sm mt-1">Paste your agreement to generate a report.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-32 bg-slate/10 rounded-2xl w-full"></div>
                                <div className="h-24 bg-slate/10 rounded-xl w-full"></div>
                                <div className="h-24 bg-slate/10 rounded-xl w-full"></div>
                            </div>
                        )}

                        {result && (
                            <div ref={resultsRef} className="space-y-6">
                                <SummaryCard
                                    overallRisk={result.overallRisk}
                                    summary={result.summary}
                                />
                                <div className="space-y-4">
                                    {result.risks.map((risk, index) => (
                                        <RiskCard key={index} {...risk} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-8 border-t border-border bg-white text-center">
                <p className="text-muted text-sm">
                    &copy; {new Date().getFullYear()} Enigma Risk Scanner. Built for Hackathon.
                </p>
            </footer>
        </div>
    );
};

export default Home;
