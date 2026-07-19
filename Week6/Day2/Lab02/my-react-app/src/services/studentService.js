import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

const col = collection(db, "students");

export const studentService = {

  async getAll() {
    const q = query(col, orderBy("studentId"));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  },

  async create(data) {
    await addDoc(col, data);
  },

  async update(id, data) {
    const ref = doc(db, "students", id);
    await updateDoc(ref, data);
  },

  async remove(id) {
    const ref = doc(db, "students", id);
    await deleteDoc(ref);
  }

};