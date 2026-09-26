type DevelopmentMode = "Tunel" | "Developer" | "Production";

export function getUrlBackend(): string {
  const mode = process.env.EXPO_PUBLIC_DEVELOPMENT_MODE as DevelopmentMode;

  const API_URL = {
    Tunel: process.env.EXPO_PUBLIC_URI_TUNEL,
    Developer: process.env.EXPO_PUBLIC_URL_API,
    Production: process.env.EXPO_PUBLIC_URL_API_PROD,
  }[mode];

  return API_URL ?? "";
}
