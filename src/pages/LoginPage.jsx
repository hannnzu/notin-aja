import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Left Panel: Visual Branding Showcase */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#2A1E1B] text-[#F2EFE8] relative overflow-hidden flex-col justify-between p-12 select-none">
                {/* Soft Gold Glowing Orbs in Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9A84C]/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9A84C]/10 blur-[120px] pointer-events-none"></div>
                
                {/* Top Logo branding */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-[#C9A84C] flex items-center justify-center -rotate-6 overflow-hidden shadow-md border border-[#D9C48A]/20">
                        <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif font-bold text-2xl tracking-tight text-white">
                        Notin, <span className="text-primary italic">Aja!</span>
                    </span>
                </div>

                {/* Center: Interactive Elegant Showcase */}
                <div className="my-auto relative z-10 flex flex-col items-start max-w-lg">
                    <h2 className="text-5xl font-serif font-semibold text-white leading-tight mb-4">
                        Atur Tugas dengan <br />
                        <span className="text-primary italic">Elegansi Klasik</span>
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 font-light leading-relaxed">
                        Platform manajemen produktivitas premium yang menggabungkan kemudahan Kanban Board dengan fleksibilitas struktur tugas bertingkat.
                    </p>

                    {/* Premium Mockup Card */}
                    <div className="w-full bg-[#3D2E2A]/80 backdrop-blur-md rounded-2xl p-6 border border-[#553F36]/60 shadow-2xl animate-float relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center justify-between mb-5 border-b border-[#553F36]/50 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full bg-red-500/80"></span>
                                <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></span>
                                <span className="w-3.5 h-3.5 rounded-full bg-green-500/80"></span>
                            </div>
                            <span className="text-xs uppercase font-bold text-[#C9A84C] tracking-widest bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/20">Kanban Board</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-[#2A1E1B]/50 p-3.5 rounded-xl border border-[#553F36]/40">
                                <span className="material-symbols-outlined text-primary text-xl">check_box</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">Finalisasi Design System</p>
                                    <p className="text-xs text-slate-400">Notin Aja! - Prioritas Tinggi</p>
                                </div>
                                <span className="text-[10px] font-bold bg-[#C9A84C] text-[#2A1E1B] px-2 py-0.5 rounded">Hari Ini</span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#2A1E1B]/30 p-3.5 rounded-xl border border-[#553F36]/20">
                                <span className="material-symbols-outlined text-slate-500 text-xl">check_box_outline_blank</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-300">Integrasi Database Real-time</p>
                                    <p className="text-xs text-slate-500">Supabase RLS & Sync</p>
                                </div>
                                <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">Besok</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer branding details */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                    <span>© {new Date().getFullYear()} Notin Aja!. Hak Cipta Dilindungi.</span>
                    <div className="flex gap-4">
                        <span className="hover:text-primary cursor-pointer transition-colors">Panduan</span>
                        <span className="hover:text-primary cursor-pointer transition-colors">Privasi</span>
                    </div>
                </div>
            </div>

            {/* Right Panel: Interactive Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                {/* Soft Background Radial Glow for Mobile */}
                <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>
                <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>

                {/* Top Logo for Mobile */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center -rotate-6 overflow-hidden shadow-sm">
                        <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-tight text-slate-800 dark:text-slate-50">
                        Notin, <span className="text-primary italic">Aja!</span>
                    </span>
                </div>

                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/60 shadow-xl relative z-10 animate-slide-up bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 font-serif">Selamat Datang</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk untuk melanjutkan aktivitas produktivitas Anda.</p>
                    </div>

                    {flashMessage && (
                        <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm font-medium border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">check_circle</span>
                            <span>{flashMessage}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-2.5 animate-pulse">
                            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full mb-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Masuk dengan Google
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATAU EMAIL</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Alamat Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                placeholder="nama@email.com"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-300">Kata Sandi</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark hover:underline font-bold transition-colors">Lupa Sandi?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[1px]"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : 'Masuk Sekarang'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Belum punya akun? <Link to="/register" className="text-primary hover:text-primary-dark hover:underline font-bold transition-colors">Daftar sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
