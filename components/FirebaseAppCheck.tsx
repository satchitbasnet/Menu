"use client";

import { useEffect } from "react";
import { initFirebaseAppCheck } from "@/lib/firebase-app-check";

/** Initializes Firebase App Check once in the browser. */
export function FirebaseAppCheck() {
  useEffect(() => {
    initFirebaseAppCheck();
  }, []);

  return null;
}
