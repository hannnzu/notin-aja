import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import { useAuthStore } from '../store/useAuthStore';
import { isTaskToday } from '../utils/dateUtils';

export default function TopNav() {
  const { tasks, searchQuery, setSearchQuery, searchTasksServerSide } = useTaskStore();
  const { user, signOut } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Aggregate notifications
  const urgentTasks = tasks.filter(t => !t.isArchived && !t.isCompleted && t.priority === 'Prioritas Tinggi');
  const todayTasks = tasks.filter(t => !t.isArchived && !t.isCompleted && isTaskToday(t.dueDate));
  const recentOverdue = tasks.filter(t => !t.isArchived && !t.isCompleted && t.isOverdue);

  const notificationsCount = urgentTasks.length + todayTasks.length + recentOverdue.length;

  // Only maintain an unread badge if there are legitimate system alerts
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  useEffect(() => {
    if (notificationsCount > 0) setHasUnreadAlerts(true);
  }, [notificationsCount]);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/tasks' && e.target.value.trim() !== '') {
      navigate('/tasks');
    }
  };

  // Debounced Server-side Search
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timeoutId = setTimeout(() => {
      searchTasksServerSide(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchTasksServerSide]);

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
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              setHasUnreadAlerts(false);
            }}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
            {hasUnreadAlerts && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 transition-opacity"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-sm">Notifikasi</h3>
                <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{notificationsCount} Baru</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notificationsCount === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">Belum ada peringatan sistem hari ini.</div>
                ) : (
                  <>
                    {urgentTasks.length > 0 && (
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50">
                        <div className="flex items-center gap-2 text-red-500 mb-1">
                          <span className="material-symbols-outlined text-sm">priority_high</span>
                          <p className="text-sm font-bold">Prioritas Tinggi</p>
                        </div>
                        <p className="text-xs text-slate-500">Anda memiliki {urgentTasks.length} tugas merah yang harus segera dieksekusi.</p>
                      </div>
                    )}
                    {todayTasks.length > 0 && (
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50">
                        <div className="flex items-center gap-2 text-primary mb-1">
                          <span className="material-symbols-outlined text-sm">today</span>
                          <p className="text-sm font-bold">Agenda Hari Ini</p>
                        </div>
                        <p className="text-xs text-slate-500">Jangan lupa tuntaskan {todayTasks.length} tugas yang dijadwalkan hari ini!</p>
                      </div>
                    )}
                    {recentOverdue.length > 0 && (
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-2 text-amber-500 mb-1">
                          <span className="material-symbols-outlined text-sm">warning</span>
                          <p className="text-sm font-bold">Tenggat Terlewat</p>
                        </div>
                        <p className="text-xs text-slate-500">Waduh! Ada {recentOverdue.length} tugas yang sudah terlambat dari jadwal.</p>
                      </div>
                    )}
                  </>
                )}
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
              <p className="text-sm font-bold leading-none">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{user?.user_metadata?.role || 'Pengguna'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {(user?.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <p className="text-sm font-bold">{user?.user_metadata?.full_name || 'My Account'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/settings'); setShowProfile(false); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Pengaturan
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
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
