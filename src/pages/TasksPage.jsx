import { useEffect, useState, useRef } from 'react';
import TaskList from '../components/TaskList';
import KanbanBoard from '../components/KanbanBoard';
import { useTaskStore } from '../store/useTaskStore';
import { isTaskToday } from '../utils/dateUtils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default function TasksPage() {
  const { tasks, fetchTasks, isLoading, error, currentFilter, currentCategory, searchQuery, openModal } = useTaskStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  const getFilteredTasks = () => {
    let filtered = tasks.filter(t => !t.isArchived);

    // Apply Filter
    if (currentFilter === 'today') {
      filtered = filtered.filter(t => isTaskToday(t.dueDate) || t.isOverdue);
    } else if (currentFilter === 'important') {
      filtered = filtered.filter(t => t.priority === 'Prioritas Tinggi');
    }

    // Apply Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(t => t.category === currentCategory);
    }

    // Apply Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q));
    }

    // Apply local Status Filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(t => !t.isCompleted);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(t => t.isCompleted);
    }

    // Apply Sorting
    if (sortOrder === 'dueDateAsc') {
      filtered = filtered.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate || a.dueDate === 'Selesai') return 1;
        if (!b.dueDate || b.dueDate === 'Selesai') return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const categories = [...new Set(filteredTasks.map(t => t.category || 'Lainnya'))];

  // Right Sidebar Metrics
  const todayTasks = tasks.filter(t => !t.isArchived && (isTaskToday(t.dueDate) || t.isOverdue));
  const completedToday = todayTasks.filter(t => t.isCompleted).length;
  const totalToday = todayTasks.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const getUpcomingDeadlines = () => {
    return tasks
      .filter(t => !t.isArchived && !t.isCompleted && t.dueDate !== 'Selesai' && !isTaskToday(t.dueDate) && t.dueDate && !t.isOverdue)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  };
  const upcomingDeadlines = getUpcomingDeadlines();

  // Calendar Logic
  const currentDate = new Date();
  const monthStart = startOfMonth(currentCalendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentCalendarMonth(addMonths(currentCalendarMonth, 1));
  const prevMonth = () => setCurrentCalendarMonth(subMonths(currentCalendarMonth, 1));

  return (
    <div className="max-w-[1440px] mx-auto flex gap-6 p-6 w-full relative">
      <div className="flex-1">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tugas Saya</h1>
            <p className="text-slate-500 mt-1 capitalize">{format(currentDate, 'EEEE, d MMMM', { locale: idLocale })}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Tampilan Daftar"
              >
                <span className="material-symbols-outlined text-sm">view_list</span>
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-1.5 rounded-md flex items-center justify-center transition-all ${viewMode === 'board' ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Tampilan Papan Kanban"
              >
                <span className="material-symbols-outlined text-sm">view_kanban</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-lg">sort</span> 
                {sortOrder === 'default' ? 'Urutkan' : 'Tenggat Terdekat'}
              </button>
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-1 overflow-hidden">
                <button onClick={() => setSortOrder('default')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${sortOrder === 'default' ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}>Tatanan Logis</button>
                <button onClick={() => setSortOrder('dueDateAsc')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${sortOrder === 'dueDateAsc' ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}>Tenggat Terdekat</button>
              </div>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                <span className="material-symbols-outlined text-lg">filter_list</span> 
                {statusFilter === 'all' ? 'Saring' : statusFilter === 'active' ? 'Belum Selesai' : 'Sudah Selesai'}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-1 overflow-hidden">
                <button onClick={() => setStatusFilter('all')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${statusFilter === 'all' ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}>Semua Status</button>
                <button onClick={() => setStatusFilter('active')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${statusFilter === 'active' ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}>
                  Belum Selesai
                  {statusFilter === 'active' && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                </button>
                <button onClick={() => setStatusFilter('completed')} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${statusFilter === 'completed' ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}>
                  Sudah Selesai
                  {statusFilter === 'completed' && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
            Terjadi kesalahan: {error}
          </div>
        )}

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">inventory_2</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight mb-2">Belum Ada Tugas di Sini</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Tarik napas panjang. Kategori atau pencarian ini masih kosong melompong.
            </p>
            <button
              onClick={() => openModal()}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Mulai Kerjakan Sesuatu
            </button>
          </div>
        ) : viewMode === 'board' ? (
          <div className="mt-4 h-[calc(100vh-200px)]">
            <KanbanBoard tasks={filteredTasks} />
          </div>
        ) : (
          categories.map(category => {
            const categoryTasks = filteredTasks.filter(t => (t.category || 'Lainnya') === category);
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
                      <p className="text-[10px] text-slate-500">{task.priority} • {task.category}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full mt-4 text-xs font-semibold text-primary hover:underline flex justify-center items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              {showCalendar ? 'Tutup Kalender' : 'Lihat Kalender'}
            </button>

            {showCalendar && (
              <div className="absolute top-full mt-2 right-0 w-[280px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={(e) => { e.stopPropagation(); prevMonth(); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <p className="text-center font-bold text-sm capitalize">{format(currentCalendarMonth, 'MMMM yyyy', { locale: idLocale })}</p>
                  <button onClick={(e) => { e.stopPropagation(); nextMonth(); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'].map(day => (
                    <div key={day} className="text-[10px] font-bold text-slate-400 py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isDayToday = isToday(day);
                    
                    const dayTasks = tasks.filter(t => !t.isArchived && !t.isCompleted && t.dueDate && t.dueDate === format(day, 'yyyy-MM-dd'));
                    const hasTask = dayTasks.length > 0;
                    const hasUrgent = dayTasks.some(t => t.priority === 'Prioritas Tinggi');

                    return (
                      <div
                        key={i}
                        className={`
                          relative flex flex-col items-center justify-center h-8 w-8 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-default transition-colors mx-auto
                          ${!isCurrentMonth ? 'text-slate-300 dark:text-slate-600 font-medium' : 'text-slate-700 dark:text-slate-200 font-bold'}
                          ${isDayToday ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 text-primary' : ''}
                        `}
                      >
                        <span className="z-10">{format(day, 'd')}</span>
                        {hasTask && (
                          <div className={`absolute bottom-1 w-1 h-1 rounded-full ${hasUrgent ? 'bg-red-500' : 'bg-primary'}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
