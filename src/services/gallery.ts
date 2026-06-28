import {
    collection, addDoc, deleteDoc,
    doc, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import {
    ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { GalleryPhoto } from '@/types';
import { v4 as uuid } from 'uuid';

const COL = 'gallery';

export function subscribeGallery(cb: (items: GalleryPhoto[]) => void) {
    const q = query(collection(db, COL), orderBy('uploadedAt', 'desc'));
    return onSnapshot(q, (s) =>
        cb(s.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryPhoto)))
    );
}

export async function uploadPhoto(file: File, album: string) {
    const path = `gallery/${uuid()}_${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    const url = await getDownloadURL(r);
    await addDoc(collection(db, COL), {
        url, album, uploadedAt: Date.now(), path,
    });
}

export async function deletePhoto(photo: GalleryPhoto & { path?: string }) {
    await deleteDoc(doc(db, COL, photo.id));
    if (photo.path) {
        try { await deleteObject(ref(storage, photo.path)); } catch {}
    }
}