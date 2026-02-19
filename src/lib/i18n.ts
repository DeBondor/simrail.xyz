export type Lang = "pl" | "en";

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
  navTools: string;
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
  footerDisclaimer: string;
  importXmlTitle: string;
  clearStationsTitle: string;
  themeDark: string;
  themeLight: string;
  switchLangTitle: string;
}

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
    navTools: "Narzędzia",
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
    footerDisclaimer:
      "© 2026 SimRail XYZ — narzędzia nieoficjalne, nieafiliowane z SimRail.",
    importXmlTitle: "Importuj rozkład jazdy SimRail (.xml)",
    clearStationsTitle: "Wyczyść stacje pośrednie",
    themeDark: "Tryb ciemny",
    themeLight: "Tryb jasny",
    switchLangTitle: "Przełącz na angielski",
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
    navTools: "Tools",
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
    footerDisclaimer:
      "© 2026 SimRail XYZ — unofficial tools, not affiliated with SimRail.",
    importXmlTitle: "Import SimRail timetable (.xml)",
    clearStationsTitle: "Clear intermediate stations",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    switchLangTitle: "Switch to Polish",
  },
};

