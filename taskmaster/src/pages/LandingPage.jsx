import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LandingPage() {
  const { user, isInitialized } = useAuthStore();
  const [scrollY, setScrollY] = useState(0);

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

  return (
    <div className="min-h-screen bg-[#1A1412] text-[#E8E4D9] font-sans selection:bg-[#C9A84C]/30 relative overflow-hidden flex flex-col">
      {/* Radial Gradient Glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(201,168,76,0.15),_transparent_50%)] pointer-events-none"></div>

      {/* Header Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 border-b border-[#EDE9DF]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden shadow-lg shadow-primary/20">
            <img src="/notin.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-slate-50">
            Notin, <span className="text-primary italic">Aja!</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium tracking-wider uppercase">
          <Link to="/login" className="text-[#9C7E74] hover:text-[#C9A84C] transition-colors hidden md:block">Masuk</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg border border-[#B5A89A]/30 text-[#E8E4D9] hover:bg-white/5 hover:border-[#C9A84C] transition-all">
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center mt-12 md:mt-24 px-4">

        {/* Copywriting */}
        <div className="max-w-4xl mx-auto text-center mb-16 relative z-30">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#D9C48A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse"></span>
            Pantau Terus Tugasmu!
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight mb-6 text-white drop-shadow-lg">
            Produktivitas Harian,<br />
            <span className="italic text-[#C9A84C]">Memberikan kemudahan dalam mengatur tugas-tugasmu.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#9C7E74] font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Pantau aktivitasmu, atur tugas-tugas harianmu, dan tetap teratur dengan Notin, Aja!.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A84C] text-[#3D2E2A] font-bold tracking-wider uppercase hover:bg-[#A8894A] transition-all shadow-[0_0_40px_-10px_rgba(201,168,76,0.5)]">
              Mulai Ruang Kerjamu
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-[#9C7E74]/30 text-[#D6D1C4] font-medium tracking-wider uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
              Sudah Punya Akun?
            </Link>
          </div>
        </div>

        {/* Cinematic 3D Showcase Arena */}
        <div className="relative w-full max-w-6xl mx-auto h-[450px] md:h-[650px] mt-10 perspective-[1200px] flex justify-center">

          {/* Teks Penjelas Kiri (Absolute to Arena, Z-50) */}
          <div 
            className="hidden md:block absolute left-0 lg:left-[5%] top-1/4 w-56 transition-all duration-700 pointer-events-none text-right z-50"
            style={{ 
              opacity: scrollY > 100 ? 1 : 0, 
              transform: `translateX(${scrollY > 100 ? '0px' : '-20px'})` 
            }}
          >
            <div className="absolute top-4 -right-12 w-10 h-[1px] bg-[#C9A84C]/50"></div>
            <h4 className="font-serif text-[#C9A84C] text-xl mb-1">Indikator Cerdas</h4>
            <p className="text-[#9C7E74] text-xs leading-relaxed drop-shadow-md">Representasi visual elegan dari kompartemen kehidupan Anda.</p>
          </div>
          
          {/* Left Mockup Wrapper (Scroll Tracker) */}
          <div 
            className="absolute left-[5%] md:left-[22%] top-10 w-[300px] md:w-[350px] h-[80%] md:h-[90%] z-10 transition-transform duration-100 ease-linear"
            style={{ 
              transform: `translateX(-${Math.min(scrollY * 0.12, 120)}px) translateY(-${Math.min(scrollY * 0.08, 60)}px) rotateY(${5 + Math.min(scrollY * 0.03, 15)}deg) rotateX(5deg)` 
            }}
          >
            {/* Float Animator */}
            <div className="w-full h-full animate-[float_6s_ease-in-out_infinite]">
            <div className="w-full h-full rounded-2xl md:rounded-3xl border border-[#EDE9DF]/10 overflow-hidden bg-[#F2EFE8] flex flex-col relative" style={{ boxShadow: '-20px 30px 60px rgba(0,0,0,0.8)' }}>
              {/* Fake Top Nav */}
              <div className="h-10 md:h-12 border-b border-[#D6D1C4] flex items-center px-4 justify-between bg-white/60">
                <div className="w-20 md:w-24 h-2.5 bg-[#D6D1C4] rounded-full"></div>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#C9A84C] border border-white"></div>
              </div>
              {/* Fake Dashboard Content */}
              <div className="p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                <div className="w-24 md:w-32 h-3 md:h-4 bg-[#B5A89A] rounded-full mb-1"></div>

                {/* Fake Category Card 1 */}
                <div className="bg-white rounded-xl p-3 md:p-4 border border-[#D6D1C4] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><span className="material-symbols-outlined text-[14px] md:text-[16px]">work</span></div>
                    <div className="text-[10px] md:text-xs font-bold text-[#3D2E2A]">75%</div>
                  </div>
                  <div className="w-16 md:w-20 h-2 md:h-3 bg-[#3D2E2A] rounded-full mb-3"></div>
                  <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[75%] h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                {/* Fake Category Card 2 */}
                <div className="bg-white rounded-xl p-3 md:p-4 border border-[#D6D1C4] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><span className="material-symbols-outlined text-[14px] md:text-[16px]">person</span></div>
                    <div className="text-[10px] md:text-xs font-bold text-[#3D2E2A]">40%</div>
                  </div>
                  <div className="w-20 md:w-24 h-2 md:h-3 bg-[#3D2E2A] rounded-full mb-3"></div>
                  <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[40%] h-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teks Penjelas Kanan (Absolute to Arena, Z-50) */}
          <div 
            className="hidden md:block absolute right-0 lg:right-[5%] top-1/2 w-56 transition-all duration-700 pointer-events-none text-left z-50"
            style={{ 
              opacity: scrollY > 120 ? 1 : 0, 
              transform: `translateX(${scrollY > 120 ? '0px' : '20px'})` 
            }}
          >
            <div className="absolute top-4 -left-12 w-10 h-[1px] bg-[#C9A84C]/50"></div>
            <h4 className="font-serif text-[#C9A84C] text-xl mb-1">Status Terinci</h4>
            <p className="text-[#9C7E74] text-xs leading-relaxed drop-shadow-md">Tinjau dan selesaikan tugas di hamparan gelap yang menenangkan maya.</p>
          </div>

          {/* Right Mockup Wrapper (Scroll Tracker) */}
          <div 
            className="absolute right-[5%] md:right-[22%] top-0 w-[300px] md:w-[350px] h-[80%] md:h-[90%] z-20 transition-transform duration-100 ease-linear"
            style={{ 
              transform: `translateX(${Math.min(scrollY * 0.12, 120)}px) translateY(-${Math.min(scrollY * 0.12, 80)}px) rotateY(-${5 + Math.min(scrollY * 0.03, 15)}deg) rotateX(5deg)` 
            }}
          >
            {/* Float Animator */}
            <div className="w-full h-full animate-[float_7s_ease-in-out_infinite_reverse]">
            <div className="w-full h-full rounded-2xl md:rounded-3xl border border-[#EDE9DF]/10 overflow-hidden bg-[#3D2E2A] flex flex-col relative" style={{ boxShadow: '20px 30px 60px rgba(0,0,0,0.8)' }}>
              {/* Fake Top Nav (Dark Mode) */}
              <div className="h-10 md:h-12 border-b border-[#2A1E1B] flex items-center px-4 justify-between bg-[#2A1E1B]/50">
                <div className="w-20 md:w-24 h-2.5 bg-[#6B5147] rounded-full"></div>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#C9A84C] border border-[#2A1E1B]"></div>
              </div>
              {/* Fake Tasks Content (Dark Mode) */}
              <div className="p-4 md:p-6 flex flex-col gap-3">
                <div className="w-32 md:w-40 h-3 md:h-4 bg-[#D9C48A] rounded-full mb-1 md:mb-2"></div>

                {/* Fake Task 1 */}
                <div className="bg-[#2A1E1B] rounded-xl p-2.5 md:p-3 border border-[#4B3630] flex items-center gap-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded border border-[#6B5147] shrink-0"></div>
                  <div className="flex-1">
                    <div className="w-[70%] h-2 md:h-2.5 bg-[#E8E4D9] rounded-full mb-1.5 md:mb-2"></div>
                    <div className="w-[40%] h-1.5 md:h-2 bg-[#9C7E74] rounded-full"></div>
                  </div>
                  <div className="w-10 h-3 md:w-12 md:h-4 bg-red-900/30 rounded flex items-center justify-center shrink-0"><div className="w-6 md:w-8 h-1 md:h-1.5 bg-red-400 rounded-full"></div></div>
                </div>

                {/* Fake Task 2 (Completed) */}
                <div className="bg-[#2A1E1B] rounded-xl p-2.5 md:p-3 border border-[#4B3630] flex items-center gap-3 opacity-60">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-[#C9A84C] flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[8px] md:text-[10px] text-[#3D2E2A]">check</span></div>
                  <div className="flex-1">
                    <div className="w-[85%] h-2 md:h-2.5 bg-[#E8E4D9] rounded-full mb-1.5 md:mb-2"></div>
                    <div className="w-[50%] h-1.5 md:h-2 bg-[#9C7E74] rounded-full"></div>
                  </div>
                </div>

                {/* Fake Task 3 */}
                <div className="bg-[#2A1E1B] rounded-xl p-2.5 md:p-3 border border-[#4B3630] flex items-center gap-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded border border-[#6B5147] shrink-0"></div>
                  <div className="flex-1">
                    <div className="w-[60%] h-2 md:h-2.5 bg-[#E8E4D9] rounded-full mb-1.5 md:mb-2"></div>
                    <div className="w-[30%] h-1.5 md:h-2 bg-[#9C7E74] rounded-full"></div>
                  </div>
                  <div className="w-10 h-3 md:w-12 md:h-4 bg-yellow-900/30 rounded flex items-center justify-center shrink-0"><div className="w-6 md:w-8 h-1 md:h-1.5 bg-yellow-400 rounded-full"></div></div>
                </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Editorial Features Section */}
      <section className="relative z-30 border-t border-[#B5A89A]/10 bg-[#1A1412] px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">category</span>
            </div>
            <h3 className="font-serif text-2xl text-[#E8E4D9] mb-3">Sistem Klasifikasi Terpadu</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm md:text-base">
              Pisahkan kehidupan pribadi dan pekerjaan Anda dalam kompartemen cerdas. Warna indikator yang menenangkan mencegah beban kognitif berlebih.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left relative md:px-8">
            <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-[#B5A89A]/10"></div>
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">dark_mode</span>
            </div>
            <h3 className="font-serif text-2xl text-[#E8E4D9] mb-3">Estetika Gelap Pejalan Malam</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm md:text-base">
              Dirancang khusus untuk mata Anda. Mode Gelap kami tidak menggunakan warna hitam yang menyilaukan, melainkan cokelat pekat (Mocha) yang mewah.
            </p>
            <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-[#B5A89A]/10"></div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-8">
            <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
              <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
            </div>
            <h3 className="font-serif text-2xl text-[#E8E4D9] mb-3">Aman Tersinkronisasi</h3>
            <p className="text-[#9C7E74] font-light leading-relaxed text-sm md:text-base">
              Setiap coretan pemikiran Anda tersimpan secara presisi di awan (cloud). Akses dari berbagai perangkat tanpa takut kehilangan satu progres pun.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 border-t border-[#B5A89A]/10 py-8 text-center text-[#6B5147] text-xs md:text-sm tracking-wider uppercase">
        <p>&copy; {new Date().getFullYear()} Notin, Aja!.</p>
      </footer>

      {/* Inline styles for custom animations that don't need a heavy tailwind config update */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .perspective-\\[1200px\\] {
          perspective: 1200px;
        }
      `}} />
    </div>
  );
}
