import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Memastikan pengguna mengakses halaman ini dari tautan pemulihan
    useEffect(() => {
        // Supabase menyertakan token akses via hash URL (misal: #access_token=...)
        // Jika tidak ada hash (pengguna mencoba mengakses reset-password langsung), tolak.
        if (!location.hash && !location.search.includes('code=')) {
            navigate('/login');
        }
    }, [location, navigate]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Kata sandi tidak cocok.');
            return;
        }

        setLoading(true);
        setError(null);

        // Memperbarui sandi pengguna yang sesinya terotentikasi dari tautan masuk pemulihan
        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Jika sukses, lempar pengguna ke halaman login dengan pesan sukses
            navigate('/login', { state: { message: 'Kata sandi Anda berhasil diperbarui. Silakan masuk dengan sandi baru.' } });
        }
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
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Sandi Baru</h1>
                    <p className="text-slate-500 dark:text-slate-400">Silakan buat kata sandi baru untuk akun Anda.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi Baru</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                            placeholder="Minimal 6 karakter"
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Sandi Baru</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                            placeholder="Ketik ulang sandi"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : 'Simpan Sandi Baru'}
                    </button>
                </form>
            </div>
        </div>
    );
}
