'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Newspaper, Image, Users, ClipboardList, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }: {
    icon: React.ElementType; label: string;
    value: number; color: string;
}) {
    return (
        <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6
                     hover:border-${color}-500/50 transition-all group`}>
            <div className={`w-12 h-12 bg-${color}-500/10 rounded-xl
                       flex items-center justify-center mb-4
                       group-hover:bg-${color}-500/20 transition`}>
                <Icon className={`text-${color}-400`} size={24} />
            </div>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-gray-400 text-sm">{label}</div>
        </div>
    );
}

export default function Dashboard() {
    const [counts, setCounts] = useState({
        coaches: 0, news: 0, photos: 0, applications: 0,
    });

    useEffect(() => {
        const cols = ['coaches', 'news', 'gallery', 'applications'];
        const keys = ['coaches', 'news', 'photos', 'applications'];
        const unsubs = cols.map((col, i) =>
            onSnapshot(collection(db, col), (s) =>
                setCounts(prev => ({ ...prev, [keys[i]]: s.size }))
            )
        );
        return () => unsubs.forEach(u => u());
    }, []);

    const stats = [
        { icon: Users,         label: 'Тренеров',  value: counts.coaches,      color: 'blue'   },
        { icon: Newspaper,     label: 'Новостей',  value: counts.news,         color: 'red'    },
        { icon: Image,         label: 'Фотографий',value: counts.photos,       color: 'green'  },
        { icon: ClipboardList, label: 'Заявок',    value: counts.applications, color: 'yellow' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">
                    Добро пожаловать в панель управления клубом
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-red-400" size={20} />
                    <h2 className="font-bold text-white">Быстрые действия</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { href: '/admin/news?new=1',         label: '+ Новость'    },
                        { href: '/admin/coaches?new=1',       label: '+ Тренер'     },
                        { href: '/admin/gallery',             label: '+ Фото'       },
                        { href: '/admin/applications',        label: 'Заявки'       },
                    ].map(({ href, label }) => (
                        <a key={href} href={href}
                           className="bg-gray-800 hover:bg-red-600/20 border
                         border-gray-700 hover:border-red-500/50
                         text-center py-3 rounded-xl text-sm
                         font-medium text-gray-300 hover:text-white
                         transition-all">
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}