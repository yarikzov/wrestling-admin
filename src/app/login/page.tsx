'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [pass, setPass]   = useState('');
    const [err, setErr]     = useState('');
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErr('');
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            router.push('/admin');
        } catch {
            setErr('Неверный логин или пароль');
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center
                    justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8
                      border border-gray-800 shadow-2xl">
                <div className="text-center mb-8">
                    <span className="text-red-500 font-black text-3xl">ПАРФЕНТЬЕВ</span>
                    <p className="text-gray-400 mt-2">Вход в административную панель</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input type="email" value={email}
                               onChange={e => setEmail(e.target.value)}
                               className="w-full bg-gray-800 text-white border border-gray-700
                         rounded-lg px-4 py-3 focus:outline-none
                         focus:border-red-500 transition"
                               placeholder="admin@club.ru" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Пароль</label>
                        <input type="password" value={pass}
                               onChange={e => setPass(e.target.value)}
                               className="w-full bg-gray-800 text-white border border-gray-700
                         rounded-lg px-4 py-3 focus:outline-none
                         focus:border-red-500 transition"
                               placeholder="••••••••" required />
                    </div>
                    {err && <p className="text-red-400 text-sm">{err}</p>}
                    <button type="submit"
                            className="w-full bg-red-600 hover:bg-red-500 text-white
                       font-bold py-3 rounded-lg transition-all
                       transform hover:scale-[1.02] active:scale-[0.98]">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}