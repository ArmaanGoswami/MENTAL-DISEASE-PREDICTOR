"""
DISEASE ONTOLOGY & MULTI-MODAL DIAGNOSTIC SCORING ENGINE
Comprehensive catalogue of 45+ Mental Health Diseases & Conditions
Mapped to DSM-5, ICD-11, and Behavioral / Cognitive Biomarkers.
"""

# Catalogue of 45+ Mental Health Diseases & Conditions
DISEASE_CATALOGUE = [
    # -------------------------------------------------------------
    # 1. MOOD & AFFECTIVE DISORDERS (1 - 6)
    # -------------------------------------------------------------
    {
        "id": "mdd",
        "name": "Major Depressive Disorder (MDD)",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A70",
        "dsm_code": "296.2 / 296.3",
        "description": "Persistent depressed mood, profound loss of interest/pleasure (anhedonia), energy depletion, feelings of worthlessness, and psychomotor slowing.",
        "hallmarks": "High Neuroticism, Very Low Extraversion, Psychomotor Retardation, Cognitive Slowing (Stroop Delay)",
        "dsm_criteria": "Depressed mood or loss of interest for ≥ 2 weeks accompanied by significant distress and functional impairment."
    },
    {
        "id": "dysthymia",
        "name": "Persistent Depressive Disorder (Dysthymia)",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A72",
        "dsm_code": "300.4",
        "description": "Chronic, low-grade depressive state lasting continuously for at least two years with low energy, poor self-esteem, and cognitive fatigue.",
        "hallmarks": "Chronic High Neuroticism, Low Conscientiousness, Chronic Sleep Disturbance",
        "dsm_criteria": "Depressed mood for most of the day for at least 2 years without major symptom remission > 2 months."
    },
    {
        "id": "bipolar_1",
        "name": "Bipolar I Disorder (Manic/Depressive)",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A60",
        "dsm_code": "296.4",
        "description": "Extreme mood oscillations alternating between depressive crashes and euphoric or irritable manic episodes with hyperactive impulsivity.",
        "hallmarks": "Extreme Neuroticism Volatility, High Psychomotor Agitation, High Risk Tolerance (BART choice)",
        "dsm_criteria": "Occurrence of at least one lifetime manic episode, often followed by major depressive episodes."
    },
    {
        "id": "bipolar_2",
        "name": "Bipolar II Disorder (Hypomanic/Depressive)",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A61",
        "dsm_code": "296.89",
        "description": "Recurrent severe depressive episodes interspaced with distinct hypomanic episodes (energized, productive, reduced sleep need without full psychotic mania).",
        "hallmarks": "Affective Instability, Reduced Sleep Need with High Speech Cadence, Mood Shifts",
        "dsm_criteria": "At least one hypomanic episode (≥ 4 days) and at least one major depressive episode."
    },
    {
        "id": "cyclothymia",
        "name": "Cyclothymic Disorder",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A62",
        "dsm_code": "301.13",
        "description": "Chronic fluctuating mood disturbances involving numerous periods of mild hypomanic symptoms and mild depressive symptoms over at least 2 years.",
        "hallmarks": "High Neuroticism, Unstable Energy Levels, Sub-threshold Affective Flips",
        "dsm_criteria": "Frequent hypomanic and depressive episodes that do not meet full severity for major depression or mania."
    },
    {
        "id": "sad",
        "name": "Seasonal Affective Disorder (SAD)",
        "category": "Mood & Affective Disorders",
        "icd_code": "6A70.Y",
        "dsm_code": "296.22 w/ Seasonal Pattern",
        "description": "Recurrent depressive episodes characterized by hypersomnia, carbohydrate craving, and lethargy following reduced sunlight exposure.",
        "hallmarks": "High Sleep Hours with Low Energy, Somatic Heaviness, Low Extraversion in Winter",
        "dsm_criteria": "Depressive episodes recurring predictably during specific calendar seasons with full spring remission."
    },

    # -------------------------------------------------------------
    # 2. ANXIETY & PANIC SPECTRUM (7 - 12)
    # -------------------------------------------------------------
    {
        "id": "gad",
        "name": "Generalized Anxiety Disorder (GAD)",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B00",
        "dsm_code": "300.02",
        "description": "Excessive, uncontrollable worry about various everyday events accompanied by restlessness, muscle tension, and cognitive fatigue.",
        "hallmarks": "High Neuroticism, Catastrophizing Distortions, Shoulders & Gut Somatic Tension",
        "dsm_criteria": "Excessive anxiety and worry for more days than not for ≥ 6 months about a number of events."
    },
    {
        "id": "panic_disorder",
        "name": "Panic Disorder (Paroxysmal Anxiety)",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B01",
        "dsm_code": "300.01",
        "description": "Recurrent unexpected surges of overwhelming terror (panic attacks) with palpitations, chest tightness, shortness of breath, and fear of dying.",
        "hallmarks": "Acute Chest Tension, Sudden Psychomotor Agitation, Somatosensory Amplification",
        "dsm_criteria": "Recurrent unexpected panic attacks followed by at least 1 month of persistent concern about recurrence."
    },
    {
        "id": "agoraphobia",
        "name": "Agoraphobia",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B02",
        "dsm_code": "300.22",
        "description": "Marked fear or avoidance of situations where escape might be difficult (public transport, open spaces, crowds) during panic sensations.",
        "hallmarks": "High Neuroticism, Extremely Low Extraversion, Severe Avoidance Schemas",
        "dsm_criteria": "Fear/avoidance of ≥ 2 agoraphobic situations (public transit, open spaces, crowds, standing in line)."
    },
    {
        "id": "social_anxiety",
        "name": "Social Anxiety Disorder (Social Phobia)",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B04",
        "dsm_code": "300.23",
        "description": "Intense, persistent fear of being scrutinized, judged, or humiliated in social and performance situations, leading to severe avoidance.",
        "hallmarks": "High Neuroticism, Low Extraversion, 'Mind Reading' CBT Distortions, Throat/Voice Tightness",
        "dsm_criteria": "Persistent fear of social scrutiny lasting ≥ 6 months out of proportion to actual threat."
    },
    {
        "id": "specific_phobia",
        "name": "Specific Phobia",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B03",
        "dsm_code": "300.29",
        "description": "Irrational, intense anxiety triggered by exposure to specific objects or situations (heights, needles, flying, insects) resulting in avoidance.",
        "hallmarks": "Isolated Acute Threat Reaction, Focused Somatic Arousal, Normal Baseline Traits",
        "dsm_criteria": "Marked fear of specific object/situation lasting ≥ 6 months with immediate fear response."
    },
    {
        "id": "separation_anxiety",
        "name": "Adult Separation Anxiety Disorder",
        "category": "Anxiety & Panic Spectrum",
        "icd_code": "6B05",
        "dsm_code": "309.21",
        "description": "Developmentally inappropriate and excessive fear or anxiety concerning separation from major attachment figures or home.",
        "hallmarks": "High Neuroticism, High Agreeableness, Attachment Clinging, Nighttime Distress",
        "dsm_criteria": "Persistent distress over separation lasting ≥ 6 months in adults causing clinical impairment."
    },

    # -------------------------------------------------------------
    # 3. TRAUMA & STRESSOR-RELATED DISORDERS (13 - 16)
    # -------------------------------------------------------------
    {
        "id": "ptsd",
        "name": "Post-Traumatic Stress Disorder (PTSD)",
        "category": "Trauma & Stress Spectrum",
        "icd_code": "6B40",
        "dsm_code": "309.81",
        "description": "Persistent re-experiencing of traumatic events through intrusive memories, flashbacks, severe hyper-vigilance, and trauma-avoidance.",
        "hallmarks": "Extreme Threat Vigilance (Reaction Speed to Threat Cues), High Neuroticism, Sleep Insomnia",
        "dsm_criteria": "Exposure to actual/threatened death, serious injury, or sexual violence followed by intrusion, avoidance, and hyper-arousal symptoms."
    },
    {
        "id": "c_ptsd",
        "name": "Complex PTSD (C-PTSD)",
        "category": "Trauma & Stress Spectrum",
        "icd_code": "6B41",
        "dsm_code": "309.81 (Complex Specifier)",
        "description": "Syndrome following prolonged, repeated trauma (childhood neglect, domestic abuse) with severe emotional dysregulation and negative self-concept.",
        "hallmarks": "Affective Instability, Pervasive Distrust, Somatic Heaviness, Low Self-Worth",
        "dsm_criteria": "Meets full PTSD criteria plus severe disturbances in emotional regulation, persistent worthlessness, and relational difficulties."
    },
    {
        "id": "acute_stress",
        "name": "Acute Stress Disorder",
        "category": "Trauma & Stress Spectrum",
        "icd_code": "6B43",
        "dsm_code": "308.3",
        "description": "Acute psychological reaction occurring immediately (3 days to 1 month) following exposure to a life-threatening or catastrophic event.",
        "hallmarks": "Acute Dissociation, Elevated Heart Cadence, Shock Response, Depersonalization",
        "dsm_criteria": "Onset within 3 days of traumatic event, lasting up to 1 month with intrusive memories and dissociation."
    },
    {
        "id": "adjustment_disorder",
        "name": "Adjustment Disorder with Anxiety/Depression",
        "category": "Trauma & Stress Spectrum",
        "icd_code": "6B42",
        "dsm_code": "309.28",
        "description": "Emotional or behavioral reaction to an identifiable life stressor (breakup, job loss, relocation, academic failure) out of proportion to event.",
        "hallmarks": "Recent Environmental Stressor, Acute Elevation in Neuroticism, Moderate Fatigue",
        "dsm_criteria": "Symptoms emerge within 3 months of stressor onset and resolve within 6 months once stressor ceases."
    },

    # -------------------------------------------------------------
    # 4. OBSESSIVE-COMPULSIVE & RELATED DISORDERS (17 - 20)
    # -------------------------------------------------------------
    {
        "id": "ocd",
        "name": "Obsessive-Compulsive Disorder (OCD)",
        "category": "Obsessive-Compulsive Spectrum",
        "icd_code": "6B20",
        "dsm_code": "300.3",
        "description": "Intrusive, unwanted distressing thoughts (obsessions) that drive repetitive ritualistic behaviors or mental acts (compulsions) to neutralize anxiety.",
        "hallmarks": "High Neuroticism, Stroop Cognitive Rigidity, 'All-or-Nothing' & Catastrophizing Distortions",
        "dsm_criteria": "Presence of obsessions, compulsions, or both, consuming > 1 hour/day or causing marked distress."
    },
    {
        "id": "bdd",
        "name": "Body Dysmorphic Disorder (BDD)",
        "category": "Obsessive-Compulsive Spectrum",
        "icd_code": "6B21",
        "dsm_code": "300.7",
        "description": "Preoccupation with one or more perceived defects or flaws in physical appearance that are unobservable or appear slight to others.",
        "hallmarks": "Social Anxiety Overlap, Repetitive Mirror Checking / Avoidance, High Neuroticism",
        "dsm_criteria": "Appearance preoccupations causing repetitive behaviors (mirror checking, grooming) and functional impairment."
    },
    {
        "id": "hoarding",
        "name": "Hoarding Disorder",
        "category": "Obsessive-Compulsive Spectrum",
        "icd_code": "6B24",
        "dsm_code": "300.3 (Hoarding)",
        "description": "Persistent difficulty discarding or parting with possessions regardless of value, driven by a perceived need to save items and distress associated with letting go.",
        "hallmarks": "Low Conscientiousness in Execution, High Avoidance, Indecisiveness on Choice Tasks",
        "dsm_criteria": "Persistent discarding difficulty resulting in clutter that congests living areas."
    },
    {
        "id": "trichotillomania",
        "name": "Trichotillomania & Excoriation (Body-Focused Repetitive)",
        "category": "Obsessive-Compulsive Spectrum",
        "icd_code": "6B25",
        "dsm_code": "312.39 / 698.4",
        "description": "Recurrent pulling out of one's hair or skin-picking resulting in tissue damage, typically triggered by mounting tension or cognitive boredom.",
        "hallmarks": "Motor Tapping Rhythm Dysregulation, Somatic Urges, Low Impulse Inhibition",
        "dsm_criteria": "Recurrent hair pulling or skin picking accompanied by repeated failed attempts to stop."
    },

    # -------------------------------------------------------------
    # 5. NEURODEVELOPMENTAL & EXECUTIVE DEFICITS (21 - 25)
    # -------------------------------------------------------------
    {
        "id": "adhd_inattentive",
        "name": "ADHD - Predominantly Inattentive Presentation",
        "category": "Neurodevelopmental & Executive",
        "icd_code": "6A05.0",
        "dsm_code": "314.00",
        "description": "Difficulty sustaining attention, high susceptibility to cognitive distractions, frequent careless errors, chronic procrastination, and disorganization.",
        "hallmarks": "High Stroop Error Rate, Short Digit Span Memory, Low Conscientiousness (Execution)",
        "dsm_criteria": "≥ 6 symptoms of inattention lasting ≥ 6 months inconsistent with developmental level."
    },
    {
        "id": "adhd_hyperactive",
        "name": "ADHD - Hyperactive/Impulsive Presentation",
        "category": "Neurodevelopmental & Executive",
        "icd_code": "6A05.1",
        "dsm_code": "314.01",
        "description": "Motor restlessness, inability to remain seated, impulsive conversational interruptions, and high-risk spontaneous decision making.",
        "hallmarks": "High Tapping Speed (Motor Agitation), High BART Risk Taking, Low Delay of Gratification",
        "dsm_criteria": "≥ 6 symptoms of hyperactivity-impulsivity causing impairment across multiple settings."
    },
    {
        "id": "adhd_combined",
        "name": "ADHD - Combined Presentation",
        "category": "Neurodevelopmental & Executive",
        "icd_code": "6A05.2",
        "dsm_code": "314.01",
        "description": "Concurrent expression of severe executive inattention alongside physical restlessness and behavioral impulsivity.",
        "hallmarks": "Cognitive Stroop Interference, Rapid Irregular Motor Tapping, Executive Brain Fog",
        "dsm_criteria": "Meets criteria for both inattention and hyperactivity-impulsivity for ≥ 6 months."
    },
    {
        "id": "autism_spectrum",
        "name": "Adult Autism Spectrum Profile (Level 1 / High Functioning)",
        "category": "Neurodevelopmental & Executive",
        "icd_code": "6A02.0",
        "dsm_code": "299.00",
        "description": "Atypical social communication, intense special interests, need for routine predictability, and sensory over/under-reactivity.",
        "hallmarks": "Low Extraversion in Social Contexts, High Conscientiousness / Detail Focus, Sensory Sensitivity",
        "dsm_criteria": "Persistent deficits in social-emotional reciprocity and nonverbal communication plus restricted, repetitive patterns of behavior."
    },
    {
        "id": "executive_dysfunction",
        "name": "Executive Function Deficit & Working Memory Strain",
        "category": "Neurodevelopmental & Executive",
        "icd_code": "MB24.1",
        "dsm_code": "799.53",
        "description": "Deficit in working memory, task prioritization, cognitive switching, and emotional inhibition secondary to severe neuro-fatigue.",
        "hallmarks": "Severely Short Digit Span (<= 4 items), Stroop Switching Delay, Brain Fog Markers",
        "dsm_criteria": "Measurable cognitive working memory and attention task performance deficit under load."
    },

    # -------------------------------------------------------------
    # 6. PERSONALITY DISORDERS (CLUSTERS A, B, C) (26 - 35)
    # -------------------------------------------------------------
    {
        "id": "bpd",
        "name": "Borderline Personality Pattern (BPD)",
        "category": "Personality Disorders",
        "icd_code": "6D10 (Borderline Pattern)",
        "dsm_code": "301.83",
        "description": "Pervasive pattern of instability in interpersonal relationships, self-image, and affects, accompanied by marked impulsivity and intense fear of abandonment.",
        "hallmarks": "Extreme Neuroticism, Low Agreeableness, Affective Instability, Rapid Mood Shifts",
        "dsm_criteria": "Pattern of interpersonal and emotional instability with ≥ 5 specific criteria including abandonment dread and impulsivity."
    },
    {
        "id": "npd",
        "name": "Narcissistic Personality Pattern (NPD)",
        "category": "Personality Disorders",
        "icd_code": "6D11.1",
        "dsm_code": "301.81",
        "description": "Grandiosity, need for admiration, and lack of empathy, often concealing a fragile, hyper-vulnerable self-esteem sensitive to criticism.",
        "hallmarks": "Very Low Agreeableness, Defensive Neuroticism, Grandiosity Schemas",
        "dsm_criteria": "Pervasive grandiosity and lack of empathy beginning by early adulthood across contexts."
    },
    {
        "id": "histrionic",
        "name": "Histrionic Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6D11.2",
        "dsm_code": "301.50",
        "description": "Excessive emotionality and attention-seeking behavior, discomfort when not the center of attention, and impressionistic speech.",
        "hallmarks": "Very High Extraversion, Elevated Neuroticism, Theatrical Emotionality",
        "dsm_criteria": "Excessive emotionality and attention-seeking with rapid shifts in shallow emotional expression."
    },
    {
        "id": "antisocial",
        "name": "Antisocial Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6D11.3",
        "dsm_code": "301.7",
        "description": "Disregard for and violation of the rights of others, deceitfulness, impulsivity, irritability, and lack of remorse.",
        "hallmarks": "Extremely Low Agreeableness, Low Conscientiousness, High Risk-Seeking",
        "dsm_criteria": "Persistent disregard for moral and legal boundaries occurring since age 15."
    },
    {
        "id": "avpd",
        "name": "Avoidant Personality Pattern (AvPD)",
        "category": "Personality Disorders",
        "icd_code": "6D11.4",
        "dsm_code": "301.82",
        "description": "Pervasive social inhibition, feelings of inadequacy, and hypersensitivity to negative evaluation, avoiding interactions unless certain of being liked.",
        "hallmarks": "High Neuroticism, Extremely Low Extraversion, Social Dread, Shame Markers",
        "dsm_criteria": "Social inhibition and feelings of inadequacy with ≥ 4 specific avoidance traits."
    },
    {
        "id": "dependent",
        "name": "Dependent Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6D11.5",
        "dsm_code": "301.6",
        "description": "Pervasive and excessive need to be taken care of, resulting in submissive, clinging behavior and fears of separation.",
        "hallmarks": "High Agreeableness, High Neuroticism, Submissive Decision Schemas",
        "dsm_criteria": "Excessive need to be taken care of leading to submissiveness and difficulty initiating projects."
    },
    {
        "id": "ocpd",
        "name": "Obsessive-Compulsive Personality (OCPD / Perfectionism)",
        "category": "Personality Disorders",
        "icd_code": "6D11.6",
        "dsm_code": "301.4",
        "description": "Preoccupation with orderliness, perfectionism, and mental and interpersonal control, at the expense of flexibility, openness, and efficiency.",
        "hallmarks": "Extreme Conscientiousness, Low Openness, Cognitive Inflexibility, Workaholic Urgency",
        "dsm_criteria": "Perfectionism that interferes with task completion, excessive devotion to work, and hyper-morality."
    },
    {
        "id": "paranoid",
        "name": "Paranoid Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6D11.7",
        "dsm_code": "301.0",
        "description": "Pervasive distrust and suspiciousness of others such that their motives are interpreted as malevolent; doubts loyalty of peers.",
        "hallmarks": "Extremely Low Agreeableness, High Neuroticism, Guarded Hyper-Vigilance",
        "dsm_criteria": "Distrust and suspiciousness of others without sufficient basis beginning by early adulthood."
    },
    {
        "id": "schizoid",
        "name": "Schizoid Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6D11.8",
        "dsm_code": "301.20",
        "description": "Detachment from social relationships and a restricted range of expression of emotions in interpersonal settings; prefers solitary activities.",
        "hallmarks": "Extremely Low Extraversion, Flat Affect, Low Neuroticism (Emotional Indifference)",
        "dsm_criteria": "Neither desires nor enjoys close relationships; almost always chooses solitary activities."
    },
    {
        "id": "schizotypal",
        "name": "Schizotypal Personality Pattern",
        "category": "Personality Disorders",
        "icd_code": "6A22",
        "dsm_code": "301.22",
        "description": "Acute discomfort with close relationships accompanied by cognitive or perceptual distortions and eccentricities of behavior.",
        "hallmarks": "High Openness (Magical/Atypical Thinking), Low Extraversion, Paranoid Ideation",
        "dsm_criteria": "Social and interpersonal deficits with cognitive/perceptual eccentricities."
    },

    # -------------------------------------------------------------
    # 7. DISSOCIATIVE & SOMATOFORM DISORDERS (36 - 39)
    # -------------------------------------------------------------
    {
        "id": "dpdr",
        "name": "Depersonalization / Derealization Disorder",
        "category": "Dissociative & Somatic",
        "icd_code": "6B66",
        "dsm_code": "300.6",
        "description": "Persistent or recurrent experiences of unreality or detachment from one's mind, body, or surroundings (feeling like a detached robot/observer).",
        "hallmarks": "High Neuroticism, Dissociative Numbness, Somatic Disconnect",
        "dsm_criteria": "Recurrent depersonalization (detachment from self) or derealization (detachment from reality) with reality testing intact."
    },
    {
        "id": "dissociative_amnesia",
        "name": "Dissociative Amnesia",
        "category": "Dissociative & Somatic",
        "icd_code": "6B61",
        "dsm_code": "300.12",
        "description": "Inability to recall important autobiographical information, usually of a traumatic or stressful nature, inconsistent with ordinary forgetting.",
        "hallmarks": "Severe Trauma Reaction, Memory Gaps, Emotional Blocking",
        "dsm_criteria": "Inability to recall autobiographical trauma information not attributable to neurological disease."
    },
    {
        "id": "illness_anxiety",
        "name": "Illness Anxiety Disorder (Hypochondriasis)",
        "category": "Dissociative & Somatic",
        "icd_code": "6B23",
        "dsm_code": "300.7",
        "description": "Preoccupation with having or acquiring a serious illness; somatic symptoms are not present or are only mild, yet health anxiety is severe.",
        "hallmarks": "High Neuroticism, Somatic Amplification, Catastrophizing Distortions",
        "dsm_criteria": "Preoccupation with having serious illness persisting ≥ 6 months despite medical reassurance."
    },
    {
        "id": "somatic_symptom",
        "name": "Somatic Symptom Disorder",
        "category": "Dissociative & Somatic",
        "icd_code": "6C20",
        "dsm_code": "300.82",
        "description": "One or more distressing physical symptoms accompanied by disproportionate and persistent thoughts, feelings, or behaviors related to those symptoms.",
        "hallmarks": "Widespread Somatic Body Scan Pain (Head, Gut, Chest), High Neuroticism",
        "dsm_criteria": "Distressing somatic symptoms resulting in excessive time and energy devoted to health concerns."
    },

    # -------------------------------------------------------------
    # 8. SLEEP, COGNITIVE & MODERN SYNDROMES (40 - 45)
    # -------------------------------------------------------------
    {
        "id": "insomnia_disorder",
        "name": "Chronic Insomnia Disorder",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "7A00",
        "dsm_code": "307.42",
        "description": "Dissatisfaction with sleep quantity or quality with difficulty initiating or maintaining sleep, causing daytime cognitive impairment.",
        "hallmarks": "Sleep Hours <= 5.0, Cognitive Slowing, Autonomic Hyperarousal at Bedtime",
        "dsm_criteria": "Sleep initiation/maintenance difficulty occurring ≥ 3 nights/week for at least 3 months."
    },
    {
        "id": "delayed_sleep_phase",
        "name": "Delayed Sleep Phase Syndrome (Circadian Disruption)",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "7A61",
        "dsm_code": "307.45",
        "description": "Persistent circadian pattern of sleep onset and awakening that is delayed by two or more hours relative to conventional schedules.",
        "hallmarks": "Late Bedtime Rhythm, Morning Psychomotor Slowing, Social Jetlag",
        "dsm_criteria": "Persistent sleep onset delay causing distress and morning functioning impairment."
    },
    {
        "id": "executive_burnout",
        "name": "Severe Executive Burnout Syndrome",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "QD85",
        "dsm_code": "Z73.0 (Occupational Burnout)",
        "description": "Syndrome conceptualized as resulting from chronic workplace stress that has not been successfully managed; exhaustion, mental distancing, and reduced efficacy.",
        "hallmarks": "Work Hours > 9, High Conscientiousness + High Neuroticism, Executive Fatigue",
        "dsm_criteria": "Feelings of energy depletion, increased mental distancing from work, and reduced professional efficacy."
    },
    {
        "id": "alexithymia_syndrome",
        "name": "Alexithymia (Affective Blindness)",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "MB24.Z",
        "dsm_code": "TAS-20 Construct",
        "description": "Subclinical cognitive-affective trait characterized by the inability to identify, describe, and express emotions verbally, manifesting somatically.",
        "hallmarks": "Low Openness, Low Extraversion, High Somatic Tension Conversion",
        "dsm_criteria": "Score > 61 on Toronto Alexithymia Scale; inability to differentiate feelings from somatic sensations."
    },
    {
        "id": "anhedonic_apathy",
        "name": "Anhedonic Apathy & Emotional Blunting",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "MB28.2",
        "dsm_code": "780.79",
        "description": "Profound lack of emotional responsiveness, interest, or motivation, distinct from sadness; characterized by a 'flat line' subjective experience.",
        "hallmarks": "Very Low Extraversion, Low Neuroticism (Numbness), Psychomotor Sluggishness",
        "dsm_criteria": "Loss of pleasure, interest, and spontaneous motivational drive lasting > 4 weeks."
    },
    {
        "id": "impostor_neurosis",
        "name": "Impostor Phenomenon & Perfectionist Neurosis",
        "category": "Sleep-Wake & Cognitive Syndromes",
        "icd_code": "MB28.Y",
        "dsm_code": "Clance Impostor Construct",
        "description": "Internal psychological experience of intellectual phoniness despite evident success, coupled with intense anxiety of being exposed as a fraud.",
        "hallmarks": "High Conscientiousness + High Neuroticism, 'All-or-Nothing' & Catastrophizing Distortions",
        "dsm_criteria": "Chronic inability to internalize accomplishment, attributing success to luck rather than competence."
    }
]

# -------------------------------------------------------------
# MULTI-MODAL 45+ DISEASE PROBABILITY ENGINE
# -------------------------------------------------------------
def calculate_45_disease_probabilities(
    ocean_scores: dict,
    user_metadata: dict,
    game_metrics: dict = None,
    tapping_metrics: dict = None,
    somatic_tension: list = None,
    cbt_distortions: list = None,
    journal_text: str = ""
) -> list:
    """
    Computes real-time probability scores (0.0 to 100.0%) for all 45+ diseases
    by synthesizing:
    1. Psychometric OCEAN traits (O, C, E, A, N)
    2. Demographic schedule (Sleep hours, Work hours)
    3. Cognitive Game Biomarkers (Stroop latency ms, Digit Span memory)
    4. Psychomotor Rhythm (Tapping rate, Motor agitation / retardation variance)
    5. Somatic Body Tension Heatmap (Chest, Gut, Throat, Jaw, Head)
    6. Cognitive Distortion Detective (Catastrophizing, All-or-nothing, etc.)
    """
    game_metrics = game_metrics or {}
    tapping_metrics = tapping_metrics or {}
    somatic_tension = somatic_tension or []
    cbt_distortions = cbt_distortions or []

    O = float(ocean_scores.get("Openness", 50.0))
    C = float(ocean_scores.get("Conscientiousness", 50.0))
    E = float(ocean_scores.get("Extraversion", 50.0))
    A = float(ocean_scores.get("Agreeableness", 50.0))
    N = float(ocean_scores.get("Neuroticism", 50.0))

    sleep = float(user_metadata.get("baseline_sleep", 7.0))
    work_hrs = float(user_metadata.get("baseline_work_hours", 8.0))

    # Activity Biomarkers Extraction
    stroop_rt = float(game_metrics.get("stroop_rt_ms", 650)) # normal ~600-750ms
    stroop_errors = float(game_metrics.get("stroop_errors", 0))
    digit_span = float(game_metrics.get("digit_span", 7)) # normal ~6-8 items
    
    tap_rate = float(tapping_metrics.get("taps_per_sec", 4.5)) # normal ~4-6
    tap_variance = float(tapping_metrics.get("variance_ms", 35)) # normal ~20-50ms

    has_chest = "chest" in somatic_tension
    has_gut = "gut" in somatic_tension
    has_head = "head" in somatic_tension
    has_throat = "throat" in somatic_tension
    has_jaw = "jaw" in somatic_tension

    has_catastrophizing = "catastrophizing" in cbt_distortions
    has_all_or_nothing = "all_or_nothing" in cbt_distortions
    has_mind_reading = "mind_reading" in cbt_distortions

    sleep_deficit = max(0.0, 7.5 - sleep)
    work_excess = max(0.0, work_hrs - 8.0)

    calculated_results = []

    for disease in DISEASE_CATALOGUE:
        d_id = disease["id"]
        base_score = 15.0

        # Algorithmic multi-modal scoring per condition
        if d_id == "mdd":
            base_score = (0.35 * N) + (0.30 * (100 - E)) + (2.5 * sleep_deficit)
            if tap_rate < 3.2: base_score += 15.0 # psychomotor retardation
            if digit_span <= 4: base_score += 10.0 # brain fog
            if stroop_rt > 900: base_score += 8.0

        elif d_id == "dysthymia":
            base_score = (0.40 * N) + (0.25 * (100 - C)) + (1.8 * sleep_deficit)

        elif d_id == "bipolar_1":
            base_score = (0.30 * N) + (0.20 * E)
            if tap_rate > 7.0 or tap_variance > 70: base_score += 25.0 # manic motor agitation
            if sleep < 4.5 and work_hrs > 10: base_score += 20.0

        elif d_id == "bipolar_2":
            base_score = (0.35 * N) + (0.15 * E) + (1.5 * sleep_deficit)
            if tap_rate > 6.0: base_score += 15.0

        elif d_id == "cyclothymia":
            base_score = (0.38 * N) + (0.20 * abs(50 - E))

        elif d_id == "sad":
            base_score = (0.30 * N) + (0.25 * (100 - E))
            if sleep >= 9.0: base_score += 22.0 # hypersomnia

        elif d_id == "gad":
            base_score = (0.42 * N) + (2.0 * sleep_deficit) + (1.5 * work_excess)
            if has_gut or has_head: base_score += 14.0
            if has_catastrophizing: base_score += 12.0

        elif d_id == "panic_disorder":
            base_score = (0.40 * N)
            if has_chest: base_score += 25.0 # chest tightness hallmark
            if has_throat: base_score += 15.0
            if tap_variance > 60: base_score += 10.0

        elif d_id == "agoraphobia":
            base_score = (0.35 * N) + (0.40 * (100 - E))
            if has_chest: base_score += 15.0

        elif d_id == "social_anxiety":
            base_score = (0.38 * N) + (0.42 * (100 - E))
            if has_mind_reading: base_score += 18.0
            if has_throat: base_score += 10.0

        elif d_id == "specific_phobia":
            base_score = (0.20 * N) + 10.0

        elif d_id == "separation_anxiety":
            base_score = (0.35 * N) + (0.30 * A) + (0.15 * (100 - E))

        elif d_id == "ptsd":
            base_score = (0.45 * N) + (2.0 * sleep_deficit)
            if game_metrics.get("threat_reaction_ms", 0) > 0 and game_metrics.get("threat_reaction_ms", 600) < 450:
                base_score += 24.0 # hyper-vigilance speed boost
            if has_chest or has_head: base_score += 10.0

        elif d_id == "c_ptsd":
            base_score = (0.48 * N) + (0.20 * (100 - A)) + (0.15 * (100 - E))
            if has_catastrophizing: base_score += 12.0

        elif d_id == "acute_stress":
            base_score = (0.40 * N) + (2.2 * sleep_deficit)

        elif d_id == "adjustment_disorder":
            base_score = (0.35 * N) + (1.8 * work_excess)

        elif d_id == "ocd":
            base_score = (0.40 * N) + (0.25 * C)
            if stroop_errors > 2: base_score += 15.0 # cognitive inhibition struggle
            if has_all_or_nothing: base_score += 14.0

        elif d_id == "bdd":
            base_score = (0.45 * N) + (0.25 * (100 - E))
            if has_all_or_nothing: base_score += 12.0

        elif d_id == "hoarding":
            base_score = (0.25 * N) + (0.35 * (100 - C))

        elif d_id == "trichotillomania":
            base_score = (0.35 * N)
            if tap_variance > 50: base_score += 18.0

        elif d_id == "adhd_inattentive":
            base_score = (0.30 * (100 - C))
            if stroop_rt > 850 or stroop_errors >= 2: base_score += 26.0
            if digit_span <= 4: base_score += 18.0

        elif d_id == "adhd_hyperactive":
            base_score = (0.25 * (100 - C)) + (0.20 * E)
            if tap_rate > 6.5: base_score += 28.0 # motor hyperactivity

        elif d_id == "adhd_combined":
            base_score = (0.30 * (100 - C)) + (0.20 * N)
            if (stroop_errors >= 2 or stroop_rt > 800) and tap_rate > 6.0: base_score += 32.0

        elif d_id == "autism_spectrum":
            base_score = (0.35 * (100 - E)) + (0.25 * C) + (0.15 * (100 - A))
            if stroop_rt > 800: base_score += 12.0

        elif d_id == "executive_dysfunction":
            base_score = (0.25 * N) + (2.0 * sleep_deficit) + (2.0 * work_excess)
            if digit_span <= 4: base_score += 28.0
            if stroop_rt > 850: base_score += 16.0

        elif d_id == "bpd":
            base_score = (0.52 * N) + (0.25 * (100 - A))
            if has_all_or_nothing: base_score += 12.0

        elif d_id == "npd":
            base_score = (0.50 * (100 - A)) + (0.25 * N) + (0.15 * E)

        elif d_id == "histrionic":
            base_score = (0.45 * E) + (0.30 * N) + (0.15 * (100 - C))

        elif d_id == "antisocial":
            base_score = (0.55 * (100 - A)) + (0.30 * (100 - C))

        elif d_id == "avpd":
            base_score = (0.45 * N) + (0.45 * (100 - E))
            if has_mind_reading: base_score += 15.0

        elif d_id == "dependent":
            base_score = (0.40 * A) + (0.45 * N)

        elif d_id == "ocpd":
            base_score = (0.50 * C) + (0.25 * N) + (0.20 * (100 - O)) + (2.0 * work_excess)
            if has_jaw or has_all_or_nothing: base_score += 14.0

        elif d_id == "paranoid":
            base_score = (0.55 * (100 - A)) + (0.35 * N)

        elif d_id == "schizoid":
            base_score = (0.55 * (100 - E)) + (0.25 * (100 - O))

        elif d_id == "schizotypal":
            base_score = (0.40 * O) + (0.35 * (100 - E)) + (0.20 * N)

        elif d_id == "dpdr":
            base_score = (0.42 * N) + (0.25 * (100 - E))
            if digit_span <= 4: base_score += 14.0

        elif d_id == "dissociative_amnesia":
            base_score = (0.40 * N) + 10.0

        elif d_id == "illness_anxiety":
            base_score = (0.48 * N)
            if has_catastrophizing: base_score += 18.0
            if has_chest or has_gut or has_head: base_score += 12.0

        elif d_id == "somatic_symptom":
            base_score = (0.40 * N) + (len(somatic_tension) * 7.0)

        elif d_id == "insomnia_disorder":
            base_score = (0.30 * N) + (4.5 * sleep_deficit)
            if sleep <= 5.0: base_score += 25.0

        elif d_id == "delayed_sleep_phase":
            base_score = (0.20 * N) + (2.5 * sleep_deficit)
            if sleep < 6.0: base_score += 20.0

        elif d_id == "executive_burnout":
            base_score = (0.35 * N) + (0.25 * C) + (3.0 * work_excess) + (2.0 * sleep_deficit)
            if digit_span <= 4: base_score += 15.0

        elif d_id == "alexithymia_syndrome":
            base_score = (0.45 * (100 - O)) + (0.35 * (100 - E))
            if len(somatic_tension) >= 2: base_score += 14.0

        elif d_id == "anhedonic_apathy":
            base_score = (0.45 * (100 - E)) + (0.20 * (100 - N))
            if tap_rate < 3.2: base_score += 18.0

        elif d_id == "impostor_neurosis":
            base_score = (0.40 * C) + (0.38 * N)
            if has_all_or_nothing: base_score += 15.0

        # Clamp between 5.0 and 97.0
        final_score = max(5.0, min(97.0, round(float(base_score), 1)))

        # Assign Risk Tier
        if final_score < 35:
            tier = "Low / Stable"
            badge = "emerald"
        elif final_score < 60:
            tier = "Monitoring"
            badge = "amber"
        elif final_score < 78:
            tier = "Elevated Concern"
            badge = "orange"
        else:
            tier = "High Clinical Probability"
            badge = "rose"

        calculated_results.append({
            **disease,
            "score": final_score,
            "tier": tier,
            "badge": badge
        })

    # Sort by risk score descending
    calculated_results.sort(key=lambda d: d["score"], reverse=True)
    return calculated_results

if __name__ == "__main__":
    print(f"Total diseases registered in ontology: {len(DISEASE_CATALOGUE)}")
    test_scores = calculate_45_disease_probabilities(
        ocean_scores={"Openness": 45, "Conscientiousness": 85, "Extraversion": 30, "Agreeableness": 45, "Neuroticism": 82},
        user_metadata={"baseline_sleep": 5.0, "baseline_work_hours": 11.0},
        game_metrics={"stroop_rt_ms": 920, "digit_span": 4},
        tapping_metrics={"taps_per_sec": 3.0, "variance_ms": 30},
        somatic_tension=["chest", "gut"],
        cbt_distortions=["catastrophizing", "all_or_nothing"]
    )
    print("\nTop 5 Flagged Diseases:")
    for d in test_scores[:5]:
        print(f"- {d['name']} ({d['category']}): {d['score']}% [{d['tier']}]")
