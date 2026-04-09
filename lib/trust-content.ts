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
        "Här beskriver vi vilka personuppgifter Vidat behandlar, varför uppgifterna behövs och hur du kan begära tillgång, rättelse eller radering.",
      highlight:
        "Vidat behandlar bara den information som krävs för att leverera tjänsten, skydda konton, ge support och följa tillämpliga rättsliga krav.",
      sections: [
        {
          title: "Vilka uppgifter vi behandlar",
          body: [
            "Vi behandlar kontouppgifter som namn, e-postadress, arbetsyta, roller och autentiseringsrelaterade identifierare.",
            "Vi lagrar produktdata som webbplatsadresser, scanresultat, rapporter, notifieringsinställningar, webhook-mål, supportärenden och loggade händelser i tjänsten.",
            "Vi behandlar också teknisk driftdata, till exempel IP-adresser, sessionsinformation, felspårning och säkerhetsloggar, för att hålla tjänsten stabil och säker.",
          ],
        },
        {
          title: "Varför vi behandlar uppgifterna",
          body: [
            "Kontouppgifter används för inloggning, åtkomstkontroll, arbetsytehantering och support.",
            "Scanresultat och rapportdata används för att leverera övervakning, historik, analys och delbara rapporter.",
            "Drift- och säkerhetsdata används för incidenthantering, missbruksdetektion, felsökning och skydd av tjänsten och våra användare.",
          ],
        },
        {
          title: "Lagring och radering",
          body: [
            "Vi sparar uppgifter så länge de behövs för att leverera tjänsten, uppfylla avtal, följa lagkrav och hantera rimliga backup- och säkerhetsbehov.",
            "När ett konto avslutas raderas eller anonymiseras uppgifter enligt våra interna rutiner, med hänsyn till bokföringskrav, säkerhetsloggar och nödvändig spårbarhet.",
            "Radering omfattar både data i aktiva system och data som omfattas av våra backup- och återställningsprocesser.",
          ],
        },
        {
          title: "Dina rättigheter",
          body: [
            "Du kan begära information om vilka personuppgifter vi behandlar om dig, få felaktiga uppgifter rättade och begära export eller radering där det är möjligt.",
            "Du kan också invända mot viss behandling eller lämna klagomål till relevant tillsynsmyndighet om du anser att behandlingen strider mot gällande regler.",
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
        "This page explains what personal data Vidat processes, why it is needed, and how you can request access, correction, or deletion.",
      highlight:
        "Vidat only processes the information needed to provide the service, protect accounts, deliver support, and comply with applicable legal obligations.",
      sections: [
        {
          title: "What data we process",
          body: [
            "We process account data such as name, email address, workspace membership, roles, and authentication-related identifiers.",
            "We store product data such as website URLs, scan results, reports, notification settings, webhook targets, support requests, and operational events within the service.",
            "We also process technical operations data such as IP addresses, session information, error traces, and security logs to keep the service stable and secure.",
          ],
        },
        {
          title: "Why we process it",
          body: [
            "Account data is used for sign-in, access control, workspace management, and support.",
            "Scan and reporting data is used to deliver monitoring, history, analysis, and shareable reports.",
            "Operational and security data is used for incident handling, abuse detection, troubleshooting, and protection of the service and its users.",
          ],
        },
        {
          title: "Storage and deletion",
          body: [
            "We retain data for as long as needed to provide the service, fulfill contractual commitments, comply with legal obligations, and support reasonable backup and security requirements.",
            "When an account is closed, data is deleted or anonymized according to internal routines, taking into account accounting requirements, security logs, and necessary traceability.",
            "Deletion covers both active systems and data that is part of backup and recovery processes.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You can request information about the personal data we process about you, have inaccurate data corrected, and request export or deletion where applicable.",
            "You may also object to certain processing or lodge a complaint with the relevant supervisory authority if you believe the processing conflicts with applicable rules.",
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
        "De här villkoren beskriver hur Vidat får användas, vad som ingår i tjänsten och vilket ansvar som gäller mellan kund och leverantör.",
      highlight:
        "Genom att använda Vidat accepterar du dessa villkor och ansvarar för att tjänsten används lagligt, ansvarsfullt och inom ramen för er behörighet.",
      sections: [
        {
          title: "Tillåten användning",
          body: [
            "Tjänsten får bara användas för webbplatser och resurser som kunden äger, driver eller uttryckligen har rätt att övervaka.",
            "Kunden ansvarar för att användningen följer tillämpliga lagar, avtal, robots-regler och interna säkerhetskrav.",
          ],
        },
        {
          title: "Planer, avgifter och gränser",
          body: [
            "Vald plan avgör vilka funktioner, användningsgränser, lagringsnivåer och supportnivåer som ingår.",
            "Om gränser överskrids kan funktionalitet begränsas tills planen uppgraderas eller användningen anpassas.",
          ],
        },
        {
          title: "Tillgänglighet och support",
          body: [
            "Vidat drivs med rimliga säkerhets- och driftrutiner för att ge en stabil och tillförlitlig tjänst.",
            "Eventuella särskilda SLA:er, svarstider eller utökade supportåtaganden regleras separat per plan eller avtal.",
          ],
        },
        {
          title: "Uppsägning och avslut",
          body: [
            "När ett konto eller en prenumeration avslutas får kunden möjlighet att exportera relevant data innan ordinarie raderingsrutiner träder i kraft.",
            "Vidat kan tillfälligt begränsa eller stänga av konton som missbrukar tjänsten, kringgår gränser eller skapar risk för infrastrukturen eller andra kunder.",
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
        "These terms describe how Vidat may be used, what is included in the service, and which responsibilities apply between customer and provider.",
      highlight:
        "By using Vidat, you accept these terms and agree to use the service lawfully, responsibly, and within the scope of your authorization.",
      sections: [
        {
          title: "Permitted use",
          body: [
            "The service may only be used for websites and resources the customer owns, operates, or is explicitly authorized to monitor.",
            "The customer is responsible for ensuring use complies with applicable law, contracts, robots rules, and internal security requirements.",
          ],
        },
        {
          title: "Plans, fees, and limits",
          body: [
            "The selected plan determines which features, usage limits, retention levels, and support levels are included.",
            "If limits are exceeded, functionality may be restricted until the plan is upgraded or the usage is adjusted.",
          ],
        },
        {
          title: "Availability and support",
          body: [
            "Vidat is operated with reasonable security and reliability routines to provide a stable and dependable service.",
            "Any specific SLAs, response times, or extended support commitments are governed separately by plan or contract.",
          ],
        },
        {
          title: "Termination and offboarding",
          body: [
            "When an account or subscription ends, the customer is given the opportunity to export relevant data before standard deletion routines take effect.",
            "Vidat may temporarily restrict or suspend accounts that abuse the service, bypass limits, or create risk for the infrastructure or other customers.",
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
        "Den här sidan beskriver hur Vidat använder cookies och liknande tekniker för att webbplatsen och tjänsten ska fungera korrekt.",
      highlight:
        "Vi använder främst cookies för inloggning, säkerhet, språkval och andra funktioner som behövs för att ge en stabil användarupplevelse.",
      sections: [
        {
          title: "Nödvändiga cookies",
          body: [
            "Nödvändiga cookies används för sessionshantering, inloggning, säkerhetskontroller och grundläggande drift av applikationen.",
            "Dessa cookies krävs för att centrala delar av tjänsten ska fungera och kan därför inte stängas av utan att funktionaliteten påverkas.",
          ],
        },
        {
          title: "Preferenser",
          body: [
            "Cookies kan användas för att spara språkval, tema och andra inställningar som gör upplevelsen mer relevant och konsekvent mellan besök.",
            "Om vi inför ytterligare analys- eller preferenscookies uppdateras den här sidan så att användningsområdet framgår tydligt.",
          ],
        },
        {
          title: "Tredjepart",
          body: [
            "Vissa integrerade tjänster, till exempel autentisering eller betalningsflöden, kan sätta egna cookies när de används i anslutning till Vidat.",
            "Sådana tredjepartscookies omfattas även av respektive leverantörs egna villkor och integritetspolicyer.",
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
        "This page explains how Vidat uses cookies and similar technologies to keep the website and service working properly.",
      highlight:
        "We primarily use cookies for sign-in, security, language preferences, and other functions required for a stable user experience.",
      sections: [
        {
          title: "Necessary cookies",
          body: [
            "Necessary cookies are used for session handling, authentication, security checks, and the core operation of the application.",
            "These cookies are required for essential parts of the service to work and cannot be disabled without affecting functionality.",
          ],
        },
        {
          title: "Preferences",
          body: [
            "Cookies may be used to remember language, theme, and other settings that make the experience more relevant and consistent between visits.",
            "If we introduce additional analytics or preference cookies, this page will be updated so their use is clearly described.",
          ],
        },
        {
          title: "Third parties",
          body: [
            "Some integrated services, such as authentication or billing flows, may set their own cookies when used together with Vidat.",
            "Such third-party cookies are also governed by the respective provider's own terms and privacy policies.",
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
      title: "Säkerhet",
      intro:
        "Här beskriver vi hur Vidat arbetar med säkerhet, incidenthantering och rapportering av sårbarheter.",
      highlight:
        "Säkerhet är en del av den löpande driften. Vi arbetar med förebyggande kontroller, tydliga åtkomstrutiner och snabb hantering av avvikelser.",
      sections: [
        {
          title: "Produkt- och driftkontroller",
          body: [
            "Åtkomst till system och data begränsas med autentisering, rollstyrning och principen om minsta möjliga behörighet.",
            "Loggning, säkerhetsövervakning, backup-rutiner och hantering av känsliga hemligheter används för att minska risk och förbättra spårbarhet.",
          ],
        },
        {
          title: "Incidenthantering",
          body: [
            "Vidat hanterar incidenter genom triage, intern eskalering, felsökning och tydlig kommunikation till berörda kunder när det behövs.",
            "Om en incident påverkar tillgänglighet eller kunddata uppdateras statussidan och berörda kunder informeras så snabbt som möjligt.",
          ],
        },
        {
          title: "Vulnerability disclosure",
          body: [
            "Säkerhetsforskare, kunder och partners kan rapportera sårbarheter till security@vidat.app.",
            "Vi uppskattar tydliga reproduktionssteg och ansvarsfull rapportering i god tro så att problem kan verifieras och åtgärdas snabbt.",
          ],
        },
        {
          title: "Praktiskt säkerhetsarbete",
          body: [
            "Vi arbetar löpande med att följa upp datalagring, backup, återställning, loggning och tredjepartsberoenden som påverkar tjänsten.",
            "För företagskunder tillhandahåller vi relevanta kontaktvägar och kompletterande information vid behov i samband med utvärdering eller upphandling.",
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
        "This page explains how Vidat works with security, incident handling, and vulnerability reporting.",
      highlight:
        "Security is part of day-to-day operations. We use preventive controls, clear access routines, and timely handling of incidents and deviations.",
      sections: [
        {
          title: "Product and operational controls",
          body: [
            "Access to systems and data is limited through authentication, role-based access, and the principle of least privilege.",
            "Logging, security monitoring, backup routines, and handling of sensitive secrets are used to reduce risk and improve traceability.",
          ],
        },
        {
          title: "Incident handling",
          body: [
            "Vidat handles incidents through triage, internal escalation, troubleshooting, and clear communication to affected customers when needed.",
            "If an incident affects availability or customer data, the status page is updated and affected customers are informed as quickly as possible.",
          ],
        },
        {
          title: "Vulnerability disclosure",
          body: [
            "Security researchers, customers, and partners can report vulnerabilities to security@vidat.app.",
            "We appreciate clear reproduction steps and responsible good-faith disclosure so issues can be verified and fixed quickly.",
          ],
        },
        {
          title: "Practical security work",
          body: [
            "We continuously review data storage, backup, recovery, logging, and third-party dependencies that affect the service.",
            "For business customers, we provide relevant contact paths and supporting information when needed during evaluation or procurement.",
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
        "Kunder som använder Vidat i sin verksamhet kan begära ett personuppgiftsbiträdesavtal som reglerar behandling av personuppgifter i tjänsten.",
      highlight:
        "Vidat agerar personuppgiftsbiträde i den utsträckning vi behandlar personuppgifter för kundens räkning för att leverera tjänsten.",
      sections: [
        {
          title: "Roller och syfte",
          body: [
            "Kunden är normalt personuppgiftsansvarig för den data som förs in i eller skapas genom användningen av tjänsten.",
            "Vidat agerar personuppgiftsbiträde för den behandling som krävs för att driva, underhålla, säkra och supporta tjänsten enligt kundens instruktioner.",
          ],
        },
        {
          title: "Instruktioner och underbiträden",
          body: [
            "Vidat behandlar personuppgifter enligt dokumenterade instruktioner från kunden och i den omfattning som krävs för att leverera tjänsten.",
            "Eventuella underbiträden som används för drift, autentisering, e-post eller andra stödfunktioner hanteras inom ramen för gällande avtal och processer.",
          ],
        },
        {
          title: "Säkerhet och incidenter",
          body: [
            "Avtalet beskriver de tekniska och organisatoriska säkerhetsåtgärder som används för att skydda personuppgifter i tjänsten.",
            "Om en personuppgiftsincident inträffar informerar Vidat berörda kunder i enlighet med avtal och tillämpliga regler.",
          ],
        },
        {
          title: "Radering och återlämning",
          body: [
            "När avtalet upphör kan kunden begära export eller radering av relevant data enligt överenskomna rutiner och gällande lagkrav.",
            "Uppgifter som måste sparas av rättsliga skäl eller inom definierade backupfönster hanteras enligt dokumenterade raderingsprocesser.",
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
        "Customers using Vidat in their business can request a data processing addendum governing the processing of personal data in the service.",
      highlight:
        "Vidat acts as a processor to the extent that we process personal data on the customer's behalf in order to provide the service.",
      sections: [
        {
          title: "Roles and purpose",
          body: [
            "The customer is normally the controller for data entered into or generated through the use of the service.",
            "Vidat acts as processor for the processing required to operate, maintain, secure, and support the service in accordance with the customer's instructions.",
          ],
        },
        {
          title: "Instructions and subprocessors",
          body: [
            "Vidat processes personal data according to documented customer instructions and only to the extent required to deliver the service.",
            "Any subprocessors used for hosting, authentication, email, or other supporting functions are handled within the framework of applicable agreements and processes.",
          ],
        },
        {
          title: "Security and incidents",
          body: [
            "The agreement describes the technical and organizational security measures used to protect personal data in the service.",
            "If a personal data incident occurs, Vidat informs affected customers in accordance with the agreement and applicable rules.",
          ],
        },
        {
          title: "Deletion and return",
          body: [
            "When the agreement ends, the customer may request export or deletion of relevant data according to agreed routines and applicable legal requirements.",
            "Data that must be retained for legal reasons or within defined backup windows is handled according to documented deletion processes.",
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
        "Den här policyn förklarar vilken användning av Vidat som är tillåten och vilka beteenden som inte accepteras.",
      highlight:
        "Målet är att skydda tjänsten, våra användare och tredje part från missbruk, överbelastning och otillåten användning.",
      sections: [
        {
          title: "Förbjudna beteenden",
          body: [
            "Det är inte tillåtet att använda tjänsten för otillåten scanning, intrångsförsök, överbelastning, spam, bedrägeri eller annan aktivitet som strider mot lag eller avtal.",
            "Det är inte heller tillåtet att kringgå planbegränsningar, manipulera användningsmätning eller använda tjänsten på ett sätt som skadar andra kunder eller infrastrukturen.",
          ],
        },
        {
          title: "Respekt för tredje part",
          body: [
            "Övervakning och scanning ska ske med rimlig frekvens och endast mot resurser som kunden har rätt att testa eller övervaka.",
            "Om externa integrationer används ansvarar kunden för att webhook-mål, notifieringslistor och API-anrop hanteras på ett ansvarsfullt sätt.",
          ],
        },
        {
          title: "Efterlevnad och åtgärder",
          body: [
            "Vidat kan pausa, begränsa eller stänga av konton vid misstänkt missbruk, säkerhetsrisk eller väsentliga avtalsbrott.",
            "Vid behov kan relevanta loggar sparas för felsökning, tvistlösning eller för att uppfylla rättsliga skyldigheter.",
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
        "This policy explains which uses of Vidat are allowed and which behaviors are not accepted.",
      highlight:
        "The goal is to protect the service, our users, and third parties from abuse, overload, and unauthorized use.",
      sections: [
        {
          title: "Prohibited behavior",
          body: [
            "The service may not be used for unauthorized scanning, intrusion attempts, overload activity, spam, fraud, or any conduct that violates law or contract.",
            "It is also prohibited to bypass plan limits, manipulate usage measurement, or use the service in ways that harm other customers or the infrastructure.",
          ],
        },
        {
          title: "Respect for third parties",
          body: [
            "Monitoring and scanning must take place at a reasonable frequency and only against resources the customer is authorized to test or monitor.",
            "If external integrations are used, the customer is responsible for handling webhook targets, notification lists, and API calls responsibly.",
          ],
        },
        {
          title: "Enforcement",
          body: [
            "Vidat may pause, restrict, or suspend accounts in response to suspected abuse, security risk, or material breaches of contract.",
            "When necessary, relevant logs may be retained for troubleshooting, dispute handling, or compliance with legal obligations.",
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
      eyebrow: "Trustcenter",
      title: "Policyer och förtroendesidor",
      intro:
        "Här samlar vi de sidor som kunder, inköpsteam och säkerhetsansvariga oftast vill se när de utvärderar Vidat.",
      highlight:
        "Sidorna nedan ger en samlad bild av hur Vidat arbetar med integritet, villkor, säkerhet, dataskydd och kundkommunikation.",
      sections: [
        {
          title: "Det här hittar du här",
          body: [
            "Här finns integritetspolicy, användarvillkor, cookiepolicy, säkerhetssida, kontaktvägar och offentlig statussida samlade på ett ställe.",
            "För företagskunder finns även information om personuppgiftsbiträdesavtal och vilka principer som gäller för dataskydd och behandling.",
          ],
        },
        {
          title: "Varför de här sidorna finns",
          body: [
            "Tydlig information minskar friktion i utvärdering, upphandling och onboarding och gör det enklare att bedöma tjänsten.",
            "Vi uppdaterar sidorna när produktflöden, arbetssätt eller kontaktvägar förändras så att informationen hålls relevant och användbar.",
          ],
        },
      ],
      ctas: [
        { href: "/privacy", label: "Integritet" },
        { href: "/security", label: "Säkerhet" },
      ],
    },
    en: {
      eyebrow: "Trust center",
      title: "Policies and trust pages",
      intro:
        "This section brings together the pages customers, procurement teams, and security stakeholders usually want to review when evaluating Vidat.",
      highlight:
        "The pages below provide a consolidated view of how Vidat works with privacy, terms, security, data protection, and customer communication.",
      sections: [
        {
          title: "What you will find here",
          body: [
            "This area collects the privacy policy, terms of use, cookie policy, security page, contact paths, and public status page in one place.",
            "For business customers, it also includes information about the data processing addendum and the principles that govern data protection and processing.",
          ],
        },
        {
          title: "Why these pages exist",
          body: [
            "Clear information reduces friction during evaluation, procurement, and onboarding and makes the service easier to assess.",
            "We update these pages when product flows, operational routines, or contact paths change so the information stays relevant and useful.",
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
        "Vilka uppgifter som behandlas, varför de behövs och hur tillgång, export och radering fungerar.",
    },
    {
      href: "/terms",
      title: "Användarvillkor",
      description:
        "Grundregler för användning, planer, ansvar och avslut av konto eller prenumeration.",
    },
    {
      href: "/cookies",
      title: "Cookiepolicy",
      description:
        "Hur cookies används i tjänsten och vilka funktioner de stödjer.",
    },
    {
      href: "/security",
      title: "Säkerhet",
      description:
        "Säkerhetsrutiner, incidenthantering och hur sårbarheter rapporteras.",
    },
    {
      href: "/dpa",
      title: "Personuppgiftsbiträdesavtal",
      description:
        "Roller, instruktioner, underbiträden och radering för företagskunder.",
    },
    {
      href: "/acceptable-use",
      title: "Acceptabel användning",
      description:
        "Regler mot missbruk, aggressiv scanning och annan otillåten användning.",
    },
    {
      href: "/status",
      title: "Status",
      description:
        "Publik driftsida för incidenter, störningar och löpande statuskommunikation.",
    },
    {
      href: "/contact",
      title: "Kontakt",
      description:
        "Support, billing, säkerhet och tydliga kontaktvägar till teamet.",
    },
  ],
  en: [
    {
      href: "/privacy",
      title: "Privacy policy",
      description:
        "What data is processed, why it is needed, and how access, export, and deletion work.",
    },
    {
      href: "/terms",
      title: "Terms of use",
      description:
        "Core rules for use, plans, responsibilities, and account or subscription termination.",
    },
    {
      href: "/cookies",
      title: "Cookie policy",
      description:
        "How cookies are used in the service and which functions they support.",
    },
    {
      href: "/security",
      title: "Security",
      description:
        "Security routines, incident handling, and how vulnerabilities are reported.",
    },
    {
      href: "/dpa",
      title: "Data processing addendum",
      description:
        "Roles, instructions, subprocessors, and deletion terms for business customers.",
    },
    {
      href: "/acceptable-use",
      title: "Acceptable use policy",
      description:
        "Rules against abuse, aggressive scanning, and other unauthorized use.",
    },
    {
      href: "/status",
      title: "Status",
      description:
        "Public operating page for incidents, disruptions, and ongoing status communication.",
    },
    {
      href: "/contact",
      title: "Contact",
      description:
        "Support, billing, security, and clear contact paths into the team.",
    },
  ],
}
