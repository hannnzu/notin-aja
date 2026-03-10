import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';

export default function Sidebar() {
  const navigate = useNavigate();
  const setFilter = useTaskStore(state => state.setFilter);
  const setCategory = useTaskStore(state => state.setCategory);
  const currentFilter = useTaskStore(state => state.currentFilter);
  const currentCategory = useTaskStore(state => state.currentCategory);

  const tasks = useTaskStore(state => state.tasks);
  const inboxCount = tasks.filter(t => !t.isArchived).length;
  const todayCount = tasks.filter(t => !t.isArchived && (t.dueDate === 'Hari Ini' || t.isOverdue)).length;
  const openModal = useTaskStore(state => state.openModal);

  const location = useLocation();
  const isTasksPage = location.pathname === '/tasks';

  const handleFilterClick = (filter) => {
    setFilter(filter);
    navigate('/tasks');
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
    navigate('/tasks');
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <span className="material-symbols-outlined">grid_view</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">Notin, Aja!</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Manajemen Tugas</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
              ? 'bg-primary/10 text-primary group font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          <span className="text-sm">Dasboard</span>
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
              ? 'bg-primary/10 text-primary group font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">check_box</span>
          <span className="text-sm">Tugas</span>
        </NavLink>
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
              ? 'bg-primary/10 text-primary group font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">archive</span>
          <span className="text-sm">Arsip</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
              ? 'bg-primary/10 text-primary group font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="text-sm">Pengaturan</span>
        </NavLink>
        <div className="pt-4 pb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Penyaring
          </h3>
          <button
            onClick={() => handleFilterClick('inbox')}
            className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${isTasksPage && currentFilter === 'inbox' && currentCategory === 'all' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[20px] mr-3">inbox</span>
            <span className="text-sm">Kotak Masuk</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isTasksPage && currentFilter === 'inbox' && currentCategory === 'all' ? 'bg-primary/20 text-primary font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {inboxCount}
            </span>
          </button>
          <button
            onClick={() => handleFilterClick('today')}
            className={`w-full flex items-center px-3 py-2 rounded-lg font-medium mt-1 transition-colors ${isTasksPage && currentFilter === 'today' && currentCategory === 'all' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[20px] mr-3">calendar_today</span>
            <span className="text-sm">Hari Ini</span>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isTasksPage && currentFilter === 'today' && currentCategory === 'all' ? 'bg-primary/20 text-primary font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {todayCount}
            </span>
          </button>
          <button
            onClick={() => handleFilterClick('important')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium mt-1 transition-colors ${isTasksPage && currentFilter === 'important' && currentCategory === 'all' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[20px]">star</span>
            <span className="text-sm text-left flex-1">Penting</span>
          </button>
        </div>
        <div className="pt-2 pb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Daftar
          </h3>
          <button
            onClick={() => handleCategoryClick('Pekerjaan')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isTasksPage && currentCategory === 'Pekerjaan' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-blue-500 text-[20px]">work</span>
            <span className="text-sm">Pekerjaan</span>
          </button>
          <button
            onClick={() => handleCategoryClick('Pribadi')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium mt-1 transition-colors ${isTasksPage && currentCategory === 'Pribadi' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-orange-500 text-[20px]">person</span>
            <span className="text-sm">Pribadi</span>
          </button>
          <button
            onClick={() => handleCategoryClick('Belanja')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium mt-1 transition-colors ${isTasksPage && currentCategory === 'Belanja' ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <span className="material-symbols-outlined text-green-500 text-[20px]">
              shopping_cart
            </span>
            <span className="text-sm">Belanja</span>
          </button>
        </div>
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={() => openModal()}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Tambah Tugas Baru</span>
        </button>
      </div>
    </aside>
  );
}
