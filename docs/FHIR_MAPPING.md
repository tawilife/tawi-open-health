# HL7 FHIR Release 4 Mapping Guide

## Clinical Scope
Tawi Life maps multi-specialty clinical screening and triage data (EPDS, PHQ-9, WHO ANC, ESI, CTAS, MTS, SATS, PaedCTAS) directly to HL7 FHIR Release 4 (R4) standards for seamless Electronic Health Record (EHR) integration.

### Standards & Terminologies
- **LOINC Terminology**: Standardized question and score codes for mental health, obstetric triage, pediatric IMCI, and acute emergency care.
- **SNOMED CT**: Clinical diagnosis and risk score encodings (e.g., Edinburgh postnatal depression scale score `248062006`).
- **ObservationInterpretation**: High / Critical Risk (`H`), Abnormal / Elevated Strain (`A`), Normal / Low Risk (`N`).

### Generated FHIR Resources & Utilities
1. **`Observation` (`convertToFhirObservation`)**: Master score observation containing category (`survey`), subject reference, performer facility, total score quantity, interpretation, and itemized component sub-observations.
2. **`QuestionnaireResponse`**: Structured survey responses mapped to protocol-specific linkIds and integer answers.
3. **`Bundle` (`buildFHIRBundle`)**: Collection bundle encapsulating Observation and QuestionnaireResponse resources.
