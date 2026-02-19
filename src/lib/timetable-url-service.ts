import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "timetableUrls";

/** Firestore doc ID from center + category (safe for document id) */
function docId(centerName: string, categoryName: string): string {
  return `${centerName}_${categoryName}`;
}

export interface TimetableUrlEntry {
  centerName: string;
  categoryName: string;
  url: string;
}

export async function getTimetableUrl(
  centerName: string,
  categoryName: string
): Promise<string | null> {
  const ref = doc(db, COLLECTION, docId(centerName, categoryName));
  const snap = await getDoc(ref);
  const data = snap.data();
  return data?.url && typeof data.url === "string" ? data.url : null;
}

export async function setTimetableUrl(
  centerName: string,
  categoryName: string,
  url: string
): Promise<void> {
  const ref = doc(db, COLLECTION, docId(centerName, categoryName));
  await setDoc(ref, {
    centerName,
    categoryName,
    url: url.trim(),
  });
}

export async function listTimetableUrls(): Promise<TimetableUrlEntry[]> {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      centerName: data.centerName ?? "",
      categoryName: data.categoryName ?? "",
      url: data.url ?? "",
    };
  });
}

export async function deleteTimetableUrl(
  centerName: string,
  categoryName: string
): Promise<void> {
  const ref = doc(db, COLLECTION, docId(centerName, categoryName));
  await deleteDoc(ref);
}
