'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import {
    LayoutDashboard, Newspaper, Image, Users,
    Calendar, ClipboardList, LogOut,
} from 'lucide-react';

const links = [
    { href: '/admin',              icon: LayoutDashboard, label: 'Dashboard'  },
    { href: '/admin/news',         icon: Newspaper,       label: 'Новости'    },
    { href: '/admin/gallery',      icon: Image,           label: 'Галерея'    },
    { href: '/admin/coaches',      icon: Users,           label: 'Тренеры'    },
    { href: '/admin/schedule',     icon: Calendar,        label: 'Расписание' },
    { href: '/admin/applications', icon: ClipboardList,   label: 'Заявки'     },
];

export default function Sidebar() {
    const path = usePathname();
    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r
                      border-gray-800 flex flex-col z-40">
            <div className="p-6 border-b border-gray-800">
        <span className="text-red-500 font-black text-xl tracking-wider">
          ПАРФЕНТЬЕВ
        </span>
                <span className="text-gray-400 text-sm block mt-1">Админ-панель</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map(({ href, icon: Icon, label }) => {
                    const active = path === href;
                    return (
                        <Link key={href} href={href}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg
                          text-sm font-medium transition-all
                          ${active
                                  ? 'bg-red-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button onClick={() => signOut(auth)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg
                     text-sm font-medium text-gray-400
                     hover:bg-gray-800 hover:text-red-400 w-full transition-all">
                    <LogOut size={18} /> Выйти
                </button>
            </div>
        </aside>
    );
}