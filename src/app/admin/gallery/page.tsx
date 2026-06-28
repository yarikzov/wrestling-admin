'use client';
import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { GalleryPhoto } from '@/types';
import { subscribeGallery, uploadPhoto, deletePhoto } from '@/services/gallery';
import { Trash2, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function GalleryPage() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [album, setAlbum] = useState('Общее');
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => subscribeGallery(setPhotos), []);

    const onDrop = useCallback(async (files: File[]) => {
        setUploading(true);
        try {
            await Promise.all(files.map(f => uploadPhoto(f, album)));
            toast.success(`Загружено ${files.length} фото`);
        } catch { toast.error('Ошибка загрузки'); }
        setUploading(false);
    }, [album]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'image/*': [] }, multiple: true,
    });

    async function handleDelete(photo: GalleryPhoto) {
        if (!confirm('Удалить фото?')) return;
        await deletePhoto(photo as any);
        toast.success('Удалено');
    }

    const albums = ['Общее', 'Тренировки', 'Соревнования', 'Сборы', 'Награждения'];

    return (
        <div>
            <Toaster position="top-right" />
            <div className="mb-8">
                <h1 className="text-3xl font-black">Галерея</h1>
                <p className="text-gray-400 mt-1">{photos.length} фотографий</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-gray-400">Альбом:</label>
                    <div className="flex gap-2 flex-wrap">
                        {albums.map(a => (
                            <button key={a} onClick={() => setAlbum(a)}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                        album === a
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                <div {...getRootProps()}
                     className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
                         isDragActive
                             ? 'border-red-500 bg-red-500/10'
                             : 'border-gray-700 hover:border-red-500 hover:bg-gray-800/50'}`}>
                    <input {...getInputProps()} />
                    <Upload size={32} className="mx-auto text-gray-500 mb-3" />
                    {uploading
                        ? <p className="text-gray-400">Загружаем фото...</p>
                        : isDragActive
                            ? <p className="text-red-400">Отпустите файлы здесь</p>
                            : <div>
                                <p className="text-gray-300 font-medium">Перетащите фото сюда</p>
                                <p className="text-gray-500 text-sm mt-1">или нажмите для выбора файлов</p>
                            </div>
                    }
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {photos.map(photo => (
                    <div key={photo.id}
                         className="relative group rounded-xl overflow-hidden aspect-square bg-gray-800 cursor-pointer"
                         onClick={() => setSelected(photo.url)}>
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <button onClick={e => { e.stopPropagation(); handleDelete(photo); }}
                                    className="p-2 bg-red-600 rounded-lg">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-xs text-gray-300 truncate">
                            {photo.album}
                        </div>
                    </div>
                ))}
            </div>

            {photos.length === 0 && (
                <div className="text-center text-gray-500 py-16">Фотографий пока нет</div>
            )}

            {selected && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                     onClick={() => setSelected(null)}>
                    <img src={selected} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
                </div>
            )}
        </div>
    );
}