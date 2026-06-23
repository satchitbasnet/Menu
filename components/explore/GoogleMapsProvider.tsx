"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  APILoadingStatus,
  APIProvider,
  useApiLoadingStatus,
} from "@vis.gl/react-google-maps";
import type { GoogleMapsConfig } from "@/lib/google-maps-config";
import {
  connectMapsAppCheck,
  isMapsAppCheckBridgeRequired,
} from "@/lib/maps-app-check-bridge";

type GoogleMapsProviderProps = {
  config: GoogleMapsConfig;
  children: ReactNode;
  onAuthFailure: () => void;
};

function AuthStatusMonitor({ onAuthFailure }: { onAuthFailure: () => void }) {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (
      status === APILoadingStatus.AUTH_FAILURE ||
      status === APILoadingStatus.FAILED
    ) {
      onAuthFailure();
    }
  }, [status, onAuthFailure]);

  return null;
}

function GoogleAuthFailureHook({ onAuthFailure }: { onAuthFailure: () => void }) {
  useEffect(() => {
    type GmWindow = Window & { gm_authFailure?: () => void };

    const win = window as GmWindow;
    const previous = win.gm_authFailure;

    win.gm_authFailure = () => {
      onAuthFailure();
      previous?.();
    };

    return () => {
      win.gm_authFailure = previous;
    };
  }, [onAuthFailure]);

  return null;
}

/** Detects Google's "Oops! Something went wrong" overlay and triggers fallback. */
export function GoogleMapsErrorDetector({
  onError,
}: {
  onError: () => void;
}) {
  useEffect(() => {
    const check = () => {
      if (
        document.querySelector(".gm-err-container") ||
        document.querySelector(".gm-err-message")
      ) {
        onError();
        return true;
      }
      return false;
    };

    if (check()) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (check()) {
        window.clearInterval(intervalId);
      }
    }, 400);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [onError]);

  return null;
}

export function GoogleMapsProvider({
  config,
  children,
  onAuthFailure,
}: GoogleMapsProviderProps) {
  const [appCheckReady, setAppCheckReady] = useState(
    !isMapsAppCheckBridgeRequired()
  );

  useEffect(() => {
    if (!isMapsAppCheckBridgeRequired()) {
      return;
    }

    let cancelled = false;

    connectMapsAppCheck()
      .then(() => {
        if (!cancelled) {
          setAppCheckReady(true);
        }
      })
      .catch((error) => {
        console.error("Maps App Check bridge failed:", error);
        if (!cancelled) {
          onAuthFailure();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onAuthFailure]);

  if (!appCheckReady) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/40">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={config.apiKey}
      libraries={["marker", "places"]}
      onError={(error) => {
        console.error("Google Maps API error:", error);
        onAuthFailure();
      }}
    >
      <GoogleAuthFailureHook onAuthFailure={onAuthFailure} />
      <AuthStatusMonitor onAuthFailure={onAuthFailure} />
      {children}
    </APIProvider>
  );
}

export function useGoogleMapsRuntimeFailure() {
  const [failed, setFailed] = useState(false);
  return {
    failed,
    markFailed: () => setFailed(true),
    reset: () => setFailed(false),
  };
}
