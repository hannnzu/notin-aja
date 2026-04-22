import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const flashMessage = location.state?.message;
    const user = useAuthStore(state => state.user);

    useEffect(() => {
        // If user is already legally logged in, redirect them
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Intercept generic Invalid Credentials to add context about Email Verification
            if (error.message === 'Invalid login credentials') {
                setError('Email atau sandi salah, ATAU Anda belum memverifikasi email Anda. Periksa kotak masuk Anda.');
            } else {
                setError(error.message);
            }
        } else {
            navigate('/'); // Redirect to dashboard
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col justify-center items-center p-6 relative">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center -rotate-6 overflow-hidden shadow-sm">
                    <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-serif font-bold text-2xl tracking-tight text-slate-800 dark:text-slate-50">
                    Notin, <span className="text-primary italic">Aja!</span>
                </span>
            </div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Selamat Datang</h1>
                    <p className="text-slate-500 dark:text-slate-400">Masuk untuk melanjutkan aktivitas Anda.</p>
                </div>

                {flashMessage && (
                    <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-4 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-800">
                        {flashMessage}
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full mb-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Masuk dengan Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATAU EMAIL</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
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
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Kata Sandi</label>
                            <Link to="/forgot-password" className="flex-none text-xs text-primary hover:underline font-bold">Lupa Sandi?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : 'Masuk Sekarang'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Belum punya akun? <Link to="/register" className="text-primary hover:underline font-bold">Daftar sekarang</Link>
                </p>
            </div>
        </div>
    );
}
