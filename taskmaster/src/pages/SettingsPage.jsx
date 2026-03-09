export default function SettingsPage() {
  return (
    <div className="max-w-[1440px] mx-auto p-6 w-full relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
        <p className="text-slate-500 mt-1">Kelola preferensi akun dan aplikasi Anda.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-2xl">
        <h3 className="text-lg font-bold mb-4">Profil Pengguna</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama</label>
            <input type="text" defaultValue="Alex Rivers" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold mt-8 mb-4">Tampilan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Mode Gelap</p>
            <p className="text-sm text-slate-500">Ubah tema aplikasi menjadi gelap.</p>
          </div>
          <button className="w-12 h-6 bg-slate-300 dark:bg-primary rounded-full relative transition-colors cursor-pointer" onClick={() => document.documentElement.classList.toggle('dark')}>
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 dark:translate-x-6 transition-transform"></div>
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
