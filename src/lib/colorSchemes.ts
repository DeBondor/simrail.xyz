export interface ColorScheme {
  primary: string;
  secondary: string;
}

export type CategoryKey = "EIP" | "IC" | "TLK" | "IR" | "R" | "TME" | "TDE" | "CUSTOM";

export const colorSchemes: Record<string, ColorScheme> = {
  EIP: { primary: "#4D1B17", secondary: "#CF5D54" },
  IC: { primary: "#1A2E4A", secondary: "#4A8BC4" },
  TLK: { primary: "#406D1F", secondary: "#88C8AF" },
  IR: { primary: "#2D236C", secondary: "#7390DB" },
  R: { primary: "#173D4D", secondary: "#54A9CE" },
  TME: { primary: "#515151", secondary: "#A1A1A1" },
  TDE: { primary: "#515151", secondary: "#A1A1A1" },
};

export const categoryOptions = [
  { value: "EIP", label: "EIP — Express InterCity Premium" },
  { value: "IC", label: "IC — InterCity" },
  { value: "TLK", label: "TLK — Twoje Linie Kolejowe" },
  { value: "IR", label: "IR — InterRegio" },
  { value: "R", label: "R — Regio" },
  { value: "TME", label: "TME — Towarowy krajowy masowy" },
  { value: "TDE", label: "TDE — Towarowy krajowy intermodalny" },
  { value: "CUSTOM", label: "✦ Custom" },
] as const;

