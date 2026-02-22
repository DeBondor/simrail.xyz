export type Lang = "pl" | "en" | "de" | "cz" | "fr";

export interface Translations {
  panelRoute: string;
  panelStations: string;
  labelCat: string;
  labelRouteNum: string;
  labelStart: string;
  labelEnd: string;
  labelIntermediate: string;
  labelCatName: string;
  labelPrimary: string;
  labelSecondary: string;
  badgeIntermediate: (n: number) => string;
  presetPlaceholder: string;
  customPlaceholder: string;
  btnAdd: string;
  btnDownload: string;
  dragTitle: string;
  removeTitle: string;
  segmentLabel: (i: number) => string;
  segStyleNames: [string, string, string];
  btnClearStations: string;
  searchPlaceholder: string;
  panelEndPos: string;
  labelEndX: string;
  panelAdv: string;
  advSqSize: string;
  advTriW: string;
  advTriH: string;
  advTrackY: string;
  advLineH: string;
  advFixedGap: string;
  advSidebarW: string;
  advFontSizeStart: string;
  advFontSizeMid: string;
  advFontSizeEnd: string;
  advReset: string;

  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroRouteGen: string;
  heroGithub: string;
  dividerTools: string;
  toolRouteTitle: string;
  toolRouteDesc: string;
  toolLiveMapTitle: string;
  toolLiveMapDesc: string;
  tagAvailable: string;
  tagSoon: string;
  toolTimetableTitle: string;
  toolTimetableDesc: string;
  footerDisclaimer: string;
  footerLicense: string;
  importXmlTitle: string;
  clearStationsTitle: string;
  themeDark: string;
  themeLight: string;
  noStationsFound: string;
}

export const LANG_LABELS: Record<Lang, string> = {
  pl: "Polski",
  en: "English",
  de: "Deutsch",
  cz: "Čeština",
  fr: "Français",
};

export const LANGS: Record<Lang, Translations> = {
  pl: {
    panelRoute: "Trasa",
    panelStations: "Stacje",
    labelCat: "Kategoria",
    labelRouteNum: "Numer Pociągu",
    labelStart: "Stacja początkowa",
    labelEnd: "Stacja końcowa",
    labelIntermediate: "Stacje pośrednie",
    labelCatName: "Nazwa kategorii",
    labelPrimary: "Kolor tła (primary)",
    labelSecondary: "Kolor akcentu (secondary)",
    badgeIntermediate: (n) =>
      n + (n === 1 ? " pośrednia" : " pośrednich"),
    presetPlaceholder: "— Wybierz z listy —",
    customPlaceholder: "lub wpisz własną…",
    btnAdd: "Dodaj",
    btnDownload: "Pobierz PNG",
    dragTitle: "Przeciągnij",
    removeTitle: "Usuń",
    segmentLabel: (i) => `odcinek ${i + 1}`,
    segStyleNames: ["Ciągła", "Przerywana", "Mieszana"],
    btnClearStations: "Wyczyść",
    searchPlaceholder: "Szukaj stacji…",
    panelEndPos: "Koniec trasy",
    labelEndX: "Pozycja końcowa",
    panelAdv: "Zaawansowane",
    advSqSize: "Kwadrat (px)",
    advTriW: "Trójkąt szer.",
    advTriH: "Trójkąt wys.",
    advTrackY: "Pozycja toru Y",
    advLineH: "Grubość linii",
    advFixedGap: "Odstęp stacji",
    advSidebarW: "Szerokość paska",
    advFontSizeStart: "Tekst st. początkowej",
    advFontSizeMid: "Tekst st. pośredniej",
    advFontSizeEnd: "Tekst st. końcowej",
    advReset: "Przywróć domyślne",
    heroBadge: "Narzędzia dla SimRail",
    heroTitle: "Witaj w",
    heroDesc:
      "Zestaw darmowych narzędzi dla społeczności SimRail.",
    heroRouteGen: "Route Generator",
    heroGithub: "GitHub",
    dividerTools: "Dostępne narzędzia",
    toolRouteTitle: "Route Generator",
    toolRouteDesc:
      "Generuj estetyczne tablice tras pociągów SimRail z wyborem kategorii, stacji pośrednich i palety kolorów.",
    toolLiveMapTitle: "Live Map",
    toolLiveMapDesc:
      "Śledź pozycje pociągów w czasie rzeczywistym na interaktywnej mapie serwerów SimRail.",
    tagAvailable: "Dostępne",
    tagSoon: "Wkrótce",
    toolTimetableTitle: "EDR Timetable",
    toolTimetableDesc:
      "Przeglądaj i analizuj rozkłady jazdy EDR w przejrzystym, interaktywnym widoku.",
    footerDisclaimer:
      "© 2026 SimRail XYZ — narzędzia nieoficjalne, nieafiliowane z SimRail.",
    footerLicense: "Licencja",
    importXmlTitle: "Importuj rozkład jazdy SimRail (.xml)",
    clearStationsTitle: "Wyczyść stacje pośrednie",
    themeDark: "Tryb ciemny",
    themeLight: "Tryb jasny",
    noStationsFound: "Nie znaleziono stacji.",
  },
  en: {
    panelRoute: "Route",
    panelStations: "Stations",
    labelCat: "Category",
    labelRouteNum: "Train number",
    labelStart: "Start station",
    labelEnd: "End station",
    labelIntermediate: "Intermediate stations",
    labelCatName: "Category name",
    labelPrimary: "Background color (primary)",
    labelSecondary: "Accent color (secondary)",
    badgeIntermediate: (n) =>
      n + (n === 1 ? " intermediate" : " intermediate"),
    presetPlaceholder: "— Choose from list —",
    customPlaceholder: "or type custom…",
    btnAdd: "Add",
    btnDownload: "Download PNG",
    dragTitle: "Drag",
    removeTitle: "Remove",
    segmentLabel: (i) => `segment ${i + 1}`,
    segStyleNames: ["Solid", "Dashed", "Mixed"],
    btnClearStations: "Clear",
    searchPlaceholder: "Search stations…",
    panelEndPos: "Track end",
    labelEndX: "End position",
    panelAdv: "Advanced",
    advSqSize: "Square (px)",
    advTriW: "Triangle W",
    advTriH: "Triangle H",
    advTrackY: "Track Y pos.",
    advLineH: "Line thickness",
    advFixedGap: "Station gap",
    advSidebarW: "Sidebar width",
    advFontSizeStart: "Start station font",
    advFontSizeMid: "Mid station font",
    advFontSizeEnd: "End station font",
    advReset: "Reset defaults",

    heroBadge: "Tools for SimRail",
    heroTitle: "Welcome to",
    heroDesc:
      "A set of free tools for the SimRail community.",
    heroRouteGen: "Route Generator",
    heroGithub: "GitHub",
    dividerTools: "Available tools",
    toolRouteTitle: "Route Generator",
    toolRouteDesc:
      "Generate aesthetic route boards for SimRail trains with category selection, intermediate stations and color palette.",
    toolLiveMapTitle: "Live Map",
    toolLiveMapDesc:
      "Track train positions in real time on an interactive map of SimRail servers.",
    tagAvailable: "Available",
    tagSoon: "Coming soon",
    toolTimetableTitle: "EDR Timetable",
    toolTimetableDesc:
      "Browse and analyze EDR timetables in a clear, interactive view.",
    footerDisclaimer:
      "© 2026 SimRail XYZ — unofficial tools, not affiliated with SimRail.",
    footerLicense: "License",
    importXmlTitle: "Import SimRail timetable (.xml)",
    clearStationsTitle: "Clear intermediate stations",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    noStationsFound: "No stations found.",
  },
  de: {
    panelRoute: "Strecke",
    panelStations: "Bahnhöfe",
    labelCat: "Kategorie",
    labelRouteNum: "Zugnummer",
    labelStart: "Startbahnhof",
    labelEnd: "Endbahnhof",
    labelIntermediate: "Zwischenbahnhöfe",
    labelCatName: "Kategoriename",
    labelPrimary: "Hintergrundfarbe (primär)",
    labelSecondary: "Akzentfarbe (sekundär)",
    badgeIntermediate: (n) =>
      n + (n === 1 ? " Zwischenhalt" : " Zwischenhalte"),
    presetPlaceholder: "— Aus Liste wählen —",
    customPlaceholder: "oder eigene eingeben…",
    btnAdd: "Hinzufügen",
    btnDownload: "PNG herunterladen",
    dragTitle: "Ziehen",
    removeTitle: "Entfernen",
    segmentLabel: (i) => `Abschnitt ${i + 1}`,
    segStyleNames: ["Durchgehend", "Gestrichelt", "Gemischt"],
    btnClearStations: "Löschen",
    searchPlaceholder: "Bahnhöfe suchen…",
    panelEndPos: "Streckenende",
    labelEndX: "Endposition",
    panelAdv: "Erweitert",
    advSqSize: "Quadrat (px)",
    advTriW: "Dreieck B",
    advTriH: "Dreieck H",
    advTrackY: "Gleis Y-Pos.",
    advLineH: "Linienstärke",
    advFixedGap: "Bahnhofsabstand",
    advSidebarW: "Seitenleistenbreite",
    advFontSizeStart: "Schrift Startbahnhof",
    advFontSizeMid: "Schrift Zwischenbahnhof",
    advFontSizeEnd: "Schrift Endbahnhof",
    advReset: "Zurücksetzen",

    heroBadge: "Werkzeuge für SimRail",
    heroTitle: "Willkommen bei",
    heroDesc:
      "Eine Sammlung kostenloser Werkzeuge für die SimRail-Community.",
    heroRouteGen: "Route Generator",
    heroGithub: "GitHub",
    dividerTools: "Verfügbare Werkzeuge",
    toolRouteTitle: "Route Generator",
    toolRouteDesc:
      "Erstelle ästhetische Streckentafeln für SimRail-Züge mit Kategorieauswahl, Zwischenstationen und Farbpalette.",
    toolLiveMapTitle: "Live Map",
    toolLiveMapDesc:
      "Verfolge Zugpositionen in Echtzeit auf einer interaktiven Karte der SimRail-Server.",
    tagAvailable: "Verfügbar",
    tagSoon: "Demnächst",
    toolTimetableTitle: "EDR Fahrplan",
    toolTimetableDesc:
      "Durchsuche und analysiere EDR-Fahrpläne in einer übersichtlichen, interaktiven Ansicht.",
    footerDisclaimer:
      "© 2026 SimRail XYZ — inoffizielle Werkzeuge, nicht mit SimRail verbunden.",
    footerLicense: "Lizenz",
    importXmlTitle: "SimRail-Fahrplan importieren (.xml)",
    clearStationsTitle: "Zwischenbahnhöfe löschen",
    themeDark: "Dunkelmodus",
    themeLight: "Hellmodus",
    noStationsFound: "Keine Bahnhöfe gefunden.",
  },
  cz: {
    panelRoute: "Trasa",
    panelStations: "Stanice",
    labelCat: "Kategorie",
    labelRouteNum: "Číslo vlaku",
    labelStart: "Výchozí stanice",
    labelEnd: "Cílová stanice",
    labelIntermediate: "Mezilehlé stanice",
    labelCatName: "Název kategorie",
    labelPrimary: "Barva pozadí (primární)",
    labelSecondary: "Barva zvýraznění (sekundární)",
    badgeIntermediate: (n) =>
      n + (n === 1 ? " mezilehlá" : " mezilehlých"),
    presetPlaceholder: "— Vyberte ze seznamu —",
    customPlaceholder: "nebo zadejte vlastní…",
    btnAdd: "Přidat",
    btnDownload: "Stáhnout PNG",
    dragTitle: "Přetáhnout",
    removeTitle: "Odebrat",
    segmentLabel: (i) => `úsek ${i + 1}`,
    segStyleNames: ["Plná", "Přerušovaná", "Smíšená"],
    btnClearStations: "Vymazat",
    searchPlaceholder: "Hledat stanice…",
    panelEndPos: "Konec trasy",
    labelEndX: "Koncová pozice",
    panelAdv: "Pokročilé",
    advSqSize: "Čtverec (px)",
    advTriW: "Trojúhelník š.",
    advTriH: "Trojúhelník v.",
    advTrackY: "Pozice koleje Y",
    advLineH: "Tloušťka čáry",
    advFixedGap: "Rozestup stanic",
    advSidebarW: "Šířka postranního panelu",
    advFontSizeStart: "Písmo výchozí stanice",
    advFontSizeMid: "Písmo mezilehlé stanice",
    advFontSizeEnd: "Písmo cílové stanice",
    advReset: "Obnovit výchozí",

    heroBadge: "Nástroje pro SimRail",
    heroTitle: "Vítejte v",
    heroDesc:
      "Sada bezplatných nástrojů pro komunitu SimRail.",
    heroRouteGen: "Route Generator",
    heroGithub: "GitHub",
    dividerTools: "Dostupné nástroje",
    toolRouteTitle: "Route Generator",
    toolRouteDesc:
      "Generujte estetické trasové tabule pro vlaky SimRail s výběrem kategorie, mezilehlých stanic a barevné palety.",
    toolLiveMapTitle: "Live Map",
    toolLiveMapDesc:
      "Sledujte polohy vlaků v reálném čase na interaktivní mapě serverů SimRail.",
    tagAvailable: "Dostupné",
    tagSoon: "Již brzy",
    toolTimetableTitle: "EDR Jízdní řád",
    toolTimetableDesc:
      "Procházejte a analyzujte jízdní řády EDR v přehledném interaktivním zobrazení.",
    footerDisclaimer:
      "© 2026 SimRail XYZ — neoficiální nástroje, nesouvisí se SimRail.",
    footerLicense: "Licence",
    importXmlTitle: "Importovat jízdní řád SimRail (.xml)",
    clearStationsTitle: "Vymazat mezilehlé stanice",
    themeDark: "Tmavý režim",
    themeLight: "Světlý režim",
    noStationsFound: "Žádné stanice nenalezeny.",
  },
  fr: {
    panelRoute: "Itinéraire",
    panelStations: "Gares",
    labelCat: "Catégorie",
    labelRouteNum: "Numéro de train",
    labelStart: "Gare de départ",
    labelEnd: "Gare d'arrivée",
    labelIntermediate: "Gares intermédiaires",
    labelCatName: "Nom de la catégorie",
    labelPrimary: "Couleur de fond (primaire)",
    labelSecondary: "Couleur d'accent (secondaire)",
    badgeIntermediate: (n) =>
      n + (n === 1 ? " intermédiaire" : " intermédiaires"),
    presetPlaceholder: "— Choisir dans la liste —",
    customPlaceholder: "ou saisir manuellement…",
    btnAdd: "Ajouter",
    btnDownload: "Télécharger PNG",
    dragTitle: "Glisser",
    removeTitle: "Supprimer",
    segmentLabel: (i) => `tronçon ${i + 1}`,
    segStyleNames: ["Continue", "Pointillée", "Mixte"],
    btnClearStations: "Effacer",
    searchPlaceholder: "Rechercher des gares…",
    panelEndPos: "Fin de l'itinéraire",
    labelEndX: "Position finale",
    panelAdv: "Avancé",
    advSqSize: "Carré (px)",
    advTriW: "Triangle L",
    advTriH: "Triangle H",
    advTrackY: "Position Y voie",
    advLineH: "Épaisseur de ligne",
    advFixedGap: "Espacement des gares",
    advSidebarW: "Largeur du panneau",
    advFontSizeStart: "Police gare de départ",
    advFontSizeMid: "Police gare intermédiaire",
    advFontSizeEnd: "Police gare d'arrivée",
    advReset: "Réinitialiser",

    heroBadge: "Outils pour SimRail",
    heroTitle: "Bienvenue sur",
    heroDesc:
      "Un ensemble d'outils gratuits pour la communauté SimRail.",
    heroRouteGen: "Route Generator",
    heroGithub: "GitHub",
    dividerTools: "Outils disponibles",
    toolRouteTitle: "Route Generator",
    toolRouteDesc:
      "Générez des panneaux d'itinéraire esthétiques pour les trains SimRail avec sélection de catégorie, gares intermédiaires et palette de couleurs.",
    toolLiveMapTitle: "Live Map",
    toolLiveMapDesc:
      "Suivez les positions des trains en temps réel sur une carte interactive des serveurs SimRail.",
    tagAvailable: "Disponible",
    tagSoon: "Bientôt",
    toolTimetableTitle: "Horaires EDR",
    toolTimetableDesc:
      "Parcourez et analysez les horaires EDR dans une vue interactive et claire.",
    footerDisclaimer:
      "© 2026 SimRail XYZ — outils non officiels, non affiliés à SimRail.",
    footerLicense: "Licence",
    importXmlTitle: "Importer un horaire SimRail (.xml)",
    clearStationsTitle: "Effacer les gares intermédiaires",
    themeDark: "Mode sombre",
    themeLight: "Mode clair",
    noStationsFound: "Aucune gare trouvée.",
  },
};

