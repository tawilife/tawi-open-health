/**
 * HL7 FHIR R4 Interoperability Module for Tawi Life (Multi-Specialty Support)
 * Standards:
 * - HL7 FHIR Release 4 (R4) Specification
 * - LOINC & SNOMED CT Clinical Terminologies for EPDS, PHQ-9, WHO ANC, IMCI, NCD, AUDIT, and Post-Surgical triage.
 */

import { getProtocol, ClinicalProtocolPack } from '@/lib/clinical-protocols';

export interface EPDSScreeningData {
  totalScore: number;
  tier: 'LOW' | 'ELEVATED' | 'CRISIS';
  answers: { [itemKey: string]: number } | number[];
  clientReference?: string;
  facilityCode?: string;
  facilityName?: string;
  timestamp?: string;
  language?: string;
  notes?: string;
  protocolId?: string;
}

export function buildFHIRBundle(data: EPDSScreeningData) {
  const protocol: ClinicalProtocolPack = getProtocol(data.protocolId);
  const timestamp = data.timestamp || new Date().toISOString();
  const bundleId = `tawi-${protocol.id}-bundle-${Date.now()}`;
  const patientId = data.clientReference || `urn:uuid:tawi-anonymous-${Date.now().toString(36)}`;
  const facilityCode = data.facilityCode || 'KE-MOH-RMNCAH';
  const facilityName = data.facilityName || 'Tawi Life Clinical Community Hub';

  // Answers normalize against protocol dimensions
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

  // FHIR Risk Interpretation Code
  const fhirInterpretation = data.tier === 'CRISIS'
    ? { code: 'H', display: 'High / Critical Risk (Tier 3)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : data.tier === 'ELEVATED'
    ? { code: 'A', display: 'Abnormal / Elevated Strain (Tier 2)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : { code: 'N', display: 'Normal / Low Risk (Tier 1)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' };

  // Component observations for each protocol scoring dimension
  const components = protocol.scoringDimensions.map(dim => {
    const score = answersMap[dim.key] || 0;
    return {
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: dim.loincCode,
            display: dim.label,
          },
        ],
        text: dim.description,
      },
      valueInteger: score,
    };
  });

  // Master Observation Resource
  const observationResource = {
    resourceType: 'Observation',
    id: `tawi-${protocol.id}-obs-${Date.now()}`,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'survey',
            display: 'Survey',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: 'https://tawilife.org/protocols',
          code: protocol.id,
          display: protocol.name,
        },
      ],
      text: `${protocol.name} Total Score Assessment`,
    },
    subject: {
      reference: patientId,
      display: data.clientReference ? `Patient ID: ${data.clientReference}` : 'Anonymous Patient (Zero-Trace)',
    },
    effectiveDateTime: timestamp,
    performer: [
      {
        identifier: {
          system: 'https://tawilife.org/facilities',
          value: facilityCode,
        },
        display: facilityName,
      },
    ],
    valueQuantity: {
      value: data.totalScore,
      unit: '{score}',
      system: 'http://unitsofmeasure.org',
      code: '{score}',
    },
    interpretation: [
      {
        coding: [fhirInterpretation],
        text: `Clinical Triage Tier: ${data.tier} (Protocol: ${protocol.name})`,
      },
    ],
    note: [
      {
        text: `Screened via Tawi Life multi-specialty clinical protocol (${protocol.name}). ${data.notes || ''}`.trim(),
      },
    ],
    component: components,
  };

  // QuestionnaireResponse Resource
  const questionnaireResponseResource = {
    resourceType: 'QuestionnaireResponse',
    id: `tawi-${protocol.id}-qr-${Date.now()}`,
    status: 'completed',
    questionnaire: `https://tawilife.org/questionnaires/${protocol.id}`,
    subject: {
      reference: patientId,
    },
    authored: timestamp,
    item: protocol.scoringDimensions.map(dim => ({
      linkId: dim.key,
      text: dim.description,
      answer: [
        {
          valueInteger: answersMap[dim.key] || 0,
        },
      ],
    })),
  };

  return {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp,
    entry: [
      { resource: observationResource },
      { resource: questionnaireResponseResource },
    ],
  };
}
