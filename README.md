# Tawi Open Health

Open-source digital public goods for maternal mental health, clinical interoperability, and localized triage across Africa.

Developed as part of **Tawi Life**, an initiative dedicated to culturally attuned maternal mental health screening and clinical decision support.

---

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
