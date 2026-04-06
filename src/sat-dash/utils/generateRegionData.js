export const generateRegionData = (name, theme, rawData, milestones) => {
  let cumRec = 0;
  let cumInst = 0;
  let cumSat = 0;

  // ✅ ADD cumulative SAT counters
  let cumS1 = 0;
  let cumS2 = 0;
  let cumS3 = 0;
  let cumS4 = 0;
  let cumS5 = 0;
  let cumS6 = 0;
  let cumS7 = 0;
  let cumS8 = 0;

  const data = rawData.map((row, index) => {
    const { received, installed, sat } = row;

    cumRec += received;
    cumInst += installed;
    // cumSat += sat.s7;

    cumS1 += sat.s1;
    cumS2 += sat.s2;
    cumS3 += sat.s3;
    cumS4 += sat.s4;
    cumS5 += sat.s5;
    cumS6 += sat.s6;
    cumS7 += sat.s7;
    cumS8 += sat.s8;

    // Correctly calculate Cumulative SAT as sum of all stages
    cumSat = cumS1 + cumS2 + cumS3 + cumS4 + cumS5 + cumS6 + cumS7 + cumS8;

    const milestone = milestones?.[index] || {};

    return {
      month: row.month,
      received,
      installed,
      satCleared: sat.s8,
      cumReceived: cumRec,
      cumInstalled: cumInst,
      cumSatCleared: cumSat,
      stockInHand: cumRec - cumInst,
      netChange: received - installed,
      satBreakdown: sat,
      cumSatBreakdown: {
        s1: cumS1,
        s2: cumS2,
        s3: cumS3,
        s4: cumS4,
        s5: cumS5,
        s6: cumS6,
        s7: cumS7,
        s8: cumS8,
      },
      // month-level milestones (fine)
      satStartDate: milestone.start || null,
      lumpsumInvoiceDate: milestone.lumpsumInv || null,
      pmpInvoiceDate: milestone.pmpInv || null,
      lumpsumCollectionDate: milestone.lumpsumCol || null,
      scCollectionDate: milestone.scCol || null,
    };
  });

  return {
    name,
    theme,
    data,
    satMilestones: milestones || {},
    financials: {
      lumpsum: 0,
      pmp: 0,
      totalRevenue: 0,
      collected: 0,
      collectionRate: 0,
    },

  };
};