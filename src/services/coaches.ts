import {
    collection, addDoc, updateDoc,
    deleteDoc, doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { Coach } from '@/types';
import { v4 as uuid } from 'uuid';

const COL = 'coaches';

export function subscribeCoaches(cb: (items: Coach[]) => void) {
    const q = query(collection(db, COL), orderBy('name'));
    return onSnapshot(q, (s) =>
        cb(s.docs.map((d) => ({ id: d.id, ...d.data() } as Coach)))
    );
}

export async function uploadCoachPhoto(file: File) {
    const r = ref(storage, `coaches/${uuid()}_${file.name}`);
    await uploadBytes(r, file);
    return getDownloadURL(r);
}

export async function createCoach(data: Omit<Coach, 'id'>) {
    await addDoc(collection(db, COL), data);
}

export async function updateCoach(id: string, data: Partial<Coach>) {
    await updateDoc(doc(db, COL, id), data);
}

export async function deleteCoach(id: string) {
    await deleteDoc(doc(db, COL, id));
}