import { useEffect, useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { isTaskToday, subDays } from '../utils/dateUtils';

export default function Dashboard() {
  const { tasks, fetchTasks, isLoading, error, openModal } = useTaskStore();
  const [chartRange, setChartRange] = useState(7);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const activeTasks = tasks.filter(t => !t.isArchived);

  // Dynamic Metrics
  const tasksDueToday = activeTasks.filter(t => isTaskToday(t.dueDate) || t.isOverdue);
  const sisaTugasHariIni = tasksDueToday.filter(t => !t.isCompleted).length;
  const tugasPrioritas = activeTasks.filter(t => !t.isCompleted && t.priority === 'Prioritas Tinggi').length;
  const selesaiBaruBaruIni = activeTasks.filter(t => t.isCompleted).length;

  // Calculate percentage of today's tasks completed (dynamic indicator)
  const totalToday = tasksDueToday.length;
  const totalCompletedToday = totalToday - sisaTugasHariIni;
  const percentageCompleted = totalToday === 0 ? 0 : Math.round((totalCompletedToday / totalToday) * 100);

  // Priority List Fast Track
  const quickPriorityTasks = activeTasks
    .filter(t => !t.isCompleted && t.priority === 'Prioritas Tinggi')
    .slice(0, 3);

  // Generate Productivity Graph Logic
  const getLastDaysArray = (daysCount) => {
    const days = [];
    const today = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      days.push(subDays(today, i));
    }
    return days;
  };

  const chartDays = getLastDaysArray(chartRange);

  // Calculate max tasks completed in any of the mapped days to set graph scale
  const completedByDay = chartDays.map(date => {
    return activeTasks.filter(t => {
      if (!t.isCompleted) return false;

      const targetDateStr = t.dueDate && t.dueDate !== 'Selesai'
        ? t.dueDate
        : t.dateCreatedAt;

      if (!targetDateStr) return false;

      // Parse safely avoiding timezone jumps by just extracting YYYY-MM-DD
      const dateStr = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');

      return targetDateStr.startsWith(dateStr);
    }).length;
  });
  const maxCompleted = Math.max(...completedByDay, 1); // Avoid division by zero

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Selamat Pagi!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {activeTasks.length === 0
            ? "Semua bersih! Tidak ada kegiatan yang menumpuk hari ini."
            : "Berikut adalah ringkasan kegiatan proyek Anda."}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
          Gagal mengambil data: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${totalToday > 0 ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 bg-slate-50 dark:bg-slate-800'}`}>
                  {percentageCompleted}% Selesai
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

          {activeTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-3">
              <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[48px]">award_star</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight mb-3">Tidak Ada Agenda Tersembunyi!</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                Wah, Anda hebat! Semua tugas telah diselesaikan atau Anda belum memulai satupun proyek baru. Mari kita ciptakan hari yang produktif.
              </p>
              <button
                onClick={() => openModal()}
                className="px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined">add_task</span>
                Rancanakan Sesuatu
              </button>
            </div>
          ) : (
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
                  <select
                    value={chartRange}
                    onChange={(e) => setChartRange(Number(e.target.value))}
                    className="bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold rounded-lg focus:ring-0 cursor-pointer"
                  >
                    <option value={7}>7 Hari Terakhir</option>
                    <option value={30}>30 Hari Terakhir</option>
                  </select>
                </div>
                <div className="flex items-end justify-between h-48 gap-1 md:gap-2 pt-4">
                  {chartDays.map((date, index) => {
                    const completedCount = completedByDay[index];
                    const heightPercentage = Math.round((completedCount / maxCompleted) * 100);
                    const isToday = index === chartDays.length - 1; // Last item is always today

                    // Conditionally render labels to prevent overlap on 30 day view
                    const showLabel = chartRange === 7 ? true : (index % 5 === 0 || isToday);

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {completedCount} tugas pada {date.getDate()}/{date.getMonth() + 1}
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm md:rounded-t-lg relative flex-1">
                          <div
                            className={`absolute inset-x-0 bottom-0 rounded-t-sm md:rounded-t-lg transition-all duration-500 ${isToday ? 'bg-primary' : 'bg-primary/50'}`}
                            style={{ height: `${heightPercentage}%`, minHeight: completedCount > 0 ? '10%' : '0%' }}
                          ></div>
                        </div>
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase h-3 md:h-4 ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                          {showLabel ? (chartRange === 7 ? dayNames[date.getDay()] : date.getDate()) : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Upcoming Tasks Quick View */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Daftar Prioritas</h3>
                  <button
                    onClick={() => {
                      useTaskStore.getState().setFilter('important');
                    }}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Lihat Semua
                  </button>
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
                          <p className="text-xs text-slate-500 mt-1">{task.dueDate || 'Penjadwalan API'} • {task.category}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => openModal()}
                  className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-sm font-medium hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Tambah Tugas Cepat
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
