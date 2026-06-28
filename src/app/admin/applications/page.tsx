'use client';
import { useEffect, useState } from 'react';
import { Application } from '@/types';
import { subscribeApplications, updateApplicationStatus } from '@/services/applications';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const STATUS_MAP = {
    new:        { label: 'Новая',      cls: 'bg-red-500/20 text-red-400'    },
    processing: { label: 'В работе',   cls: 'bg-yellow-500/20 text-yellow-400' },
    done:       { label: 'Выполнена',  cls: 'bg-green-500/20 text-green-400'  },
};

export default function ApplicationsPage() {
    const [items, setItems] = useState<Application[]>([]);
    useEffect(() => subscribeApplications(setItems), []);

    const newCount = items.filter(i => i.status === 'new').length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black">Заявки</h1>
                <p className="text-gray-400 mt-1">
                    {items.length} всего · {newCount} новых
                </p>
            </div>

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id}
                         className="bg-gray-900 border border-gray-800 rounded-2xl
                       p-5 flex items-center gap-4 hover:border-gray-700
                       transition">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full
                            flex items-center justify-center text-red-400
                            font-black text-lg flex-shrink-0">
                            {item.name?.[0] ?? '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold">{item.name}</div>
                            <div className="text-sm text-gray-400 flex gap-4 mt-0.5">
                                <span>{item.phone}</span>
                                {item.age && <span>Возраст: {item.age}</span>}
                            </div>
                            {item.message && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {item.message}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-1 rounded-full
                               ${STATUS_MAP[item.status].cls}`}>
                {STATUS_MAP[item.status].label}
              </span>
                            <span className="text-xs text-gray-600">
                {format(new Date(item.createdAt), 'd MMM yyyy', { locale: ru })}
              </span>
                            {item.telegramSent && (
                                <span className="text-xs text-blue-400">✈ TG</span>
                            )}
                        </div>
                        <select
                            value={item.status}
                            onChange={e => updateApplicationStatus(
                                item.id, e.target.value as Application['status']
                            )}
                            className="bg-gray-800 border border-gray-700 rounded-lg
                         px-2 py-1.5 text-sm text-white focus:outline-none
                         focus:border-red-500">
                            <option value="new">Новая</option>
                            <option value="processing">В работе</option>
                            <option value="done">Выполнена</option>
                        </select>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center text-gray-500 py-16">
                        Заявок пока нет
                    </div>
                )}
            </div>
        </div>
    );
}