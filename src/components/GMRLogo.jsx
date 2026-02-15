import React from 'react';

const GMRLogo = ({ className = "h-12" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 100"
            className={className}
            fill="none"
            aria-label="GMR Logo"
        >
            {/* G - Blue */}
            <path
                d="M85 35 H55 V65 H75 V50 H85 V68 C85 85 75 95 55 95 C30 95 15 75 15 50 C15 25 30 5 55 5 C75 5 85 15 85 35 Z"
                fill="#0B3C6D"
                stroke="#0B3C6D"
                strokeWidth="10"
                strokeLinejoin="round"
            />

            {/* M - Red Chevron (Left) */}
            <path
                d="M90 100 L125 10 L160 100 H135 L125 60 L115 100 H90 Z"
                fill="#E31E24"
            />

            {/* M - Orange Chevron (Right) - Overlapping */}
            <path
                d="M140 100 L175 10 L210 100 H185 L175 60 L165 100 H140 Z"
                fill="#F4A300"
            />

            {/* R - Blue */}
            <path
                d="M220 5 L220 100 H245 V65 H255 L275 100 H300 L275 60 C290 60 300 50 300 30 C300 10 285 5 260 5 H220 Z M245 45 V25 H260 C270 25 270 45 260 45 H245 Z"
                fill="#0B3C6D"
            />
        </svg>
    );
};

export default GMRLogo;
