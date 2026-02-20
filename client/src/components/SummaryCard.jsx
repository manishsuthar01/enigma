import React from 'react';

const SummaryCard = ({ overallRisk, summary }) => {
    const getRiskStyles = (risk) => {
        switch (risk) {
            case 'Red': return 'bg-risk-high text-white';
            case 'Yellow': return 'bg-risk-medium text-white';
            case 'Green': return 'bg-risk-low text-white';
            default: return 'bg-slate text-white';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-border p-6 risk-card-shadow transition-all">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-navy">Analysis Summary</h2>
                <div className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${getRiskStyles(overallRisk)}`}>
                    Overall Risk: {overallRisk}
                </div>
            </div>
            <p className="text-slate leading-relaxed">
                {summary}
            </p>
        </div>
    );
};

export default SummaryCard;
