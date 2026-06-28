import {
    collection, addDoc, updateDoc,
    deleteDoc, doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { ScheduleRow } from '@/types';

const COL = 'schedule';

export function subscribeSchedule(cb: (items: ScheduleRow[]) => void) {
    return onSnapshot(
        query(collection(db, COL), orderBy('day')),
        (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduleRow)))
    );
}

export async function createRow(data: Omit<ScheduleRow, 'id'>) {
    await addDoc(collection(db, COL), data);
}

export async function updateRow(id: string, data: Partial<ScheduleRow>) {
    await updateDoc(doc(db, COL, id), data);
}

export async function deleteRow(id: string) {
    await deleteDoc(doc(db, COL, id));
}