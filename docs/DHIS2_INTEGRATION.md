# DHIS2 Interoperability Guide

## Integration Scope
Tawi Life formats multi-specialty clinical screening and community health worker triage assessments (EPDS, PHQ-9, WHO ANC, ESI, CTAS, MTS, SATS, PaedCTAS) for DHIS2 Tracker and Aggregate APIs.

### Target Endpoints
- **Tracker & Event Capture**: `/api/events`
- **Aggregate Reporting**: `/api/dataValueSets`

### Harmonized Data Elements
- `DE_[PROTOCOL]_TOTAL_SCORE`: Total screening score for the active protocol
- `DE_[PROTOCOL]_RISK_TIER`: Risk classification (LOW, ELEVATED, CRISIS)
- `DE_CRISIS_ESCALATION`: Tier 3 safety escalation flag (`true`/`false`)
- `DE_AGG_[PROTOCOL]_SCREENINGS`: Monthly aggregate screening count
