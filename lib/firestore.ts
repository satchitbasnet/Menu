import {
  collection,
  type DocumentData,
  getDocs,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

/** Read all documents from a Firestore collection. */
export async function getCollectionDocs<T extends DocumentData = DocumentData>(
  collectionName: string
): Promise<(T & { id: string })[]> {
  const db = getFirebaseFirestore();
  if (!db) {
    return [];
  }

  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as T),
  }));
}

/** Firebase quickstart example — fetch all documents from the `cities` collection. */
export async function getCities() {
  return getCollectionDocs("cities");
}
