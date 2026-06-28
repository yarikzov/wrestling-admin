import {
    collection, onSnapshot, query,
    orderBy, updateDoc, doc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Application } from '@/types';

const COL = 'applications';

export function subscribeApplications(cb: (items: Application[]) => void) {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (s) =>
        cb(s.docs.map((d) => ({ id: d.id, ...d.data() } as Application)))
    );
}

export async function updateApplicationStatus(
    id: string,
    status: Application['status']
) {
    await updateDoc(doc(db, COL, id), { status });
}