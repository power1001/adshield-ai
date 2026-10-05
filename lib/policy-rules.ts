export type SupportedLanguage = "en" | "es" | "de" | "fr" | "pt" | "hi" | "it" | "nl" | "all";

export interface PolicyRule {
  id: string;
  category: "personal_attributes" | "unrealistic_claims" | "sensational_health" | "deceptive_urgency" | "negative_perception";
  policyName: string;
  officialRef: string;
  severity: "critical" | "high" | "medium";
  pattern: RegExp;
  flagDescription: string;
  metaBotReason: string;
  recommendedFix: string;
  language: SupportedLanguage;
}

export const MULTI_LANG_POLICY_RULES: PolicyRule[] = [
  // ==========================================
  // ENGLISH (EN) - US, UK, CA, AU Market
  // ==========================================
  {
    id: "en_pa_debt",
    language: "en",
    category: "personal_attributes",
    policyName: "Personal Attributes & Debt (English)",
    officialRef: "Meta Ad Standards §4.6",
    severity: "critical",
    pattern: /\b(are you in debt|struggling with debt|can't pay your bills|are you broke|drowning in debt|bad credit score|unemployed|lost your job)\b/i,
    flagDescription: "Directly asking user about personal debt or bad credit.",
    metaBotReason: "Meta prohibits ads asserting or implying knowledge of personal financial distress.",
    recommendedFix: "Shift to third-person: 'Discover how modern professionals optimize daily cash flow.'",
  },
  {
    id: "en_pa_weight",
    language: "en",
    category: "personal_attributes",
    policyName: "Body Insecurity & Weight (English)",
    officialRef: "Meta Ad Standards §4.11",
    severity: "critical",
    pattern: /\b(are you fat|tired of being overweight|hate your belly fat|struggling to lose weight|hate looking in the mirror|ashamed of your body)\b/i,
    flagDescription: "Directly targeting body insecurities and weight shame.",
    metaBotReason: "Violates Meta's negative self-perception and mental health safety guidelines.",
    recommendedFix: "Frame positively: 'Support natural vitality and sustainable daily wellness habits.'",
  },
  {
    id: "en_uc_roi",
    language: "en",
    category: "unrealistic_claims",
    policyName: "Unrealistic Income Guarantee (English)",
    officialRef: "Meta Ad Standards §4.14",
    severity: "critical",
    pattern: /\b(make \$?\d+[\d,]* (in \d+ days|overnight|in a week|guaranteed)|guaranteed return|100% risk free income|become a millionaire in|passive income while you sleep)\b/i,
    flagDescription: "Promising specific dollar income in short timeframes.",
    metaBotReason: "Meta automated fraud bot flags specific dollar promises linked to rapid timeframes.",
    recommendedFix: "Focus on systems: 'Learn the foundational e-commerce framework our students use.'",
  },
  {
    id: "en_sh_miracle",
    language: "en",
    category: "sensational_health",
    policyName: "Miracle Health & Fat Burner (English)",
    officialRef: "Meta Ad Standards §4.11",
    severity: "critical",
    pattern: /\b(melt belly fat|burn \d+ lbs in|miracle pill|secret doctor loophole|cure diabetes|cure cancer|reverse aging in \d+ days)\b/i,
    flagDescription: "Sensationalized medical and fast body transformation claims.",
    metaBotReason: "Zero-tolerance trigger for automated ad account suspensions.",
    recommendedFix: "Use botanical wellness language: 'Formulated with organic botanicals to support digestion.'",
  },
  {
    id: "en_du_censorship",
    language: "en",
    category: "deceptive_urgency",
    policyName: "Platform Censorship Clickbait (English)",
    officialRef: "Meta Ad Standards §4.5",
    severity: "high",
    pattern: /\b(facebook doesn't want you to see|before this gets taken down|banned from tv|before it's deleted|secret loophole they hide)\b/i,
    flagDescription: "Claiming Meta/Facebook is censoring the content.",
    metaBotReason: "Meta aggressively blacklists ads accusing the platform of censorship.",
    recommendedFix: "Provide authentic transparency instead of fake censorship hooks.",
  },

  // ==========================================
  // SPANISH (ES) - US Hispanic & Latin America
  // ==========================================
  {
    id: "es_pa_debt",
    language: "es",
    category: "personal_attributes",
    policyName: "Atributos Personales y Deudas (Español)",
    officialRef: "Normas de Meta §4.6",
    severity: "critical",
    pattern: /\b(estás endeudado|tienes muchas deudas|no puedes pagar tus cuentas|estás quebrado|tienes mal crédito|sin dinero|estás sin trabajo)\b/i,
    flagDescription: "Preguntar directamente al usuario sobre deudas o quiebra financiera.",
    metaBotReason: "Meta prohíbe anuncios que afirmen conocer la situación financiera personal del usuario.",
    recommendedFix: "Enfoque en tercera persona: 'Conoce el método que ayuda a profesionales a optimizar su flujo de caja.'",
  },
  {
    id: "es_pa_weight",
    language: "es",
    category: "personal_attributes",
    policyName: "Inseguridad Corporal y Pérdida de Peso (Español)",
    officialRef: "Normas de Meta §4.11",
    severity: "critical",
    pattern: /\b(estás gordo|cansado de tener sobrepeso|elimina tu barriga|odias tu cuerpo|grasa abdominal en \d+ días|avergonzado de tu cuerpo)\b/i,
    flagDescription: "Apelar a la vergüenza corporal o pérdida rápida de grasa.",
    metaBotReason: "Meta bloquea anuncios que promuevan una autopercepción negativa.",
    recommendedFix: "Enfócate en bienestar integral: 'Fórmula botánica para apoyar la vitalidad y energía diaria.'",
  },
  {
    id: "es_uc_roi",
    language: "es",
    category: "unrealistic_claims",
    policyName: "Ganancias Irreales y Garantizadas (Español)",
    officialRef: "Normas de Meta §4.14",
    severity: "critical",
    pattern: /\b(gana \$?\d+[\d,]* (en \d+ días|de la noche a la mañana|garantizado)|dinero garantizado|hazte millonario en|ingresos pasivos mientras duermes|dinero fácil)\b/i,
    flagDescription: "Prometer cifras de dinero específicas en plazos garantizados.",
    metaBotReason: "Filtro automatizado contra esquemas de enriquecimiento rápido.",
    recommendedFix: "Usa lenguaje de negocio: 'Aprende las estrategias probadas para escalar ventas en e-commerce.'",
  },
  {
    id: "es_sh_miracle",
    language: "es",
    category: "sensational_health",
    policyName: "Curación Milagrosa (Español)",
    officialRef: "Normas de Meta §4.11",
    severity: "critical",
    pattern: /\b(quema grasa en \d+ días|píldora milagrosa|el secreto que los doctores ocultan|cura la diabetes|remedio milagroso|antes de que lo borren)\b/i,
    flagDescription: "Afirmaciones médicas exageradas o remedios milagrosos.",
    metaBotReason: "Motivo número 1 de inhabilitación de cuentas en mercados hispanohablantes.",
    recommendedFix: "Promueve nutrientes naturales y hábitos saludables sostenibles.",
  },

  // ==========================================
  // PORTUGUESE (PT) - Brazil & Portugal Market
  // ==========================================
  {
    id: "pt_pa_debt",
    language: "pt",
    category: "personal_attributes",
    policyName: "Atributos Pessoais e Dívidas (Português)",
    officialRef: "Políticas do Meta §4.6",
    severity: "critical",
    pattern: /\b(está endividado|cheio de dívidas|está quebrado|sem dinheiro para pagar contas|nome sujo|score baixo)\b/i,
    flagDescription: "Perguntar diretamente sobre dívidas pessoais ou score negativo.",
    metaBotReason: "Violação direta das políticas de atributos pessoais do Meta.",
    recommendedFix: "Use narrativa em terceira pessoa focada em educação financeira.",
  },
  {
    id: "pt_uc_roi",
    language: "pt",
    category: "unrealistic_claims",
    policyName: "Ganhos Irreais e Fique Rico Rápido (Português)",
    officialRef: "Políticas do Meta §4.14",
    severity: "critical",
    pattern: /\b(ganhe R?\$?\d+[\d,]* (em \d+ dias|da noite para o dia|garantido)|fique rico rápido|renda passiva dormindo|lucro garantido|renda extra garantida)\b/i,
    flagDescription: "Promessas financeiras rápidas e garantidas.",
    metaBotReason: "Gatilho automático de bloqueio do Gerenciador de Negócios (BM).",
    recommendedFix: "Apresente metodologias de gestão e crescimento comercial sustentável.",
  },
  {
    id: "pt_sh_fat",
    language: "pt",
    category: "sensational_health",
    policyName: "Emagrecimento Milagroso (Português)",
    officialRef: "Políticas do Meta §4.11",
    severity: "critical",
    pattern: /\b(seque a barriga em \d+ dias|perca \d+ kg em|pílula milagrosa|segredo que os médicos escondem|queima gordura rápido|antes que seja banido)\b/i,
    flagDescription: "Promessas mirabolantes de perda de peso acelerada.",
    metaBotReason: "Causa suspensão imediata de contas de anúncios em saúde e bem-estar.",
    recommendedFix: "Posicione o produto como suplemento para energia e hábitos diários.",
  },

  // ==========================================
  // GERMAN (DE) - DACH Region (Germany, Austria, Switzerland)
  // ==========================================
  {
    id: "de_pa_debt",
    language: "de",
    category: "personal_attributes",
    policyName: "Persönliche Merkmale & Schulden (Deutsch)",
    officialRef: "Meta Werberichtlinien §4.6",
    severity: "critical",
    pattern: /\b(bist du verschuldet|hast du schulden|bist du pleite|kein geld mehr|schlechte bonität|kannst deine rechnungen nicht bezahlen)\b/i,
    flagDescription: "Direkte Frage nach Schulden oder Zahlungsunfähigkeit.",
    metaBotReason: "Meta verbietet das Andeuten persönlicher finanzieller Notsituationen.",
    recommendedFix: "Nutze Bildungsperspektive: 'Erfahre, wie moderne Unternehmer ihr Cashflow-Management optimieren.'",
  },
  {
    id: "de_sh_weight",
    language: "de",
    category: "sensational_health",
    policyName: "Gewichtsverlust & Wunderpillen (Deutsch)",
    officialRef: "Meta Werberichtlinien §4.11",
    severity: "critical",
    pattern: /\b(bauchfett verbrennen in \d+ tagen|wunderpille|bist du übergewichtig|geheimes ärzte-geheimnis|in \d+ tagen schlank|ärzte hassen diesen trick)\b/i,
    flagDescription: "Unrealistische Gewichtsabnahme- und Wunderversprechen.",
    metaBotReason: "Sofortige Ablehnung durch Metas automatische KI-Prüfung.",
    recommendedFix: "Fokussiere auf ganzheitliche Vitalität und gesunde Routinen.",
  },
  {
    id: "de_uc_roi",
    language: "de",
    category: "unrealistic_claims",
    policyName: "Unrealistische Einkommensversprechen (Deutsch)",
    officialRef: "Meta Werberichtlinien §4.14",
    severity: "critical",
    pattern: /\b(verdiene \d+[\d,]*\s*€\s*(in \d+ tagen|über nacht|garantiert)|garantierter gewinn|passives einkommen im schlaf|werde millionär)\b/i,
    flagDescription: "Garantierte und übertriebene Einkommensversprechen.",
    metaBotReason: "KI-Detektoren von Meta sperren Werbekonten mit schnellen Reichtumsversprechen.",
    recommendedFix: "Beschreibe die Methodik und unternehmerische Weiterbildung.",
  },

  // ==========================================
  // FRENCH (FR) - France, Canada, Belgium
  // ==========================================
  {
    id: "fr_pa_debt",
    language: "fr",
    category: "personal_attributes",
    policyName: "Attributs Personnels et Dettes (Français)",
    officialRef: "Règles Publicitaires Meta §4.6",
    severity: "critical",
    pattern: /\b(êtes-vous endetté|avez-vous des dettes|êtes-vous fauché|difficultés financières|interdit bancaire|sans emploi)\b/i,
    flagDescription: "Interrogation directe sur l'endettement ou la faillite personnelle.",
    metaBotReason: "Meta interdit d'affirmer ou d'insinuer une situation financière difficile.",
    recommendedFix: "Adoptez une approche pédagogique sur la gestion de trésorerie.",
  },
  {
    id: "fr_sh_weight",
    language: "fr",
    category: "sensational_health",
    policyName: "Perte de Poids Miraculeuse (Français)",
    officialRef: "Règles Publicitaires Meta §4.11",
    severity: "critical",
    pattern: /\b(brûlez les graisses en \d+ jours|pilule miracle|secret des médecins|perdez \d+ kg en|êtes-vous en surpoids|graisse abdominale)\b/i,
    flagDescription: "Allégations de perte de poids rapide et termes culpabilisants.",
    metaBotReason: "Rejet automatique par les algorithmes de conformité Meta.",
    recommendedFix: "Mettez en avant le bien-être quotidien et la nutrition naturelle.",
  },
  {
    id: "fr_uc_roi",
    language: "fr",
    category: "unrealistic_claims",
    policyName: "Gains Financiers Irréalistes (Français)",
    officialRef: "Règles Publicitaires Meta §4.14",
    severity: "critical",
    pattern: /\b(gagnez \d+[\d,]*\s*€\s*(en \d+ jours|garanti|du jour au lendemain)|revenu passif en dormant|devenez millionnaire)\b/i,
    flagDescription: "Promesses de gains d'argent rapides et garantis.",
    metaBotReason: "Détection immédiate d'enrichissement facile.",
    recommendedFix: "Privilégiez l'apprentissage de compétences e-commerce.",
  },

  // ==========================================
  // ITALIAN (IT) - Italy
  // ==========================================
  {
    id: "it_pa_debt",
    language: "it",
    category: "personal_attributes",
    policyName: "Attributi Personali e Debiti (Italiano)",
    officialRef: "Standard Pubblicitari Meta §4.6",
    severity: "critical",
    pattern: /\b(sei indebitato|pieno di debiti|sei al verde|non riesci a pagare le bollette|senza soldi)\b/i,
    flagDescription: "Domande dirette sulla situazione debitoria personale.",
    metaBotReason: "Violazione delle norme sulla conoscenza delle condizioni finanziarie personali.",
    recommendedFix: "Usa prospettiva educativa su gestione e finanza aziendale.",
  },
  {
    id: "it_sh_weight",
    language: "it",
    category: "sensational_health",
    policyName: "Dimagrimento Miracoloso (Italiano)",
    officialRef: "Standard Pubblicitari Meta §4.11",
    severity: "critical",
    pattern: /\b(brucia grassi in \d+ giorni|pillola miracolosa|segreto dei medici|perdi \d+ kg|grasso addominale)\b/i,
    flagDescription: "Promesse esagerate di dimagrimento rapido.",
    metaBotReason: "Blocco automatico per promesse sanitarie irrealistiche.",
    recommendedFix: "Promuovi integratori botanici per la vitalità quotidiana.",
  },

  // ==========================================
  // DUTCH (NL) - Netherlands & Belgium
  // ==========================================
  {
    id: "nl_pa_debt",
    language: "nl",
    category: "personal_attributes",
    policyName: "Persoonlijke Kenmerken & Schulden (Nederlands)",
    officialRef: "Meta Advertentierichtlijnen §4.6",
    severity: "critical",
    pattern: /\b(heb je schulden|zit je in de schulden|ben je blut|geen geld meer|moeite met rekeningen)\b/i,
    flagDescription: "Directe vraag over persoonlijke schulden of financiële nood.",
    metaBotReason: "Overtreding van de Meta richtlijnen voor persoonlijke omstandigheden.",
    recommendedFix: "Gebruik een professionele focus op cashflow management.",
  },

  // ==========================================
  // HINDI / HINGLISH (HI) - South Asian Market
  // ==========================================
  {
    id: "hi_pa_money",
    language: "hi",
    category: "unrealistic_claims",
    policyName: "Unrealistic Income & Get Rich (Hindi/Hinglish)",
    officialRef: "Meta Policy §4.14",
    severity: "critical",
    pattern: /\b(kya aap berozgar hain|ghar baithe \d+ hazar kamaye|guaranteed kamai|paise double|100% guarantee paisa|crorepati banne ka tarika|paise kamane ka jadu)\b/i,
    flagDescription: "Unrealistic get-rich-quick claims in Hindi/Hinglish.",
    metaBotReason: "Meta's Indian language NLP models flag overnight earning schemes immediately.",
    recommendedFix: "Focus on skill acquisition: 'Apne digital skills ko upgrade karein aur naye opportunities explore karein.'",
  },
  {
    id: "hi_sh_weight",
    language: "hi",
    category: "sensational_health",
    policyName: "Miracle Weight Loss (Hindi/Hinglish)",
    officialRef: "Meta Policy §4.11",
    severity: "critical",
    pattern: /\b(pet ki charbi \d+ din me gayab|motapa kam karein|chamatkari dawa|doctor ka raaz|vazan ghatao)\b/i,
    flagDescription: "Miracle weight loss claims in Hindi/Hinglish.",
    metaBotReason: "Immediate flag on miracle cure terminology.",
    recommendedFix: "Frame around healthy nutrition and lifestyle habits.",
  },
];

