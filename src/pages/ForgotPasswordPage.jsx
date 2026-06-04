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
                        Pemulihan Akses <br />
                        <span className="text-primary italic">Tanpa Hambatan</span>
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 font-light leading-relaxed">
                        Kami membantu Anda kembali ke jalur produktivitas dengan aman. Cukup masukkan email terdaftar Anda untuk menerima instruksi pemulihan.
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
                            <span className="text-xs uppercase font-bold text-[#C9A84C] tracking-widest bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/20">Keamanan Akun</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-[#2A1E1B]/40 p-3.5 rounded-xl border border-[#553F36]/20">
                                <span className="material-symbols-outlined text-primary text-xl">lock_reset</span>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">Reset Sandi Instan</p>
                                    <p className="text-xs text-slate-400">Tautan aman langsung ke kotak masuk</p>
                                </div>
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
                    {error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-start gap-2.5 animate-pulse">
                            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-bounce">
                                <span className="material-symbols-outlined text-[40px]">mark_email_read</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 font-serif">Periksa Email Anda</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                                Kami telah mengirimkan tautan pemulihan kata sandi ke <strong>{email}</strong>. Silakan klik tautan tersebut untuk mengatur ulang kata sandi Anda.
                            </p>
                            <Link
                                to="/login"
                                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-900/60 text-[#3D2E2A] dark:text-slate-200 rounded-xl font-bold transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 active:scale-[0.98]"
                            >
                                Kembali ke Halaman Masuk
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2 font-serif">Lupa Sandi</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Masukkan email Anda untuk menerima tautan pemulihan sandi.</p>
                            </div>

                            <form onSubmit={handleReset} className="space-y-5">
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-[1px]"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : 'Kirim Tautan Pemulihan'}
                                </button>
                            </form>
                        </>
                    )}

                    {!success && (
                        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-700/50 pt-6">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light font-bold transition-colors">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Kembali ke Halaman Masuk
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
