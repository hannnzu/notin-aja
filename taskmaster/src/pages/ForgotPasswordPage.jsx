import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Kirim instruksi reset sandi ke email pengguna
        // Secara default, Supabase akan mengarahkan pengguna kembali ke URL asal atau URL yang di-whitelist
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col justify-center items-center p-6 relative">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center -rotate-6 overflow-hidden shadow-sm">
                    <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-black text-xl tracking-tight text-slate-800 dark:text-white">
                    Notin, Aja!
                </span>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Lupa Sandi</h1>
                    <p className="text-slate-500 dark:text-slate-400">Masukkan email Anda untuk menerima tautan pemulihan sandi.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Periksa Email Anda</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Kami telah mengirimkan tautan pemulihan kata sandi ke <strong>{email}</strong>.</p>
                        <Link
                            to="/login"
                            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center"
                        >
                            Kembali ke Halaman Masuk
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alamat Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : 'Kirim Tautan Pemulihan'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 text-center">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium transition-colors">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Kembali ke Halaman Masuk
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
