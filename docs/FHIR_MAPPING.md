# HL7 FHIR Release 4 Mapping Guide

## Clinical Scope
Tawi Life maps perinatal and maternal mental health screening data directly to HL7 FHIR Release 4 standards.

### Standards & Terminologies
- **LOINC 71354-5**: Edinburgh Postnatal Depression Scale [EPDS]
- **LOINC 71355-2 to 71364-4**: EPDS Items 1 through 10
- **SNOMED CT 248062006**: Edinburgh postnatal depression scale score
- **SNOMED CT 386661006**: Postpartum depression
- **ObservationInterpretation**: High (H), Abnormal (A), Normal (N)

### Generated FHIR Resources
A complete bundle contains:
1. `Observation`: Total score, LOINC code, facility identifier, and itemized component observations.
2. `QuestionnaireResponse`: Individual answers linked to standard item IDs.
3. `RiskAssessment`: Stratified risk evaluation (Low, Elevated, Crisis) with referral recommendations.
