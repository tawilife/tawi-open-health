/**
 * FHIR Mapper Utility (`lib/fhir-mapper.ts`)
 * Converts multi-specialty triage assessment results (including protocol-specific dimensions)
 * into fully compliant HL7 FHIR R4 Observation and QuestionnaireResponse resources for EHR integration.
 */

import { getProtocol, ClinicalProtocolPack } from '@/lib/clinical-protocols';

export interface TriageAssessmentInput {
  totalScore: number;
  tier: 'LOW' | 'ELEVATED' | 'CRISIS';
  items: Record<string, number> | number[];
  protocolId?: string;
  clientReference?: string;
  facilityCode?: string;
  facilityName?: string;
  timestamp?: string;
  notes?: string;
  narrativeSummary?: string;
}

export interface FHIRObservationResource {
  resourceType: 'Observation';
  id: string;
  status: string;
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
    display: string;
  };
  effectiveDateTime: string;
  performer: Array<{
    identifier: {
      system: string;
      value: string;
    };
    display: string;
  }>;
  valueQuantity: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  interpretation: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  }>;
  note: Array<{
    text: string;
  }>;
  component: Array<{
    code: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
      text: string;
    };
    valueInteger: number;
  }>;
}

/**
 * Converts triage assessment results into a compliant HL7 FHIR R4 Observation resource.
 */
export function convertToFhirObservation(input: TriageAssessmentInput): FHIRObservationResource {
  const protocol: ClinicalProtocolPack = getProtocol(input.protocolId);
  const timestamp = input.timestamp || new Date().toISOString();
  const patientId = input.clientReference || `urn:uuid:tawi-anonymous-${Date.now().toString(36)}`;
  const facilityCode = input.facilityCode || 'KE-MOH-FACILITY';
  const facilityName = input.facilityName || 'Tawi Life Clinical Hub';

  // Normalize items/answers
  const answersMap: Record<string, number> = {};
  if (Array.isArray(input.items)) {
    input.items.forEach((val, idx) => {
      const dim = protocol.scoringDimensions[idx];
      if (dim) {
        answersMap[dim.key] = val;
      }
    });
  } else if (input.items) {
    Object.entries(input.items).forEach(([k, v]) => {
      answersMap[k] = Number(v);
    });
  }

  // FHIR Interpretation Coding
  const fhirInterpretation = input.tier === 'CRISIS'
    ? { code: 'H', display: 'High / Critical Risk (Tier 3)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : input.tier === 'ELEVATED'
    ? { code: 'A', display: 'Abnormal / Elevated Strain (Tier 2)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : { code: 'N', display: 'Normal / Low Risk (Tier 1)', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' };

  // Protocol-specific dimensions as component observations
  const components = protocol.scoringDimensions.map(dim => {
    const score = answersMap[dim.key] !== undefined ? answersMap[dim.key] : 0;
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

  return {
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
      text: `${protocol.name} Triage Assessment Score`,
    },
    subject: {
      reference: patientId,
      display: input.clientReference ? `Patient ID: ${input.clientReference}` : 'Anonymous Patient (Zero-Trace)',
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
      value: input.totalScore,
      unit: '{score}',
      system: 'http://unitsofmeasure.org',
      code: '{score}',
    },
    interpretation: [
      {
        coding: [fhirInterpretation],
        text: `Clinical Triage Tier: ${input.tier} (Protocol: ${protocol.name})`,
      },
    ],
    note: [
      {
        text: `Protocol: ${protocol.name} (${protocol.specialty}). Summary: ${input.narrativeSummary || ''}. ${input.notes || ''}`.trim(),
      },
    ],
    component: components,
  };
}
