/**
 * HL7 FHIR R4 Interoperability Module for Tawi Life
 * Standards:
 * - HL7 FHIR Release 4 (R4) Specification
 * - LOINC 71354-5: Edinburgh Postnatal Depression Scale [EPDS]
 * - LOINC 71355-2 through 71364-4: EPDS Items 1-10
 * - SNOMED CT 248062006: Edinburgh postnatal depression scale score
 * - SNOMED CT 445414007: Screening for depression
 */

export interface EPDSScreeningData {
  totalScore: number;
  tier: 'LOW' | 'ELEVATED' | 'CRISIS';
  answers: { [itemNumber: number]: number } | number[];
  clientReference?: string;
  facilityCode?: string;
  facilityName?: string;
  timestamp?: string;
  language?: string;
  notes?: string;
}

export const EPDS_LOINC_ITEMS: Record<number, { loinc: string; text: string }> = {
  1: { loinc: '71355-2', text: 'Able to laugh and see funny side of things' },
  2: { loinc: '71356-0', text: 'Looked forward with enjoyment to things' },
  3: { loinc: '71357-8', text: 'Blamed myself unnecessarily when things went wrong' },
  4: { loinc: '71358-6', text: 'Been anxious or worried for no good reason' },
  5: { loinc: '71359-4', text: 'Felt scared or panicky for no good reason' },
  6: { loinc: '71360-2', text: 'Things have been getting on top of me' },
  7: { loinc: '71361-0', text: 'Been so unhappy that I have had difficulty sleeping' },
  8: { loinc: '71362-8', text: 'Felt sad or miserable' },
  9: { loinc: '71363-6', text: 'Been so unhappy that I have been crying' },
  10: { loinc: '71364-4', text: 'Thought of harming myself has occurred to me (Self-harm risk)' },
};

export function buildFHIRBundle(data: EPDSScreeningData) {
  const timestamp = data.timestamp || new Date().toISOString();
  const bundleId = `tawi-epds-bundle-${Date.now()}`;
  const patientId = data.clientReference || `urn:uuid:tawi-anonymous-${Date.now().toString(36)}`;
  const facilityCode = data.facilityCode || 'KE-MOH-RMNCAH';
  const facilityName = data.facilityName || 'Tawi Life Maternal Community Hub';

  // Answers normalize
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

  // FHIR Risk Code
  const fhirInterpretation = data.tier === 'CRISIS'
    ? { code: 'H', display: 'High / Critical Risk', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : data.tier === 'ELEVATED'
    ? { code: 'A', display: 'Abnormal / Elevated Strain', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' }
    : { code: 'N', display: 'Normal / Low Risk', system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation' };

  // Component observations for each EPDS question item
  const components = Object.entries(answersMap).map(([itemNum, score]) => {
    const num = Number(itemNum);
    const meta = EPDS_LOINC_ITEMS[num] || { loinc: `EPDS-ITEM-${num}`, text: `EPDS Item ${num}` };
    return {
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: meta.loinc,
            display: meta.text,
          },
        ],
        text: meta.text,
      },
      valueInteger: score,
    };
  });

  // Master EPDS Total Score Observation
  const observationResource = {
    resourceType: 'Observation',
    id: `tawi-epds-obs-${Date.now()}`,
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
          system: 'http://loinc.org',
          code: '71354-5',
          display: 'Edinburgh Postnatal Depression Scale [EPDS]',
        },
        {
          system: 'http://snomed.info/sct',
          code: '248062006',
          display: 'Edinburgh postnatal depression scale score',
        },
      ],
      text: 'Edinburgh Postnatal Depression Scale Total Score',
    },
    subject: {
      reference: patientId,
      display: data.clientReference ? `Patient ID: ${data.clientReference}` : 'Anonymous Mother (Zero-Trace)',
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
        text: `Maternal Triage Tier: ${data.tier}`,
      },
    ],
    note: [
      {
        text: `Screened via Tawi Life voice/touch maternal interface. Item 10 self-harm triggered: ${isSelfHarmTriggered ? 'YES (Critical Safety Referral)' : 'NO'}. ${data.notes || ''}`.trim(),
      },
    ],
    component: components,
  };

  // QuestionnaireResponse Resource
  const questionnaireResponseResource = {
    resourceType: 'QuestionnaireResponse',
    id: `tawi-epds-qr-${Date.now()}`,
    status: 'completed',
    questionnaire: 'http://loinc.org/q/71354-5',
    subject: {
      reference: patientId,
    },
    authored: timestamp,
    item: Object.entries(answersMap).map(([itemNum, score]) => {
      const num = Number(itemNum);
      const meta = EPDS_LOINC_ITEMS[num] || { loinc: `EPDS-${num}`, text: `Item ${num}` };
      return {
        linkId: `item-${num}`,
        text: meta.text,
        answer: [
          {
            valueInteger: score,
          },
        ],
      };
    }),
  };

  // RiskAssessment Resource
  const riskAssessmentResource = {
    resourceType: 'RiskAssessment',
    id: `tawi-epds-risk-${Date.now()}`,
    status: 'final',
    subject: {
      reference: patientId,
    },
    occurrenceDateTime: timestamp,
    basis: [
      {
        reference: `Observation/${observationResource.id}`,
      },
    ],
    prediction: [
      {
        outcome: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386661006',
              display: 'Postpartum depression',
            },
          ],
          text: 'Perinatal / Postnatal Mental Health Strain',
        },
        qualitativeRisk: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/risk-probability',
              code: data.tier === 'CRISIS' ? 'high' : data.tier === 'ELEVATED' ? 'moderate' : 'low',
              display: data.tier,
            },
          ],
        },
        rationale: `EPDS score of ${data.totalScore}/30 with self-harm item 10 flag: ${isSelfHarmTriggered ? 'TRIGGERED' : 'CLEAR'}.`,
      },
    ],
    mitigation: isSelfHarmTriggered 
      ? 'Immediate 1199 emergency helpline or acute clinical midwife escalation required.' 
      : data.tier === 'ELEVATED'
      ? 'Schedule Community Health Worker (CHW) home follow-up within 72 hours; connect with maternal support circle.'
      : 'Routine postpartum care and community affirmation.',
  };

  // Assembled FHIR R4 Bundle
  const bundle = {
    resourceType: 'Bundle',
    id: bundleId,
    type: 'collection',
    timestamp: timestamp,
    meta: {
      profile: [
        'http://hl7.org/fhir/StructureDefinition/Bundle',
      ],
      tag: [
        {
          system: 'https://tawilife.org/interop',
          code: 'maternal-mental-health-triage',
          display: 'Tawi Life Clinical Screening Export',
        },
      ],
    },
    entry: [
      {
        fullUrl: `urn:uuid:${observationResource.id}`,
        resource: observationResource,
      },
      {
        fullUrl: `urn:uuid:${questionnaireResponseResource.id}`,
        resource: questionnaireResponseResource,
      },
      {
        fullUrl: `urn:uuid:${riskAssessmentResource.id}`,
        resource: riskAssessmentResource,
      },
    ],
  };

  return bundle;
}
