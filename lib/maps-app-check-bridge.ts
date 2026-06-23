import { getToken } from "firebase/app-check";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import {
  getFirebaseAppCheck,
  initFirebaseAppCheck,
  isFirebaseAppCheckConfigured,
} from "@/lib/firebase-app-check";
import { getGoogleMapsConfig } from "@/lib/google-maps-config";

let bridgePromise: Promise<boolean> | undefined;

async function loadCoreSettings(): Promise<typeof google.maps.Settings | null> {
  const config = getGoogleMapsConfig();
  if (!config.enabled || typeof window === "undefined") {
    return null;
  }

  if (typeof google === "undefined" || !google.maps?.importLibrary) {
    setOptions({ key: config.apiKey });
  }

  const load =
    typeof google !== "undefined" && google.maps?.importLibrary
      ? google.maps.importLibrary.bind(google.maps)
      : importLibrary;

  const core = (await load("core")) as google.maps.CoreLibrary;
  return core.Settings;
}

/**
 * Connects Firebase App Check to Google Maps via
 * `Settings.getInstance().fetchAppCheckToken`.
 *
 * Call before the Maps JS API makes authenticated requests (e.g. before
 * `new Map()` or vis.gl `<Map>`).
 */
export async function connectMapsAppCheck(
  settingsClass?: typeof google.maps.Settings
): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (bridgePromise !== undefined) {
    return bridgePromise;
  }

  bridgePromise = (async () => {
    if (!isFirebaseAppCheckConfigured()) {
      return false;
    }

    const appCheck = initFirebaseAppCheck();
    if (!appCheck) {
      return false;
    }

    const Settings = settingsClass ?? (await loadCoreSettings());
    if (!Settings) {
      return false;
    }

    Settings.getInstance().fetchAppCheckToken = () =>
      getToken(appCheck, false).then(({ token }) => ({ token }));

    return true;
  })();

  return bridgePromise;
}

export function isMapsAppCheckBridgeRequired(): boolean {
  return isFirebaseAppCheckConfigured();
}

/** Returns the wired App Check instance after `connectMapsAppCheck()`. */
export function getMapsAppCheck() {
  return getFirebaseAppCheck();
}
