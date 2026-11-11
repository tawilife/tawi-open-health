# Tawi Open Health

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Standard: HL7 FHIR R4](https://img.shields.io/badge/Standard-HL7%20FHIR%20R4-blue.svg)](https://hl7.org/fhir/R4/)
[![System: DHIS2 Tracker](https://img.shields.io/badge/System-DHIS2%20Tracker-orange.svg)](https://dhis2.org/)
[![DPG Standard](https://img.shields.io/badge/DPG-Alliance%20Aligned-teal.svg)](https://digitalpublicgoods.net/)

The Tawi Life Open Health Engine is an open-source clinical data transformation and public health reporting pipeline.

It serves as the data commons layer connecting Tawi Life’s frontier AI voice triage engine to national health information systems (HMIS), district CEmONC hospitals, and community healthcare workers (CHWs) as an Open-source digital public goods for maternal mental health, clinical interoperability, and localized triage across Africa.

Developed as part of **Tawi Life**, an initiative dedicated to culturally attuned maternal mental health screening and clinical decision support.

---

## What is Included

1. **`@tawilife/interop`**  
   - **HL7 FHIR Release 4**: Full mapper transforming real-time, zero-trace clinical triage outputs and Edinburgh Postnatal Depression Scale (EPDS) risk assessments into  FHIR `Observation`, `QuestionnaireResponse`, and `RiskAssessment` resources with LOINC `71354-5` and SNOMED CT encodings.
   - **DHIS2**: Integration mapper for the DHIS2 Tracker (/api/events) and Aggregate (/api/dataValueSets) data structures aligned with WHO RMNCAH definitions. Converts anonymized maternal screening and triage events into standard DHIS2 JSON payloads (Tracked Entity Instances, Program Stages, and Events) for national health registries without storing personal identifiers (Zero-Data Retention).
2. **Localized Clinical Lexicons**  
   - Culturally adapted screening vocabularies in Swahili, Sheng, English, French, and Portuguese.
3. **Public Health Directories**  
   - Global Maternal Mental Health Helpline Registry (70+ Countries) A structured, machine-readable dataset (helplines.json) mapping 70+ nations to verified toll-free maternal mental health hotlines, suicide prevention lifelines, and emergency CEmONC referral desks (featuring Kenya Red Cross 1199, Niskize 0900 620 800, Befrienders Kenya, PANDA, and Postpartum Support International)

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
