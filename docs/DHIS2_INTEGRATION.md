# DHIS2 Interoperability Guide

## Integration Scope
Tawi Life formats maternal health screening and community health worker assessments for DHIS2 Tracker and Aggregate APIs.

### Target Endpoints
- **Tracker & Event Capture**: `/api/events`
- **Aggregate Reporting**: `/api/dataValueSets`

### Standard WHO RMNCAH Harmonization
- `DE_EPDS_TOT_01`: Total screening score
- `DE_EPDS_TIER_02`: Risk classification (Low, Elevated, Crisis)
- `DE_EPDS_ITM10_03`: Safety / self-harm escalation flag
- `DE_REF_1199_05`: Crisis referral status
