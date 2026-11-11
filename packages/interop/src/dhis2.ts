/**
 * DHIS2 Interoperability Module for Tawi Life
 * Standards:
 * - DHIS2 Aggregate Web API (/api/dataValueSets)
 * - DHIS2 Tracker & Event Capture API (/api/events)
 * - Harmonized with WHO RMNCAH (Reproductive, Maternal, Newborn, Child & Adolescent Health) Data Dictionary
 */

import { EPDSScreeningData } from './fhir';

export interface DHIS2ExportOptions {
  orgUnitId?: string; // Facility ID in DHIS2 (e.g. 'KE_DISP_001' or 11-char UID)
  programId?: string; // DHIS2 Program UID for RMNCAH Maternal Mental Health
  programStageId?: string;
  period?: string; // e.g. '202611' for monthly aggregate or '2026W45'
}

// Standard WHO / MoH DHIS2 Data Element Code Mapping
export const DHIS2_DATA_ELEMENTS = {
  EPDS_TOTAL_SCORE: 'DE_EPDS_TOT_01',
  EPDS_RISK_TIER: 'DE_EPDS_TIER_02',
  ITEM_10_SELF_HARM: 'DE_EPDS_ITM10_03',
  SCREENING_COMPLETED: 'DE_MAT_SCR_COMP_04',
  REFERRAL_CRISIS_LINE: 'DE_REF_1199_05',
};

/**
 * Builds standard DHIS2 Tracker / Event payload (/api/events)
 * for clinical tracking of a maternal screening event
 */
export function buildDHIS2EventPayload(data: EPDSScreeningData, options: DHIS2ExportOptions = {}) {
  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
  const eventDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
  const orgUnit = options.orgUnitId || data.facilityCode || 'Dispensary_MOH_KE';
  const program = options.programId || 'PROG_RMNCAH_MATERNAL_MH';
  const programStage = options.programStageId || 'STAGE_POSTNATAL_VISIT';

  const answersMap: Record<number, number> = {};
  if (Array.isArray(data.answers)) {
    data.answers.forEach((val, idx) => {
      answersMap[idx + 1] = val;
    });
  } else if (data.answers) {
    Object.entries(data.answers).forEach(([k, v]) => {
      answersMap[Number(k)] = Number(v);
    });
  }

  const isSelfHarmTriggered = (answersMap[10] || 0) > 0;

  const dataValues = [
    {
      dataElement: DHIS2_DATA_ELEMENTS.EPDS_TOTAL_SCORE,
      value: String(data.totalScore),
    },
    {
      dataElement: DHIS2_DATA_ELEMENTS.EPDS_RISK_TIER,
      value: data.tier,
    },
    {
      dataElement: DHIS2_DATA_ELEMENTS.ITEM_10_SELF_HARM,
      value: isSelfHarmTriggered ? 'true' : 'false',
    },
    {
      dataElement: DHIS2_DATA_ELEMENTS.SCREENING_COMPLETED,
      value: 'true',
    },
    {
      dataElement: DHIS2_DATA_ELEMENTS.REFERRAL_CRISIS_LINE,
      value: data.tier === 'CRISIS' ? 'true' : 'false',
    },
  ];

  // Append individual item scores
  for (let i = 1; i <= 10; i++) {
    if (answersMap[i] !== undefined) {
      dataValues.push({
        dataElement: `DE_EPDS_ITEM_${String(i).padStart(2, '0')}`,
        value: String(answersMap[i]),
      });
    }
  }

  return {
    events: [
      {
        program,
        programStage,
        orgUnit,
        eventDate,
        status: 'COMPLETED',
        storedBy: 'tawi-life-companion',
        coordinate: undefined,
        dataValues,
        notes: [
          {
            value: `Tawi Life Screening Export. Subject: ${data.clientReference || 'Anonymous (Zero-Trace)'}. Language: ${data.language || 'en'}.`,
          },
        ],
      },
    ],
  };
}

/**
 * Builds standard DHIS2 Aggregate DataValueSets payload (/api/dataValueSets)
 * for MoH monthly health facility reporting
 */
export function buildDHIS2AggregatePayload(data: EPDSScreeningData, options: DHIS2ExportOptions = {}) {
  const dateObj = data.timestamp ? new Date(data.timestamp) : new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const period = options.period || `${year}${month}`; // e.g. '202611'
  const orgUnit = options.orgUnitId || data.facilityCode || 'Dispensary_MOH_KE';

  return {
    dataValues: [
      {
        dataElement: 'DE_AGG_TOTAL_MOTHERS_SCREENED',
        period,
        orgUnit,
        value: '1',
      },
      {
        dataElement: data.tier === 'CRISIS' ? 'DE_AGG_EPDS_CRISIS_COUNT' : data.tier === 'ELEVATED' ? 'DE_AGG_EPDS_ELEVATED_COUNT' : 'DE_AGG_EPDS_LOW_COUNT',
        period,
        orgUnit,
        value: '1',
      },
      {
        dataElement: 'DE_AGG_EPDS_MEAN_SCORE',
        period,
        orgUnit,
        value: String(data.totalScore),
      },
    ],
  };
}
