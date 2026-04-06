const getQuarter = (month) => {
    const m = month.split("-")[0];
    if (["Jan", "Feb", "Mar"].includes(m)) return "Q1";
    if (["Apr", "May", "Jun"].includes(m)) return "Q2";
    if (["Jul", "Aug", "Sep"].includes(m)) return "Q3";
    return "Q4";
};

const monthIndex = {
    Jan: 0, Feb: 1, Mar: 2,
    Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8,
    Oct: 9, Nov: 10, Dec: 11,
};

const sortMonths = (a, b) => {
    const [ma, ya] = a.split("-");
    const [mb, yb] = b.split("-");
    return ya !== yb
        ? Number(ya) - Number(yb)
        : monthIndex[ma] - monthIndex[mb];
};

export const buildQuarterWiseInventory = (rows) => {
    const map = {};

    rows.forEach((d) => {
        const [mon, yy] = d.month.split("-");
        const quarter = getQuarter(d.month);
        const year = Number(yy) < 50 ? 2000 + Number(yy) : 1900 + Number(yy);
        const key = `${quarter}-${year}`;

        if (!map[key]) {
            map[key] = {
                quarter,
                year,
                netChange: 0,
                months: [],
            };
        }

        map[key].netChange += d.netChange;
        map[key].months.push(d.month);
    });

    return Object.values(map)
        .map((q) => {
            q.months.sort(sortMonths);
            const startMonth = q.months[0].split("-")[0];
            const endMonth = q.months[q.months.length - 1].split("-")[0];
            const shortYear = String(q.year).slice(-2);
            return {
                quarter: q.quarter,
                year: q.year,
                label: `${q.quarter} (${startMonth} → ${endMonth})' ${shortYear}`,
                netChange: q.netChange,
            };
        })
        .sort(
            (a, b) =>
                a.year - b.year ||
                { Q1: 1, Q2: 2, Q3: 3, Q4: 4 }[a.quarter] -
                { Q1: 1, Q2: 2, Q3: 3, Q4: 4 }[b.quarter]
        );
};

