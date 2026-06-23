import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import {
  connectMapsAppCheck,
  isMapsAppCheckBridgeRequired,
} from "@/lib/maps-app-check-bridge";
import { getGoogleMapsConfig } from "@/lib/google-maps-config";

export type GoogleMapsInitResult = {
  Settings: typeof google.maps.Settings;
  Map: typeof google.maps.Map;
};

let initPromise: Promise<GoogleMapsInitResult | null> | undefined;

function resolveImportLibrary() {
  if (typeof google !== "undefined" && google.maps?.importLibrary) {
    return google.maps.importLibrary.bind(google.maps) as typeof importLibrary;
  }

  return importLibrary;
}

function ensureGoogleMapsOptions(): boolean {
  const config = getGoogleMapsConfig();
  if (!config.enabled) {
    return false;
  }

  if (typeof google === "undefined" || !google.maps?.importLibrary) {
    setOptions({ key: config.apiKey });
  }

  return true;
}

/** Load any Maps JS API library via dynamic import. */
export async function importGoogleMapsLibrary<
  TLibraryName extends Parameters<typeof importLibrary>[0],
>(libraryName: TLibraryName) {
  if (typeof window === "undefined" || !ensureGoogleMapsOptions()) {
    return null;
  }

  return resolveImportLibrary()(libraryName);
}

/**
 * Full bootstrap from Google's Firebase + Maps App Check guide:
 * core/maps libraries, App Check token bridge, then Map is ready to use.
 */
export async function initGoogleMapsWithAppCheck(): Promise<GoogleMapsInitResult | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const load = resolveImportLibrary();
  if (!ensureGoogleMapsOptions()) {
    return null;
  }

  const { Settings } = await load("core");

  if (isMapsAppCheckBridgeRequired()) {
    await connectMapsAppCheck(Settings);
  }

  const { Map } = await load("maps");

  return { Settings, Map };
}

/**
 * Google's recommended bootstrap — loads `core` (Settings) and `maps` (Map).
 * Wires App Check when configured. Safe inside or outside vis.gl APIProvider.
 */
export async function initGoogleMaps(): Promise<GoogleMapsInitResult | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (initPromise !== undefined) {
    return initPromise;
  }

  initPromise = initGoogleMapsWithAppCheck();

  return initPromise;
}
