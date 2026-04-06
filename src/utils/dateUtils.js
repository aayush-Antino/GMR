/**
 * Utility to calculate date ranges for different durations.
 * Returns { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
 */
export const getDateRange = (duration) => {
    const to = new Date();
    let from = new Date();
    
    const d = duration.toLowerCase();

    if (d === 'daily') {
        // Last 30 days
        from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));
    } else if (d === 'weekly') {
        // Last 3 months (approx 90 days)
        from = new Date(to.getTime());
        from.setMonth(to.getMonth() - 3);
    } else if (d === 'monthly') {
        // Last 1 year (e.g. April to same month last year = 12 months difference)
        from = new Date(to.getTime());
        from.setMonth(to.getMonth() - 12);
    }
    
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    
    return {
        from: formatDate(from),
        to: formatDate(to)
    };
};

/**
 * Fills missing dates in a dataset with zero values to ensure a continuous timeline.
 * @param {Array} data - Array of { name: 'Label', ... } objects
 * @param {string} fromStr - Start date YYYY-MM-DD
 * @param {string} toStr - End date YYYY-MM-DD
 * @param {string} granularity - 'daily', 'weekly', or 'monthly'
 */
export const fillDateGaps = (data, fromStr, toStr, granularity = 'daily') => {
    if (!data || !fromStr || !toStr) return data || [];
    
    const start = new Date(fromStr);
    const end = new Date(toStr);
    const filled = [];
    const lookup = new Map((data || []).map(d => [d.name, d]));
    
    const valueKeys = (data && data.length > 0) 
        ? Object.keys(data[0]).filter(k => k !== 'name' && k !== 'color') 
        : ['value', 'count', 'installations', 'stock', 'verified'];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getLabel = (date, gran) => {
        const d = gran?.toLowerCase() || 'daily';
        if (d === 'monthly') {
            return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        }
        if (d === 'weekly') {
            const dayNum = date.getDate();
            const week = Math.min(4, Math.ceil(dayNum / 7));
            const month = monthNames[date.getMonth()].toLowerCase();
            return `week${week}-${month}`;
        }
        // daily
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const tempDate = new Date(start);
    const seenLabels = new Set();
    
    // We loop day by day to ensure we hit every potential label boundary
    while (tempDate <= end) {
        const label = getLabel(tempDate, granularity);
        
        if (!seenLabels.has(label)) {
            const existing = lookup.get(label);
            if (existing) {
                filled.push(existing);
            } else {
                const entry = { name: label };
                valueKeys.forEach(k => { entry[k] = 0; });
                filled.push(entry);
            }
            seenLabels.add(label);
        }
        
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    return filled;
};

/**
 * Calculates the best-fit period (daily, weekly, monthly) for a given date range.
 * @param {string} fromStr - YYYY-MM-DD
 * @param {string} toStr - YYYY-MM-DD
 */
export const getPeriodFromRange = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 'daily';
    
    const start = new Date(fromStr);
    const end = new Date(toStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 45) return 'daily';
    if (diffDays <= 150) return 'weekly';
    return 'monthly';
};
