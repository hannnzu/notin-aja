import TaskList from '../components/TaskList';
import { useTaskStore } from '../store/useTaskStore';

export default function TasksPage() {
  const { tasks, currentFilter, currentCategory, searchQuery, openModal } = useTaskStore();

  const getFilteredTasks = () => {
    let filtered = tasks.filter(t => !t.isArchived);
    
    // Apply Filter
    if (currentFilter === 'today') {
      filtered = filtered.filter(t => t.dueDate === 'Hari Ini' || t.isOverdue);
    } else if (currentFilter === 'important') {
      filtered = filtered.filter(t => t.priority === 'Prioritas Tinggi');
    }

    // Apply Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(t => t.project === currentCategory);
    }
    
    // Apply Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.project?.toLowerCase().includes(q));
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const categories = [...new Set(filteredTasks.map(t => t.project || 'Lainnya'))];

  // Right Sidebar Metrics
  const todayTasks = tasks.filter(t => !t.isArchived && (t.dueDate === 'Hari Ini' || t.isOverdue));
  const completedToday = todayTasks.filter(t => t.isCompleted).length;
  const totalToday = todayTasks.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const getUpcomingDeadlines = () => {
    return tasks
      .filter(t => !t.isArchived && !t.isCompleted && t.dueDate !== 'Selesai' && t.dueDate !== 'Hari Ini' && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  };
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="max-w-[1440px] mx-auto flex gap-6 p-6 w-full relative">
      <div className="flex-1">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tugas Saya</h1>
            <p className="text-slate-500 mt-1">Senin, 21 Oktober</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">sort</span> Urutkan
            </button>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">filter_list</span> Saring
            </button>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Tidak ada tugas ditemukan.
          </div>
        ) : (
          categories.map(category => {
            const categoryTasks = filteredTasks.filter(t => (t.project || 'Lainnya') === category);
            let icon = 'flag';
            let iconColor = 'text-slate-500';
            if (category === 'Pekerjaan') {
              icon = 'work';
              iconColor = 'text-blue-500';
            } else if (category === 'Pribadi') {
              icon = 'person';
              iconColor = 'text-orange-500';
            } else if (category === 'Belanja') {
              icon = 'shopping_cart';
              iconColor = 'text-green-500';
            }

            return (
              <TaskList
                key={category}
                title={category === 'Lainnya' ? 'Tugas Lainnya' : category}
                icon={icon}
                iconColor={iconColor}
                count={categoryTasks.filter(t => !t.isCompleted).length}
                tasks={categoryTasks}
              />
            );
          })
        )}

        {/* Quick Add Floating (Mobile Only) */}
        <button 
          onClick={() => openModal()}
          className="md:hidden fixed bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* Right Sidebar: Stats & Progress */}
      <aside className="w-72 shrink-0 hidden xl:flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold mb-4">Kemajuan Hari Ini</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Tugas selesai</span>
            <span className="text-xs font-bold">{completedToday} / {totalToday}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 italic">
            {progressPercent === 100 ? 'Semua tugas hari ini selesai!' : 'Terus selesaikan tugasmu hari ini.'}
          </p>
        </div>
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tenggat Waktu Mendatang</h4>
          <div className="space-y-4">
            {upcomingDeadlines.length === 0 ? (
               <p className="text-xs text-slate-500 text-center py-4">Tidak ada tugas mendatang.</p>
            ) : (
              upcomingDeadlines.map((task) => {
                const d = new Date(task.dueDate);
                const formatMonth = isNaN(d) ? '...' : d.toLocaleDateString('id-ID', { month: 'short' });
                const formatDay = isNaN(d) ? '!' : d.getDate();
                
                return (
                  <div key={task.id} className="flex gap-3">
                    <div className="size-9 rounded-lg bg-white dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{formatMonth}</span>
                      <span className="text-sm font-bold leading-none">{formatDay}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight line-clamp-1">{task.title}</p>
                      <p className="text-[10px] text-slate-500">{task.priority} • {task.project}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button className="w-full mt-4 text-xs font-semibold text-primary hover:underline">
            Lihat Kalender
          </button>
        </div>
      </aside>
    </div>
  );
}
