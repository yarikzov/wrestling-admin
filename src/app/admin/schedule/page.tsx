'use client';
import { useEffect, useState } from 'react';
import { ScheduleRow } from '@/types';
import { subscribeSchedule, createRow, updateRow, deleteRow } from '@/services/schedule';
import { Plus, Trash2, Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const DAYS = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const EMPTY: Omit<ScheduleRow, 'id'> = { day: 'Понедельник', time: '', group: '', coach: '' };

export default function SchedulePage() {
    const [items, setItems] = useState<ScheduleRow[]>([]);
    const [form, setForm] = useState<Omit<ScheduleRow, 'id'>>(EMPTY);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<ScheduleRow>>({});
    const [show, setShow] = useState(false);

    useEffect(() => subscribeSchedule(setItems), []);

    async function handleAdd() {
        if (!form.time || !form.group || !form.coach) return toast.error('Заполните все поля');
        await createRow(form);
        setForm(EMPTY);
        setShow(false);
        toast.success('Добавлено');
    }

    async function saveEdit(id: string) {
        await updateRow(id, editData);
        setEditingId(null);
        toast.success('Сохранено');
    }

    async function handleDelete(id: string) {
        if (!confirm('Удалить строку?')) return;
        await deleteRow(id);
        toast.success('Удалено');
    }

    const byDay = DAYS.map(day => ({
        day,
        rows: items.filter(i => i.day === day),
    })).filter(g => g.rows.length > 0);

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black">Расписание</h1>
                    <p className="text-gray-400 mt-1">{items.length} тренировок</p>
                </div>
                <button onClick={() => setShow(true)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2.5 rounded-xl font-medium text-sm transition">
                    <Plus size={18} /> Добавить
                </button>
            </div>

            <div className="space-y-6">
                {byDay.map(({ day, rows }) => (
                    <div key={day} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-800 bg-gray-800/50">
                            <h3 className="font-bold text-white">{day}</h3>
                        </div>
                        <table className="w-full">
                            <thead>
                            <tr className="text-xs text-gray-500 border-b border-gray-800">
                                <th className="text-left px-5 py-2">Время</th>
                                <th className="text-left px-5 py-2">Группа</th>
                                <th className="text-left px-5 py-2">Тренер</th>
                                <th className="px-5 py-2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map(row => (
                                <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                    {editingId === row.id ? (
                                        <>
                                            <td className="px-5 py-2">
                                                <input value={editData.time ?? row.time}
                                                       onChange={e => setEditData(d => ({ ...d, time: e.target.value }))}
                                                       className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm w-24 text-white focus:outline-none focus:border-red-500" />
                                            </td>
                                            <td className="px-5 py-2">
                                                <input value={editData.group ?? row.group}
                                                       onChange={e => setEditData(d => ({ ...d, group: e.target.value }))}
                                                       className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm w-32 text-white focus:outline-none focus:border-red-500" />
                                            </td>
                                            <td className="px-5 py-2">
                                                <input value={editData.coach ?? row.coach}
                                                       onChange={e => setEditData(d => ({ ...d, coach: e.target.value }))}
                                                       className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm w-36 text-white focus:outline-none focus:border-red-500" />
                                            </td>
                                            <td className="px-5 py-2">
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveEdit(row.id)}
                                                            className="p-1.5 bg-green-600/20 hover:bg-green-600/40 rounded-lg transition">
                                                        <Check size={14} className="text-green-400" />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}
                                                            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                                                        <X size={14} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-5 py-3 text-white font-medium">{row.time}</td>
                                            <td className="px-5 py-3 text-gray-300">{row.group}</td>
                                            <td className="px-5 py-3 text-gray-400">{row.coach}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => { setEditingId(row.id); setEditData({}); }}
                                                            className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition">
                                                        Изменить
                                                    </button>
                                                    <button onClick={() => handleDelete(row.id)}
                                                            className="p-1.5 bg-gray-800 hover:bg-red-600/20 rounded-lg transition">
                                                        <Trash2 size={14} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center text-gray-500 py-16">Расписание пока пустое</div>
                )}
            </div>

            {show && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
                        <h2 className="font-black text-xl mb-6">Новая тренировка</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">День недели</label>
                                <select value={form.day}
                                        onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500">
                                    {DAYS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <input value={form.time}
                                   onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                   placeholder="Время (напр. 16:00)"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />
                            <input value={form.group}
                                   onChange={e => setForm(f => ({ ...f, group: e.target.value }))}
                                   placeholder="Группа (напр. Юная группа)"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />
                            <input value={form.coach}
                                   onChange={e => setForm(f => ({ ...f, coach: e.target.value }))}
                                   placeholder="Тренер"
                                   className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500" />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShow(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition">
                                Отмена
                            </button>
                            <button onClick={handleAdd}
                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold transition">
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}