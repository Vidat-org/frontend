export type Locale = "sv" | "en"

type Dictionary = Record<string, string>

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    "common.theme.light": "Ljust",
    "common.theme.dark": "Mörkt",
    "common.theme.system": "System",
    "common.somethingWentWrongTryAgain": "Något gick fel. Försök igen.",
    "common.never": "Aldrig",
    "common.loading": "Laddar...",
    "common.loadingLabel": "Laddar",
    "common.close": "Stäng",
    "common.mobile": "Mobil",
    "common.desktop": "Dator",
    "addWebsite.success": "Webbplatsen har lagts till",
    "addWebsite.upgradeRequired":
      "Uppgradera din plan för att lägga till fler webbplatser.",
    "addWebsite.cta": "Lägg till webbplats",
    "addWebsite.title": "Lägg till en webbplats",
    "addWebsite.description":
      "Ange adressen till den webbplats du vill övervaka.",
    "addWebsite.nameLabel": "Namn",
    "addWebsite.namePlaceholder": "Ex. Min personliga hemsida",
    "addWebsite.urlLabel": "Webbadress",
    "addWebsite.urlPlaceholder": "https://exempel.se",
    "addWebsite.intervalLabel": "Intervall",
    "addWebsite.intervalPlaceholder": "Välj intervall",
    "addWebsite.submit": "Lägg till webbplats",
    "newCheck.scanDone": "Scan klar!",
    "newCheck.deviceMobileActive": "Scannar som mobil",
    "newCheck.deviceDesktopActive": "Scannar som dator",
    "newCheck.scanning": "Scannar",
    "newCheck.newScan": "Ny scan",
    "newCheck.mobileHint":
      "Mobil är standard — Google indexerar din sida primärt som mobilanvändare.",
    "newCheck.desktopHint":
      "Desktop-scan mäter prestanda för besökare på större skärmar.",
    "reportCard.reportFrom": "Rapport från:",
    "issues.title": "Hittade problem",
    "issues.countFound": "{count} problem hittade",
    "issues.noneFound": "Inga problem hittades",
    "issues.noneFoundDescription": "Allt ser bra ut för den senaste scannen.",
    "issues.severityCritical": "Kritisk",
    "issues.severityHigh": "Hög",
    "issues.severityMedium": "Medium",
    "issues.severityLow": "Låg",
    "vitals.title": "Core Web Vitals",
    "vitals.whatIsThis": "Vad är detta? ↗",
    "vitals.statusGood": "Bra",
    "vitals.statusNeedsImprovement": "Kan förbättras",
    "vitals.statusPoor": "Dålig",
    "vitals.goodLabel": "Bra:",
    "vitals.poorLabel": "Dålig:",
    "scanChart.performance": "Prestanda",
    "scanChart.accessibility": "Tillgänglighet",
    "scanChart.bestPractices": "Best practices",
    "scanChart.noScansYet": "Inga scannar än",
    "dashboardWrapper.performanceOverTime": "Prestanda över tid",
    "websiteCard.scoreGood": "Bra",
    "websiteCard.scoreNeedsWork": "Kan förbättras",
    "websiteCard.scorePoor": "Dålig",
    "websiteCard.pausedByPlan": "Pausad av plan",
    "websiteCard.lastCheckedEvery": "{date} · var {hours}:e timme",
    "settingsNav.overview": "Översikt",
    "settingsNav.billing": "Billing",
    "settingsNav.notifications": "Notifieringar",
    "settingsNav.team": "Team",
    "settingsNav.integrations": "Integrationer",
    "settingsNav.api": "API",
    "settingsNav.support": "Support",
    "settingsNav.logs": "Loggar",
    "sidebar.mySites": "Mina sajter",
    "sidebar.reports": "Rapporter",
    "sidebar.settings": "Inställningar",
    "sidebar.billing": "Billing",
    "sidebar.team": "Team",
    "sidebar.integrations": "Integrationer",
    "sidebar.api": "API",
    "sidebar.support": "Support",
    "sidebar.logs": "Loggar",
    "sidebar.product": "Produkt",
    "sidebar.settingsSection": "Inställningar",
    "settingsLayout.eyebrow": "Inställningar",
    "settingsLayout.title": "Workspace-inställningar",
    "settingsPage.billingTitle": "Billing",
    "settingsPage.billingDescription": "Planer, dunning och betalningsstatus.",
    "settingsPage.notificationsTitle": "Notifieringar",
    "settingsPage.notificationsDescription": "E-post, Slack och larmregler.",
    "settingsPage.teamTitle": "Team",
    "settingsPage.teamDescription": "Medlemmar, roller och inbjudningar.",
    "settingsPage.integrationsTitle": "Integrationer",
    "settingsPage.integrationsDescription":
      "Webhook-destinationer och externa flöden.",
    "settingsPage.apiTitle": "API",
    "settingsPage.apiDescription": "API-nycklar för integrationer.",
    "settingsPage.supportTitle": "Support",
    "settingsPage.supportDescription": "Supportärenden och kundresa.",
    "settingsPage.logsTitle": "Loggar",
    "settingsPage.logsDescription": "Audit-logg och leveranshistorik.",
    "docs.eyebrow": "Dokumentation",
    "docs.title": "Vidat docs",
    "docs.intro":
      "Produkten har redan ett fungerande SaaS-skelett. Det som återstår är främst de kommersiella och operativa delarna som krävs för att tjänsten ska kännas komplett för betalande team.",
    "docs.currentTitle": "Finns redan idag",
    "docs.roadmapTitle": "Nästa steg mot komplett SaaS",
    "docs.capability1":
      "Dashboard med översikt över sajter, scannar, rapporter och planutnyttjande.",
    "docs.capability2":
      "Planmodeller och entitlements för free, starter, pro och enterprise.",
    "docs.capability3":
      "Konto- och notifieringsinställningar med webhook-destinationer per användare.",
    "docs.capability4":
      "Juridiska sidor och grund för billing-portal via miljövariabler.",
    "docs.roadmap1":
      "Checkout och prenumerationsflöden med riktig betallösning, dunning och kvitton.",
    "docs.roadmap2":
      "Organisationer, teamroller, inbjudningar och separata workspaces.",
    "docs.roadmap3":
      "Onboarding med aktiveringsteg, exempeldata och en tydlig första aha-upplevelse.",
    "docs.roadmap4":
      "Robust notifieringsleverans via e-post, Slack och webhooks med retry och loggning.",
    "docs.roadmap5":
      "Trust layer med audit-loggar, retention-kontroller, rate limiting och incidentberedskap.",
    "docs.toHome": "Till startsidan",
    "docs.toSettings": "Till inställningar",
    "contact.eyebrow": "Support",
    "contact.title": "Kontakt",
    "contact.intro":
      "Den här sidan samlar supportvägar och statuslänkar som en SaaS behöver inför lansering.",
    "contact.support": "Allmän support: support@vidat.app",
    "contact.billing": "Billingfrågor: billing@vidat.app",
    "contact.security": "Security och incidenter: security@vidat.app",
    "contact.status": "Statussida: /status",
    "contact.sla":
      "Svarstider bör definieras per plan innan tjänsten lanseras publikt.",
    "privacy.eyebrow": "Integritet",
    "privacy.title": "Integritetspolicy",
    "privacy.intro":
      "Vidat behandlar kontodata, webbplatsmetadata och scanresultat för att leverera övervakning och rapportering.",
    "privacy.item1":
      "Vi lagrar användaridentifierare, planstatus och skapade resurser.",
    "privacy.item2":
      "Scanresultat, rapporter och issues sparas för att visa historik i produkten.",
    "privacy.item3":
      "Personuppgifter begränsas till vad som krävs för autentisering, betalning, support och drift.",
    "privacy.item4":
      "För att radera konto- eller supportdata krävs en administrativ raderingsrutin på backend.",
    "terms.eyebrow": "Juridik",
    "terms.title": "Användarvillkor",
    "terms.intro":
      "De här villkoren är en produktgrund och behöver kompletteras med juridiskt godkända formuleringar inför offentlig lansering.",
    "terms.item1":
      "Tjänsten tillhandahålls i befintligt skick och får användas för att övervaka egna eller godkända webbplatser.",
    "terms.item2":
      "Betalda planer styr tillgängliga funktioner, gränser och supportnivå.",
    "terms.item3":
      "Missbruk, otillåten scanning eller försök att kringgå kontogränser kan leda till avstängning.",
    "terms.item4":
      "Kunddata ska exporteras eller raderas enligt dokumenterad retention när en prenumeration avslutas.",
    "status.eyebrow": "Status",
    "status.title": "Systemstatus",
    "status.intro":
      "Publik statussida för kunder som vill följa driftläge, historik och incidenter.",
    "status.systemScanning": "Scanning",
    "status.systemReports": "Rapporter",
    "status.systemBilling": "Billing",
    "status.systemNotifications": "Notifieringar",
    "status.operational": "Driftsatt",
    "status.detailScanning":
      "Schemalagda och manuella scannar fungerar normalt.",
    "status.detailReports": "Rapportgenerering och visning fungerar normalt.",
    "status.detailBilling":
      "Planhantering och billing-status fungerar normalt.",
    "status.detailNotifications":
      "Webhook-, Slack- och e-postflöden fungerar normalt.",
    "reportsPage.noReports": "Inga rapporter",
    "reportsPage.reportEvery14Days": "Rapporter genereras var 14:e dag",
    "websitePage.backToOverview": "Tillbaka till översikten",
    "websitePage.seoScore": "SEO-poäng",
    "websitePage.performance": "Prestanda",
    "websitePage.latestScan": "Senaste scan",
    "websitePage.nextScan": "Nästa scan",
    "dashboard.activeSites": "Aktiva sajter",
    "dashboard.savedTotal": "{count} sparade totalt",
    "dashboard.scans": "Scannar",
    "dashboard.historicalRuns": "Historiska körningar",
    "dashboard.reports": "Rapporter",
    "dashboard.generatedReports": "Genererade rapporter",
    "dashboard.plan": "Plan",
    "dashboard.workspace": "Workspace",
    "dashboard.pendingInvites": "{count} väntande inbjudningar",
    "dashboard.onboarding": "Onboarding",
    "dashboard.firstValueSteps": "Första värde-stegen",
    "dashboard.trustLayer": "Trust layer",
    "dashboard.latestDeliveries": "{count} senaste leveranser",
    "dashboard.overviewTitle": "Översikt",
    "dashboard.overviewDescription":
      "Status, planutnyttjande och vad som behöver åtgärdas.",
    "dashboard.planUsage": "Planutnyttjande",
    "dashboard.operationalWarnings": "Driftvarningar",
    "dashboard.lastScanFailed": "Senaste scan misslyckades",
    "dashboard.pausedByPlanLimit": "Pausad på grund av plangräns",
    "dashboard.noCriticalWarnings": "Inga akuta driftvarningar.",
    "dashboard.needsImprovement": "Behöver förbättras",
    "dashboard.noSitesBelowTarget": "Inga sajter under målgränsen.",
    "dashboard.latestActivity": "Senaste aktivitet",
    "dashboard.latestActivityDescription":
      "Rapporter, scannar och notifieringar nära i tid.",
    "dashboard.scanFailed": "Scan misslyckades",
    "dashboard.newReportAvailable": "Ny rapport tillgänglig",
    "dashboard.onboardingAndTeam": "Onboarding och team",
    "dashboard.role": "roll",
    "dashboard.firstWebsiteAdded": "Första webbplatsen tillagd",
    "dashboard.firstScanRun": "Första scan körd",
    "dashboard.reportRead": "Rapport läst",
    "dashboard.alertsConfigured": "Alerts konfigurerade",
    "dashboard.integrationConnected": "Integration ansluten",
    "dashboard.openSettingsToManageWorkspace":
      "Öppna inställningar för att hantera workspace",
    "dashboard.operationsLog": "Driftlogg",
    "dashboard.operationsLogDescription":
      "Audit-loggar och senaste leveranshistorik.",
    "dashboard.yourWebsites": "Dina webbplatser",
    "dashboard.billingConnected": "Billing ansluten",
    "dashboard.billingRequiresEnv": "Billing kräver miljövariabler",
    "dashboard.noWebsitesYet": "Inga webbplatser än",
    "dashboard.addFirstWebsiteDescription":
      "Lägg till din första webbplats för att starta övervakning, notifieringar och rapporter.",
    "dashboard.done": "Klar",
    "dashboard.missing": "Saknas",
    "dashboard.unknownTime": "okänd tid",
    "settingsCenter.settingsSaved": "Inställningarna sparades",
    "settingsCenter.saveSettingsFailed": "Kunde inte spara inställningarna",
    "settingsCenter.webhookAdded": "Webhook tillagd",
    "settingsCenter.webhookDeleted": "Webhook borttagen",
    "settingsCenter.inviteCreated": "Inbjudan skickad",
    "settingsCenter.inviteRevoked": "Inbjudan återkallad",
    "settingsCenter.workspaceSwitched": "Bytte workspace",
    "settingsCenter.inviteAccepted": "Inbjudan accepterad",
    "settingsCenter.inviteDeclined": "Inbjudan avböjd",
    "settingsCenter.memberRoleUpdated": "Medlemsroll uppdaterad",
    "settingsCenter.memberRemoved": "Medlem borttagen",
    "settingsCenter.billingUpdated": "Billing uppdaterad",
    "settingsCenter.apiKeyCreated": "API-nyckel skapad",
    "settingsCenter.apiKeyRevoked": "API-nyckel återkallad",
    "settingsCenter.supportRequestCreated": "Supportärende skapat",
    "settingsCenter.loading": "Laddar inställningar...",
    "settingsCenter.accountEyebrow": "SaaS-konto",
    "settingsCenter.title": "Inställningar",
    "settingsCenter.subtitle":
      "Workspace, billing, notifieringar och drifthistorik.",
    "settingsCenter.activeMembers": "Aktiva medlemmar",
    "settingsCenter.stepsDone": "Steg klara",
    "settingsCenter.failedCount": "{count} misslyckade",
    "settingsCenter.billingTitle": "Billing och prenumeration",
    "settingsCenter.billingDescription":
      "Hantera plan, dunning-status och självbetjäningslänkar.",
    "settingsCenter.provider": "Leverantör",
    "settingsCenter.monthlyAmount": "Belopp per månad (SEK)",
    "settingsCenter.plan": "Plan",
    "settingsCenter.stats.workspace": "Workspace",
    "settingsCenter.stats.onboarding": "Onboarding",
    "settingsCenter.stats.billing": "Billing",
    "settingsCenter.billingStatus": "Status",
    "settingsCenter.dunningStatus": "Dunning",
    "settingsCenter.portalUrl": "Portal-URL",
    "settingsCenter.checkoutUrl": "Checkout-URL",
    "settingsCenter.openBillingPortal": "Öppna billing-portalen",
    "settingsCenter.noBillingPortalConfigured":
      "Ingen billing-portal konfigurerad.",
    "settingsCenter.saveBilling": "Spara billing",
    "settingsCenter.onboardingTitle": "Onboarding",
    "settingsCenter.onboardingDescription":
      "Följ upp första värde-stegen för workspacet.",
    "settingsCenter.onboarding.firstWebsiteAdded": "Första webbplatsen tillagd",
    "settingsCenter.onboarding.firstScanRun": "Första scan körd",
    "settingsCenter.onboarding.reportOpened": "Rapport öppnad",
    "settingsCenter.onboarding.alertsConfigured": "Alerts konfigurerade",
    "settingsCenter.onboarding.integrationConnected": "Integration ansluten",
    "settingsCenter.restApiHint":
      "Autentisera med `Authorization: Bearer <api_key>` eller `x-api-key`.",
    "settingsCenter.notificationsDescription":
      "Styr vilka händelser som skickas och till vilka kanaler.",
    "settingsCenter.notifications.emailLabel": "E-postnotifieringar",
    "settingsCenter.notifications.emailDescription":
      "Skicka kritiska drift- och regressionsnotiser via e-post.",
    "settingsCenter.notifications.scanFailureLabel": "Scan failure-larm",
    "settingsCenter.notifications.scanFailureDescription":
      "Notis när en scan misslyckas eller tar timeout.",
    "settingsCenter.notifications.scoreDropLabel": "Score drop-larm",
    "settingsCenter.notifications.scoreDropDescription":
      "Notis när poängen faller under din valda tröskel.",
    "settingsCenter.notifications.scoreDropThreshold": "Tröskel för poängfall",
    "settingsCenter.team.title": "Team och inbjudningar",
    "settingsCenter.team.description":
      "Lägg till admins och medlemmar i samma workspace.",
    "settingsCenter.team.yourWorkspaces": "Dina workspaces",
    "settingsCenter.team.active": "Aktiv",
    "settingsCenter.team.switchWorkspace": "Byt workspace",
    "settingsCenter.team.pendingInvites": "Väntande inbjudningar",
    "settingsCenter.team.validUntil": "giltig till",
    "settingsCenter.team.accept": "Acceptera",
    "settingsCenter.team.makeMember": "Gör till medlem",
    "settingsCenter.team.makeAdmin": "Gör till admin",
    "settingsCenter.team.email": "E-post",
    "settingsCenter.team.emailPlaceholder": "teammedlem@foretag.se",
    "settingsCenter.team.role": "Roll",
    "settingsCenter.integrations.title": "Webhook-destinationer",
    "settingsCenter.integrations.description":
      "Skicka händelser till externa system med historik i driftloggen.",
    "settingsCenter.integrations.name": "Namn",
    "settingsCenter.integrations.namePlaceholder": "Ops-webhook",
    "settingsCenter.integrations.url": "URL",
    "settingsCenter.integrations.events": "Händelser",
    "settingsCenter.integrations.addWebhook": "Lägg till webhook",
    "settingsCenter.integrations.active": "Aktiv",
    "settingsCenter.integrations.paused": "Pausad",
    "settingsCenter.integrations.pause": "Pausa",
    "settingsCenter.integrations.activate": "Aktivera",
    "settingsCenter.apiKeys.title": "API-nycklar",
    "settingsCenter.apiKeys.description":
      "Skapa och återkalla nycklar för integrationer och API-anrop.",
    "settingsCenter.apiKeys.shownOnce": "Nyckeln visas bara en gång",
    "settingsCenter.apiKeys.labelPlaceholder": "Production-integration",
    "settingsCenter.apiKeys.create": "Skapa nyckel",
    "settingsCenter.apiKeys.empty": "Inga API-nycklar än.",
    "settingsCenter.apiKeys.revoked": "återkallad",
    "settingsCenter.apiKeys.active": "aktiv",
    "settingsCenter.apiKeys.revoke": "Återkalla",
    "settingsCenter.support.title": "Supportärenden",
    "settingsCenter.support.description":
      "Skapa ärenden för support, billing, security eller kundframgång.",
    "settingsCenter.support.subjectPlaceholder": "Ämne",
    "settingsCenter.support.messagePlaceholder":
      "Beskriv problemet eller önskemålet",
    "settingsCenter.support.create": "Skapa supportärende",
    "settingsCenter.support.empty": "Inga supportärenden än.",
    "settingsCenter.logs.auditTitle": "Audit-logg",
    "settingsCenter.logs.auditDescription":
      "Senaste administrativa och operativa händelserna.",
    "settingsCenter.logs.deliveryTitle": "Leveranslogg",
    "settingsCenter.logs.deliveryDescription":
      "Historik över notifieringar och integrationsleveranser.",
    "settingsCenter.logs.loadMore": "Ladda fler",
    "settingsCenter.logs.loadingMore": "Laddar fler...",
    "sidebar.toggle": "Växla sidopanel",
    "vitals.speedIndex": "Speed Index",
    "home.brand": "Vidat",
    "home.tagline": "Prestandaövervakning för team",
    "home.nav.features": "Funktioner",
    "home.nav.completeSaas": "Komplett SaaS",
    "home.nav.pricing": "Priser",
    "home.nav.docs": "Docs",
    "home.nav.saasShort": "SaaS",
    "home.actions.signIn": "Logga in",
    "home.actions.startFree": "Kom igång gratis",
    "home.actions.createAccount": "Skapa konto",
    "home.actions.viewSaasSettings": "Se SaaS-inställningar",
    "home.hero.pill": "Fånga regressioner innan kunden gör det",
    "home.hero.title": "Gör prestanda till en produkt, inte en eftertanke.",
    "home.hero.description":
      "Vidat hjälper team att övervaka Lighthouse, förstå förändringar över tid och agera direkt när en release försämrar upplevelsen. Tjänsten har redan kärnan i en modern SaaS, men ett par avgörande lager saknas för att den ska vara kommersiellt komplett.",
    "home.metrics.m1":
      "Övervakning av sajter, rapporter och score-förändringar.",
    "home.metrics.m2": "Planer från gratisnivå till enterprise.",
    "home.metrics.m3":
      "Dashboard, rapporter, webhooks och kontokontroller — på ett ställe.",
    "home.demo.eyebrow": "Live-översikt",
    "home.demo.title": "Deploy-hälsa",
    "home.demo.pill": "Pro-workspace",
    "home.demo.alertTitle": "Regression upptäckt",
    "home.demo.alertDescription":
      "LCP har försämrats med 380 ms efter senaste deploy på mobil. Analytics-bundeln har vuxit markant.",
    "home.demo.alertPill": "Alert",
    "home.demo.aiEyebrow": "AI-rekommendation",
    "home.demo.aiDescription":
      "Flytta tredjepartsskript från den kritiska renderingsvägen, fördröj tag manager på mobil och gå igenom senaste deploy för nya bildblock ovanför folden.",
    "home.demo.integrationsLabel": "Integrationer",
    "home.demo.integrationsValue": "Slack, webhooks, e-post",
    "home.demo.billingLabel": "Billingstatus",
    "home.demo.billingValue": "Portal och upgrade-flöden redo",
    "home.productPillars.performance.title": "Prestanda utan manuellt arbete",
    "home.productPillars.performance.description":
      "Schemalagda Lighthouse-körningar, historik och regressionsspårning för varje webbplats.",
    "home.productPillars.insights.title": "Insikter som går att agera på",
    "home.productPillars.insights.description":
      "AI-förklaringar, prioriterade förbättringsförslag och rapporter som kan delas internt eller med kund.",
    "home.productPillars.ops.title": "Byggd för operativ drift",
    "home.productPillars.ops.description":
      "Webhook-flöden, notifieringar, billing-stöd och tydliga plangränser finns redan i produkten.",
    "home.sections.features.eyebrow": "Funktioner",
    "home.sections.features.title":
      "En landningssida ska sälja ett arbetsflöde, inte bara features.",
    "home.sections.features.description":
      "Det här upplägget tydliggör vad produkten faktiskt löser: övervakning, rapportering och driftkoppling i ett och samma verktyg.",
    "home.features.monitoring.eyebrow": "Övervakning",
    "home.features.monitoring.title":
      "Behandla varje deploy som affärskritisk.",
    "home.features.monitoring.description":
      "Vidat fångar förändringar i Core Web Vitals, SEO och teknisk kvalitet innan användarna märker att något gått fel.",
    "home.features.monitoring.bullet1":
      "Dagliga, veckovisa eller deploy-triggade scannar",
    "home.features.monitoring.bullet2":
      "Mobil- och desktop-perspektiv i samma arbetsflöde",
    "home.features.monitoring.bullet3":
      "Historik som gör regressionsmönster uppenbara",
    "home.features.reporting.eyebrow": "Rapportering",
    "home.features.reporting.title":
      "Gör siffror begripliga för team och kund.",
    "home.features.reporting.description":
      "Rapporterna fokuserar på vad som förändrats, varför det spelar roll och vad som bör göras härnäst.",
    "home.features.reporting.bullet1": "AI-summeringar på svenska",
    "home.features.reporting.bullet2":
      "Tydliga prioriteringar i stället för rådata",
    "home.features.reporting.bullet3":
      "White-label-redo för byråer och konsultteam",
    "home.features.automation.eyebrow": "Automatisering",
    "home.features.automation.title":
      "Koppla ihop produkten med resten av din drift.",
    "home.features.automation.description":
      "Notiser och händelser kan vidarebefordras till Slack, interna verktyg eller externa system via webhooks.",
    "home.features.automation.bullet1":
      "Scan failure-larm och score drop-varningar",
    "home.features.automation.bullet2": "Webhook-destinationer per konto",
    "home.features.automation.bullet3":
      "Billing- och planstyrning för SaaS-upplägg",
    "home.sections.completeSaas.eyebrow": "Komplett SaaS",
    "home.sections.completeSaas.title":
      "Det här bör du lägga till för att tjänsten ska kännas färdig på riktigt.",
    "home.sections.completeSaas.description":
      "Produkten har en stark kärna, men en kommersiell SaaS behöver även de delar som användaren bara märker när de saknas.",
    "home.completeSaas.billing.title": "Riktiga betalflöden",
    "home.completeSaas.billing.description":
      "Checkout, prenumerationsändringar, kvitton, dunning och självbetjäning i billing-portalen måste fungera utan manuell hantering.",
    "home.completeSaas.orgs.title": "Organisationer och roller",
    "home.completeSaas.orgs.description":
      "Teamkonton, inbjudningar, ägare/admin/medlem-roller och separata workspaces är det som ofta skiljer en bra produkt från en riktig SaaS.",
    "home.completeSaas.onboarding.title": "Onboarding som konverterar",
    "home.completeSaas.onboarding.description":
      "Guidad första upplevelse, exempeldata, checklista och tydlig aktivering efter signup minskar churn direkt.",
    "home.completeSaas.trust.title": "Trust och compliance",
    "home.completeSaas.trust.description":
      "Audit-loggar, datalagring, incidentprocess, backups, rate limiting och säker webhook-hantering ska vara tydligt definierade.",
    "home.completeSaas.support.title": "Support och kundresa",
    "home.completeSaas.support.description":
      "Inbyggd hjälp, statuskommunikation, SLA-nivåer, kontaktvägar och success-flöden för större kunder bör vara produktiserade.",
    "home.completeSaas.gtm.title": "Go-to-market inbyggt i produkten",
    "home.completeSaas.gtm.description":
      "Referral-spårning, trial-regler, usage limits, upgrade-tillfällen och expansionstriggers behöver vara medvetet designade.",
    "home.sections.trust.eyebrow": "Trust layer",
    "home.sections.trust.title":
      "Många SaaS-produkter förlorar affären just här.",
    "home.sections.trust.description":
      "Security, support och transparens bör synas redan på startsidan om du vill att större kunder ska ta produkten på allvar.",
    "home.trust.cards.ops.title": "Säker drift",
    "home.trust.cards.ops.description":
      "Webhook-secrets, rollback-rutiner, felhantering och kontrollerad datalagring.",
    "home.trust.cards.policies.title": "Tydliga policies",
    "home.trust.cards.policies.description":
      "Privacy, terms, betalflöden och planregler som går att förstå innan köp.",
    "home.trust.cards.comms.title": "Aktiv kommunikation",
    "home.trust.cards.comms.description":
      "Status, supportvägar och notiser som gör att kunden känner sig trygg efter signup.",
    "home.sections.pricing.eyebrow": "Priser",
    "home.sections.pricing.title":
      "Prisstrukturen finns redan. Nu säljer den också bättre.",
    "home.sections.pricing.description":
      "Planerna nedan speglar entitlements i kodbasen och ger tydligare upgrade-logik.",
    "home.pricing.recommended": "Rekommenderad",
    "home.pricing.free.name": "Free",
    "home.pricing.free.description": "För solo-test och din första webbplats.",
    "home.pricing.free.feature1": "1 aktiv webbplats",
    "home.pricing.free.feature2": "Manuella scannar",
    "home.pricing.free.feature3": "7 dagars historik",
    "home.pricing.free.feature4": "Grundläggande rapporter",
    "home.pricing.starter.name": "Starter",
    "home.pricing.starter.description":
      "För mindre team som vill börja automatisera.",
    "home.pricing.starter.feature1": "5 aktiva webbplatser",
    "home.pricing.starter.feature2": "Schemalagda scannar",
    "home.pricing.starter.feature3": "90 dagars historik",
    "home.pricing.starter.feature4": "E-postnotifieringar",
    "home.pricing.pro.name": "Pro",
    "home.pricing.pro.description":
      "För team som deployar ofta och vill hålla koll på regressioner.",
    "home.pricing.pro.feature1": "25 aktiva webbplatser",
    "home.pricing.pro.feature2": "Mobil och desktop",
    "home.pricing.pro.feature3": "Webhook- och Slack-stöd",
    "home.pricing.pro.feature4": "Regressionsdetektering",
    "home.pricing.enterprise.name": "Enterprise",
    "home.pricing.enterprise.description":
      "För byråer, större produktteam och fler intressenter.",
    "home.pricing.enterprise.feature1": "Näst intill obegränsade webbplatser",
    "home.pricing.enterprise.feature2": "Lång historik",
    "home.pricing.enterprise.feature3": "Team och white-label",
    "home.pricing.enterprise.feature4": "Prioriterad support",
    "home.sections.faq.eyebrow": "Vanliga frågor",
    "home.sections.faq.title":
      "Korta svar på det viktigaste du behöver ta ställning till nu.",
    "home.faq.q1.question": "Vad finns redan på plats i produkten?",
    "home.faq.q1.answer":
      "Dashboard, rapporter, planstyrning, inställningar, webhooks, notifieringsinställningar och grunden för billing finns redan i kodbasen.",
    "home.faq.q2.question": "Vad bör jag prioritera härnäst?",
    "home.faq.q2.answer":
      "1) riktiga betalflöden, 2) organisationskonton, 3) onboarding och aktivering, 4) robust notifieringsleverans och 5) audit och compliance.",
    "home.faq.q3.question": "Är produkten byggd för byråer eller interna team?",
    "home.faq.q3.answer":
      "Båda. White-label, teamfunktioner, flera workspaces och kundvänliga rapporter gör den extra stark för byråspåret.",
    "home.nextSteps.eyebrow": "Nästa steg",
    "home.nextSteps.title":
      "Vill du kan jag ta nästa steg och bygga de saknade SaaS-delarna också.",
    "home.nextSteps.description":
      "En rimlig ordning i den här kodbasen är billing checkout, team och roller, onboarding-flöde samt verklig notifieringsleverans.",
    "home.nextSteps.actions.openSettings": "Öppna inställningar",
    "home.nextSteps.actions.contactUs": "Kontakta oss",
    "home.footer.tagline":
      "Byggd för team som vill fånga prestandaproblem tidigt.",
    "home.footer.links.privacy": "Privacy",
    "home.footer.links.terms": "Terms",
    "home.footer.links.docs": "Docs",
    "home.footer.links.contact": "Kontakt",
    "sidebar.mobile.title": "Sidopanel",
    "sidebar.mobile.description": "Visar den mobila sidopanelen.",
    "settingsApi.restApiTitle": "REST API",
    "settingsApi.authPrefix": "Autentisera med",
    "settingsApi.authOr": "eller",
  },
  en: {
    "common.theme.light": "Light",
    "common.theme.dark": "Dark",
    "common.theme.system": "System",
    "common.somethingWentWrongTryAgain":
      "Something went wrong. Please try again.",
    "common.never": "Never",
    "common.loading": "Loading...",
    "common.loadingLabel": "Loading",
    "common.close": "Close",
    "common.mobile": "Mobile",
    "common.desktop": "Desktop",
    "addWebsite.success": "Website added",
    "addWebsite.upgradeRequired": "Upgrade your plan to add more websites.",
    "addWebsite.cta": "Add website",
    "addWebsite.title": "Add a website",
    "addWebsite.description":
      "Enter the URL of the website you want to monitor.",
    "addWebsite.nameLabel": "Name",
    "addWebsite.namePlaceholder": "Ex. My personal website",
    "addWebsite.urlLabel": "Website URL",
    "addWebsite.urlPlaceholder": "https://example.com",
    "addWebsite.intervalLabel": "Interval",
    "addWebsite.intervalPlaceholder": "Select interval",
    "addWebsite.submit": "Add website",
    "newCheck.scanDone": "Scan complete!",
    "newCheck.deviceMobileActive": "Scanning as mobile",
    "newCheck.deviceDesktopActive": "Scanning as desktop",
    "newCheck.scanning": "Scanning",
    "newCheck.newScan": "New scan",
    "newCheck.mobileHint":
      "Mobile is the default — Google primarily indexes your site as a mobile user.",
    "newCheck.desktopHint":
      "Desktop scanning measures performance for visitors on larger screens.",
    "reportCard.reportFrom": "Report from:",
    "issues.title": "Detected issues",
    "issues.countFound": "{count} issues found",
    "issues.noneFound": "No issues found",
    "issues.noneFoundDescription": "Everything looks good for the latest scan.",
    "issues.severityCritical": "Critical",
    "issues.severityHigh": "High",
    "issues.severityMedium": "Medium",
    "issues.severityLow": "Low",
    "vitals.title": "Core Web Vitals",
    "vitals.whatIsThis": "What is this? ↗",
    "vitals.statusGood": "Good",
    "vitals.statusNeedsImprovement": "Needs improvement",
    "vitals.statusPoor": "Poor",
    "vitals.goodLabel": "Good:",
    "vitals.poorLabel": "Poor:",
    "scanChart.performance": "Performance",
    "scanChart.accessibility": "Accessibility",
    "scanChart.bestPractices": "Best practices",
    "scanChart.noScansYet": "No scans yet",
    "dashboardWrapper.performanceOverTime": "Performance over time",
    "websiteCard.scoreGood": "Good",
    "websiteCard.scoreNeedsWork": "Needs improvement",
    "websiteCard.scorePoor": "Poor",
    "websiteCard.pausedByPlan": "Paused by plan",
    "websiteCard.lastCheckedEvery": "{date} · every {hours} hours",
    "settingsNav.overview": "Overview",
    "settingsNav.billing": "Billing",
    "settingsNav.notifications": "Notifications",
    "settingsNav.team": "Team",
    "settingsNav.integrations": "Integrations",
    "settingsNav.api": "API",
    "settingsNav.support": "Support",
    "settingsNav.logs": "Logs",
    "sidebar.mySites": "My sites",
    "sidebar.reports": "Reports",
    "sidebar.settings": "Settings",
    "sidebar.billing": "Billing",
    "sidebar.team": "Team",
    "sidebar.integrations": "Integrations",
    "sidebar.api": "API",
    "sidebar.support": "Support",
    "sidebar.logs": "Logs",
    "sidebar.product": "Product",
    "sidebar.settingsSection": "Settings",
    "settingsLayout.eyebrow": "Settings",
    "settingsLayout.title": "Workspace settings",
    "settingsPage.billingTitle": "Billing",
    "settingsPage.billingDescription": "Plans, dunning, and payment status.",
    "settingsPage.notificationsTitle": "Notifications",
    "settingsPage.notificationsDescription": "Email, Slack, and alert rules.",
    "settingsPage.teamTitle": "Team",
    "settingsPage.teamDescription": "Members, roles, and invites.",
    "settingsPage.integrationsTitle": "Integrations",
    "settingsPage.integrationsDescription":
      "Webhook destinations and external flows.",
    "settingsPage.apiTitle": "API",
    "settingsPage.apiDescription": "API keys for integrations.",
    "settingsPage.supportTitle": "Support",
    "settingsPage.supportDescription": "Support cases and customer journey.",
    "settingsPage.logsTitle": "Logs",
    "settingsPage.logsDescription": "Audit logs and delivery history.",
    "docs.eyebrow": "Documentation",
    "docs.title": "Vidat docs",
    "docs.intro":
      "The product already has a working SaaS skeleton. What remains are mostly the commercial and operational layers needed to make it feel complete for paying teams.",
    "docs.currentTitle": "Already available today",
    "docs.roadmapTitle": "Next steps toward a complete SaaS",
    "docs.capability1":
      "Dashboard with an overview of sites, scans, reports, and plan usage.",
    "docs.capability2":
      "Plan models and entitlements for free, starter, pro, and enterprise.",
    "docs.capability3":
      "Account and notification settings with webhook destinations per user.",
    "docs.capability4":
      "Legal pages and billing portal foundation via environment variables.",
    "docs.roadmap1":
      "Checkout and subscription flows with a real payment provider, dunning, and receipts.",
    "docs.roadmap2":
      "Organizations, team roles, invites, and separate workspaces.",
    "docs.roadmap3":
      "Onboarding with activation steps, sample data, and a clear first aha moment.",
    "docs.roadmap4":
      "Robust notification delivery via email, Slack, and webhooks with retries and logging.",
    "docs.roadmap5":
      "Trust layer with audit logs, retention controls, rate limiting, and incident readiness.",
    "docs.toHome": "Back to home",
    "docs.toSettings": "Go to settings",
    "contact.eyebrow": "Support",
    "contact.title": "Contact",
    "contact.intro":
      "This page lists support channels and status links a SaaS needs before launch.",
    "contact.support": "General support: support@vidat.app",
    "contact.billing": "Billing: billing@vidat.app",
    "contact.security": "Security and incidents: security@vidat.app",
    "contact.status": "Status page: /status",
    "contact.sla":
      "Response times should be defined per plan before public launch.",
    "privacy.eyebrow": "Privacy",
    "privacy.title": "Privacy policy",
    "privacy.intro":
      "Vidat processes account data, website metadata, and scan results to deliver monitoring and reporting.",
    "privacy.item1":
      "We store user identifiers, plan status, and created resources.",
    "privacy.item2":
      "Scan results, reports, and issues are stored to provide history in the product.",
    "privacy.item3":
      "Personal data is limited to what is required for authentication, billing, support, and operations.",
    "privacy.item4":
      "To delete account or support data, an administrative deletion routine must be connected on the backend.",
    "terms.eyebrow": "Legal",
    "terms.title": "Terms of use",
    "terms.intro":
      "These terms are a product baseline and must be completed with legally approved language before public launch.",
    "terms.item1":
      "The service is provided as-is and may be used to monitor owned or approved websites.",
    "terms.item2":
      "Paid plans govern available features, limits, and support levels.",
    "terms.item3":
      "Abuse, unauthorized scanning, or attempts to bypass account limits may result in suspension.",
    "terms.item4":
      "Customer data should be exported or deleted according to documented retention when a subscription ends.",
    "status.eyebrow": "Status",
    "status.title": "System status",
    "status.intro":
      "Public status page for customers who want to follow operating status, history, and incidents.",
    "status.systemScanning": "Scanning",
    "status.systemReports": "Reports",
    "status.systemBilling": "Billing",
    "status.systemNotifications": "Notifications",
    "status.operational": "Operational",
    "status.detailScanning":
      "Scheduled and manual scanning is operating normally.",
    "status.detailReports":
      "Report generation and viewing are operating normally.",
    "status.detailBilling":
      "Plan management and billing state are operating normally.",
    "status.detailNotifications":
      "Webhook, Slack, and email flows are available.",
    "reportsPage.noReports": "No reports",
    "reportsPage.reportEvery14Days": "Reports are generated every 14 days",
    "websitePage.backToOverview": "Back to overview",
    "websitePage.seoScore": "SEO score",
    "websitePage.performance": "Performance",
    "websitePage.latestScan": "Latest scan",
    "websitePage.nextScan": "Next scan",
    "dashboard.activeSites": "Active sites",
    "dashboard.savedTotal": "{count} saved total",
    "dashboard.scans": "Scans",
    "dashboard.historicalRuns": "Historical runs",
    "dashboard.reports": "Reports",
    "dashboard.generatedReports": "Generated reports",
    "dashboard.plan": "Plan",
    "dashboard.workspace": "Workspace",
    "dashboard.pendingInvites": "{count} pending invites",
    "dashboard.onboarding": "Onboarding",
    "dashboard.firstValueSteps": "First value steps",
    "dashboard.trustLayer": "Trust layer",
    "dashboard.latestDeliveries": "{count} latest deliveries",
    "dashboard.overviewTitle": "Overview",
    "dashboard.overviewDescription":
      "Status, plan usage, and what needs attention.",
    "dashboard.planUsage": "Plan usage",
    "dashboard.operationalWarnings": "Operational warnings",
    "dashboard.lastScanFailed": "Latest scan failed",
    "dashboard.pausedByPlanLimit": "Paused due to plan limit",
    "dashboard.noCriticalWarnings": "No critical warnings.",
    "dashboard.needsImprovement": "Needs improvement",
    "dashboard.noSitesBelowTarget": "No sites below the target threshold.",
    "dashboard.latestActivity": "Latest activity",
    "dashboard.latestActivityDescription":
      "Reports, scans, and notifications close in time.",
    "dashboard.scanFailed": "Scan failed",
    "dashboard.newReportAvailable": "New report available",
    "dashboard.onboardingAndTeam": "Onboarding and team",
    "dashboard.role": "role",
    "dashboard.firstWebsiteAdded": "First website added",
    "dashboard.firstScanRun": "First scan run",
    "dashboard.reportRead": "Report read",
    "dashboard.alertsConfigured": "Alerts configured",
    "dashboard.integrationConnected": "Integration connected",
    "dashboard.openSettingsToManageWorkspace":
      "Open settings to manage your workspace",
    "dashboard.operationsLog": "Operations log",
    "dashboard.operationsLogDescription":
      "Audit logs and latest delivery history.",
    "dashboard.yourWebsites": "Your websites",
    "dashboard.billingConnected": "Billing connected",
    "dashboard.billingRequiresEnv": "Billing requires env vars",
    "dashboard.noWebsitesYet": "No websites yet",
    "dashboard.addFirstWebsiteDescription":
      "Add your first website to start monitoring, notifications, and reports.",
    "dashboard.done": "Done",
    "dashboard.missing": "Missing",
    "dashboard.unknownTime": "unknown time",
    "settingsCenter.settingsSaved": "Settings saved",
    "settingsCenter.saveSettingsFailed": "Could not save settings",
    "settingsCenter.webhookAdded": "Webhook added",
    "settingsCenter.webhookDeleted": "Webhook removed",
    "settingsCenter.inviteCreated": "Invite sent",
    "settingsCenter.inviteRevoked": "Invite revoked",
    "settingsCenter.workspaceSwitched": "Workspace switched",
    "settingsCenter.inviteAccepted": "Invite accepted",
    "settingsCenter.inviteDeclined": "Invite declined",
    "settingsCenter.memberRoleUpdated": "Member role updated",
    "settingsCenter.memberRemoved": "Member removed",
    "settingsCenter.billingUpdated": "Billing updated",
    "settingsCenter.apiKeyCreated": "API key created",
    "settingsCenter.apiKeyRevoked": "API key revoked",
    "settingsCenter.supportRequestCreated": "Support request created",
    "settingsCenter.loading": "Loading settings...",
    "settingsCenter.accountEyebrow": "SaaS account",
    "settingsCenter.title": "Settings",
    "settingsCenter.subtitle":
      "Workspace, billing, notifications, and operational history.",
    "settingsCenter.activeMembers": "Active members",
    "settingsCenter.stepsDone": "Steps completed",
    "settingsCenter.failedCount": "{count} failed",
    "settingsCenter.billingTitle": "Billing and subscription",
    "settingsCenter.billingDescription":
      "Manage plan, dunning status, and self-service links.",
    "settingsCenter.provider": "Provider",
    "settingsCenter.monthlyAmount": "Amount per month (SEK)",
    "settingsCenter.plan": "Plan",
    "settingsCenter.stats.workspace": "Workspace",
    "settingsCenter.stats.onboarding": "Onboarding",
    "settingsCenter.stats.billing": "Billing",
    "settingsCenter.billingStatus": "Status",
    "settingsCenter.dunningStatus": "Dunning",
    "settingsCenter.portalUrl": "Portal URL",
    "settingsCenter.checkoutUrl": "Checkout URL",
    "settingsCenter.openBillingPortal": "Open billing portal",
    "settingsCenter.noBillingPortalConfigured": "No billing portal configured.",
    "settingsCenter.saveBilling": "Save billing",
    "settingsCenter.onboardingTitle": "Onboarding",
    "settingsCenter.onboardingDescription":
      "Track first-value steps for the workspace.",
    "settingsCenter.onboarding.firstWebsiteAdded": "First website added",
    "settingsCenter.onboarding.firstScanRun": "First scan run",
    "settingsCenter.onboarding.reportOpened": "Report opened",
    "settingsCenter.onboarding.alertsConfigured": "Alerts configured",
    "settingsCenter.onboarding.integrationConnected": "Integration connected",
    "settingsCenter.restApiHint":
      "Authenticate using `Authorization: Bearer <api_key>` or `x-api-key`.",
    "settingsCenter.notificationsDescription":
      "Control which events are sent and to which channels.",
    "settingsCenter.notifications.emailLabel": "Email notifications",
    "settingsCenter.notifications.emailDescription":
      "Send critical operational and regression notifications via email.",
    "settingsCenter.notifications.scanFailureLabel": "Scan failure alerts",
    "settingsCenter.notifications.scanFailureDescription":
      "Alert when a scan fails or times out.",
    "settingsCenter.notifications.scoreDropLabel": "Score drop alerts",
    "settingsCenter.notifications.scoreDropDescription":
      "Alert when the score drops below your set threshold.",
    "settingsCenter.notifications.scoreDropThreshold": "Score drop threshold",
    "settingsCenter.team.title": "Team and invites",
    "settingsCenter.team.description":
      "Add admins and members to the same workspace.",
    "settingsCenter.team.yourWorkspaces": "Your workspaces",
    "settingsCenter.team.active": "Active",
    "settingsCenter.team.switchWorkspace": "Switch workspace",
    "settingsCenter.team.pendingInvites": "Pending invites",
    "settingsCenter.team.validUntil": "valid until",
    "settingsCenter.team.accept": "Accept",
    "settingsCenter.team.makeMember": "Make member",
    "settingsCenter.team.makeAdmin": "Make admin",
    "settingsCenter.team.email": "Email",
    "settingsCenter.team.emailPlaceholder": "teammate@company.com",
    "settingsCenter.team.role": "Role",
    "settingsCenter.integrations.title": "Webhook destinations",
    "settingsCenter.integrations.description":
      "Send events to external systems with history in the operations log.",
    "settingsCenter.integrations.name": "Name",
    "settingsCenter.integrations.namePlaceholder": "Ops webhook",
    "settingsCenter.integrations.url": "URL",
    "settingsCenter.integrations.events": "Events",
    "settingsCenter.integrations.addWebhook": "Add webhook",
    "settingsCenter.integrations.active": "Active",
    "settingsCenter.integrations.paused": "Paused",
    "settingsCenter.integrations.pause": "Pause",
    "settingsCenter.integrations.activate": "Activate",
    "settingsCenter.apiKeys.title": "API keys",
    "settingsCenter.apiKeys.description":
      "Create and revoke keys for integrations and API calls.",
    "settingsCenter.apiKeys.shownOnce": "This key is only shown once",
    "settingsCenter.apiKeys.labelPlaceholder": "Production integration",
    "settingsCenter.apiKeys.create": "Create key",
    "settingsCenter.apiKeys.empty": "No API keys yet.",
    "settingsCenter.apiKeys.revoked": "revoked",
    "settingsCenter.apiKeys.active": "active",
    "settingsCenter.apiKeys.revoke": "Revoke",
    "settingsCenter.support.title": "Support requests",
    "settingsCenter.support.description":
      "Create requests for support, billing, security, or customer success.",
    "settingsCenter.support.subjectPlaceholder": "Subject",
    "settingsCenter.support.messagePlaceholder":
      "Describe the issue or request",
    "settingsCenter.support.create": "Create support request",
    "settingsCenter.support.empty": "No support requests yet.",
    "settingsCenter.logs.auditTitle": "Audit log",
    "settingsCenter.logs.auditDescription":
      "Latest administrative and operational events.",
    "settingsCenter.logs.deliveryTitle": "Delivery log",
    "settingsCenter.logs.deliveryDescription":
      "History of notifications and integration deliveries.",
    "settingsCenter.logs.loadMore": "Load more",
    "settingsCenter.logs.loadingMore": "Loading more...",
    "sidebar.toggle": "Toggle sidebar",
    "vitals.speedIndex": "Speed Index",
    "home.brand": "Vidat",
    "home.tagline": "Performance monitoring for teams",
    "home.nav.features": "Features",
    "home.nav.completeSaas": "Complete SaaS",
    "home.nav.pricing": "Pricing",
    "home.nav.docs": "Docs",
    "home.nav.saasShort": "SaaS",
    "home.actions.signIn": "Sign in",
    "home.actions.startFree": "Get started free",
    "home.actions.createAccount": "Create account",
    "home.actions.viewSaasSettings": "View SaaS settings",
    "home.hero.pill": "Catch regressions before your customers do",
    "home.hero.title": "Make performance a product, not an afterthought.",
    "home.hero.description":
      "Vidat helps teams monitor Lighthouse, understand changes over time, and act fast when a release degrades the experience. The core of a modern SaaS is already in place — a few critical layers remain before it's commercially complete.",
    "home.metrics.m1": "Monitor sites, reports, and score changes.",
    "home.metrics.m2": "Plans from free tier to enterprise.",
    "home.metrics.m3":
      "Dashboard, reports, webhooks, and account controls — in one place.",
    "home.demo.eyebrow": "Live overview",
    "home.demo.title": "Deploy health",
    "home.demo.pill": "Pro workspace",
    "home.demo.alertTitle": "Regression detected",
    "home.demo.alertDescription":
      "LCP degraded by 380ms after the latest mobile deploy. The analytics bundle grew significantly.",
    "home.demo.alertPill": "Alert",
    "home.demo.aiEyebrow": "AI recommendation",
    "home.demo.aiDescription":
      "Move third-party scripts off the critical render path, delay tag manager on mobile, and review the latest deploy for new above-the-fold image blocks.",
    "home.demo.integrationsLabel": "Integrations",
    "home.demo.integrationsValue": "Slack, webhooks, email",
    "home.demo.billingLabel": "Billing status",
    "home.demo.billingValue": "Portal and upgrade paths ready",
    "home.productPillars.performance.title": "Performance without manual work",
    "home.productPillars.performance.description":
      "Scheduled Lighthouse runs, history, and regression tracking for every website.",
    "home.productPillars.insights.title": "Actionable insights",
    "home.productPillars.insights.description":
      "AI explanations, prioritized recommendations, and reports you can share with your team or customers.",
    "home.productPillars.ops.title": "Built for operations",
    "home.productPillars.ops.description":
      "Webhook flows, notifications, billing support, and clear plan limits already in the product.",
    "home.sections.features.eyebrow": "Features",
    "home.sections.features.title":
      "A landing page should sell a workflow, not just features.",
    "home.sections.features.description":
      "This layout makes it clearer what the product actually solves: monitoring, reporting, and operations in one tool.",
    "home.features.monitoring.eyebrow": "Monitoring",
    "home.features.monitoring.title":
      "Treat every deploy as business-critical.",
    "home.features.monitoring.description":
      "Vidat catches changes in Core Web Vitals, SEO, and technical quality before your users notice something broke.",
    "home.features.monitoring.bullet1":
      "Daily, weekly, or deploy-triggered scans",
    "home.features.monitoring.bullet2":
      "Mobile and desktop perspectives in one workflow",
    "home.features.monitoring.bullet3":
      "History that makes regression patterns obvious",
    "home.features.reporting.eyebrow": "Reporting",
    "home.features.reporting.title":
      "Make numbers understandable for teams and customers.",
    "home.features.reporting.description":
      "Reports focus on what changed, why it matters, and what to do next.",
    "home.features.reporting.bullet1": "AI summaries",
    "home.features.reporting.bullet2": "Clear priorities instead of raw data",
    "home.features.reporting.bullet3":
      "White-label ready for agencies and consulting teams",
    "home.features.automation.eyebrow": "Automation",
    "home.features.automation.title":
      "Connect the product to the rest of your stack.",
    "home.features.automation.description":
      "Notifications and events can be forwarded to Slack, internal tools, or external systems via webhooks.",
    "home.features.automation.bullet1":
      "Scan failure alerts and score drop warnings",
    "home.features.automation.bullet2": "Webhook destinations per account",
    "home.features.automation.bullet3":
      "Billing and plan controls for SaaS setups",
    "home.sections.completeSaas.eyebrow": "Complete SaaS",
    "home.sections.completeSaas.title":
      "What you should add to make the service truly complete.",
    "home.sections.completeSaas.description":
      "The product has a strong core, but a commercial SaaS also needs the parts users only notice when they're missing.",
    "home.completeSaas.billing.title": "Real billing flows",
    "home.completeSaas.billing.description":
      "Checkout, subscription changes, receipts, dunning, and self-service must work without manual handling.",
    "home.completeSaas.orgs.title": "Organizations and roles",
    "home.completeSaas.orgs.description":
      "Team accounts, invites, owner/admin/member roles, and separate workspaces often separate a good product from a real SaaS.",
    "home.completeSaas.onboarding.title": "Onboarding that converts",
    "home.completeSaas.onboarding.description":
      "A guided first experience, sample data, checklists, and clear activation after signup reduce churn immediately.",
    "home.completeSaas.trust.title": "Trust and compliance",
    "home.completeSaas.trust.description":
      "Audit logs, data retention, incident process, backups, rate limiting, and secure webhook handling should be clearly defined.",
    "home.completeSaas.support.title": "Support and customer journey",
    "home.completeSaas.support.description":
      "In-product help, status communication, SLA levels, contact paths, and success flows for larger customers should be productized.",
    "home.completeSaas.gtm.title": "Go-to-market built into the product",
    "home.completeSaas.gtm.description":
      "Referral tracking, trial rules, usage limits, upgrade moments, and expansion triggers should be intentionally designed.",
    "home.sections.trust.eyebrow": "Trust layer",
    "home.sections.trust.title": "Many SaaS products lose the deal right here.",
    "home.sections.trust.description":
      "Security, support, and transparency should show up on the homepage if you want larger customers to take the product seriously.",
    "home.trust.cards.ops.title": "Reliable operations",
    "home.trust.cards.ops.description":
      "Webhook secrets, rollback routines, error handling, and controlled data retention.",
    "home.trust.cards.policies.title": "Clear policies",
    "home.trust.cards.policies.description":
      "Privacy, terms, billing flows, and plan rules you can understand before purchase.",
    "home.trust.cards.comms.title": "Active communication",
    "home.trust.cards.comms.description":
      "Status, support channels, and notifications that keep customers confident after signup.",
    "home.sections.pricing.eyebrow": "Pricing",
    "home.sections.pricing.title":
      "The price structure already exists. Now it sells better too.",
    "home.sections.pricing.description":
      "The plans below reflect the entitlement logic in the codebase and provide clearer upgrade paths.",
    "home.pricing.recommended": "Recommended",
    "home.pricing.free.name": "Free",
    "home.pricing.free.description": "For solo testing and your first website.",
    "home.pricing.free.feature1": "1 active website",
    "home.pricing.free.feature2": "Manual scans",
    "home.pricing.free.feature3": "7-day history",
    "home.pricing.free.feature4": "Basic reports",
    "home.pricing.starter.name": "Starter",
    "home.pricing.starter.description":
      "For small teams ready to start automating.",
    "home.pricing.starter.feature1": "5 active websites",
    "home.pricing.starter.feature2": "Scheduled scans",
    "home.pricing.starter.feature3": "90-day history",
    "home.pricing.starter.feature4": "Email notifications",
    "home.pricing.pro.name": "Pro",
    "home.pricing.pro.description":
      "For teams shipping often and managing regression risk.",
    "home.pricing.pro.feature1": "25 active websites",
    "home.pricing.pro.feature2": "Mobile and desktop",
    "home.pricing.pro.feature3": "Webhook and Slack support",
    "home.pricing.pro.feature4": "Regression detection",
    "home.pricing.enterprise.name": "Enterprise",
    "home.pricing.enterprise.description":
      "For agencies, larger product teams, and more stakeholders.",
    "home.pricing.enterprise.feature1": "Near-unlimited websites",
    "home.pricing.enterprise.feature2": "Extended history",
    "home.pricing.enterprise.feature3": "Teams and white-label",
    "home.pricing.enterprise.feature4": "Priority support",
    "home.sections.faq.eyebrow": "FAQ",
    "home.sections.faq.title": "Quick answers to what you need to decide now.",
    "home.faq.q1.question": "What is already in place?",
    "home.faq.q1.answer":
      "Dashboard, reports, plan controls, settings, webhooks, notification settings, and the billing foundation are already in the codebase.",
    "home.faq.q2.question": "What should I prioritize next?",
    "home.faq.q2.answer":
      "1) real billing flows, 2) organization accounts, 3) onboarding and activation, 4) robust notification delivery, and 5) audit and compliance.",
    "home.faq.q3.question":
      "Is the product built for agencies or internal teams?",
    "home.faq.q3.answer":
      "Both. White-labeling, team features, multiple workspaces, and customer-friendly reports make it especially strong for the agency path.",
    "home.nextSteps.eyebrow": "Next steps",
    "home.nextSteps.title":
      "I can take the next step and build the missing SaaS pieces too.",
    "home.nextSteps.description":
      "A sensible order in this codebase: billing checkout, teams and roles, onboarding flow, and real notification delivery.",
    "home.nextSteps.actions.openSettings": "Open settings",
    "home.nextSteps.actions.contactUs": "Contact us",
    "home.footer.tagline":
      "Built for teams who want to catch performance issues early.",
    "home.footer.links.privacy": "Privacy",
    "home.footer.links.terms": "Terms",
    "home.footer.links.docs": "Docs",
    "home.footer.links.contact": "Contact",
    "sidebar.mobile.title": "Sidebar",
    "sidebar.mobile.description": "Displays the mobile sidebar.",
    "settingsApi.restApiTitle": "REST API",
    "settingsApi.authPrefix": "Authenticate with",
    "settingsApi.authOr": "or",
  },
}

const DEFAULT_LOCALE: Locale =
  (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale | undefined) ?? "sv"

function interpolate(
  template: string,
  params?: Record<string, string | number>
) {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key]
    return value === undefined ? `{${key}}` : String(value)
  })
}

export function t(
  key: string,
  params?: Record<string, string | number>,
  locale: Locale = DEFAULT_LOCALE
) {
  const message = dictionaries[locale][key] ?? key
  return interpolate(message, params)
}

export function registerTranslations(locale: Locale, entries: Dictionary) {
  dictionaries[locale] = {
    ...dictionaries[locale],
    ...entries,
  }
}
