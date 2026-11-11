import { buildFHIRBundle } from '../packages/interop/src/fhir';

const sampleAssessment = {
  totalScore: 11,
  tier: 'ELEVATED' as const,
  answers: [1, 1, 2, 1, 0, 1, 2, 1, 2, 0],
  clientReference: 'ANON-MOM-4821',
  facilityCode: 'KE-DISP-001',
  facilityName: 'Kibera Community Health Centre',
  language: 'sw'
};

const fhirBundle = buildFHIRBundle(sampleAssessment);
console.log('Generated FHIR R4 Bundle:');
console.log(JSON.stringify(fhirBundle, null, 2));
