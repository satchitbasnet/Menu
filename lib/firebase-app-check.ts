import {
  type AppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";

const recaptchaEnterpriseSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;

export function isFirebaseAppCheckConfigured(): boolean {
  return Boolean(isFirebaseConfigured() && recaptchaEnterpriseSiteKey);
}

let appCheck: AppCheck | null | undefined;

function enableAppCheckDebugToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  const debugToken = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
  if (!debugToken) {
    return;
  }

  const globalScope = globalThis as typeof globalThis & {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  };

  globalScope.FIREBASE_APPCHECK_DEBUG_TOKEN =
    debugToken === "true" ? true : debugToken;
}

/**
 * Initialize App Check with reCAPTCHA Enterprise.
 * Must run in the browser before other Firebase client SDK calls.
 */
export function initFirebaseAppCheck(): AppCheck | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (appCheck !== undefined) {
    return appCheck;
  }

  if (!isFirebaseAppCheckConfigured()) {
    appCheck = null;
    return appCheck;
  }

  const app = getFirebaseApp();
  if (!app) {
    appCheck = null;
    return appCheck;
  }

  enableAppCheckDebugToken();

  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey!),
    isTokenAutoRefreshEnabled: true,
  });

  return appCheck;
}

export function getFirebaseAppCheck(): AppCheck | null {
  if (appCheck === undefined) {
    return initFirebaseAppCheck();
  }

  return appCheck;
}
