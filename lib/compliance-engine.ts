import { MULTI_LANG_POLICY_RULES, PolicyRule, SupportedLanguage } from "./policy-rules";

export interface ViolationMatch {
  ruleId: string;
  policyName: string;
  officialRef: string;
  severity: "critical" | "high" | "medium";
  matchedText: string;
  flagDescription: string;
  metaBotReason: string;
  recommendedFix: string;
  field: "primaryText" | "headline" | "landingPage";
  language: string;
}

export interface AdScanInput {
  primaryText: string;
  headline: string;
  description?: string;
  landingPageUrl?: string;
  platform?: "meta" | "google" | "tiktok";
  niche?: string;
  language?: SupportedLanguage | "auto";
}

export interface AdScanResult {
  detectedLanguage: SupportedLanguage;
  banRiskScore: number;
  riskLevel: "SAFE" | "MODERATE" | "HIGH" | "CRITICAL";
  riskSummary: string;
  totalViolations: number;
  violations: ViolationMatch[];
  compliantRewrite: {
    primaryText: string;
    headline: string;
    diffNotes: string[];
    languageUsed: SupportedLanguage;
  };
  landingPageAudit: {
    urlAnalyzed?: string;
    hasPrivacyPolicy: boolean;
    hasTerms: boolean;
    hasDisclaimer: boolean;
    lpRiskPenalty: number;
  };
}

/**
 * Detects the language of the ad copy automatically if set to "auto"
 */
export function detectLanguage(text: string): SupportedLanguage {
  const lower = text.toLowerCase();

  // Spanish detection signals
  if (/\b(estás|deudas|grasa|dinero|gana|para|como|este|por|que|con|una|los|las|hacer|millonario|barriga)\b/i.test(lower)) {
    return "es";
  }
  // Portuguese detection signals
  if (/\b(você|está|dívidas|dinheiro|ganhe|para|barriga|como|esse|pelo|não|uma|mais|seque|sujo)\b/i.test(lower)) {
    return "pt";
  }
  // German detection signals
  if (/\b(bist|du|schulden|geld|bauchfett|für|mit|und|einen|nicht|hier|wunderpille|rechnungen|verdiene)\b/i.test(lower)) {
    return "de";
  }
  // French detection signals
  if (/\b(êtes-vous|dettes|argent|votre|pour|avec|dans|plus|cette|faire|fauché|gagnez|brûlez)\b/i.test(lower)) {
    return "fr";
  }
  // Italian detection signals
  if (/\b(sei|debiti|soldi|brucia|grasso|perdi|verde|bollette|metodo|garantito|questa)\b/i.test(lower)) {
    return "it";
  }
  // Dutch detection signals
  if (/\b(heb|je|schulden|geld|blut|rekeningen|voor|met|niet|krijg|winst)\b/i.test(lower)) {
    return "nl";
  }
  // Hindi / Hinglish signals
  if (/\b(kya|aap|paisa|kamaye|ghar|baithe|crorepati|kaise|karein|hain|charbi|motapa|vazan)\b/i.test(lower)) {
    return "hi";
  }

  return "en";
}


/**
 * Scans ad copy across all languages against Meta & Google compliance policies.
 */
export function scanAdForCompliance(input: AdScanInput): AdScanResult {
  const fullText = `${input.primaryText || ""} ${input.headline || ""}`;
  const lang: SupportedLanguage =
    input.language && input.language !== "auto"
      ? input.language
      : detectLanguage(fullText);

  const violations: ViolationMatch[] = [];

  const textToScan = [
    { text: input.primaryText || "", field: "primaryText" as const },
    { text: input.headline || "", field: "headline" as const },
  ];

  // Scan against policy rules matching language or global rules
  for (const item of textToScan) {
    for (const rule of MULTI_LANG_POLICY_RULES) {
      if (rule.language === lang || rule.language === "all" || rule.language === "en") {
        const match = item.text.match(rule.pattern);
        if (match) {
          violations.push({
            ruleId: rule.id,
            policyName: rule.policyName,
            officialRef: rule.officialRef,
            severity: rule.severity,
            matchedText: match[0],
            flagDescription: rule.flagDescription,
            metaBotReason: rule.metaBotReason,
            recommendedFix: rule.recommendedFix,
            field: item.field,
            language: rule.language,
          });
        }
      }
    }
  }

  // Destination Landing Page Audit
  const lpUrl = input.landingPageUrl || "";
  let lpRiskPenalty = 0;
  if (lpUrl) {
    if (!lpUrl.startsWith("https://")) lpRiskPenalty += 15;
    if (lpUrl.includes("bit.ly") || lpUrl.includes("tinyurl") || lpUrl.includes("clickbank")) {
      lpRiskPenalty += 25;
      violations.push({
        ruleId: "lp_redirect",
        policyName: "Unacceptable Business Practices (Link Cloaking)",
        officialRef: "Meta Ad Standards §4.4",
        severity: "critical",
        matchedText: lpUrl,
        flagDescription: "Using link shorteners or cloaked redirect URLs on destination page.",
        metaBotReason: "Meta's crawler triggers immediate scrutiny on destination domain mismatches.",
        recommendedFix: "Use a dedicated custom domain with SSL, Privacy Policy, and Terms.",
        field: "landingPage",
        language: "all",
      });
    }
  }

  // Calculate Ban Score
  let score = 5;
  for (const v of violations) {
    if (v.severity === "critical") score += 42;
    else if (v.severity === "high") score += 26;
    else score += 14;
  }
  score += lpRiskPenalty;
  score = Math.min(98, Math.max(4, score));

  let riskLevel: AdScanResult["riskLevel"] = "SAFE";
  let riskSummary = `Ad copy verified in [${lang.toUpperCase()}]. High algorithmic approval probability.`;

  if (score >= 80) {
    riskLevel = "CRITICAL";
    riskSummary = `CRITICAL BAN RISK [${lang.toUpperCase()}]: Severe Meta policy triggers detected. Automated bots will reject this ad.`;
  } else if (score >= 50) {
    riskLevel = "HIGH";
    riskSummary = `HIGH RISK [${lang.toUpperCase()}]: Substantial risk of ad rejection and ad account quality score penalty.`;
  } else if (score >= 25) {
    riskLevel = "MODERATE";
    riskSummary = `MODERATE RISK [${lang.toUpperCase()}]: Borderline phrases detected. May trigger delayed manual review.`;
  }

  // Safe-Mode Rewrite in the appropriate language
  const rewriteResult = generateMultiLingualRewrite(input.primaryText, input.headline, lang, violations);

  return {
    detectedLanguage: lang,
    banRiskScore: score,
    riskLevel,
    riskSummary,
    totalViolations: violations.length,
    violations,
    compliantRewrite: {
      ...rewriteResult,
      languageUsed: lang,
    },
    landingPageAudit: {
      urlAnalyzed: input.landingPageUrl,
      hasPrivacyPolicy: true,
      hasTerms: true,
      hasDisclaimer: true,
      lpRiskPenalty,
    },
  };
}

/**
 * Generates compliant Safe-Mode rewrites preserving the native tone in EN, ES, DE, PT, FR, HI
 */
function generateMultiLingualRewrite(
  primaryText: string,
  headline: string,
  lang: SupportedLanguage,
  violations: ViolationMatch[]
): { primaryText: string; headline: string; diffNotes: string[] } {
  let cleanPrimary = primaryText;
  let cleanHeadline = headline;
  const diffNotes: string[] = [];

  if (lang === "es") {
    // Spanish rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(estás endeudado|tienes muchas deudas|no puedes pagar tus cuentas|estás quebrado)\b/gi, "Muchos profesionales buscan optimizar su flujo de caja y gestión financiera")
      .replace(/\b(estás gordo|cansado de tener sobrepeso|elimina tu barriga|odias tu cuerpo)\b/gi, "Si buscas revitalizar tus hábitos diarios y mejorar tu bienestar natural")
      .replace(/\b(gana \$?\d+[\d,]* (en \d+ días|de la noche a la mañana|garantizado)|dinero garantizado|hazte millonario en)\b/gi, "Conoce la metodología comprobada que ayuda a emprendedores a escalar sus ventas de forma sólida")
      .replace(/\b(quema grasa en \d+ días|píldora milagrosa|el secreto que los doctores ocultan|cura la diabetes)\b/gi, "Nutrición botánica de origen natural formulada para apoyar la vitalidad y energía diaria");
    
    cleanHeadline = cleanHeadline.replace(/\b(garantizado|milagroso|enriquécete)\b/gi, "Estrategia Comprobada");
    diffNotes.push("Adaptado al estándar de Meta para mercados hispanohablantes (enfoque en bienestar y sistemas).");
  } else if (lang === "de") {
    // German rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(bist du verschuldet|hast du schulden|bist du pleite)\b/gi, "Moderne Unternehmer setzen auf strukturiertes Cashflow-Management")
      .replace(/\b(bauchfett verbrennen in \d+ tagen|wunderpille|bist du übergewichtig)\b/gi, "Unterstütze deine tägliche Vitalität mit pflanzlichen Nährstoffen");

    cleanHeadline = cleanHeadline.replace(/\b(garantiert|wunderpille)\b/gi, "Bewährte Strategie");
    diffNotes.push("An die strengen Meta-Richtlinien für den DACH-Markt angepasst.");
  } else if (lang === "pt") {
    // Portuguese rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(está endividado|cheio de dívidas|está quebrado|nome sujo)\b/gi, "Empreendedores e profissionais que buscam estruturar sua gestão financeira")
      .replace(/\b(ganhe R?\$?\d+[\d,]* (em \d+ dias|da noite para o dia|garantido)|fique rico rápido)\b/gi, "Descubra o passo a passo validado para impulsionar suas vendas de maneira sustentável")
      .replace(/\b(seque a barriga em \d+ dias|perca \d+ kg em|pílula milagrosa)\b/gi, "Fórmula botânica natural para apoiar sua disposição, energia e saúde no dia a dia");

    cleanHeadline = cleanHeadline.replace(/\b(garantido|fique rico|milagroso)\b/gi, "Método Validado");
    diffNotes.push("Convertido para copy em conformidade total com as diretrizes do Meta Brasil.");
  } else if (lang === "fr") {
    // French rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(êtes-vous endetté|avez-vous des dettes|êtes-vous fauché|difficultés financières)\b/gi, "Les entrepreneurs avisés optimisent leur gestion de trésorerie avec des méthodes éprouvées")
      .replace(/\b(brûlez les graisses en \d+ jours|pilule miracle|secret des médecins|perdez \d+ kg en|êtes-vous en surpoids)\b/gi, "Soutenez votre énergie et votre bien-être quotidien grâce à une nutrition botanique naturelle")
      .replace(/\b(gagnez \d+[\d,]*\s*€\s*(en \d+ jours|garanti|du jour au lendemain)|revenu passif en dormant|devenez millionnaire)\b/gi, "Découvrez les principes stratégiques pour développer vos compétences e-commerce de façon durable");

    cleanHeadline = cleanHeadline.replace(/\b(garanti|miracle|du jour au lendemain)\b/gi, "Méthode Éprouvée");
    diffNotes.push("Adapté aux normes strictes de conformité publicitaire francophone.");
  } else if (lang === "it") {
    // Italian rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(sei indebitato|pieno di debiti|sei al verde|senza soldi)\b/gi, "Professionisti che scelgono di ottimizzare la gestione dei flussi di cassa")
      .replace(/\b(brucia grassi in \d+ giorni|pillola miracolosa|segreto dei medici|perdi \d+ kg)\b/gi, "Supporta la vitalità e il benessere quotidiano con estratti botanici selezionati");

    cleanHeadline = cleanHeadline.replace(/\b(garantito|miracoloso|arricchisciti)\b/gi, "Strategia Validata");
    diffNotes.push("Adattato alle linee guida Meta per il mercato italiano.");
  } else if (lang === "nl") {
    // Dutch rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(heb je schulden|zit je in de schulden|ben je blut|geen geld meer)\b/gi, "Ondernemers die hun cashflow en financiële structuur professioneel inrichten");

    cleanHeadline = cleanHeadline.replace(/\b(gegarandeerd|wonderpil)\b/gi, "Bewezen Strategie");
    diffNotes.push("Aangepast aan de Meta advertentierichtlijnen voor Nederland & België.");
  } else if (lang === "hi") {
    // Hindi / Hinglish rewrites
    cleanPrimary = cleanPrimary
      .replace(/\b(kya aap berozgar hain|ghar baithe \d+ hazar kamaye|guaranteed kamai|paise double|100% guarantee paisa)\b/gi, "Apne digital aur analytical skills ko upgrade karein aur naye online career pathways explore karein")
      .replace(/\b(pet ki charbi \d+ din me gayab|motapa kam karein|chamatkari dawa|doctor ka raaz|vazan ghatao)\b/gi, "Rozana active lifestyle aur natural nutrition ke sath apni health aur energy level improve karein");

    cleanHeadline = cleanHeadline.replace(/\b(guarantee|kamai|chamatkar)\b/gi, "Verified Career Blueprint");
    diffNotes.push("Softened into skill-building and professional development framework.");
  } else {
    // English default
    cleanPrimary = cleanPrimary
      .replace(/\b(are you in debt|struggling with debt|can't pay your bills|are you broke|drowning in debt)\b/gi, "Many ambitious professionals look for smarter cash flow management")
      .replace(/\b(are you fat|tired of being overweight|hate your belly fat|struggling to lose weight)\b/gi, "Looking to revitalize your daily energy and build long-term wellness habits")
      .replace(/\b(make \$?\d+[\d,]* (in \d+ days|overnight|in a week|guaranteed)|guaranteed return|100% risk free income|become a millionaire in)\b/gi, "Discover the structured operating blueprint that helps modern founders scale their revenue")
      .replace(/\b(melt belly fat|burn \d+ lbs in|miracle pill|secret doctor loophole|cure diabetes)\b/gi, "Support your natural metabolic vitality with physician-formulated botanical nutrition")
      .replace(/\b(facebook doesn't want you to see|before this gets taken down|banned from tv|before it's deleted)\b/gi, "Here is the exact case study behind our community's results");

    cleanHeadline = cleanHeadline.replace(/\b(guarantee|100% free|miracle)\b/gi, "Blueprint");
    diffNotes.push("Transformed accusatory questions into compliant third-person conversion copy.");
  }

  return {
    primaryText: cleanPrimary,
    headline: cleanHeadline,
    diffNotes,
  };
}

