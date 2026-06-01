import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useCategoryStore, CATEGORY_COLOR_PALETTE } from '../store/useCategoryStore';
import { isTaskToday } from '../utils/dateUtils';

export default function Sidebar() {
  const navigate = useNavigate();
  const setFilter = useTaskStore(state => state.setFilter);
  const setCategory = useTaskStore(state => state.setCategory);
  const currentFilter = useTaskStore(state => state.currentFilter);
  const currentCategory = useTaskStore(state => state.currentCategory);

  const tasks = useTaskStore(state => state.tasks);
  const inboxCount = tasks.filter(t => !t.isArchived).length;
  const todayCount = tasks.filter(t => !t.isArchived && (isTaskToday(t.dueDate) || t.isOverdue)).length;
  const openModal = useTaskStore(state => state.openModal);

  const isMobileMenuOpen = useTaskStore(state => state.isMobileMenuOpen);
  const setMobileMenuOpen = useTaskStore(state => state.setMobileMenuOpen);

  const categories = useCategoryStore(state => state.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const location = useLocation();
  const isTasksPage = location.pathname === '/tasks';

  const handleFilterClick = (filter) => {
    setFilter(filter);
    setMobileMenuOpen(false);
    navigate('/tasks');
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
    setMobileMenuOpen(false);
    navigate('/tasks');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white overflow-hidden shrink-0 shadow-sm">
          <img src="/notin.png" alt="Notin, Aja! Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none font-serif text-slate-800 dark:text-slate-50">Notin, <span className="text-primary italic">Aja!</span></h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Manajemen Tugas</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
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
          onClick={() => setMobileMenuOpen(false)}
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
          to="/kanban"
          onClick={() => setMobileMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
              ? 'bg-primary/10 text-primary group font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">view_kanban</span>
          <span className="text-sm">Kanban</span>
        </NavLink>
        <NavLink
          to="/archive"
          onClick={() => setMobileMenuOpen(false)}
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
          onClick={() => setMobileMenuOpen(false)}
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
          {categories.map((cat) => {
            const color = CATEGORY_COLOR_PALETTE[cat.colorIndex ?? 3];
            const isActive = isTasksPage && currentCategory === cat.name;
            // Ikon khusus kategori default
            const defaultIcons = {
              'Pekerjaan': { icon: 'work', iconColor: 'text-blue-500' },
              'Pribadi': { icon: 'person', iconColor: 'text-orange-500' },
              'Belanja': { icon: 'shopping_cart', iconColor: 'text-green-500' },
              'Lainnya': { icon: 'flag', iconColor: 'text-slate-400' },
            };
            const defaultMeta = defaultIcons[cat.name];
            const taskCount = tasks.filter(t => !t.isArchived && t.category === cat.name).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium mt-1 first:mt-0 transition-colors ${
                  isActive ? 'text-primary bg-primary/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {defaultMeta ? (
                  <span className={`material-symbols-outlined text-[20px] ${defaultMeta.iconColor}`}>
                    {defaultMeta.icon}
                  </span>
                ) : (
                  <span className={`w-3.5 h-3.5 rounded-full ${color.bg} shrink-0 ml-0.5`}></span>
                )}
                <span className="text-sm flex-1 text-left truncate">{cat.name}</span>
                {taskCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>{taskCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={() => { openModal(); setMobileMenuOpen(false); }}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Tambah Tugas Baru</span>
        </button>
      </div>
    </aside>
    </>
  );
}
