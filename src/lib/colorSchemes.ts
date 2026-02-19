export interface ColorScheme {
  primary: string;
  secondary: string;
}

export type CategoryKey = "EIP" | "IC" | "TLK" | "R" | "TME" | "TDE" | "CUSTOM";

export const colorSchemes: Record<string, ColorScheme> = {
  EIP: { primary: "#4D1B17", secondary: "#CF5D54" },
  IC: { primary: "#1A2E4A", secondary: "#4A8BC4" },
  TLK: { primary: "#406D1F", secondary: "#88C8AF" },
  R: { primary: "#173D4D", secondary: "#54A9CE" },
  TME: { primary: "#515151", secondary: "#A1A1A1" },
  TDE: { primary: "#515151", secondary: "#A1A1A1" },
};

export const categoryOptions = [
  { value: "EIP", label: "EIP — Pendolino" },
  { value: "IC", label: "IC — InterCity" },
  { value: "TLK", label: "TLK — Twoje Linie Kolejowe" },
  { value: "R", label: "R — Regio" },
  { value: "TME", label: "TME — Other" },
  { value: "CUSTOM", label: "✦ Custom" },
] as const;

