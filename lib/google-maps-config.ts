export type GoogleMapsConfigIssue =
  | "missing"
  | "invalid_key"
  | null;

export type GoogleMapsConfig = {
  apiKey: string;
  mapId: string;
  enabled: boolean;
  issue: GoogleMapsConfigIssue;
};

const BLOCKED_MAP_IDS = new Set(["DEMO_MAP_ID"]);

/** Google Maps Platform browser keys always start with AIzaSy. */
export function isValidGoogleMapsApiKey(key: string): boolean {
  const trimmed = key.trim();
  return trimmed.startsWith("AIzaSy") && trimmed.length >= 39;
}

export function getGoogleMapsConfig(): GoogleMapsConfig {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() ?? "";

  if (!apiKey || !mapId) {
    return { apiKey, mapId, enabled: false, issue: "missing" };
  }

  if (!isValidGoogleMapsApiKey(apiKey)) {
    return { apiKey, mapId, enabled: false, issue: "invalid_key" };
  }

  if (BLOCKED_MAP_IDS.has(mapId)) {
    return { apiKey, mapId, enabled: false, issue: "missing" };
  }

  return { apiKey, mapId, enabled: true, issue: null };
}

export function googleMapsSetupMessage(issue: GoogleMapsConfigIssue): string {
  if (issue === "invalid_key") {
    return "Your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY must start with AIzaSy (from Google Cloud Console → Credentials). Save .env, then restart with npm run dev.";
  }

  return "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID to .env, save the file, then restart the dev server.";
}

export const GOOGLE_MAPS_RUNTIME_FAILURE_MESSAGE =
  "Google Maps could not load. In Google Cloud Console: enable Maps JavaScript API + Places API (New), turn on billing, add http://localhost:3000/* under HTTP referrer restrictions, and use a Map ID from your project.";
