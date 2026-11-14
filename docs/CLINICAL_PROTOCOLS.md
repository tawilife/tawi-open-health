# Multi-Specialty Clinical Protocol Packs

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

## Hard-Stop Red-Flag Rules
Each protocol pack defines specialized override rules (e.g., self-harm ideation, severe preeclampsia signs, chest pain, resuscitation priority) that instantly bypass cumulative scoring to trigger a **Tier 3 Critical Safety Protocol** and immediate emergency dispatch.
