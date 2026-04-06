/**
 * Data Validation Utilities
 * 
 * Provides validation functions for operational data to ensure data quality
 * and catch potential issues early.
 */

/**
 * Validate a single data entry
 * @param {object} entry - Data entry to validate
 * @param {number} index - Index in the data array
 * @returns {object} - Validation result with warnings and errors
 */
export const validateDataEntry = (entry, index) => {
    const warnings = [];
    const errors = [];
    
    // Check for negative values
    if (entry.metersReceived < 0) {
        errors.push(`Negative meters received for ${entry.month}`);
    }
    if (entry.metersInstalled < 0) {
        errors.push(`Negative meters installed for ${entry.month}`);
    }
    
    // Check SAT stage values
    const satStages = ['SAT_1', 'SAT_2', 'SAT_3', 'SAT_4', 'SAT_5', 'SAT_6', 'SAT_7'];
    satStages.forEach(stage => {
        if (entry[stage] < 0) {
            warnings.push(`Negative ${stage} value for ${entry.month}`);
        }
    });
    
    // Check for unrealistic utilization (installing from inventory is valid, but worth noting)
    if (entry.metersReceived === 0 && entry.metersInstalled > 0) {
        warnings.push(`${entry.month}: Installing ${entry.metersInstalled} meters from inventory (no receipts this month)`);
    }
    
    // Check if SAT cleared significantly exceeds installed (may indicate data issue)
    if (entry.satCleared > entry.metersInstalled * 1.2) {
        warnings.push(`${entry.month}: SAT cleared (${entry.satCleared}) significantly exceeds installed (${entry.metersInstalled})`);
    }
    
    // Check cumulative stock (negative stock may indicate data quality issue)
    if (entry.stockInHand < 0 && index > 0) {
        warnings.push(`${entry.month}: Negative stock in hand (${entry.stockInHand}) - may indicate data quality issue`);
    }
    
    return { warnings, errors, isValid: errors.length === 0 };
};

/**
 * Validate entire dataset
 * @param {Array} data - Array of data entries
 * @returns {object} - Validation summary
 */
export const validateDataset = (data) => {
    const allWarnings = [];
    const allErrors = [];
    
    data.forEach((entry, index) => {
        const validation = validateDataEntry(entry, index);
        allWarnings.push(...validation.warnings.map(w => ({ month: entry.month, warning: w })));
        allErrors.push(...validation.errors.map(e => ({ month: entry.month, error: e })));
    });
    
    return {
        warnings: allWarnings,
        errors: allErrors,
        isValid: allErrors.length === 0,
        warningCount: allWarnings.length,
        errorCount: allErrors.length
    };
};

/**
 * Calculate data quality metrics
 * @param {Array} data - Array of data entries
 * @returns {object} - Data quality metrics
 */
export const calculateDataQualityMetrics = (data) => {
    if (!data || data.length === 0) {
        return { completeness: 0, consistency: 0, quality: 'poor' };
    }
    
    let completeFields = 0;
    let totalFields = 0;
    let consistentEntries = 0;
    
    data.forEach(entry => {
        const requiredFields = ['month', 'metersReceived', 'metersInstalled', 'satCleared'];
        requiredFields.forEach(field => {
            totalFields++;
            if (entry[field] !== undefined && entry[field] !== null) {
                completeFields++;
            }
        });
        
        // Check consistency: stock should be reasonable
        if (entry.stockInHand >= -1000) { // Allow small negative due to timing
            consistentEntries++;
        }
    });
    
    const completeness = (completeFields / totalFields) * 100;
    const consistency = (consistentEntries / data.length) * 100;
    const quality = completeness >= 95 && consistency >= 90 ? 'good' : 
                   completeness >= 80 && consistency >= 70 ? 'fair' : 'poor';
    
    return { completeness, consistency, quality };
};

