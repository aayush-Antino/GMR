
/**
 * Transform Asset Tracking API response → SmartChart data shape
 *
 * Handles two response shapes:
 *  1. summary = "87.20%"  → percentage KPIs (mapping accuracy, etc.)
 *  2. summary = { total_consumer_count, total_dt_count, total_feeder_count } → count KPIs
 */
export function transformAssetAPIResponse(kpiName, apiResponse, params = {}) {
    if (!apiResponse) return { trend: [], distribution: [], summary: null };

    const selectedProject = (params.project && params.project !== 'All')
        ? params.project
        : 'All_Projects';

    // level_by is lowercase from UI ('discom', 'zone', etc.)
    const levelParam = (params.level_by || 'discom').toLowerCase();

    // Navigate project data
    const projectsRoot = apiResponse.projects || apiResponse;
    const projectData = projectsRoot[selectedProject]
        || projectsRoot['All_Projects']
        || Object.values(projectsRoot)[0]
        || {};

    // Case-insensitive lookup in filters
    const filtersObj = projectData.filters || {};
    const matchedFilterKey = Object.keys(filtersObj).find(
        k => k.toLowerCase() === levelParam
    );
    const levelData = matchedFilterKey ? filtersObj[matchedFilterKey] : {};

    const summaryRaw = projectData.summary;

    // ── Shape 1: summary is an object with asset counts ──────────────────────
    if (summaryRaw && typeof summaryRaw === 'object') {
        // Build a clean label→value mapping
        const labelMap = {
            total_consumer_count: 'Consumers',
            total_dt_count: 'DTRs',
            total_feeder_count: 'Feeders',
        };

        // Left chart (trend slot): donut/bar of the summary counts
        const trend = Object.entries(summaryRaw).map(([key, val]) => ({
            name: labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            value: Number(val) || 0,
        }));

        // Right chart (distribution): breakdown by the selected level
        const distribution = Object.entries(levelData).map(([name, val]) => {
            let value = 0;
            if (typeof val === 'object' && val !== null) {
                // Sum all numeric values in the nested object
                value = Object.values(val).reduce((a, v) => a + (Number(v) || 0), 0);
            } else {
                value = Number(val) || 0;
            }
            return { name, value };
        }).sort((a, b) => b.value - a.value);

        const summary = {
            value: `${(summaryRaw.total_consumer_count || 0).toLocaleString()} Consumers`,
            summary_obj: summaryRaw,
            level: matchedFilterKey || levelParam.toUpperCase(),
            project: selectedProject.replace('Project_', ''),
            total_entries: distribution.length,
        };

        return { trend, distribution, summary };
    }

    // ── Shape 2: summary is a percentage string "87.20%" ─────────────────────
    let summaryValue = 0;
    if (typeof summaryRaw === 'string' && summaryRaw.endsWith('%')) {
        summaryValue = parseFloat(summaryRaw.replace('%', ''));
    }

    const distribution = Object.entries(levelData).map(([name, val]) => {
        let value = 0;
        if (typeof val === 'string' && val.endsWith('%')) {
            value = parseFloat(val.replace('%', ''));
        } else if (typeof val === 'object' && val !== null) {
            value = Object.values(val).reduce((a, v) => a + (Number(v) || 0), 0);
        } else {
            value = Number(val) || 0;
        }
        return { name, value };
    }).sort((a, b) => b.value - a.value);

    // Left chart: top entries by the selected level
    const trend = distribution.slice(0, 20);

    const summary = {
        value: summaryRaw || '-',
        summary_pct: summaryValue,
        level: matchedFilterKey || levelParam.toUpperCase(),
        project: selectedProject.replace('Project_', ''),
        total_entries: distribution.length,
    };

    return { trend, distribution, summary };
}
