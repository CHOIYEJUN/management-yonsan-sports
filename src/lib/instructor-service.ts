import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Instructor } from "./types";

const COLLECTION = "instructors";

function toInstructor(id: string, data: DocumentData): Instructor {
  return {
    id,
    name: data.name ?? "",
    currentCenter: data.currentCenter ?? "",
    category: data.category ?? "",
    position: data.position ?? "",
    imageUrl: data.imageUrl,
    gender: data.gender === "female" || data.gender === "male" ? data.gender : undefined,
    assignedClasses: Array.isArray(data.assignedClasses) ? data.assignedClasses : [],
    licenses: Array.isArray(data.licenses) ? data.licenses : [],
    career: Array.isArray(data.career) ? data.career : [],
  };
}

export async function fetchInstructors(): Promise<Instructor[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toInstructor(d.id, d.data()));
}

export async function saveInstructor(instructor: Instructor): Promise<void> {
  const ref = doc(db, COLLECTION, instructor.id);
  await setDoc(ref, {
    name: instructor.name,
    currentCenter: instructor.currentCenter,
    category: instructor.category,
    position: instructor.position,
    imageUrl: instructor.imageUrl ?? null,
    gender: instructor.gender ?? null,
    assignedClasses: instructor.assignedClasses ?? [],
    licenses: instructor.licenses,
    career: instructor.career,
  });
}

export async function deleteInstructor(instructorId: string): Promise<void> {
  const ref = doc(db, COLLECTION, instructorId);
  await deleteDoc(ref);
}
