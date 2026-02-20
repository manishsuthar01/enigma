import React from 'react';

const TextAreaInput = ({ value, onChange, onScan, loading }) => {
    const charCount = value.length;
    const isTooShort = charCount < 300 && charCount > 0;
    const isTooLong = charCount > 20000;
    const isDisabled = charCount < 300 || isTooLong || loading;

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <textarea
                    className={`w-full p-4 rounded-xl border ${isTooShort || isTooLong ? 'border-risk-high' : 'border-border'
                        } focus:ring-2 focus:ring-navy focus:outline-none min-h-[300px] md:min-h-[400px] resize-none transition-all`}
                    placeholder="Paste your contract text here (min 300 characters)..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={loading}
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-muted">
                    {charCount.toLocaleString()} / 20,000 characters
                </div>
            </div>

            {isTooShort && (
                <p className="text-risk-high text-sm">
                    Please enter at least 300 characters for an accurate analysis.
                </p>
            )}
            {isTooLong && (
                <p className="text-risk-high text-sm">
                    Text exceeds the 20,000 character limit.
                </p>
            )}

            <button
                onClick={onScan}
                disabled={isDisabled}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-semibold transition-all ${isDisabled
                        ? 'bg-slate/20 text-slate/50 cursor-not-allowed'
                        : 'bg-navy text-white hover:bg-navy-light hover:scale-[1.02] shadow-sm'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Analyzing...</span>
                    </span>
                ) : (
                    'Scan Contract'
                )}
            </button>
        </div>
    );
};

export default TextAreaInput;
