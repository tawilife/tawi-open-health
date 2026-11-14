/**
 * Central Registry for Multi-Specialty Clinical Protocol Packs
 * Each protocol pack defines its own scoring rubric, LOINC/SNOMED codes,
 * hard-stop safety override rules, and local fallback keyword lexicons.
 */

export interface ProtocolDimension {
  key: string;
  label: string;
  loincCode: string;
  description: string;
  maxPoints: number;
}

export interface HardStopRule {
  dimensionKey: string;
  condition: 'greater_than' | 'equals' | 'keyword_match';
  value: number | string[];
  overrideTier: 'CRISIS';
  safetyMessage: string;
}

export interface ClinicalProtocolPack {
  id: string;
  name: string;
  specialty: string;
  version: string;
  description: string;
  maxScore: number;
  scoringDimensions: ProtocolDimension[];
  riskThresholds: {
    lowMax: number;
    elevatedMax: number;
  };
  hardStopRules: HardStopRule[];
  fallbackKeywords: {
    [keyword: string]: { dimensionKey: string; weight: number };
  };
}

export const clinicalProtocols: Record<string, ClinicalProtocolPack> = {
  epds: {
    id: 'epds',
    name: 'Maternal Mental Health (EPDS)',
    specialty: 'Perinatal Psychiatry & Obstetrics',
    version: '1.0.0',
    description: 'Edinburgh Postnatal Depression Scale for screening maternal perinatal anxiety and depression.',
    maxScore: 30,
    scoringDimensions: [
      { key: 'item_1_laugh', label: 'Laugh & Funny Side', loincCode: '71355-2', description: 'Able to laugh and see funny side of things', maxPoints: 3 },
      { key: 'item_2_look_forward', label: 'Look Forward with Enjoyment', loincCode: '71356-0', description: 'Look forward with enjoyment to things', maxPoints: 3 },
      { key: 'item_3_blame_unnecessarily', label: 'Self-Blame', loincCode: '71357-8', description: 'Blame myself unnecessarily when things go wrong', maxPoints: 3 },
      { key: 'item_4_anxious_worried', label: 'Anxiety & Worry', loincCode: '71358-6', description: 'Anxious or worried for no good reason', maxPoints: 3 },
      { key: 'item_5_scared_panicky', label: 'Panic & Fear', loincCode: '71359-4', description: 'Scared or panicky for no very good reason', maxPoints: 3 },
      { key: 'item_6_overwhelmed', label: 'Overwhelmed', loincCode: '71360-2', description: 'Things have been getting on top of me', maxPoints: 3 },
      { key: 'item_7_sleep_disturbed', label: 'Sleep Disturbed', loincCode: '71361-0', description: 'So unhappy that I have had difficulty sleeping', maxPoints: 3 },
      { key: 'item_8_sad_miserable', label: 'Sadness & Misery', loincCode: '71362-8', description: 'Sad or miserable', maxPoints: 3 },
      { key: 'item_9_crying', label: 'Crying Spells', loincCode: '71363-6', description: 'So unhappy that I have been crying', maxPoints: 3 },
      { key: 'item_10_self_harm', label: 'Self-Harm Risk', loincCode: '71364-4', description: 'Thought of harming myself has occurred to me', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 9,
      elevatedMax: 12,
    },
    hardStopRules: [
      {
        dimensionKey: 'item_10_self_harm',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'Immediate crisis intervention required for maternal self-harm ideation.',
      },
    ],
    fallbackKeywords: {
      suicide: { dimensionKey: 'item_10_self_harm', weight: 3 },
      die: { dimensionKey: 'item_10_self_harm', weight: 3 },
      harm: { dimensionKey: 'item_10_self_harm', weight: 3 },
      disappear: { dimensionKey: 'item_10_self_harm', weight: 3 },
      crying: { dimensionKey: 'item_9_crying', weight: 2 },
      sad: { dimensionKey: 'item_8_sad_miserable', weight: 2 },
      sleep: { dimensionKey: 'item_7_sleep_disturbed', weight: 2 },
      overwhelmed: { dimensionKey: 'item_6_overwhelmed', weight: 2 },
      panic: { dimensionKey: 'item_5_scared_panicky', weight: 2 },
      anxious: { dimensionKey: 'item_4_anxious_worried', weight: 2 },
      guilt: { dimensionKey: 'item_3_blame_unnecessarily', weight: 2 },
    },
  },

  phq9: {
    id: 'phq9',
    name: 'General Outpatient Mental Health (PHQ-9 & GAD-7)',
    specialty: 'Adult Psychiatry & Primary Care',
    version: '1.0.0',
    description: 'Patient Health Questionnaire for depression and generalized anxiety screening.',
    maxScore: 27,
    scoringDimensions: [
      { key: 'phq_1_interest', label: 'Little Interest or Pleasure', loincCode: '44250-9', description: 'Little interest or pleasure in doing things', maxPoints: 3 },
      { key: 'phq_2_depressed', label: 'Feeling Down or Hopeless', loincCode: '44255-8', description: 'Feeling down, depressed, or hopeless', maxPoints: 3 },
      { key: 'phq_3_sleep', label: 'Sleep Issues', loincCode: '44259-0', description: 'Trouble falling or staying asleep, or sleeping too much', maxPoints: 3 },
      { key: 'phq_4_fatigue', label: 'Fatigue & Low Energy', loincCode: '44260-8', description: 'Feeling tired or having little energy', maxPoints: 3 },
      { key: 'phq_5_appetite', label: 'Appetite Changes', loincCode: '44261-6', description: 'Poor appetite or overeating', maxPoints: 3 },
      { key: 'phq_6_failure', label: 'Guilt or Worthlessness', loincCode: '44262-4', description: 'Feeling bad about yourself or that you are a failure', maxPoints: 3 },
      { key: 'phq_7_concentration', label: 'Concentration Difficulty', loincCode: '44265-7', description: 'Trouble concentrating on things', maxPoints: 3 },
      { key: 'phq_8_psychomotor', label: 'Psychomotor Agitation/Retardation', loincCode: '44266-5', description: 'Moving or speaking so slowly, or being fidgety/restless', maxPoints: 3 },
      { key: 'phq_9_self_harm', label: 'Self-Harm / Passive Death Wish', loincCode: '44263-2', description: 'Thoughts that you would be better off dead or of hurting yourself', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 9,
      elevatedMax: 14,
    },
    hardStopRules: [
      {
        dimensionKey: 'phq_9_self_harm',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'Immediate crisis protocol triggered for self-harm / suicidal ideation.',
      },
    ],
    fallbackKeywords: {
      suicide: { dimensionKey: 'phq_9_self_harm', weight: 3 },
      die: { dimensionKey: 'phq_9_self_harm', weight: 3 },
      better: { dimensionKey: 'phq_9_self_harm', weight: 2 },
      hopeless: { dimensionKey: 'phq_2_depressed', weight: 2 },
      tired: { dimensionKey: 'phq_4_fatigue', weight: 2 },
      sleep: { dimensionKey: 'phq_3_sleep', weight: 2 },
    },
  },

  who_anc: {
    id: 'who_anc',
    name: 'Antenatal Danger Signs (Obstetric Triage)',
    specialty: 'Obstetrics & Maternal Emergency',
    version: '1.0.0',
    description: 'WHO ANC screening for preeclampsia, obstetric hemorrhage, and fetal distress.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'anc_1_headache_vision', label: 'Severe Headache / Blurred Vision', loincCode: '85353-1', description: 'Severe persistent headache or blurred vision (Preeclampsia risk)', maxPoints: 3 },
      { key: 'anc_2_bleeding', label: 'Vaginal Bleeding', loincCode: '72138-2', description: 'Any vaginal bleeding during pregnancy', maxPoints: 3 },
      { key: 'anc_3_fetal_movement', label: 'Reduced Fetal Movement', loincCode: '85354-9', description: 'Noticeable reduction or cessation of fetal movements', maxPoints: 3 },
      { key: 'anc_4_fever_pain', label: 'Severe Abdominal Pain / High Fever', loincCode: '45037-9', description: 'Severe lower abdominal cramping or chills/fever', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 0,
      elevatedMax: 2,
    },
    hardStopRules: [
      {
        dimensionKey: 'anc_1_headache_vision',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CRITICAL OBSTETRIC ALERT: Severe headache/blurred vision indicates potential preeclampsia. Immediate hospital evaluation required.',
      },
      {
        dimensionKey: 'anc_2_bleeding',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CRITICAL OBSTETRIC ALERT: Vaginal bleeding during pregnancy requires immediate emergency obstetric triage.',
      },
      {
        dimensionKey: 'anc_3_fetal_movement',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CRITICAL OBSTETRIC ALERT: Reduced fetal movement requires immediate fetal well-being assessment at maternity ward.',
      },
    ],
    fallbackKeywords: {
      bleeding: { dimensionKey: 'anc_2_bleeding', weight: 3 },
      blood: { dimensionKey: 'anc_2_bleeding', weight: 3 },
      headache: { dimensionKey: 'anc_1_headache_vision', weight: 3 },
      vision: { dimensionKey: 'anc_1_headache_vision', weight: 3 },
      blur: { dimensionKey: 'anc_1_headache_vision', weight: 3 },
      movement: { dimensionKey: 'anc_3_fetal_movement', weight: 3 },
      kick: { dimensionKey: 'anc_3_fetal_movement', weight: 3 },
      pain: { dimensionKey: 'anc_4_fever_pain', weight: 2 },
      fever: { dimensionKey: 'anc_4_fever_pain', weight: 2 },
    },
  },

  imci_pediatric: {
    id: 'imci_pediatric',
    name: 'Pediatric IMCI Pre-Triage',
    specialty: 'Pediatrics & Primary Care',
    version: '1.0.0',
    description: 'WHO Integrated Management of Childhood Illness rapid pre-triage for danger signs.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'imci_1_convulsions', label: 'History of Convulsions', loincCode: '75253-6', description: 'Child experienced convulsions or fits during current illness', maxPoints: 3 },
      { key: 'imci_2_drink_breastfeed', label: 'Inability to Drink or Breastfeed', loincCode: '85355-6', description: 'Vomiting everything or unable to suck/drink', maxPoints: 3 },
      { key: 'imci_3_chest_indrawing', label: 'Severe Chest Indrawing / Fast Breathing', loincCode: '85356-4', description: 'In-drawing of chest wall or severe respiratory distress', maxPoints: 3 },
      { key: 'imci_4_lethargy', label: 'Lethargy or Unconsciousness', loincCode: '75254-4', description: 'Not waking up, lethargic, or unconscious', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 0,
      elevatedMax: 2,
    },
    hardStopRules: [
      {
        dimensionKey: 'imci_1_convulsions',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PEDIATRIC EMERGENCY: History of convulsions requires immediate emergency resuscitation.',
      },
      {
        dimensionKey: 'imci_2_drink_breastfeed',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PEDIATRIC EMERGENCY: Inability to drink/breastfeed indicates severe dehydration or acute systemic illness.',
      },
      {
        dimensionKey: 'imci_3_chest_indrawing',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PEDIATRIC EMERGENCY: Chest indrawing indicates severe pneumonia or respiratory failure.',
      },
      {
        dimensionKey: 'imci_4_lethargy',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PEDIATRIC EMERGENCY: Lethargy or unconsciousness requires urgent pediatric triage.',
      },
    ],
    fallbackKeywords: {
      convulsion: { dimensionKey: 'imci_1_convulsions', weight: 3 },
      fit: { dimensionKey: 'imci_1_convulsions', weight: 3 },
      seizure: { dimensionKey: 'imci_1_convulsions', weight: 3 },
      vomit: { dimensionKey: 'imci_2_drink_breastfeed', weight: 3 },
      breastfeed: { dimensionKey: 'imci_2_drink_breastfeed', weight: 2 },
      drink: { dimensionKey: 'imci_2_drink_breastfeed', weight: 2 },
      breath: { dimensionKey: 'imci_3_chest_indrawing', weight: 3 },
      chest: { dimensionKey: 'imci_3_chest_indrawing', weight: 3 },
      lethargic: { dimensionKey: 'imci_4_lethargy', weight: 3 },
      unconscious: { dimensionKey: 'imci_4_lethargy', weight: 3 },
    },
  },

  ncd_chronic: {
    id: 'ncd_chronic',
    name: 'Chronic Disease (NCD) Check-Ins',
    specialty: 'Cardiology & Endocrinology',
    version: '1.0.0',
    description: 'Hypertension and Diabetes adherence and acute symptom red-flag screening.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'ncd_1_chest_pain', label: 'Acute Chest Pain / Pressure', loincCode: '85357-2', description: 'Sudden crushing chest pain, pressure, or tightness', maxPoints: 3 },
      { key: 'ncd_2_stroke_signs', label: 'Sudden Weakness / Numbness (Stroke Signs)', loincCode: '85358-0', description: 'Facial drooping, arm weakness, or slurred speech', maxPoints: 3 },
      { key: 'ncd_3_hypoglycemia', label: 'Severe Hypoglycemia Symptoms', loincCode: '85359-8', description: 'Severe dizziness, shaking, confusion, or sweating', maxPoints: 3 },
      { key: 'ncd_4_med_adherence', label: 'Medication Adherence Gap', loincCode: '85360-6', description: 'Missed prescribed blood pressure or diabetes medication', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 2,
      elevatedMax: 5,
    },
    hardStopRules: [
      {
        dimensionKey: 'ncd_1_chest_pain',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CARDIAC EMERGENCY: Chest pain requires immediate emergency dispatch for acute coronary syndrome evaluation.',
      },
      {
        dimensionKey: 'ncd_2_stroke_signs',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'STROKE EMERGENCY: Sudden neurological deficit (FAST symptoms) requires immediate emergency stroke activation.',
      },
    ],
    fallbackKeywords: {
      chest: { dimensionKey: 'ncd_1_chest_pain', weight: 3 },
      pain: { dimensionKey: 'ncd_1_chest_pain', weight: 3 },
      heart: { dimensionKey: 'ncd_1_chest_pain', weight: 3 },
      weakness: { dimensionKey: 'ncd_2_stroke_signs', weight: 3 },
      numb: { dimensionKey: 'ncd_2_stroke_signs', weight: 3 },
      speech: { dimensionKey: 'ncd_2_stroke_signs', weight: 3 },
      dizzy: { dimensionKey: 'ncd_3_hypoglycemia', weight: 2 },
      sugar: { dimensionKey: 'ncd_3_hypoglycemia', weight: 2 },
      pill: { dimensionKey: 'ncd_4_med_adherence', weight: 1 },
      medicine: { dimensionKey: 'ncd_4_med_adherence', weight: 1 },
    },
  },

  audit_youth: {
    id: 'audit_youth',
    name: 'Substance Use & Youth Screening (AUDIT-C / CRAFFT)',
    specialty: 'Addiction Medicine & Adolescent Health',
    version: '1.0.0',
    description: 'Screening for acute substance withdrawal, overdose risk, and adolescent risk behaviors.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'audit_1_withdrawal', label: 'Acute Withdrawal Symptoms', loincCode: '85361-4', description: 'Tremors, severe sweating, hallucinations, or seizures', maxPoints: 3 },
      { key: 'audit_2_overdose', label: 'Overdose Risk / Heavy Use', loincCode: '85362-2', description: 'Loss of consciousness or dangerous substance consumption', maxPoints: 3 },
      { key: 'audit_3_mental_health', label: 'Co-occurring Depression / Anxiety', loincCode: '85363-0', description: 'Severe mood disturbance or hopelessness', maxPoints: 3 },
      { key: 'audit_4_self_harm', label: 'Self-Harm / Suicidal Ideation', loincCode: '85364-8', description: 'Thoughts of harming oneself', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 3,
      elevatedMax: 7,
    },
    hardStopRules: [
      {
        dimensionKey: 'audit_4_self_harm',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CRISIS SAFETY PROTOCOL: Suicidal ideation or self-harm risk triggered in substance screening.',
      },
      {
        dimensionKey: 'audit_1_withdrawal',
        condition: 'greater_than',
        value: 1,
        overrideTier: 'CRISIS',
        safetyMessage: 'MEDICAL EMERGENCY: Severe withdrawal symptoms require immediate medical detoxification.',
      },
    ],
    fallbackKeywords: {
      suicide: { dimensionKey: 'audit_4_self_harm', weight: 3 },
      die: { dimensionKey: 'audit_4_self_harm', weight: 3 },
      withdraw: { dimensionKey: 'audit_1_withdrawal', weight: 3 },
      shake: { dimensionKey: 'audit_1_withdrawal', weight: 2 },
      overdose: { dimensionKey: 'audit_2_overdose', weight: 3 },
      drank: { dimensionKey: 'audit_2_overdose', weight: 2 },
    },
  },

  postsurg_wound: {
    id: 'postsurg_wound',
    name: 'Post-Surgical & Wound Discharge Stratification',
    specialty: 'Surgery & Post-Op Care',
    version: '1.0.0',
    description: 'Post-operative day 3, 7, and 14 check-ins for infection, bleeding, and deep vein thrombosis.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'post_1_fever', label: 'High Fever / Chills', loincCode: '85365-5', description: 'Fever above 38.5°C or severe chills', maxPoints: 3 },
      { key: 'post_2_wound_discharge', label: 'Foul-Smelling Wound Discharge / Pus', loincCode: '85366-3', description: 'Pus, foul odor, or spreading redness around surgical site', maxPoints: 3 },
      { key: 'post_3_bleeding', label: 'Uncontrolled Surgical Bleeding', loincCode: '85367-1', description: 'Active bleeding soaking through dressings', maxPoints: 3 },
      { key: 'post_4_calf_pain', label: 'Severe Calf Pain / DVT Risk', loincCode: '85368-9', description: 'Unilateral calf swelling, pain, or shortness of breath (DVT/PE risk)', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 1,
      elevatedMax: 4,
    },
    hardStopRules: [
      {
        dimensionKey: 'post_3_bleeding',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'SURGICAL EMERGENCY: Uncontrolled postoperative bleeding requires immediate surgical re-evaluation.',
      },
      {
        dimensionKey: 'post_4_calf_pain',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'SURGICAL EMERGENCY: Severe calf pain or respiratory distress indicates potential DVT/Pulmonary Embolism. Immediate emergency care required.',
      },
    ],
    fallbackKeywords: {
      bleeding: { dimensionKey: 'post_3_bleeding', weight: 3 },
      blood: { dimensionKey: 'post_3_bleeding', weight: 3 },
      fever: { dimensionKey: 'post_1_fever', weight: 3 },
      hot: { dimensionKey: 'post_1_fever', weight: 2 },
      pus: { dimensionKey: 'post_2_wound_discharge', weight: 3 },
      smell: { dimensionKey: 'post_2_wound_discharge', weight: 3 },
      wound: { dimensionKey: 'post_2_wound_discharge', weight: 2 },
      calf: { dimensionKey: 'post_4_calf_pain', weight: 3 },
      leg: { dimensionKey: 'post_4_calf_pain', weight: 2 },
    },
  },

  esi: {
    id: 'esi',
    name: 'Emergency Severity Index (ESI)',
    specialty: 'Emergency Medicine & Acute Care',
    version: '1.0.0',
    description: '5-level emergency department triage algorithm combining patient acuity and predicted resource utilization.',
    maxScore: 15,
    scoringDimensions: [
      { key: 'esi_1_life_threat', label: 'Life Threat / Immediate Intervention', loincCode: '90349-1', description: 'Requires immediate life-saving intervention (Level 1)', maxPoints: 3 },
      { key: 'esi_2_high_risk', label: 'High Risk Situation / Confusion / Pain', loincCode: '90350-9', description: 'High-risk situation, lethargy, confusion, or severe pain/distress (Level 2)', maxPoints: 3 },
      { key: 'esi_3_resources', label: 'Resource Needs (Labs, X-ray, IV)', loincCode: '90351-7', description: 'Requires multiple hospital resources (Level 3)', maxPoints: 3 },
      { key: 'esi_4_single_resource', label: 'Single Resource Need', loincCode: '90352-5', description: 'Requires single hospital resource like simple X-ray or suture (Level 4)', maxPoints: 3 },
      { key: 'esi_5_routine', label: 'Routine Outpatient Care', loincCode: '90353-3', description: 'No resources needed, routine exam or prescription refill (Level 5)', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 3,
      elevatedMax: 8,
    },
    hardStopRules: [
      {
        dimensionKey: 'esi_1_life_threat',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'ESI LEVEL 1 EMERGENCY: Immediate life-saving intervention required. Transfer to resuscitation bay.',
      },
      {
        dimensionKey: 'esi_2_high_risk',
        condition: 'greater_than',
        value: 1,
        overrideTier: 'CRISIS',
        safetyMessage: 'ESI LEVEL 2 EMERGENCY: High-risk presentation, severe pain, or altered mental status. Immediate physician evaluation required.',
      },
    ],
    fallbackKeywords: {
      resuscitation: { dimensionKey: 'esi_1_life_threat', weight: 3 },
      arrest: { dimensionKey: 'esi_1_life_threat', weight: 3 },
      unconscious: { dimensionKey: 'esi_1_life_threat', weight: 3 },
      severe: { dimensionKey: 'esi_2_high_risk', weight: 3 },
      pain: { dimensionKey: 'esi_2_high_risk', weight: 2 },
      confusion: { dimensionKey: 'esi_2_high_risk', weight: 2 },
      labs: { dimensionKey: 'esi_3_resources', weight: 1 },
      xray: { dimensionKey: 'esi_4_single_resource', weight: 1 },
    },
  },

  ctas: {
    id: 'ctas',
    name: 'Canadian Triage and Acuity Scale (CTAS)',
    specialty: 'Emergency Care & Trauma',
    version: '1.0.0',
    description: '5-level acuity scale based on presenting complaint symptom severity and clinical modifiers.',
    maxScore: 15,
    scoringDimensions: [
      { key: 'ctas_1_resuscitation', label: 'Resuscitation (Level 1)', loincCode: '90354-1', description: 'Conditions that are threats to life or limb', maxPoints: 3 },
      { key: 'ctas_2_emergent', label: 'Emergent (Level 2)', loincCode: '90355-8', description: 'Potential threat to life, limb or function', maxPoints: 3 },
      { key: 'ctas_3_urgent', label: 'Urgent (Level 3)', loincCode: '90356-6', description: 'Potential progress to a serious problem requiring emergency intervention', maxPoints: 3 },
      { key: 'ctas_4_less_urgent', label: 'Less Urgent (Level 4)', loincCode: '90357-4', description: 'Conditions related to patient age, distress, or potential for deterioration', maxPoints: 3 },
      { key: 'ctas_5_non_urgent', label: 'Non-Urgent (Level 5)', loincCode: '90358-2', description: 'Conditions that are non-acute or represent primary care problems', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 3,
      elevatedMax: 8,
    },
    hardStopRules: [
      {
        dimensionKey: 'ctas_1_resuscitation',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CTAS LEVEL 1: Immediate resuscitation required for life/limb threat.',
      },
      {
        dimensionKey: 'ctas_2_emergent',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'CTAS LEVEL 2: Emergent condition requiring physician assessment within 15 minutes.',
      },
    ],
    fallbackKeywords: {
      resuscitation: { dimensionKey: 'ctas_1_resuscitation', weight: 3 },
      shock: { dimensionKey: 'ctas_1_resuscitation', weight: 3 },
      emergent: { dimensionKey: 'ctas_2_emergent', weight: 3 },
      urgent: { dimensionKey: 'ctas_3_urgent', weight: 2 },
      routine: { dimensionKey: 'ctas_5_non_urgent', weight: 1 },
    },
  },

  mts: {
    id: 'mts',
    name: 'Manchester Triage System (MTS)',
    specialty: 'Emergency Department Flowcharts',
    version: '1.0.0',
    description: '5-level color-coded flowchart triage system (Red, Orange, Yellow, Green, Blue) for structured decision support.',
    maxScore: 15,
    scoringDimensions: [
      { key: 'mts_1_red', label: 'Red (Immediate / Resus)', loincCode: '90359-0', description: 'Immediate life-saving priority', maxPoints: 3 },
      { key: 'mts_2_orange', label: 'Orange (Very Urgent)', loincCode: '90360-8', description: 'Very urgent clinical priority (10 minutes)', maxPoints: 3 },
      { key: 'mts_3_yellow', label: 'Yellow (Urgent)', loincCode: '90361-6', description: 'Urgent clinical priority (60 minutes)', maxPoints: 3 },
      { key: 'mts_4_green', label: 'Green (Standard)', loincCode: '90362-4', description: 'Standard clinical priority (120 minutes)', maxPoints: 3 },
      { key: 'mts_5_blue', label: 'Blue (Non-Urgent)', loincCode: '90363-2', description: 'Non-urgent primary care case (240 minutes)', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 3,
      elevatedMax: 8,
    },
    hardStopRules: [
      {
        dimensionKey: 'mts_1_red',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'MTS RED PRIORITY: Immediate emergency resuscitation required.',
      },
      {
        dimensionKey: 'mts_2_orange',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'MTS ORANGE PRIORITY: Very urgent medical intervention required within 10 minutes.',
      },
    ],
    fallbackKeywords: {
      red: { dimensionKey: 'mts_1_red', weight: 3 },
      immediate: { dimensionKey: 'mts_1_red', weight: 3 },
      orange: { dimensionKey: 'mts_2_orange', weight: 3 },
      yellow: { dimensionKey: 'mts_3_yellow', weight: 2 },
      green: { dimensionKey: 'mts_4_green', weight: 1 },
    },
  },

  sats: {
    id: 'sats',
    name: 'South African Triage Scale (SATS)',
    specialty: 'High-Volume & Low-Resource Emergency Care',
    version: '1.0.0',
    description: '4-level triage scale combining physiological measures (TEWS - Triage Early Warning Score) and clinical indicators, optimized for LMIC settings.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'sats_1_emergency', label: 'Emergency (Red)', loincCode: '90364-0', description: 'Immediate life-saving resuscitation needed (TEWS >= 7)', maxPoints: 3 },
      { key: 'sats_2_very_urgent', label: 'Very Urgent (Orange)', loincCode: '90365-7', description: 'Severe physiological derangement (TEWS 5-6)', maxPoints: 3 },
      { key: 'sats_3_urgent', label: 'Urgent (Yellow)', loincCode: '90366-5', description: 'Moderate distress or risk (TEWS 3-4)', maxPoints: 3 },
      { key: 'sats_4_routine', label: 'Routine (Green)', loincCode: '90367-3', description: 'Stable ambulatory patient (TEWS 0-2)', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 2,
      elevatedMax: 6,
    },
    hardStopRules: [
      {
        dimensionKey: 'sats_1_emergency',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'SATS RED EMERGENCY: Immediate resuscitation required under South African Triage Scale guidelines.',
      },
      {
        dimensionKey: 'sats_2_very_urgent',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'SATS ORANGE VERY URGENT: High physiological risk. Immediate nurse/clinician assessment required.',
      },
    ],
    fallbackKeywords: {
      emergency: { dimensionKey: 'sats_1_emergency', weight: 3 },
      critical: { dimensionKey: 'sats_1_emergency', weight: 3 },
      urgent: { dimensionKey: 'sats_2_very_urgent', weight: 3 },
      routine: { dimensionKey: 'sats_4_routine', weight: 1 },
    },
  },

  paedctas: {
    id: 'paedctas',
    name: 'Pediatric Triage Systems (PaedCTAS)',
    specialty: 'Pediatric Emergency & Acute Care',
    version: '1.0.0',
    description: 'Pediatric-specific adaptation of triage scales for predicting admissions, respiratory distress, and ICU transfers in children.',
    maxScore: 12,
    scoringDimensions: [
      { key: 'paed_1_resuscitation', label: 'Resuscitation (Level 1 - Pediatric)', loincCode: '90368-1', description: 'Cardiorespiratory arrest or severe shock in child', maxPoints: 3 },
      { key: 'paed_2_emergent', label: 'Emergent (Level 2 - Pediatric)', loincCode: '90369-9', description: 'Severe respiratory distress, lethargy, or dehydration', maxPoints: 3 },
      { key: 'paed_3_urgent', label: 'Urgent (Level 3 - Pediatric)', loincCode: '90370-7', description: 'Moderate pain, high fever without source, vomiting', maxPoints: 3 },
      { key: 'paed_4_non_urgent', label: 'Standard / Non-Urgent (Level 4-5)', loincCode: '90371-5', description: 'Minor injury or stable upper respiratory infection', maxPoints: 3 },
    ],
    riskThresholds: {
      lowMax: 2,
      elevatedMax: 6,
    },
    hardStopRules: [
      {
        dimensionKey: 'paed_1_resuscitation',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PAEDCTAS LEVEL 1 PEDIATRIC EMERGENCY: Immediate pediatric resuscitation required.',
      },
      {
        dimensionKey: 'paed_2_emergent',
        condition: 'greater_than',
        value: 0,
        overrideTier: 'CRISIS',
        safetyMessage: 'PAEDCTAS LEVEL 2 PEDIATRIC EMERGENT: Severe distress requiring immediate medical attention.',
      },
    ],
    fallbackKeywords: {
      arrest: { dimensionKey: 'paed_1_resuscitation', weight: 3 },
      shock: { dimensionKey: 'paed_1_resuscitation', weight: 3 },
      respiratory: { dimensionKey: 'paed_2_emergent', weight: 3 },
      lethargic: { dimensionKey: 'paed_2_emergent', weight: 3 },
      fever: { dimensionKey: 'paed_3_urgent', weight: 2 },
    },
  },
};

export function getProtocol(protocolId?: string): ClinicalProtocolPack {
  if (!protocolId || !clinicalProtocols[protocolId]) {
    return clinicalProtocols.epds; // Default fallback protocol
  }
  return clinicalProtocols[protocolId];
}
