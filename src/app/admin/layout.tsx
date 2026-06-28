'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Layout/Sidebar';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center
                    justify-center">
            <div className="text-red-500 font-black text-2xl animate-pulse">
                ПАРФЕНТЬЕВ
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Sidebar />
            <main className="ml-64 p-8 min-h-screen">{children}</main>
        </div>
    );
}