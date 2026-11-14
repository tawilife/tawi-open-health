/**
 * DHIS2 Interoperability Module for Tawi Life (Multi-Specialty Support)
 * Standards:
 * - DHIS2 Aggregate Web API (/api/dataValueSets)
 * - DHIS2 Tracker & Event Capture API (/api/events)
 * - Harmonized with WHO RMNCAH & Primary Care Data Dictionaries across all active clinical protocols.
 */

import { EPDSScreeningData } from './fhir';
import { getProtocol, ClinicalProtocolPack } from '@/lib/clinical-protocols';

export interface DHIS2ExportOptions {
  orgUnitId?: string; // Facility ID in DHIS2 (e.g. 'KE_DISP_001')
  programId?: string; // DHIS2 Program UID
  programStageId?: string;
  period?: string; // e.g. '202611' for monthly aggregate
}

export const DHIS2_DATA_ELEMENTS = {
  TOTAL_SCORE: 'DE_TOTAL_SCORE_01',
  RISK_TIER: 'DE_RISK_TIER_02',
  SCREENING_COMPLETED: 'DE_SCR_COMP_03',
  CRISIS_ESCALATION: 'DE_CRISIS_ESCALATION_04',
};

export function buildDHIS2EventPayload(data: EPDSScreeningData, options: DHIS2ExportOptions = {}) {
  const protocol: ClinicalProtocolPack = getProtocol(data.protocolId);
  const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
  const eventDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
  const orgUnit = options.orgUnitId || data.facilityCode || 'Facility_MOH_01';
  const program = options.programId || `PROG_${protocol.id.toUpperCase()}`;
  const programStage = options.programStageId || 'STAGE_CLINICAL_TRIAGE';

  const answersMap: Record<string, number> = {};
  if (Array.isArray(data.answers)) {
    data.answers.forEach((val, idx) => {
      const dim = protocol.scoringDimensions[idx];
      if (dim) {
        answersMap[dim.key] = val;
      }
    });
  } else if (data.answers) {
    Object.entries(data.answers).forEach(([k, v]) => {
      answersMap[k] = Number(v);
    });
  }

  const dataValues = [
    {
      dataElement: `DE_${protocol.id.toUpperCase()}_TOTAL_SCORE`,
      value: String(data.totalScore),
    },
    {
      dataElement: `DE_${protocol.id.toUpperCase()}_RISK_TIER`,
      value: data.tier,
    },
    {
      dataElement: `DE_${protocol.id.toUpperCase()}_COMPLETED`,
      value: 'true',
    },
    {
      dataElement: `DE_CRISIS_ESCALATION`,
      value: data.tier === 'CRISIS' ? 'true' : 'false',
    },
  ];

  // Append individual dimension scores
  protocol.scoringDimensions.forEach((dim, idx) => {
    const score = answersMap[dim.key] !== undefined ? answersMap[dim.key] : 0;
    dataValues.push({
      dataElement: `DE_${protocol.id.toUpperCase()}_DIM_${String(idx + 1).padStart(2, '0')}`,
      value: String(score),
    });
  });

  return {
    events: [
      {
        program,
        programStage,
        orgUnit,
        eventDate,
        status: 'COMPLETED',
        storedBy: 'tawi-life-clinical-engine',
        dataValues,
        notes: [
          {
            value: `Tawi Life Clinical Export (${protocol.name}). Subject: ${data.clientReference || 'Anonymous'}. Language: ${data.language || 'en'}.`,
          },
        ],
      },
    ],
  };
}

export function buildDHIS2AggregatePayload(data: EPDSScreeningData, options: DHIS2ExportOptions = {}) {
  const protocol: ClinicalProtocolPack = getProtocol(data.protocolId);
  const dateObj = data.timestamp ? new Date(data.timestamp) : new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const period = options.period || `${year}${month}`;
  const orgUnit = options.orgUnitId || data.facilityCode || 'Facility_MOH_01';

  return {
    dataValues: [
      {
        dataElement: `DE_AGG_${protocol.id.toUpperCase()}_SCREENINGS`,
        period,
        orgUnit,
        value: '1',
      },
      {
        dataElement: `DE_AGG_${protocol.id.toUpperCase()}_${data.tier}_COUNT`,
        period,
        orgUnit,
        value: '1',
      },
      {
        dataElement: `DE_AGG_${protocol.id.toUpperCase()}_MEAN_SCORE`,
        period,
        orgUnit,
        value: String(data.totalScore),
      },
    ],
  };
}
