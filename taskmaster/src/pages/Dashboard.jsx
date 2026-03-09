import { useTaskStore } from '../store/useTaskStore';

export default function Dashboard() {
  const tasks = useTaskStore(state => state.tasks);
  
  // Dashboard Metrics
  const activeTasks = tasks.filter(t => !t.isArchived);
  
  const sisaTugasHariIni = activeTasks.filter(t => !t.isCompleted && (t.dueDate === 'Hari Ini' || t.isOverdue)).length;
  const tugasPrioritas = activeTasks.filter(t => !t.isCompleted && t.priority === 'Prioritas Tinggi').length;
  const selesaiBaruBaruIni = activeTasks.filter(t => t.isCompleted).length; // Simplify recent completions for MVP

  // Priority List Fast Track
  const quickPriorityTasks = activeTasks
    .filter(t => !t.isCompleted && t.priority === 'Prioritas Tinggi')
    .slice(0, 3);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Selamat Pagi, Alex!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Berikut adalah kegiatan proyek Anda hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">assignment</span>
            </div>
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
              -2%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sisa Tugas Hari Ini</p>
          <p className="text-3xl font-bold mt-1">{sisaTugasHariIni}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
              Penting
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tugas Prioritas Tinggi</p>
          <p className="text-3xl font-bold mt-1">{tugasPrioritas}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
              Total Selesai
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Selesai Baru-Baru Ini</p>
          <p className="text-3xl font-bold mt-1">{selesaiBaruBaruIni}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Produktivitas Mingguan</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aktivitas berdasarkan tugas yang selesai
              </p>
            </div>
            <select className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold rounded-lg focus:ring-0 cursor-pointer">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            {/* Simple Bar Chart Visualization */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[40%]">
                <div className="absolute inset-x-0 bottom-0 bg-primary/40 rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sen</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[65%]">
                <div className="absolute inset-x-0 bottom-0 bg-primary/60 rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sel</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[85%]">
                <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rab</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[50%]">
                <div className="absolute inset-x-0 bottom-0 bg-primary/50 rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kam</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[95%]">
                <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Jum</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[30%]">
                <div className="absolute inset-x-0 bottom-0 bg-slate-300 dark:bg-slate-600 rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Sab</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[20%]">
                <div className="absolute inset-x-0 bottom-0 bg-slate-300 dark:bg-slate-600 rounded-t-lg transition-all h-full"></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Min</span>
            </div>
          </div>
        </div>
        {/* Upcoming Tasks Quick View */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Daftar Prioritas</h3>
            <button className="text-primary text-xs font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4 flex-1">
            {quickPriorityTasks.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Tidak ada tugas prioritas tinggi.</p>
            ) : (
              quickPriorityTasks.map(task => (
                <div key={task.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold truncate pr-2 max-w-[200px]">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{task.dueDate || 'Penjadwalan API'} • {task.project}</p>
                  </div>
                </div>
              ))
            )}
           </div>
          <button className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm font-medium hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Tugas Cepat
          </button>
        </div>
      </div>
    </div>
  );
}
