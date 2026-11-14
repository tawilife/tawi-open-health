# Tawi Open Health

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Standard: HL7 FHIR R4](https://img.shields.io/badge/Standard-HL7%20FHIR%20R4-blue.svg)](https://hl7.org/fhir/R4/)
[![System: DHIS2 Tracker](https://img.shields.io/badge/System-DHIS2%20Tracker-orange.svg)](https://dhis2.org/)
[![DPG Standard](https://img.shields.io/badge/DPG-Alliance%20Aligned-teal.svg)](https://digitalpublicgoods.net/)

Open-source digital public goods for maternal mental health, clinical interoperability, and localized triage across Africa.

Developed as part of **Tawi Life**, an initiative dedicated to culturally attuned maternal mental health screening and clinical decision support.

---
## Multi-Specialty Clinical Protocol Packs

Tawi Life provides 12 swappable clinical protocol packs (`@tawilife/protocols`) designed for multi-specialty triage in primary care, maternal health, emergency departments, and community health settings:

### Supported Clinical Protocol Packs
1. **`epds`**: Maternal Mental Health (Edinburgh Postnatal Depression Scale - 10 items, LOINC `71354-5`).
2. **`phq9`**: General Outpatient Mental Health (PHQ-9 & GAD-7 depression/anxiety screening).
3. **`who_anc`**: Antenatal Danger Signs & Obstetric Triage (Preeclampsia headache/vision changes, bleeding, reduced fetal movement).
4. **`imci_pediatric`**: Pediatric IMCI Pre-Triage (Convulsions, inability to drink/breastfeed, chest indrawing, lethargy).
5. **`ncd_chronic`**: Chronic Disease Check-Ins (Hypertension, Diabetes, Stroke FAST symptoms, hypoglycemia).
6. **`audit_youth`**: Substance Use & Youth Screening (AUDIT-C, acute withdrawal, overdose risk).
7. **`postsurg_wound`**: Post-Surgical & Wound Discharge Stratification (Fever, foul discharge, bleeding, calf pain / DVT risk).
8. **`esi`**: Emergency Severity Index (5-level acuity + resource prediction).
9. **`ctas`**: Canadian Triage and Acuity Scale (5-level severity + clinical modifiers).
10. **`mts`**: Manchester Triage System (5 color-coded flowcharts).
11. **`sats`**: South African Triage Scale (4-level physiological measures + TEWS optimized for LMICs).
12. **`paedctas`**: Pediatric Triage Systems (Pediatric acuity & admission prediction).

## DHIS2 Interoperability

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

## HL7 FHIR Release 4 Mapping

## Clinical Scope
Tawi Life maps multi-specialty clinical screening and triage data (EPDS, PHQ-9, WHO ANC, ESI, CTAS, MTS, SATS, PaedCTAS) directly to HL7 FHIR Release 4 (R4) standards for seamless Electronic Health Record (EHR) integration.

### Standards & Terminologies
- **LOINC Terminology**: Standardized question and score codes for mental health, obstetric triage, pediatric IMCI, and acute emergency care.
- **SNOMED CT**: Clinical diagnosis and risk score encodings (e.g., Edinburgh postnatal depression scale score `248062006`).
- **ObservationInterpretation**: High / Critical Risk (`H`), Abnormal / Elevated Strain (`A`), Normal / Low Risk (`N`).

----

## Localization & Dialect Contribution Guide

Tawi Life prioritizes local dialects and community language patterns across Africa.

## Supported Dialects
1. **Kiswahili (sw)**: Standard East African healthcare terminology.
2. **Sheng (sheng)**: Urban Kenyan vernacular for young mothers and community peers.
3. **English (en)**: Baseline international clinical reference.
4. **French (fr)**: Francophone Central & West African regions.
5. **Portuguese (pt)**: Lusophone African regions (Mozambique, Angola).

## Adding a New Language
To add a regional language or dialect (e.g. Luganda, Somali, Oromo, Yoruba, Hausa):
1. Create a JSON representation in `packages/lexicons/epds/<lang>.json`.
2. Ensure culturally sensitive translations that avoid stigma around postpartum mood changes.
3. Submit a Pull Request following community guidelines.

----

## What is Included

1. **`@tawilife/interop`**  
   - **HL7 FHIR Release 4**: Full mapper converting maternal assessments into FHIR `Observation`, `QuestionnaireResponse`, and `RiskAssessment` resources with LOINC `71354-5` and SNOMED CT encodings.
   - **DHIS2**: Integration mapper for the DHIS2 Tracker (/api/events) and Aggregate (/api/dataValueSets) data structures aligned with WHO RMNCAH definitions.
2. **Localized Clinical Lexicons**  
   - Culturally adapted screening vocabularies in Swahili, Sheng, English, French, and Portuguese.
3. **Public Health Directories**  
   - Verified national crisis helplines, maternal emergency lines, and triage protocols.

---

## Quickstart

```bash
npm install @tawilife/interop
```

```typescript
import { buildFHIRBundle } from '@tawilife/interop';

const bundle = buildFHIRBundle({
  totalScore: 8,
  tier: 'LOW',
  answers: [0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  facilityCode: 'KE-MOH-01'
});
```

---

## License
- **Code & SDKs**: MIT License
- **Lexicons & Datasets**: Creative Commons Attribution 4.0 International (CC BY 4.0)
