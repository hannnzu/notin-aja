import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';

export default function TopNav() {
  const { searchQuery, setSearchQuery } = useTaskStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/tasks' && e.target.value.trim() !== '') {
      navigate('/tasks');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-none items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 transition-all focus:bg-white dark:focus:bg-slate-900"
            placeholder="Cari tugas, proyek..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm">Notifikasi</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50">
                  <p className="text-sm font-medium">Pengingat Tugas</p>
                  <p className="text-xs text-slate-500 mt-1">Jangan lupa siapkan laporan mingguan besok.</p>
                  <p className="text-[10px] text-slate-400 mt-2">10 menit yang lalu</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Tim Pemasaran</p>
                  <p className="text-xs text-slate-500 mt-1">Sarah menambahkan tugas baru ke proyek Anda.</p>
                  <p className="text-[10px] text-slate-400 mt-2">1 jam yang lalu</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        <div className="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-3 rounded-xl transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">Alex Johnson</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Pemimpin Proyek</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtCNm5XU8xqF5-mUdth8gxnZf2LQWoVmEXQBkIywKxVoSfGwZzO6l29COIj51_S2I7isYh69rq5YO1g6D-skQf2VrGM2JsF_Egllx06EWj5mZZlCY2ZQNNfRgANQaux5kMUU0xtNocmI9oOkZwZrd9nsGQrGH48dJUd9gm3c_Z4q2GdoJ2WIvHmJoz2FUn4o8MKOYYJNuja37uG33Fd_bTBkVCHrUECZTTv7km_-kiLvXWN3-WFBg3UFtk4YtsqxZn_Lt6fuZvgEw" 
                alt="User profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <p className="text-sm font-bold">Alex Johnson</p>
                <p className="text-xs text-slate-500">alex@example.com</p>
              </div>
              <button 
                onClick={() => { navigate('/settings'); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Pengaturan
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
