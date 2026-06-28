import {
    collection, addDoc, updateDoc,
    deleteDoc, doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import {
    ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { NewsItem } from '@/types';
import { v4 as uuid } from 'uuid';

const COL = 'news';

export function subscribeNews(cb: (items: NewsItem[]) => void) {
    const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem)));
    });
}

export async function uploadNewsImage(file: File): Promise<string> {
    const r = ref(storage, `news/${uuid()}_${file.name}`);
    await uploadBytes(r, file);
    return getDownloadURL(r);
}

export async function createNews(data: Omit<NewsItem, 'id'>) {
    await addDoc(collection(db, COL), data);
}

export async function updateNews(id: string, data: Partial<NewsItem>) {
    await updateDoc(doc(db, COL, id), data);
}

export async function deleteNews(id: string, imageUrl?: string) {
    await deleteDoc(doc(db, COL, id));
    if (imageUrl) {
        try { await deleteObject(ref(storage, imageUrl)); } catch {}
    }
}