export const satBlueData = {
    "Kashi": [
        { stage: "SAT-1", installedBase: 233441, cumulativeSat: 142282, efficiencyPct: 60.95, startSAT: "3/10/2025" },
        { stage: "SAT-2", installedBase: 311192, cumulativeSat: 231838, efficiencyPct: 74.5, startSAT: "6/25/2025" },
        { stage: "SAT-3", installedBase: 403288, cumulativeSat: 321380, efficiencyPct: 79.69, startSAT: "8/5/2025" },
        { stage: "SAT-4", installedBase: 456344, cumulativeSat: 365988, efficiencyPct: 80.2, startSAT: "9/6/2025" },
        { stage: "SAT-5", installedBase: 540965, cumulativeSat: 410484, efficiencyPct: 75.88, startSAT: "10/6/2025" },
        { stage: "SAT-6", installedBase: 630701, cumulativeSat: 469557, efficiencyPct: 74.45, startSAT: "11/5/2025" },
        { stage: "SAT-7", installedBase: 735226, cumulativeSat: 573623, efficiencyPct: 78.02, startSAT: "12/2/2025" },
        { stage: "SAT-8", installedBase: 832957, cumulativeSat: 691438, efficiencyPct: 83.01, startSAT: "1/12/2026" }
    ],
    "Triveni": [
        { stage: "SAT-1", installedBase: 181261, cumulativeSat: 158277, efficiencyPct: 87.32, startSAT: "3/10/2025" },
        { stage: "SAT-2", installedBase: 246747, cumulativeSat: 211902, efficiencyPct: 85.88, startSAT: "6/25/2025" },
        { stage: "SAT-3", installedBase: 420821, cumulativeSat: 286935, efficiencyPct: 68.18, startSAT: "8/5/2025" },
        { stage: "SAT-4", installedBase: 461813, cumulativeSat: 359658, efficiencyPct: 77.88, startSAT: "9/6/2025" },
        { stage: "SAT-5", installedBase: 535949, cumulativeSat: 406870, efficiencyPct: 75.91, startSAT: "10/6/2025" },
        { stage: "SAT-6", installedBase: 535949, cumulativeSat: 452271, efficiencyPct: 84.39, startSAT: "11/5/2025" },
        { stage: "SAT-7", installedBase: 634327, cumulativeSat: 563346, efficiencyPct: 88.76, startSAT: "12/6/2025" },
        { stage: "SAT-8", installedBase: 805269, cumulativeSat: 671966, efficiencyPct: 83.44, startSAT: "1/12/2026" }
    ],
    "Agra": [
        { stage: "SAT-1", installedBase: 263964, cumulativeSat: 198356, efficiencyPct: 75.15, startSAT: "11/14/2024" },
        { stage: "SAT-2", installedBase: 325021, cumulativeSat: 298809, efficiencyPct: 91.94, startSAT: "7/13/2025" },
        { stage: "SAT-3", installedBase: 497171, cumulativeSat: 400999, efficiencyPct: 80.66, startSAT: "8/13/2025" },
        { stage: "SAT-4", installedBase: 555723, cumulativeSat: 466026, efficiencyPct: 83.86, startSAT: "9/13/2025" },
        { stage: "SAT-5", installedBase: 660015, cumulativeSat: 510651, efficiencyPct: 77.37, startSAT: "10/14/2025" },
        { stage: "SAT-6", installedBase: 767215, cumulativeSat: 631707, efficiencyPct: 82.34, startSAT: "11/12/2025" },
        { stage: "SAT-7", installedBase: 895353, cumulativeSat: 768174, efficiencyPct: 85.80, startSAT: "12/15/2025" },
        { stage: "SAT-8", installedBase: 1196226, cumulativeSat: 960242, efficiencyPct: 80.28, startSAT: "2/12/2026" }
    ]
};

// Helper to aggregate monthly data into quarters
export const aggregateQuarterlyData = (monthlyData) => {
    // monthlyData expected to have: month (e.g., "Jun-2024"), metersReceived, metersInstalled
    const quarters = {};
    
    monthlyData.forEach(d => {
        const [month, year] = d.month.split('-');
        let q = '';
        if (['Jan', 'Feb', 'Mar'].includes(month)) q = `Q1 ${year}`; //'Jan', 'Feb', 'Mar'
        else if (['Apr', 'May', 'Jun'].includes(month)) q = `Q2 ${year}`;
        else if (['Jul', 'Aug', 'Sep'].includes(month)) q = `Q3 ${year}`;
        else if (['Oct', 'Nov', 'Dec'].includes(month)) q = `Q4 ${year}`;
        
        if (!quarters[q]) {
            quarters[q] = { quarter: q, received: 0, installed: 0 };
        }
        quarters[q].received += d.metersReceived || d.received || 0;
        quarters[q].installed += d.metersInstalled || d.installed || 0;
    });

    return Object.values(quarters).map(q => ({
        ...q,
        installedPct: q.received > 0 ? ((q.installed / q.received) * 100).toFixed(1) : 0
    }));
};
