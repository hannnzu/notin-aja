import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingPage() {
  const { user, isInitialized } = useAuthStore();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState('dashboard');
  const [activeTechTab, setActiveTechTab] = useState('plans');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If user is already logged in, redirect them to the dashboard automatically
  if (isInitialized && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#1A1412] text-[#E8E4D9] font-sans selection:bg-[#C9A84C]/30 relative overflow-hidden flex flex-col transition-colors duration-300">
      {/* Radial Gradient Glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(201,168,76,0.18),_transparent_60%)] pointer-events-none"></div>

      {/* Header Nav */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 md:py-5 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-[#1A1412]/90 backdrop-blur-md border-b border-[#EDE9DF]/10 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center text-white overflow-hidden shadow-lg shadow-[#C9A84C]/25 border border-[#D9C48A]/10">
            <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-white">
            Notin, <span className="text-[#C9A84C] italic">Aja!</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
          <Link to="/login" className="text-[#E8E4D9]/80 hover:text-[#C9A84C] transition-colors">Masuk</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl border border-[#B5A89A]/30 text-[#E8E4D9] bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all">
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center pt-28 md:pt-36 px-6 text-center">
        <div className="max-w-4xl mx-auto mb-16 relative z-30">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#D9C48A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse"></span>
            RUANG TENANG PRODUKTIF
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-[1.15] mb-6 text-white drop-shadow-lg">
            Kembalikan ketenangan <br className="hidden md:inline" />
            <span className="italic text-[#C9A84C] font-light">di tengah kesibukan.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#B5A89A] font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Workspace tenang pengelola tugas. Memadukan estetika minimalis <span className="text-white font-medium">Warm Luxury</span> dengan ketangguhan pengelolaan tugas utama & sub-tugas secara terstruktur.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A84C] text-[#2A1E1B] font-bold tracking-wider uppercase hover:bg-[#A8894A] hover:translate-y-[-1px] transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_6px_24px_rgba(201,168,76,0.4)] active:translate-y-[1px]">
              Mulai Ruang Kerjamu
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-[#EDE9DF]/20 text-[#E8E4D9] font-medium tracking-wider uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-white/10 transition-all">
              Sudah Punya Akun?
            </Link>
          </div>
        </div>

        {/* Floating cards teaser */}
        <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[450px] mt-6 perspective-[1200px] flex justify-center select-none">
          <div className="absolute left-[5%] md:left-[15%] top-16 w-[280px] md:w-[350px] h-[75%] md:h-[85%] z-10 animate-float">
            <div className="w-full h-full rounded-2xl border border-[#EDE9DF]/10 overflow-hidden bg-[#F2EFE8] text-[#3D2E2A] flex flex-col relative text-left shadow-2xl">
              <div className="h-10 border-b border-[#D6D1C4] flex items-center px-4 justify-between bg-white/50">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B5147]">Ruang Tenang Personal</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]"></span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="w-24 h-4 bg-[#B5A89A] rounded-full mb-1"></div>
                <div className="bg-white rounded-xl p-3 border border-[#D6D1C4] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Proyek Utama</span>
                    <span className="text-[10px] font-bold text-[#6B5147]">80%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[80%] h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-[#D6D1C4] shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Riset Pasar</span>
                    <span className="text-[10px] font-bold text-[#6B5147]">45%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-[5%] md:right-[15%] top-0 w-[280px] md:w-[350px] h-[75%] md:h-[85%] z-20 animate-float" style={{ animationDelay: '-3s' }}>
            <div className="w-full h-full rounded-2xl border border-[#EDE9DF]/10 overflow-hidden bg-[#3D2E2A] text-[#F2EFE8] flex flex-col relative text-left shadow-2xl">
              <div className="h-10 border-b border-[#2A1E1B] flex items-center px-4 justify-between bg-[#2A1E1B]/50">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">Kanban Board Aktif</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="w-32 h-4 bg-[#C9A84C]/20 rounded-full mb-1"></div>
                <div className="bg-[#2A1E1B] rounded-xl p-3 border border-[#4B3630] flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#C9A84C] text-lg">check_box</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white leading-none mb-1">Implementasi RLS Supabase</p>
                    <span className="text-[8px] uppercase tracking-wider text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded">Prioritas Tinggi</span>
                  </div>
                </div>
                <div className="bg-[#2A1E1B] rounded-xl p-3 border border-[#4B3630] flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-500 text-lg">check_box_outline_blank</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-300 leading-none mb-1">Audit Benchmark Kinerja</p>
                    <span className="text-[8px] uppercase tracking-wider text-yellow-400 font-bold bg-yellow-950/40 px-1.5 py-0.5 rounded">Menengah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Core Section */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1A1412] px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Mereduksi Kebisingan, Meningkatkan Fokus</h2>
          <p className="text-[#B5A89A] max-w-xl mx-auto text-sm md:text-base font-light">Notin Aja! didesain secara presisi untuk meniadakan keletihan mental dari antarmuka digital yang padat.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-left">
          <div className="p-6 bg-[#2A1E1B]/35 border border-[#553F36]/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">spa</span>
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Desain Ketenangan Jiwa</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm">
              Skema warna Warm Luxury (Ash White, Linen, Deep Mocha) memberikan kenyamanan visual alami dan mencegah ketegangan mata selama berjam-jam bekerja.
            </p>
          </div>
          <div className="p-6 bg-[#2A1E1B]/35 border border-[#553F36]/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">speed</span>
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Performa Tanpa Hambatan</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm">
              Waktu muat workspace instan berkat bundler Vite, didukung sinkronisasi state lokal Zustand berkinerja tinggi O(1) untuk responsivitas maksimal.
            </p>
          </div>
          <div className="p-6 bg-[#2A1E1B]/35 border border-[#553F36]/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Keamanan & Privasi Mutlak</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm">
              Data Anda terenkripsi secara aman dan diisolasi secara mutlak di tingkat database menggunakan Row Level Security (RLS) PostgreSQL Supabase.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Explorer (Promotional Copywriting based on PRD.md) */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1F1816] px-6 py-20 md:py-28 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Fitur Utama Ruang Kerja Anda</h2>
            <p className="text-[#B5A89A] max-w-xl mx-auto font-light text-sm md:text-base">
              Menghadirkan fitur-fitur tangguh yang didesain secara estetis untuk membantu Anda menyusun rencana hidup teratur.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            {[
              { id: 'dashboard', label: 'Ringkasan Fokus', icon: 'space_dashboard' },
              { id: 'hierarchy', label: 'Tugas Utama & Sub-Tugas', icon: 'account_tree' },
              { id: 'kanban', label: 'Kanban Board Visual', icon: 'view_kanban' },
              { id: 'categories', label: 'Kategori Kustom', icon: 'palette' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  activeFeatureTab === tab.id
                    ? 'bg-[#C9A84C] text-[#2A1E1B] shadow-lg shadow-[#C9A84C]/15 translate-y-[-1px]'
                    : 'bg-[#2A1E1B] text-[#B5A89A] border border-[#EDE9DF]/5 hover:bg-[#2A1E1B]/80 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Feature Display Grid */}
          <div className="bg-[#2A1E1B] border border-[#553F36]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[380px] flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Display Left Side: Copywriting */}
            <div className="w-full md:w-1/2 text-left z-10">
              {activeFeatureTab === 'dashboard' && (
                <div className="animate-slide-up">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20 mb-4 inline-block">Ringkasan Fokus</span>
                  <h3 className="font-serif text-3xl text-white mb-4">Pantau Progres Tanpa Kelelahan Kognitif</h3>
                  <p className="text-[#B5A89A] font-light leading-relaxed mb-6 text-sm">
                    Ruang ringkasan personal kami menyajikan metrik penting secara instan. Lihat sisa agenda hari ini, tugas berprioritas tinggi, status penyelesaian tugas, serta diagram progress bar distribusi kategori dalam satu hamparan yang tenang.
                  </p>
                  <ul className="space-y-2.5 text-xs md:text-sm text-[#E8E4D9]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Ringkasan instan sisa tugas harian Anda secara dinamis.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Pelacakan otomatis tugas berkategori "Prioritas Tinggi".</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Diagram distribusi kategori dengan sinkronisasi warna database.</li>
                  </ul>
                </div>
              )}
              {activeFeatureTab === 'hierarchy' && (
                <div className="animate-slide-up">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20 mb-4 inline-block">Tugas Utama & Sub-Tugas</span>
                  <h3 className="font-serif text-3xl text-white mb-4">Pecah Kompleksitas Rencana Anda</h3>
                  <p className="text-[#B5A89A] font-light leading-relaxed mb-6 text-sm">
                    Jangan biarkan rencana besar mengintimidasi kedamaian hari Anda. Hubungkan sub-tugas di bawah tugas utama secara berlapis dan terstruktur. Didesain dengan alur visual bersangkar yang bersih untuk kemudahan pemantauan ketergantungan tugas.
                  </p>
                  <ul className="space-y-2.5 text-xs md:text-sm text-[#E8E4D9]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Hubungan nested task bertingkat (parent-child relationship) yang rapi.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Cycle-detection engine untuk mencegah looping hubungan melingkar.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Fokus visual instan pada rumpun tugas utama di Tasks Page.</li>
                  </ul>
                </div>
              )}
              {activeFeatureTab === 'kanban' && (
                <div className="animate-slide-up">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20 mb-4 inline-block">Kanban Board Visual</span>
                  <h3 className="font-serif text-3xl text-white mb-4">Gerakan Taktil yang Memuaskan</h3>
                  <p className="text-[#B5A89A] font-light leading-relaxed mb-6 text-sm">
                    Organisasikan status pekerjaan secara grafis di Kanban Board. Dengan gestur seret-dan-lepas (drag-and-drop) ditenagai `@hello-pangea/dnd`, status tugas terbarui secara real-time dari "Belum Dimulai", "Sedang Dikerjakan", hingga "Selesai".
                  </p>
                  <ul className="space-y-2.5 text-xs md:text-sm text-[#E8E4D9]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Perpindahan kartu tugas mulus dengan responsive drop area indicator.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Tombol cepat tambah tugas langsung di bagian bawah setiap kolom.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Actions card menu langsung pada board untuk edit & delete instan.</li>
                  </ul>
                </div>
              )}
              {activeFeatureTab === 'categories' && (
                <div className="animate-slide-up">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20 mb-4 inline-block">Kustomisasi Kategori</span>
                  <h3 className="font-serif text-3xl text-white mb-4">Warna & Ikon Sesuai Dimensi Hidup Anda</h3>
                  <p className="text-[#B5A89A] font-light leading-relaxed mb-6 text-sm">
                    Pisahkan prioritas pekerjaan, hobi, belanja, dan keluarga secara instan. Buat kategori baru dengan color picker yang menawarkan 8 warna premium, serta tentukan ikon representatif agar langsung teridentifikasi di sidebar utama.
                  </p>
                  <ul className="space-y-2.5 text-xs md:text-sm text-[#E8E4D9]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Penambahan kategori langsung di dalam modal form tugas.</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Pemisahan form modal berbasis Tab (Info Utama & Sub-Tugas).</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full"></span> Autocomplete saran checklist sub-tugas berdasar riwayat terdahulu.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Display Right Side: Render Visual Mockup */}
            <div className="w-full md:w-1/2 flex justify-center z-10">
              {activeFeatureTab === 'dashboard' && (
                <div className="w-full bg-[#1A1412] rounded-2xl p-5 border border-[#553F36]/40 flex flex-col gap-4 max-w-sm animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-[#553F36]/20 pb-3">
                    <span className="text-xs font-bold text-white">Ringkasan Hari Ini</span>
                    <span className="text-[10px] text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded font-bold">4 Agenda Aktif</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#2A1E1B] p-3 rounded-xl border border-slate-700/20">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tugas Sisa</div>
                      <div className="text-xl font-bold text-white mt-1">3 Tugas</div>
                    </div>
                    <div className="bg-[#2A1E1B] p-3 rounded-xl border border-slate-700/20">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Prioritas</div>
                      <div className="text-xl font-bold text-red-400 mt-1">1 Kritis</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Progres Kategori "Kerjaan"</span>
                      <span className="font-bold text-white">75%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="w-[75%] h-full bg-[#C9A84C] rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
              {activeFeatureTab === 'hierarchy' && (
                <div className="w-full bg-[#1A1412] rounded-2xl p-5 border border-[#553F36]/40 flex flex-col gap-3 max-w-sm animate-fade-in text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C9A84C]">
                    <span className="material-symbols-outlined text-[16px]">folder_open</span> Projek Website Pemasaran
                  </div>
                  <div className="pl-6 border-l border-[#553F36]/60 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="material-symbols-outlined text-[14px]">subdirectory_arrow_right</span> Tinjau Rencana Pemasaran
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="material-symbols-outlined text-[14px]">subdirectory_arrow_right</span> Hubungkan Workspace Aman
                    </div>
                    <div className="pl-6 border-l border-[#553F36]/40 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="material-symbols-outlined text-[12px]">subdirectory_arrow_right</span> Aktifkan Batasan Keamanan
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeFeatureTab === 'kanban' && (
                <div className="w-full bg-[#1A1412] rounded-2xl p-4 border border-[#553F36]/40 flex flex-col gap-3 max-w-sm animate-fade-in text-left shadow-lg">
                  <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-[#B5A89A] uppercase tracking-wider">
                    <div className="bg-[#2A1E1B] py-1 rounded">Kemarin</div>
                    <div className="bg-[#C9A84C]/10 text-[#C9A84C] py-1 rounded border border-[#C9A84C]/20">Aktif</div>
                    <div className="bg-[#2A1E1B] py-1 rounded">Selesai</div>
                  </div>
                  <div className="bg-[#2A1E1B] rounded-xl p-3 border border-slate-700/30">
                    <p className="text-xs font-bold text-white mb-1">Rilis Versi 1.0</p>
                    <span className="text-[8px] bg-red-950/40 text-red-400 font-bold px-1.5 py-0.5 rounded">Prioritas Tinggi</span>
                  </div>
                  <div className="bg-[#2A1E1B] rounded-xl p-3 border border-[#C9A84C]/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 bg-[#C9A84C] h-full"></div>
                    <p className="text-xs font-bold text-white mb-1">Riset Kompetitor B2C</p>
                    <span className="text-[8px] bg-[#C9A84C]/10 text-[#C9A84C] font-bold px-1.5 py-0.5 rounded">Menengah</span>
                  </div>
                </div>
              )}
              {activeFeatureTab === 'categories' && (
                <div className="w-full bg-[#1A1412] rounded-2xl p-5 border border-[#553F36]/40 flex flex-wrap gap-2.5 max-w-sm justify-center items-center animate-fade-in">
                  {[
                    { name: 'Pekerjaan', bg: 'bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]' },
                    { name: 'Kolektif', bg: 'bg-blue-950/40 border-blue-800/40 text-blue-400' },
                    { name: 'Desain', bg: 'bg-purple-950/40 border-purple-800/40 text-purple-400' },
                    { name: 'Supabase', bg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400' },
                    { name: 'Riset', bg: 'bg-amber-950/40 border-amber-800/40 text-amber-400' }
                  ].map(cat => (
                    <span key={cat.name} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${cat.bg}`}>
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Standar & Paket Ruang Kerja Section */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#120D0C] px-6 py-20 md:py-28 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#D9C48A]">
              <span className="material-symbols-outlined text-[14px]">settings_suggest</span>
              Standar & Paket Layanan
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Jaminan Kenyamanan Bekerja</h2>
            <p className="text-[#B5A89A] max-w-xl mx-auto font-light text-sm">
              Lihat bagaimana kami merancang standar kenyamanan, fungsionalitas cerdas, dan pilihan paket ruang kerja yang tepat untuk Anda.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Tab Selectors */}
            <div className="w-full lg:w-1/4 flex flex-row lg:flex-col flex-wrap gap-2 shrink-0">
              {[
                { id: 'plans', label: 'Paket & Fitur Layanan', icon: 'payments' },
                { id: 'functional', label: 'Fitur Kenyamanan', icon: 'featured_play_list' },
                { id: 'comfort', label: 'Jaminan Keandalan', icon: 'verified_user' }
              ].map(techTab => (
                <button
                  key={techTab.id}
                  onClick={() => setActiveTechTab(techTab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all justify-start ${
                    activeTechTab === techTab.id
                      ? 'bg-[#2A1E1B] text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_4px_16px_rgba(201,168,76,0.1)]'
                      : 'bg-transparent text-[#B5A89A] hover:bg-[#2A1E1B]/50 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{techTab.icon}</span>
                  {techTab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents Area */}
            <div className="w-full lg:w-3/4 bg-[#2A1E1B] border border-[#553F36]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden min-h-[400px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl pointer-events-none"></div>

              {activeTechTab === 'plans' && (
                <div className="animate-fade-in space-y-6">
                  <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C9A84C]">payments</span> Pilihan Paket Workspace Anda
                  </h3>
                  <p className="text-[#B5A89A] text-sm font-light leading-relaxed">
                    Kami menyusun skema paket yang adil untuk memfasilitasi penggunaan personal mandiri hingga kebutuhan kolaborasi rumpun tim:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                    {/* Free Card */}
                    <div className="bg-[#1A1412] p-5 rounded-2xl border border-[#553F36]/40 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">Ruang Tenang Dasar</span>
                        <h4 className="text-white font-serif text-lg mt-2 mb-1">Paket Gratis</h4>
                        <p className="text-[#C9A84C] font-bold text-sm mb-4">Rp 0 <span className="text-[10px] text-slate-400 font-normal">/ selamanya</span></p>
                        <ul className="text-slate-300 text-[11px] space-y-2 mb-6">
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Tugas utama & sub-tugas tanpa batas</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Kanban Board visual dasar</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Maksimal 4 kategori kustom</li>
                        </ul>
                      </div>
                      <Link to="/register" className="w-full text-center py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-bold block transition-all">Mulai Sekarang</Link>
                    </div>

                    {/* Premium Card */}
                    <div className="bg-[#1A1412] p-5 rounded-2xl border border-[#C9A84C]/40 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#C9A84C] text-[#2A1E1B] text-[8px] font-bold px-2 py-0.5 rounded-bl uppercase tracking-wider">Populer</div>
                      <div>
                        <span className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-widest bg-[#C9A84C]/10 px-2 py-0.5 rounded border border-[#C9A84C]/25">Ruang Kerja Premium</span>
                        <h4 className="text-white font-serif text-lg mt-2 mb-1">Paket Premium</h4>
                        <p className="text-[#C9A84C] font-bold text-sm mb-4">$4.99 <span className="text-[10px] text-slate-400 font-normal">/ bulan</span></p>
                        <ul className="text-slate-300 text-[11px] space-y-2 mb-6">
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[#C9A84C] text-xs">done</span> Kategori kustom tanpa batas</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[#C9A84C] text-xs">done</span> Saran checklist otomatis yang cerdas</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[#C9A84C] text-xs">done</span> 4+ Pilihan tema visual eksklusif</li>
                        </ul>
                      </div>
                      <Link to="/register" className="w-full text-center py-2 bg-[#C9A84C] hover:bg-[#A8894A] text-[#2A1E1B] rounded-lg text-xs font-bold block transition-all">Dapatkan Premium</Link>
                    </div>

                    {/* Team Card */}
                    <div className="bg-[#1A1412] p-5 rounded-2xl border border-[#553F36]/40 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">Sinergi Rumpun Tim</span>
                        <h4 className="text-white font-serif text-lg mt-2 mb-1">Kolaborasi Tim</h4>
                        <p className="text-[#C9A84C] font-bold text-sm mb-4">$8.00 <span className="text-[10px] text-slate-400 font-normal">/ user / bulan</span></p>
                        <ul className="text-slate-300 text-[11px] space-y-2 mb-6">
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Workspace Bersama Rumpun Tim</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Penugasan & Catatan Real-time</li>
                          <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-green-500 text-xs">done</span> Kontrol akses keamanan tim</li>
                        </ul>
                      </div>
                      <button className="w-full py-2 bg-slate-850 text-slate-500 rounded-lg text-xs font-bold cursor-not-allowed" disabled>Segera Hadir</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTechTab === 'functional' && (
                <div className="animate-fade-in space-y-6">
                  <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C9A84C]">featured_play_list</span> Kemudahan Menata Tugas Harian Anda
                  </h3>
                  <p className="text-[#B5A89A] text-sm font-light">
                    Kelebihan utama ruang kerja Notin Aja! yang didesain secara sederhana untuk kenyamanan pengaturan agenda Anda:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex gap-3">
                      <span className="material-symbols-outlined text-[#C9A84C] shrink-0">visibility</span>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Penyingkap Kata Sandi</h4>
                        <p className="text-xs text-slate-400">Ketik sandi Anda tanpa ragu. Anda dapat melihat kembali kata sandi yang diketik agar tidak keliru saat masuk.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex gap-3">
                      <span className="material-symbols-outlined text-[#C9A84C] shrink-0">tab</span>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Formulir yang Rapi & Ringkas</h4>
                        <p className="text-xs text-slate-400">Pengisian informasi tugas dibagi menjadi dua lembar terpisah (Info Utama & Sub-Tugas) sehingga tidak terasa padat.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex gap-3">
                      <span className="material-symbols-outlined text-[#C9A84C] shrink-0">input_circle</span>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Pencarian Cepat & Instan</h4>
                        <p className="text-xs text-slate-400">Cukup ketik beberapa huruf, tugas yang Anda cari langsung tersaring di layar tanpa jeda loading.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex gap-3">
                      <span className="material-symbols-outlined text-[#C9A84C] shrink-0">calendar_month</span>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Sering Tanggal Tugas Kalender</h4>
                        <p className="text-xs text-slate-400">Saring tugas harian Anda langsung berdasarkan tanggal tertentu pada kalender interaktif untuk menjaga fokus.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTechTab === 'comfort' && (
                <div className="animate-fade-in space-y-6">
                  <h3 className="font-serif text-2xl text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C9A84C]">verified_user</span> Jaminan Kenyamanan & Keandalan
                  </h3>
                  <p className="text-[#B5A89A] text-sm font-light leading-relaxed">
                    Kami merancang teknologi di balik layar agar ruang kerja Anda tetap andal, aman, dan menenangkan:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex items-start gap-4">
                      <div className="w-10 h-10 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">sync</span>
                      </div>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Penyelarasan Instan Antar-Perangkat</h4>
                        <p className="text-xs text-[#B5A89A] font-light">Setiap perubahan catatan yang Anda buat di laptop akan langsung muncul di aplikasi ponsel Anda secara otomatis tanpa perlu memuat ulang halaman.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex items-start gap-4">
                      <div className="w-10 h-10 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">contrast</span>
                      </div>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Keterbacaan yang Nyaman & Teduh di Mata</h4>
                        <p className="text-xs text-[#B5A89A] font-light">Kombinasi warna prioritas tugas dan label kategori disesuaikan secara khusus agar memiliki kontras tinggi yang nyaman dibaca tanpa melelahkan mata Anda.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#1A1412] rounded-xl border border-[#553F36]/20 flex items-start gap-4">
                      <div className="w-10 h-10 rounded bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">fingerprint</span>
                      </div>
                      <div>
                        <h4 className="text-white font-serif text-md mb-1">Privasi Catatan Terkunci Rapat</h4>
                        <p className="text-xs text-[#B5A89A] font-light">Catatan tugas Anda diisolasi secara penuh dari pengguna lain demi keamanan privasi Anda. Hanya Anda yang memiliki kunci untuk melihat dan mengelolanya.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How to Start Section (3 Simple Steps to Login/SignUp) */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1A1412] px-6 py-20 md:py-28 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Cara Memulai dalam 3 Langkah</h2>
            <p className="text-[#B5A89A] max-w-xl mx-auto font-light text-sm md:text-base">Mulai atur hidup Anda dengan Notin Aja! hanya dalam hitungan detik.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center font-serif text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Buat Akun Anda</h3>
              <p className="text-[#9C7E74] text-sm font-light max-w-xs">
                Daftar akun gratis dengan email terverifikasi, atau masuk langsung menggunakan akun Google Anda secara instan.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center font-serif text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Tentukan Kategori Kustom</h3>
              <p className="text-[#9C7E74] text-sm font-light max-w-xs">
                Grupkan tugas Anda ke dalam kategori seperti "Kerjaan", "Pribadi", atau "Desain" dengan 8 pilihan warna satin yang mewah.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center font-serif text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Atur Rumpun Tugas</h3>
              <p className="text-[#9C7E74] text-sm font-light max-w-xs">
                Buat tugas utama, hubungkan dengan sub-tugas bersarang (tugas utama & sub-tugas), dan seret kartu tugas di Kanban Board Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1F1816] px-6 py-20 md:py-28 text-left">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-[#B5A89A] max-w-xl mx-auto font-light text-sm">Temukan jawaban atas fungsionalitas dan keamanan akun Anda di Notin Aja!.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Apakah Notin Aja! sepenuhnya gratis?',
                a: 'Ya, paket dasar Notin Aja! dapat Anda gunakan secara gratis selamanya. Anda sudah mendapatkan akses ke manajemen tugas utama & sub-tugas bersarang, visual Kanban Board, serta sinkronisasi data real-time ke cloud secara aman.'
              },
              {
                q: 'Apakah catatan tugas saya aman dan tidak bisa dilihat pengguna lain?',
                a: 'Sangat aman. Setiap tugas yang Anda buat dilindungi oleh sistem keamanan tingkat tinggi. Catatan Anda dikunci secara khusus sehingga tidak ada pengguna lain yang dapat melihat, mengubah, atau menyalahgunakan data Anda.'
              },
              {
                q: 'Bagaimana cara menyinkronkan data di laptop dan ponsel?',
                a: 'Semuanya terjadi secara otomatis. Saat Anda menulis tugas di laptop, perubahan tersebut akan langsung muncul di aplikasi ponsel Anda secara instan tanpa perlu menekan tombol sinkronisasi atau memuat ulang halaman.'
              },
              {
                q: 'Apakah saya bisa membuat checklist kecil di dalam tugas?',
                a: 'Tentu saja. Setiap tugas dilengkapi dengan checklist dinamis untuk membagi langkah-langkah kecil pekerjaan Anda. Anda juga akan melihat bar persentase yang menunjukkan seberapa dekat Anda menyelesaikan tugas tersebut.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#2A1E1B] border border-[#553F36]/30 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white font-bold font-serif text-md md:text-lg hover:bg-[#2A1E1B]/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 text-[#C9A84C] ${faqOpenIndex === index ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    faqOpenIndex === index ? 'max-h-[300px] border-t border-[#553F36]/30 p-5 bg-[#1F1816]/30' : 'max-h-0'
                  }`}
                >
                  <p className="text-[#B5A89A] text-sm font-light leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1A1412] px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#2A1E1B] to-[#1F1816] border border-[#C9A84C]/25 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,168,76,0.05),_transparent_70%)] pointer-events-none"></div>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Kembalikan Ketenangan Hidup Anda</h2>
          <p className="text-[#B5A89A] text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed mb-8">
            Dapatkan pengalaman mengelola agenda harian secara tenang, efisien, dan presisi dengan gaya Warm Luxury yang elegan.
          </p>
          <Link to="/register" className="inline-block px-8 py-4 rounded-xl bg-[#C9A84C] text-[#2A1E1B] font-bold tracking-wider uppercase hover:bg-[#A8894A] transition-all shadow-[0_4px_16px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_20px_rgba(201,168,76,0.35)] hover:translate-y-[-1px] active:translate-y-[1px]">
            Buat Akun Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 border-t border-[#B5A89A]/10 py-8 bg-[#120D0C] text-center text-[#6B5147] text-xs md:text-sm tracking-widest uppercase flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-4">
        <p>&copy; {new Date().getFullYear()} Notin, Aja!. Hak Cipta Dilindungi.</p>
        <div className="flex gap-6 text-[10px] md:text-xs">
          <span className="hover:text-[#C9A84C] cursor-pointer transition-colors">Panduan</span>
          <span className="hover:text-[#C9A84C] cursor-pointer transition-colors">Privasi</span>
          <span className="hover:text-[#C9A84C] cursor-pointer transition-colors">Syarat Layanan</span>
        </div>
      </footer>
    </div>
  );
}
