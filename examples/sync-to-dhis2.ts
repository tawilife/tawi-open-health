import { buildDHIS2EventPayload, buildDHIS2AggregatePayload } from '../packages/interop/src/dhis2';

const sampleData = {
  totalScore: 14,
  tier: 'CRISIS' as const,
  answers: [2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
  facilityCode: 'FACILITY_NAIROBI_05',
  language: 'sheng'
};

const dhis2Event = buildDHIS2EventPayload(sampleData, {
  programId: 'PROG_MATERNAL_MH_2026',
  orgUnitId: 'KE_DISP_NAIROBI_05'
});

console.log('Generated DHIS2 Event Payload:');
console.log(JSON.stringify(dhis2Event, null, 2));
