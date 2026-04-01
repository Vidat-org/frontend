export type TrustPageSection = {
  title: string
  body: string[]
}

export type TrustPageCta = {
  href: string
  label: string
}

export type TrustPageContent = {
  eyebrow: string
  title: string
  intro: string
  highlight: string
  sections: TrustPageSection[]
  ctas: TrustPageCta[]
}

export type TrustPageKey =
  | "privacy"
  | "terms"
  | "cookies"
  | "security"
  | "dpa"
  | "acceptable-use"
  | "trust"

type LocalizedTrustContent = Record<"sv" | "en", TrustPageContent>

export const trustPageContent: Record<TrustPageKey, LocalizedTrustContent> = {
  privacy: {
    sv: {
      eyebrow: "Integritet",
      title: "Integritetspolicy",
      intro:
        "Den här sidan förklarar vilken data Vidat behandlar, varför den behövs och hur kunder kan begära insyn, export eller radering.",
      highlight:
        "Inför publik lansering bör policyn granskas juridiskt och uppdateras med korrekt bolagsnamn, adress, personuppgiftsansvarig och laglig grund per behandling.",
      sections: [
        {
          title: "Vilken data vi behandlar",
          body: [
            "Vi behandlar kontouppgifter som namn, e-postadress, workspace-medlemskap, roller och autentiseringsrelaterade identifierare.",
            "Vi lagrar produktdata som webbplatsadresser, scanresultat, rapporter, notifieringsinställningar, webhook-destinationer, supportärenden och audit-händelser.",
            "Vi kan även behandla teknisk driftdata som IP-adresser, loggar, rate-limit-händelser och felspårning för att hålla tjänsten stabil och säker.",
          ],
        },
        {
          title: "Varför vi behandlar datan",
          body: [
            "Kontodata behövs för inloggning, åtkomstkontroll, workspace-hantering och support.",
            "Scanresultat och rapportdata behövs för att leverera övervakning, historik, regressionsdetektering och delbara rapporter.",
            "Drift- och säkerhetsdata används för incidenthantering, missbruksdetektion, felsökning och för att skydda tjänsten och våra kunder.",
          ],
        },
        {
          title: "Lagring, retention och radering",
          body: [
            "Kunddata bör bara sparas så länge det krävs för att leverera tjänsten, uppfylla legala skyldigheter och hantera rimliga backup-fönster.",
            "Inför lansering bör du dokumentera exakta retention-regler för scanhistorik, supportärenden, audit-loggar och avslutade konton.",
            "Radering bör omfatta både primärdata och dokumenterade rutiner för backup-livscykel, export och verifiering av att åtkomst verkligen stängs av.",
          ],
        },
        {
          title: "Kundens rättigheter",
          body: [
            "Kunder ska kunna begära tillgång till sina personuppgifter, rättelse av felaktiga uppgifter, export av relevanta data och radering där lagkrav tillåter det.",
            "Det bör också framgå hur invändningar, begränsningar och klagomål hanteras, särskilt för kunder inom EU/EES.",
          ],
        },
      ],
      ctas: [
        { href: "/contact", label: "Kontakta support" },
        { href: "/dpa", label: "Läs personuppgiftsbiträdesavtal" },
      ],
    },
    en: {
      eyebrow: "Privacy",
      title: "Privacy policy",
      intro:
        "This page explains what data Vidat processes, why it is needed, and how customers can request access, export, or deletion.",
      highlight:
        "Before public launch, this policy should be reviewed by counsel and updated with the correct legal entity, address, controller details, and lawful basis per processing activity.",
      sections: [
        {
          title: "What data we process",
          body: [
            "We process account details such as name, email address, workspace membership, roles, and authentication-related identifiers.",
            "We store product data such as website URLs, scan results, reports, notification settings, webhook destinations, support requests, and audit events.",
            "We may also process technical operations data such as IP addresses, logs, rate-limit events, and error traces to keep the service secure and stable.",
          ],
        },
        {
          title: "Why we process it",
          body: [
            "Account data is required for sign-in, access control, workspace management, and support.",
            "Scan and reporting data is required to deliver monitoring, history, regression detection, and shareable reports.",
            "Operational and security data is used for incident response, abuse detection, troubleshooting, and protecting the service and our customers.",
          ],
        },
        {
          title: "Storage, retention, and deletion",
          body: [
            "Customer data should be retained only as long as required to deliver the service, meet legal obligations, and support reasonable backup windows.",
            "Before launch, document exact retention rules for scan history, support requests, audit logs, and canceled accounts.",
            "Deletion should cover both primary data and documented backup lifecycle, export, and verification that access is fully revoked.",
          ],
        },
        {
          title: "Customer rights",
          body: [
            "Customers should be able to request access to their personal data, correction of inaccurate data, export of relevant records, and deletion where legally permitted.",
            "The policy should also explain how objections, restrictions, and complaints are handled, especially for customers in the EU/EEA.",
          ],
        },
      ],
      ctas: [
        { href: "/contact", label: "Contact support" },
        { href: "/dpa", label: "Read the data processing addendum" },
      ],
    },
  },
  terms: {
    sv: {
      eyebrow: "Juridik",
      title: "Användarvillkor",
      intro:
        "De här villkoren beskriver grundreglerna för hur tjänsten får användas, vad kunder kan förvänta sig och vilka begränsningar som gäller.",
      highlight:
        "Detta är ett produktnära utkast. Inför lansering bör det kompletteras med bolagsuppgifter, jurisdiktion, ansvarstak, uppsägning, återbetalningsvillkor och juridiskt godkänd formulering.",
      sections: [
        {
          title: "Tillåten användning",
          body: [
            "Tjänsten får bara användas för webbplatser och resurser som kunden äger, driver eller uttryckligen har tillstånd att övervaka.",
            "Kunden ansvarar för att användningen följer tillämpliga lagar, avtal, robots-regler och interna säkerhetspolicys.",
          ],
        },
        {
          title: "Planer, avgifter och gränser",
          body: [
            "Betalda planer styr vilka funktioner, användningsgränser, retention-nivåer och supportnivåer som ingår.",
            "Överträdelser av planbegränsningar kan leda till pausad funktionalitet, uppgradering eller manuell kontakt från support/billing.",
          ],
        },
        {
          title: "Tillgänglighet och support",
          body: [
            "Vidat ska drivas med rimliga säkerhets- och driftåtgärder, men ingen SaaS bör lova mer än vad dess operativa processer faktiskt klarar.",
            "Om särskilda SLA:er eller svarstider erbjuds ska de beskrivas separat per plan eller i enterprise-avtal.",
          ],
        },
        {
          title: "Uppsägning och avslut",
          body: [
            "Vid avslut av konto eller prenumeration bör kunden få rimlig tid att exportera relevant data innan retention-regler och raderingsrutiner tar vid.",
            "Vidat ska kunna stänga av konton som missbrukar tjänsten, försöker kringgå gränser eller utsätter infrastrukturen eller andra kunder för risk.",
          ],
        },
      ],
      ctas: [
        {
          href: "/acceptable-use",
          label: "Se policy för acceptabel användning",
        },
        { href: "/contact", label: "Kontakta oss" },
      ],
    },
    en: {
      eyebrow: "Legal",
      title: "Terms of use",
      intro:
        "These terms describe the baseline rules for using the service, what customers can expect, and which limitations apply.",
      highlight:
        "This is a product-oriented draft. Before launch, it should be completed with company details, jurisdiction, liability caps, termination terms, refund rules, and counsel-approved language.",
      sections: [
        {
          title: "Permitted use",
          body: [
            "The service may only be used for websites and resources the customer owns, operates, or is explicitly authorized to monitor.",
            "The customer is responsible for ensuring use complies with applicable law, contracts, robots rules, and internal security policies.",
          ],
        },
        {
          title: "Plans, fees, and limits",
          body: [
            "Paid plans define the included features, usage limits, retention level, and support level.",
            "Exceeding plan limits may lead to paused functionality, upgrade requirements, or manual outreach from support or billing.",
          ],
        },
        {
          title: "Availability and support",
          body: [
            "Vidat should be operated with reasonable security and reliability measures, but no SaaS should promise more than its actual operational processes can support.",
            "If specific SLAs or response times are offered, they should be documented separately by plan or in enterprise agreements.",
          ],
        },
        {
          title: "Termination and offboarding",
          body: [
            "When an account or subscription ends, customers should have a reasonable opportunity to export relevant data before retention and deletion rules apply.",
            "Vidat may suspend accounts that abuse the service, attempt to bypass limits, or expose the infrastructure or other customers to risk.",
          ],
        },
      ],
      ctas: [
        { href: "/acceptable-use", label: "View acceptable use policy" },
        { href: "/contact", label: "Contact us" },
      ],
    },
  },
  cookies: {
    sv: {
      eyebrow: "Cookies",
      title: "Cookiepolicy",
      intro:
        "En cookiepolicy behövs när tjänsten använder cookies eller liknande teknik för inloggning, preferenser, analys eller säkerhet.",
      highlight:
        "Om du använder analys, marknadsföringspixlar eller tredjepartscookies måste samtyckesflöde och cookiebanner spegla det som faktiskt laddas i frontend.",
      sections: [
        {
          title: "Nödvändiga cookies",
          body: [
            "Nödvändiga cookies kan användas för sessionshantering, inloggning, säkerhetskontroller, rate limiting och grundläggande drift av applikationen.",
            "Sådana cookies bör beskrivas tydligt eftersom de normalt inte kräver samma samtycke som icke-nödvändiga cookies i EU-flöden.",
          ],
        },
        {
          title: "Preferenser och analys",
          body: [
            "Om du sparar språkval, tema eller andra preferenser via cookies bör det framgå här.",
            "Om du använder analysverktyg måste du ange leverantör, syfte, datatyper och hur användaren kan neka eller återkalla samtycke.",
          ],
        },
        {
          title: "Tredjepart",
          body: [
            "Autentisering, betalning, support-widgetar och statusverktyg kan sätta egna cookies beroende på vilka tjänster som bäddas in.",
            "Inför lansering bör du inventera exakt vilka tredjepartsskript som finns på marknadswebb, app, checkout och supportytor.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Läs integritetspolicyn" },
        { href: "/contact", label: "Frågor om cookies" },
      ],
    },
    en: {
      eyebrow: "Cookies",
      title: "Cookie policy",
      intro:
        "A cookie policy is needed when the service uses cookies or similar technologies for sign-in, preferences, analytics, or security.",
      highlight:
        "If you use analytics, marketing pixels, or third-party cookies, the consent flow and cookie banner must match what actually loads in the frontend.",
      sections: [
        {
          title: "Necessary cookies",
          body: [
            "Necessary cookies may be used for session handling, authentication, security controls, rate limiting, and the core operation of the app.",
            "These cookies should be clearly documented because they are generally treated differently from non-essential cookies in EU consent flows.",
          ],
        },
        {
          title: "Preferences and analytics",
          body: [
            "If you store language, theme, or other user preferences in cookies, that should be stated here.",
            "If you use analytics tools, specify the provider, purpose, data categories, and how users can refuse or withdraw consent.",
          ],
        },
        {
          title: "Third parties",
          body: [
            "Authentication, billing, support widgets, and status tooling may set their own cookies depending on which services are embedded.",
            "Before launch, inventory exactly which third-party scripts exist across marketing pages, app surfaces, checkout, and support flows.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Read the privacy policy" },
        { href: "/contact", label: "Cookie questions" },
      ],
    },
  },
  security: {
    sv: {
      eyebrow: "Säkerhet",
      title: "Security",
      intro:
        "Den här sidan sammanfattar hur Vidat arbetar med säkerhet, incidenter och ansvarsfull rapportering av sårbarheter.",
      highlight:
        "Större kunder letar efter den här sidan direkt. Den behöver inte vara lång, men den måste vara trovärdig och spegla verkliga rutiner.",
      sections: [
        {
          title: "Produkt- och driftkontroller",
          body: [
            "Åtkomst ska begränsas med autentisering, rollstyrning, minst möjliga behörighet och tydlig separation mellan kunddata och administrativa verktyg.",
            "Loggning, rate limiting, hemlighetshantering, backup-rutiner och övervakning av kritiska integrationsflöden bör vara etablerade innan betalande kunder onboardas.",
          ],
        },
        {
          title: "Incidenthantering",
          body: [
            "Vidat bör ha en dokumenterad rutin för incidenttriage, intern eskalering, kundkommunikation, statusuppdateringar och efteranalys.",
            "Om en incident påverkar kunddata eller tillgänglighet ska statussidan och berörda kunder kunna uppdateras snabbt och konsekvent.",
          ],
        },
        {
          title: "Vulnerability disclosure",
          body: [
            "Säkerhetsforskare och kunder ska få en tydlig väg för att rapportera sårbarheter, helst via en särskild adress som security@vidat.app.",
            "Kommunicera att rapporter tas på allvar, att reproduktionssteg hjälper, och att god tro förväntas vid testning.",
          ],
        },
        {
          title: "Saker du bör dokumentera innan lansering",
          body: [
            "Datalagringsregion, backup-frekvens, nyckelrotation, loggretention, återställningstid och vilka tredjepartsleverantörer som behandlar kunddata.",
            "Om du tänker sälja till bolag med högre krav bör du även förbereda en subprocessor-lista, DPA-process och säkerhetsfrågeformulär.",
          ],
        },
      ],
      ctas: [
        { href: "/status", label: "Se systemstatus" },
        { href: "/contact", label: "Rapportera säkerhetsfråga" },
      ],
    },
    en: {
      eyebrow: "Security",
      title: "Security",
      intro:
        "This page summarizes how Vidat handles security, incidents, and responsible vulnerability reporting.",
      highlight:
        "Larger customers look for this page immediately. It does not need to be long, but it must be credible and reflect real operational practice.",
      sections: [
        {
          title: "Product and operational controls",
          body: [
            "Access should be limited through authentication, role controls, least privilege, and clear separation between customer data and administrative tooling.",
            "Logging, rate limiting, secret handling, backup routines, and monitoring of critical integration flows should be established before onboarding paying customers.",
          ],
        },
        {
          title: "Incident handling",
          body: [
            "Vidat should maintain a documented process for incident triage, internal escalation, customer communication, status updates, and post-incident review.",
            "If an incident affects customer data or availability, the status page and impacted customers should be updated quickly and consistently.",
          ],
        },
        {
          title: "Vulnerability disclosure",
          body: [
            "Security researchers and customers should have a clear way to report vulnerabilities, ideally through a dedicated address such as security@vidat.app.",
            "Communicate that reports are taken seriously, reproduction steps are helpful, and good-faith testing is expected.",
          ],
        },
        {
          title: "What to document before launch",
          body: [
            "Data hosting region, backup frequency, key rotation, log retention, recovery targets, and which third-party vendors process customer data.",
            "If you plan to sell to higher-compliance customers, prepare a subprocessor list, DPA workflow, and security questionnaire responses.",
          ],
        },
      ],
      ctas: [
        { href: "/status", label: "View system status" },
        { href: "/contact", label: "Report a security issue" },
      ],
    },
  },
  dpa: {
    sv: {
      eyebrow: "Dataskydd",
      title: "Personuppgiftsbiträdesavtal",
      intro:
        "Kunder som använder tjänsten för affärsdata behöver ofta ett DPA som beskriver roller, instruktioner och säkerhetsåtgärder kring personuppgiftsbehandling.",
      highlight:
        "Det här är en sammanfattning av vad sidan bör täcka. Ett riktigt DPA ska normalt tas fram eller granskas av jurist innan signering.",
      sections: [
        {
          title: "Roller och syfte",
          body: [
            "Kunden är normalt personuppgiftsansvarig för data som laddas upp eller genereras i tjänsten, medan Vidat agerar personuppgiftsbiträde för den behandling som krävs för att leverera tjänsten.",
            "DPA:t bör beskriva vilka kategorier av registrerade och uppgifter som kan förekomma, även om tjänsten främst behandlar kontodata och driftmetadata.",
          ],
        },
        {
          title: "Instruktioner och underbiträden",
          body: [
            "Avtalet bör slå fast att Vidat bara behandlar personuppgifter enligt dokumenterade instruktioner och för att driva, säkra och supporta tjänsten.",
            "Underbiträden som autentisering, hosting, e-post, billing och övervakning bör listas eller omfattas av en offentlig subprocessor-process.",
          ],
        },
        {
          title: "Säkerhet och incidenter",
          body: [
            "DPA:t bör hänvisa till tekniska och organisatoriska säkerhetsåtgärder samt beskriva hur personuppgiftsincidenter rapporteras till kund.",
            "Svarstider, kontaktvägar och kundens ansvar att lämna korrekt kontaktinformation behöver vara tydliga.",
          ],
        },
        {
          title: "Radering och återlämning",
          body: [
            "När avtalet upphör bör kunden kunna få ut relevant data eller få den raderad enligt avtalade retention-regler och backup-processer.",
            "Det är viktigt att beskriva om viss data måste behållas av legala skäl och hur länge.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Läs integritetspolicyn" },
        { href: "/contact", label: "Begär DPA-process" },
      ],
    },
    en: {
      eyebrow: "Data protection",
      title: "Data processing addendum",
      intro:
        "Customers using the service for business data often require a DPA that describes roles, instructions, and safeguards around personal data processing.",
      highlight:
        "This is a summary of what the page should cover. A real DPA should usually be drafted or reviewed by legal counsel before signature.",
      sections: [
        {
          title: "Roles and purpose",
          body: [
            "The customer is typically the controller for data uploaded to or generated in the service, while Vidat acts as processor for the processing needed to provide the service.",
            "The DPA should describe which categories of data subjects and personal data may be involved, even if the product mainly handles account and operational metadata.",
          ],
        },
        {
          title: "Instructions and subprocessors",
          body: [
            "The agreement should state that Vidat processes personal data only on documented instructions and as required to operate, secure, and support the service.",
            "Subprocessors such as authentication, hosting, email, billing, and observability vendors should be listed or covered by a public subprocessor process.",
          ],
        },
        {
          title: "Security and incidents",
          body: [
            "The DPA should reference technical and organizational security measures and explain how personal data incidents are reported to the customer.",
            "Response expectations, contact paths, and the customer's obligation to provide accurate notice contacts should be clear.",
          ],
        },
        {
          title: "Deletion and return",
          body: [
            "When the agreement ends, the customer should be able to retrieve relevant data or have it deleted according to the agreed retention and backup process.",
            "It is important to explain whether any data must be retained for legal reasons and for how long.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Read the privacy policy" },
        { href: "/contact", label: "Request DPA review" },
      ],
    },
  },
  "acceptable-use": {
    sv: {
      eyebrow: "Användning",
      title: "Policy för acceptabel användning",
      intro:
        "En AUP hjälper dig att tydligt säga nej till missbruk utan att behöva gömma kritiska regler djupt inne i användarvillkoren.",
      highlight:
        "Det här är ofta den enklaste sidan att glömma, men den är praktisk när du behöver stoppa aggressiv scanning, spam eller kontomissbruk snabbt.",
      sections: [
        {
          title: "Förbjudna beteenden",
          body: [
            "Det är inte tillåtet att använda tjänsten för otillåten scanning, intrångsförsök, överbelastning, spam, bedrägeri eller aktiviteter som bryter mot lag eller avtal.",
            "Kunder får inte försöka kringgå planbegränsningar, manipulera usage-mätning eller använda tjänsten på sätt som skadar andra kunder eller infrastrukturen.",
          ],
        },
        {
          title: "Respekt för tredje part",
          body: [
            "Övervakning och scanning ska ske med rimlig frekvens och endast mot resurser som kunden har rätt att testa.",
            "Om externa integrationer används ansvarar kunden för att webhook-mål, notifieringslistor och API-anrop hanteras ansvarsfullt.",
          ],
        },
        {
          title: "Efterlevnad och åtgärder",
          body: [
            "Vidat bör kunna pausa, begränsa eller stänga av konton vid misstänkt missbruk, säkerhetsrisk eller tydliga avtalsbrott.",
            "I allvarliga fall bör tjänsten också kunna bevara relevanta loggar för felsökning, tvist eller rättslig skyldighet.",
          ],
        },
      ],
      ctas: [
        { href: "/terms", label: "Läs användarvillkor" },
        { href: "/contact", label: "Kontakta support" },
      ],
    },
    en: {
      eyebrow: "Usage",
      title: "Acceptable use policy",
      intro:
        "An AUP gives you a clear way to prohibit misuse without hiding critical rules deep inside the terms of service.",
      highlight:
        "This is one of the easiest pages to forget, but it is practical when you need to stop aggressive scanning, spam, or account abuse quickly.",
      sections: [
        {
          title: "Prohibited behavior",
          body: [
            "The service may not be used for unauthorized scanning, intrusion attempts, overload activity, spam, fraud, or conduct that violates law or contract.",
            "Customers may not attempt to bypass plan limits, manipulate usage tracking, or use the service in ways that harm other customers or the infrastructure.",
          ],
        },
        {
          title: "Respect for third parties",
          body: [
            "Monitoring and scanning should be performed at a reasonable frequency and only against resources the customer is authorized to test.",
            "If external integrations are used, the customer is responsible for handling webhook targets, notification lists, and API calls responsibly.",
          ],
        },
        {
          title: "Enforcement",
          body: [
            "Vidat should be able to pause, restrict, or suspend accounts in response to suspected abuse, security risk, or material policy violations.",
            "In serious cases, the service should also be able to preserve relevant logs for troubleshooting, disputes, or legal obligations.",
          ],
        },
      ],
      ctas: [
        { href: "/terms", label: "Read the terms of use" },
        { href: "/contact", label: "Contact support" },
      ],
    },
  },
  trust: {
    sv: {
      eyebrow: "Trust center",
      title: "Policyer och lanseringsunderlag",
      intro:
        "Här samlas de sidor kunder, inköp och säkerhetsteam brukar leta efter när en SaaS går från demo till riktig produkt.",
      highlight:
        "Det viktigaste är inte att ha flest sidor, utan att varje sida speglar hur produkten faktiskt fungerar idag.",
      sections: [
        {
          title: "Grundpaketet du nästan alltid behöver",
          body: [
            "Integritetspolicy, användarvillkor, cookiepolicy, säkerhetssida, kontaktvägar och publik statussida.",
            "Om du säljer till företag behöver du ofta även DPA, subprocessor-lista och tydliga svar om datalagring, retention och incidenthantering.",
          ],
        },
        {
          title: "Bra nästa steg efter att sidorna finns",
          body: [
            "Se till att mailadresser, bolagsuppgifter, retention-regler, support-SLA och incidentrutiner faktiskt finns bakom texten.",
            "Koppla gärna policyerna till produktens riktiga flöden: checkout, account deletion, supportärenden, statussida och säkerhetskontakt.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Integritet" },
        { href: "/security", label: "Security" },
      ],
    },
    en: {
      eyebrow: "Trust center",
      title: "Policies and launch readiness",
      intro:
        "This is the set of pages customers, procurement, and security teams usually look for when a SaaS moves from demo to a real product.",
      highlight:
        "The goal is not to have the most pages. The goal is for each page to accurately reflect how the product actually operates.",
      sections: [
        {
          title: "The baseline package you almost always need",
          body: [
            "Privacy policy, terms of use, cookie policy, security page, contact paths, and a public status page.",
            "If you sell to companies, you will often also need a DPA, subprocessor list, and clear answers on data hosting, retention, and incident handling.",
          ],
        },
        {
          title: "Good next steps after the pages exist",
          body: [
            "Make sure email addresses, company details, retention rules, support SLAs, and incident procedures actually exist behind the copy.",
            "Tie these policies to real product flows where possible: checkout, account deletion, support requests, status communication, and security reporting.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Privacy" },
        { href: "/security", label: "Security" },
      ],
    },
  },
}

export const trustDirectoryLinks = {
  sv: [
    {
      href: "/privacy",
      title: "Integritetspolicy",
      description:
        "Vad ni samlar in, varför ni gör det och hur radering/export ska fungera.",
    },
    {
      href: "/terms",
      title: "Användarvillkor",
      description:
        "Grundregler för användning, planer, gränser och avslut av konto.",
    },
    {
      href: "/cookies",
      title: "Cookiepolicy",
      description:
        "Vilka cookies som används i app, marknadssida och eventuella tredjepartsflöden.",
    },
    {
      href: "/security",
      title: "Security",
      description:
        "Säkerhetsrutiner, incidenthantering och hur sårbarheter rapporteras.",
    },
    {
      href: "/dpa",
      title: "Personuppgiftsbiträdesavtal",
      description:
        "Roller, instruktioner, underbiträden och radering för B2B-kunder.",
    },
    {
      href: "/acceptable-use",
      title: "Acceptabel användning",
      description:
        "Tydlig policy mot missbruk, aggressiv scanning och otillåten användning.",
    },
    {
      href: "/status",
      title: "Status",
      description:
        "Publik driftsida för incidenter, störningar och operativ transparens.",
    },
    {
      href: "/contact",
      title: "Kontakt",
      description:
        "Support, billing, security och tydliga vägar in till teamet.",
    },
  ],
  en: [
    {
      href: "/privacy",
      title: "Privacy policy",
      description:
        "What you collect, why you collect it, and how deletion or export should work.",
    },
    {
      href: "/terms",
      title: "Terms of use",
      description:
        "Baseline rules for use, plans, limits, and customer offboarding.",
    },
    {
      href: "/cookies",
      title: "Cookie policy",
      description:
        "What cookies are used across the app, marketing site, and any third-party flows.",
    },
    {
      href: "/security",
      title: "Security",
      description:
        "Security practices, incident handling, and how vulnerabilities are reported.",
    },
    {
      href: "/dpa",
      title: "Data processing addendum",
      description:
        "Roles, instructions, subprocessors, and deletion terms for B2B buyers.",
    },
    {
      href: "/acceptable-use",
      title: "Acceptable use policy",
      description:
        "A clear policy against abuse, aggressive scanning, and unauthorized use.",
    },
    {
      href: "/status",
      title: "Status",
      description:
        "Public operating status for incidents, disruptions, and transparency.",
    },
    {
      href: "/contact",
      title: "Contact",
      description: "Support, billing, security, and clear paths into the team.",
    },
  ],
}
