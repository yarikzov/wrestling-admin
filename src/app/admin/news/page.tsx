'use client';
import { useEffect, useState, useRef } from 'react';
import { NewsItem } from '@/types';
import {
    subscribeNews, createNews, updateNews,
    deleteNews, uploadNewsImage,
} from '@/services/news';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EMPTY: Omit<NewsItem, 'id'> = {
    title: '', text: '', imageUrl: '',
    date: new Date().toISOString().slice(0, 10),
    published: false, createdAt: 0,
};

export default function NewsPage() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [form, setForm]   = useState<Omit<NewsItem, 'id'>>(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [show, setShow]   = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => subscribeNews(setItems), []);

    async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadNewsImage(file);
            setForm(f => ({ ...f, imageUrl: url }));
            toast.success('Фото загружено');
        } catch { toast.error('Ошибка загрузки'); }
        setUploading(false);
    }

    async function handleSave() {
        if (!form.title.trim()) return toast.error('Введите заголовок');
        const data = { ...form, createdAt: Date.now() };
        try {
            if (editing) await updateNews(editing, form);
            else await createNews(data);
            toast.success(editing ? 'Обновлено' : 'Новость создана');
            setShow(false); setEditing(null); setForm(EMPTY);
        } catch { toast.error('Ошибка сохранения'); }
    }

    function startEdit(item: NewsItem) {
        const { id, ...rest } = item;
        setForm(rest); setEditing(id); setShow(true);
    }

    async function handleDelete(item: NewsItem) {
        if (!confirm('Удалить новость?')) return;
        await deleteNews(item.id, item.imageUrl);
        toast.success('Удалено');
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Новости</h1>
                    <p className="text-gray-400 mt-1">
                        {items.length} материалов
                    </p>
                </div>
                <button onClick={() => { setShow(true); setEditing(null); setForm(EMPTY); }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500
                     px-4 py-2.5 rounded-xl font-medium text-sm transition">
                    <Plus size={18} /> Добавить
                </button>
            </div>

            <div className="grid gap-4">
                {items.map(item => (
                    <div key={item.id}
                         className="bg-gray-900 border border-gray-800 rounded-2xl
                       p-5 flex items-start gap-4 hover:border-gray-700
                       transition group">
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt=""
                                 className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold truncate">{item.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
                  ${item.published
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-700 text-gray-400'}`}>
                  {item.published ? 'Опубликовано' : 'Черновик'}
                </span>
                            </div>
                            <p className="text-gray-400 text-sm truncate">{item.text}</p>
                            <span className="text-gray-600 text-xs mt-1 block">
                {item.date}
              </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => startEdit(item)}
                                    className="p-2 bg-gray-800 hover:bg-blue-600/20
                           rounded-lg transition">
                                <Pencil size={16} className="text-blue-400" />
                            </button>
                            <button onClick={() => handleDelete(item)}
                                    className="p-2 bg-gray-800 hover:bg-red-600/20
                           rounded-lg transition">
                                <Trash2 size={16} className="text-red-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {show && (
                <div className="fixed inset-0 bg-black/80 flex items-center
                        justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl
                          max-h-[90vh] overflow-y-auto border border-gray-700">
                        <h2 className="font-black text-xl mb-6">
                            {editing ? 'Редактировать' : 'Новая новость'}
                        </h2>

                        <div className="space-y-4">
                            {form.imageUrl ? (
                                <div className="relative">
                                    <img src={form.imageUrl} alt=""
                                         className="w-full h-48 object-cover rounded-xl" />
                                    <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                                            className="absolute top-2 right-2 bg-red-600 p-1 rounded-lg">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => fileRef.current?.click()}
                                        className="w-full h-32 border-2 border-dashed border-gray-700
                             rounded-xl flex items-center justify-center gap-2
                             text-gray-400 hover:border-red-500
                             hover:text-red-400 transition">
                                    <Upload size={20} />
                                    {uploading ? 'Загрузка…' : 'Загрузить обложку'}
                                </button>
                            )}
                            <input ref={fileRef} type="file" accept="image/*"
                                   onChange={handleImage} className="hidden" />

                            <input value={form.title}
                                   onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                   placeholder="Заголовок"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-3 text-white focus:outline-none
                           focus:border-red-500" />

                            <textarea value={form.text}
                                      onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                                      placeholder="Текст статьи"
                                      rows={6}
                                      className="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-3 text-white focus:outline-none
                           focus:border-red-500 resize-none" />

                            <input type="date" value={form.date}
                                   onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl
                           px-4 py-3 text-white focus:outline-none
                           focus:border-red-500" />

                            <label className="flex items-center gap-3 cursor-pointer">
                                <div onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                                     className={`w-12 h-6 rounded-full transition-all relative
                    ${form.published ? 'bg-green-500' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full
                                   transition-all ${form.published ? 'left-7' : 'left-1'}`} />
                                </div>
                                <span className="text-sm text-gray-300">
                  {form.published ? 'Опубликовано' : 'Черновик'}
                </span>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setShow(false); setEditing(null); }}
                                    className="flex-1 py-3 rounded-xl border border-gray-700
                           text-gray-400 hover:text-white transition">
                                Отмена
                            </button>
                            <button onClick={handleSave}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500
                           font-bold transition">
                                {editing ? 'Сохранить' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}