import { useEffect, useState, useMemo } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import { useTaskStore } from '../store/useTaskStore';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

const CATEGORY_OPTIONS = ['Semua', 'Pekerjaan', 'Pribadi', 'Belanja'];

export default function KanbanPage() {
  const { tasks, fetchTasks, isLoading, error, openModal } = useTaskStore();
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const currentDate = new Date();

  const activeTasks = tasks.filter(t => !t.isArchived);

  // Build childrenMap untuk indikator badge di Kanban card
  const childrenMap = useMemo(() => {
    const map = {};
    activeTasks.forEach(t => {
      if (t.parentId) {
        if (!map[t.parentId]) map[t.parentId] = [];
        map[t.parentId].push(t);
      }
    });
    return map;
  }, [activeTasks]);

  const filteredTasks =
    categoryFilter === 'Semua'
      ? activeTasks
      : activeTasks.filter(t => t.category === categoryFilter);

  // Stats per kolom
  const countByStatus = (status) =>
    filteredTasks.filter(t => (t.status || 'todo') === status).length;

  return (
    <div className="flex flex-col h-full p-6 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Papan Kanban</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">
            {format(currentDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Stats badges */}
          <div className="hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              {countByStatus('todo')} Belum
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full border border-blue-100 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {countByStatus('in_progress')} Berjalan
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {countByStatus('done')} Selesai
            </span>
          </div>

          {/* Category filter */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 gap-0.5">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-900 shadow-sm text-primary'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Task button */}
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tugas Baru
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
          Terjadi kesalahan: {error}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
        </div>
      ) : activeTasks.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">view_kanban</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight mb-2">Papan Masih Kosong</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 text-sm">
              Tambahkan tugas pertamamu dan mulai kelola alur kerja dengan papan Kanban.
            </p>
            <button
              onClick={() => openModal()}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">add_task</span>
              Buat Tugas Pertama
            </button>
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="flex-1 overflow-hidden">
          <KanbanBoard tasks={filteredTasks} childrenMap={childrenMap} />
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => openModal()}
        className="md:hidden fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}
