import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load User Data & Theme on mount
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
    // Check local storage for theme preference
    const isDark = document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, [user]);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const updateProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Note: We're only updating full_name here. Updating email via Supabase Auth
    // requires email verification workflows unless disabled in dashboard.
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      if (data?.user) {
        setUser(data.user);
      }
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    }
    setLoading(false);
  };
  return (
    <div className="max-w-[1440px] mx-auto p-6 w-full relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Kelola preferensi akun dan aplikasi Anda.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-2xl shadow-sm">

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${message.type === 'error'
            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800'
            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
            }`}>
            {message.text}
          </div>
        )}

        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Profil Pengguna</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email <span className="text-xs font-normal text-slate-400">(Tidak dapat diubah)</span></label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold mt-8 mb-4 text-slate-900 dark:text-white">Tampilan</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Mode Gelap</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Beralih ke tema malam yang nyaman di mata.</p>
          </div>
          <button
            className={`w-14 h-7 rounded-full relative transition-colors cursor-pointer ${isDarkMode ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
            onClick={toggleDarkMode}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 left-1 transition-transform shadow-sm ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={updateProfile}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Simpan Perubahan Profil'}
          </button>
        </div>
      </div>
    </div>
  );
}
