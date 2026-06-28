'use client';
import { useEffect, useState, useRef } from 'react';
import { Coach } from '@/types';
import { subscribeCoaches, createCoach, updateCoach, deleteCoach, uploadCoachPhoto } from '@/services/coaches';
import { Plus, Pencil, Trash2, Upload, Phone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EMPTY: Omit<Coach, 'id'> = {
    name: '', role: '', bio: '', achievements: [], phone: '', photoUrl: '',
};

export default function CoachesPage() {
    const [items, setItems] = useState<Coach[]>([]);
    const [form, setForm] = useState<Omit<Coach, 'id'>>(EMPTY);
    const [editing, setEditing] = useState<string | null>(null);
    const [show, setShow] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [achText, setAchText] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => subscribeCoaches(setItems), []);

    async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadCoachPhoto(file);
            setForm(f => ({ ...f, photoUrl: url }));
            toast.success('Фото загружено');
        } catch { toast.error('Ошибка загрузки'); }
        setUploading(false);
    }

    async function handleSave() {
        if (!form.name.trim()) return toast.error('Введите имя');
        try {
            if (editing) await updateCoach(editing, form);
            else await createCoach(form);
            toast.success(editing ? 'Обновлено' : 'Тренер добавлен');
            setShow(false); setEditing(null); setForm(EMPTY); setAchText('');
        } catch { toast.error('Ошибка сохранения'); }
    }

    function startEdit(item: Coach) {
        const { id, ...rest } = item;
        setForm(rest);
        setAchText(rest.achievements.join('\n'));
        setEditing(id);
        setShow(true);
    }

    async function handleDelete(id: string) {
        if (!confirm('Удалить тренера?')) return;
        await deleteCoach(id);
        toast.success('Удалено');
    }

    function handleAchChange(val: string) {
        setAchText(val);
        setForm(f => ({ ...f, achievements: val.split('\n').filter(Boolean) }));
    }

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Тренеры</h1>
                    <p className="text-gray-400 mt-1">{items.length} тренеров</p>
                </div>
                <button onClick={() => { setShow(true); setEditing(null); setForm(EMPTY); setAchText(''); }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2.5 rounded-xl font-medium text-sm transition">
                    <Plus size={18} /> Добавить
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.id}
                         className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition group">
                        <div className="flex items-start gap-4">
                            {item.photoUrl
                                ? <img src={item.photoUrl} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                                : <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-2xl font-black text-gray-600 flex-shrink-0">
                                    {item.name[0]}
                                </div>
                            }
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold truncate">{item.name}</h3>
                                <p className="text-red-400 text-sm">{item.role}</p>
                                {item.phone && (
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                        <Phone size={11} /> {item.phone}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => startEdit(item)}
                                        className="p-2 bg-gray-800 hover:bg-blue-600/20 rounded-lg transition">
                                    <Pencil size={14} className="text-blue-400" />
                                </button>
                                <button onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-gray-800 hover:bg-red-600/20 rounded-lg transition">
                                    <Trash2 size={14} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                        {item.bio && <p className="text-gray-400 text-sm mt-3 line-clamp-2">{item.bio}</p>}
                        {item.achievements.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                                {item.achievements.slice(0, 2).map((a, i) => (
                                    <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                    {a}
                  </span>
                                ))}
                                {item.achievements.length > 2 && (
                                    <span className="text-xs text-gray-500">+{item.achievements.length - 2}</span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {show && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700">
                        <h2 className="font-black text-xl mb-6">{editing ? 'Редактировать' : 'Новый тренер'}</h2>
                        <div className="space-y-4">

                            <div className="flex items-center gap-4">
                                {form.photoUrl
                                    ? <img src={form.photoUrl} alt="" className="w-20 h-20 object-cover rounded-xl" />
                                    : <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 text-xs text-center px-2">
                                        Нет фото
                                    </div>
                                }
                                <button onClick={() => fileRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white hover:border-red-500 transition">
                                    <Upload size={16} />
                                    {uploading ? 'Загрузка…' : 'Загрузить фото'}
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                            </div>

                            <input value={form.name}
                                   onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                   placeholder="ФИО тренера"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />

                            <input value={form.role}
                                   onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                   placeholder="Должность (напр. Старший тренер)"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />

                            <input value={form.phone}
                                   onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                   placeholder="Телефон"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />

                            <textarea value={form.bio}
                                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                      placeholder="Биография"
                                      rows={3}
                                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 resize-none" />

                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Достижения (каждое с новой строки)</label>
                                <textarea value={achText}
                                          onChange={e => handleAchChange(e.target.value)}
                                          placeholder={"Мастер спорта России\nПризёр первенства России"}
                                          rows={4}
                                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 resize-none" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => { setShow(false); setEditing(null); }}
                                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                                Отмена
                            </button>
                            <button onClick={handleSave}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold transition">
                                {editing ? 'Сохранить' : 'Добавить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}