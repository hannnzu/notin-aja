import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

const registerSchema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            // Keep user on the page and show explicit inbox-check message
            setSuccessMsg("Keajaiban dimulai! Kami telah mengirim tautan konfirmasi ke email Anda. Silakan periksa Inbox (atau folder Spam) lalu klik tautan tersebut sebelum masuk.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col justify-center items-center p-6 relative">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center -rotate-6">
                    <span className="material-symbols-outlined text-white text-xl">done_all</span>
                </div>
                <span className="font-display font-black text-xl tracking-tight text-slate-800 dark:text-white">
                    Notin, Aja!
                </span>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Buat Akun</h1>
                    <p className="text-slate-500 dark:text-slate-400">Bergabunglah dan mulai atur tugas Anda hari ini.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                {successMsg ? (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-[40px]">mark_email_read</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Satu Langkah Lagi!</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                            {successMsg}
                        </p>
                        <Link
                            to="/login"
                            className="w-full inline-block py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30"
                        >
                            Ke Halaman Masuk
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alamat Email</label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white`}
                                placeholder="nama@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi</label>
                            <input
                                type="password"
                                {...register('password')}
                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : 'Daftar Sekarang'}
                        </button>
                    </form>
                )}

                <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Sudah punya akun? <Link to="/login" className="text-primary hover:underline font-bold">Masuk di sini</Link>
                </p>
            </div>
        </div>
    );
}
