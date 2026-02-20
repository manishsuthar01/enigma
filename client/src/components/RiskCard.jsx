import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const RiskCard = ({ severity, title, issue, suggestion }) => {
    const getSeverityIcon = (sev) => {
        switch (sev) {
            case 'High': return <AlertCircle className="w-5 h-5 text-risk-high" />;
            case 'Medium': return <AlertTriangle className="w-5 h-5 text-risk-medium" />;
            case 'Low': return <CheckCircle className="w-5 h-5 text-risk-low" />;
            default: return <Info className="w-5 h-5 text-slate" />;
        }
    };

    const getBadgeStyles = (sev) => {
        switch (sev) {
            case 'High': return 'bg-red-100 text-risk-high border-risk-high/20';
            case 'Medium': return 'bg-amber-100 text-risk-medium border-risk-medium/20';
            case 'Low': return 'bg-green-100 text-risk-low border-risk-low/20';
            default: return 'bg-slate/10 text-slate border-slate/20';
        }
    };

    return (
        <div className="bg-white border border-border rounded-xl p-5 mb-4 risk-card-shadow hover:border-navy/20 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {getSeverityIcon(severity)}
                    <h3 className="font-bold text-navy text-lg">{title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getBadgeStyles(severity)}`}>
                    {severity}
                </span>
            </div>

            <p className="text-slate mb-4 text-sm leading-relaxed">
                {issue}
            </p>

            <div className="bg-softwhite rounded-lg p-3 border border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted block mb-1">Suggestion</span>
                <p className="text-sm text-slate italic">
                    {suggestion}
                </p>
            </div>
        </div >
    );
};

export default RiskCard;
