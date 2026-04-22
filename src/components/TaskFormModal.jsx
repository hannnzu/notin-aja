import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTaskStore } from '../store/useTaskStore';
import { getTodayDateString } from '../utils/dateUtils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import idLocale from 'date-fns/locale/id';

const taskSchema = z.object({
  title: z.string().min(1, 'Judul tugas tidak boleh kosong'),
  priority: z.enum(['Rendah', 'Menengah', 'Prioritas Tinggi']),
  category: z.string().min(1, 'Kategori wajib diisi'),
  dueDate: z.string().optional()
});

export default function TaskFormModal() {
  const isModalOpen = useTaskStore(state => state.isModalOpen);
  const editingTask = useTaskStore(state => state.editingTask);
  const closeModal = useTaskStore(state => state.closeModal);
  const addTask = useTaskStore(state => state.addTask);
  const editTask = useTaskStore(state => state.editTask);
  const isLoading = useTaskStore(state => state.isLoading); // Added isLoading

  const [openDropdown, setOpenDropdown] = useState(null);
  const formRef = useRef(null);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const monthStart = startOfMonth(currentCalendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const todayDate = startOfDay(new Date());

  const nextMonth = (e) => { e.stopPropagation(); setCurrentCalendarMonth(addMonths(currentCalendarMonth, 1)); };
  const prevMonth = (e) => { e.stopPropagation(); setCurrentCalendarMonth(subMonths(currentCalendarMonth, 1)); };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 'Rendah',
      category: 'Pekerjaan',
      dueDate: ''
    }
  });

  const categoryValue = watch('category');
  const priorityValue = watch('priority');
  const dueDateValue = watch('dueDate');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Pastikan dropdown direset saat modal ditutup
  useEffect(() => {
    if (!isModalOpen) {
      setOpenDropdown(null);
    }
  }, [isModalOpen]);


  useEffect(() => {
    if (editingTask) {
      // Normalize casing to match exact <option> values preventing empty visual bugs
      const normCategory = (cat) => {
        if (!cat) return 'Pekerjaan';
        const l = cat.toLowerCase();
        if (l === 'pekerjaan') return 'Pekerjaan';
        if (l === 'pribadi') return 'Pribadi';
        if (l === 'belanja') return 'Belanja';
        return 'Lainnya';
      };

      const normPriority = (prio) => {
        if (!prio) return 'Rendah';
        const l = prio.toLowerCase();
        if (l.includes('tinggi') || l.includes('high')) return 'Prioritas Tinggi';
        if (l.includes('menengah') || l.includes('med')) return 'Menengah';
        return 'Rendah';
      };

      reset({
        title: editingTask.title || '',
        priority: normPriority(editingTask.priority),
        category: normCategory(editingTask.category),
        dueDate: editingTask.dueDate || ''
      });
    } else {
      reset({
        title: '',
        priority: 'Rendah',
        category: 'Pekerjaan',
        dueDate: ''
      });
    }
  }, [editingTask, isModalOpen, reset]);

  if (!isModalOpen) return null;

  const onSubmit = (data) => {
    const taskData = {
      title: data.title,
      priority: data.priority,
      dueDate: data.dueDate || getTodayDateString(),
      category: data.category,
      isCompleted: editingTask ? editingTask.isCompleted : false,
      isArchived: editingTask ? editingTask.isArchived : false,
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold">
            {editingTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4" ref={formRef}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Judul Tugas
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Apa yang perlu diselesaikan?"
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm`}
              autoFocus
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="hidden" {...register('category')} />
            <input type="hidden" {...register('priority')} />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.category ? 'border-red-500' : (openDropdown === 'category' ? 'border-primary shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-700')} rounded-lg focus:outline-none text-sm cursor-pointer flex justify-between items-center text-left transition-all`}
                >
                  <span className="truncate text-slate-800 dark:text-slate-200 font-medium">{categoryValue || 'Pilih Kategori'}</span>
                  <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {openDropdown === 'category' && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                    {['Pekerjaan', 'Pribadi', 'Belanja', 'Lainnya'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setValue('category', cat, { shouldValidate: true });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${categoryValue === cat ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
                      >
                        <span className="truncate">{cat}</span>
                        {categoryValue === cat && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prioritas
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
                  className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.priority ? 'border-red-500' : (openDropdown === 'priority' ? 'border-primary shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-700')} rounded-lg focus:outline-none text-sm cursor-pointer flex justify-between items-center text-left transition-all`}
                >
                  <span className={`truncate font-medium ${priorityValue === 'Prioritas Tinggi' ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
                    {priorityValue || 'Pilih Prioritas'}
                  </span>
                  <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform ${openDropdown === 'priority' ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                
                {openDropdown === 'priority' && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                    {['Rendah', 'Menengah', 'Prioritas Tinggi'].map((prio) => (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => {
                          setValue('priority', prio, { shouldValidate: true });
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${priorityValue === prio ? 'font-bold bg-primary/5 text-primary' : 'text-slate-600 dark:text-slate-300'} ${prio === 'Prioritas Tinggi' && priorityValue !== prio ? 'text-red-600' : ''}`}
                      >
                        <span className="truncate">{prio}</span>
                        {priorityValue === prio && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tenggat Waktu
            </label>
            <input type="hidden" {...register('dueDate')} />
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'dueDate' ? null : 'dueDate')}
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${errors.dueDate ? 'border-red-500' : (openDropdown === 'dueDate' ? 'border-primary shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-700')} rounded-lg focus:outline-none text-sm cursor-pointer flex justify-between items-center text-left transition-all`}
              >
                <span className={`truncate font-medium ${dueDateValue ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                  {dueDateValue ? format(new Date(dueDateValue), 'EEEE, d MMMM yyyy', { locale: idLocale }) : 'Pilih Tanggal Tenggat (Opsional)'}
                </span>
                <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform ${openDropdown === 'dueDate' ? 'rotate-180' : ''}`}>calendar_month</span>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === 'dueDate' ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
                <div className="overflow-hidden">
                  <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                      <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <p className="text-center font-bold text-sm capitalize">{format(currentCalendarMonth, 'MMMM yyyy', { locale: idLocale })}</p>
                    <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 flex items-center justify-center transition-colors">
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
                      const isSelected = dueDateValue && dueDateValue === format(day, 'yyyy-MM-dd');
                      const isPast = isBefore(startOfDay(day), todayDate);
                      
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            setValue('dueDate', format(day, 'yyyy-MM-dd'), { shouldValidate: true });
                            setOpenDropdown(null);
                          }}
                          className={`
                            relative flex items-center justify-center h-8 w-8 rounded-lg text-xs transition-all mx-auto
                            ${isPast ? 'opacity-30 cursor-not-allowed text-slate-300 dark:text-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200'}
                            ${!isCurrentMonth ? 'opacity-40 font-medium' : 'font-bold'}
                            ${isSelected ? '!bg-primary !text-white !opacity-100 shadow-sm shadow-primary/40' : ''}
                            ${isDayToday && !isSelected ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 !text-primary' : ''}
                          `}
                        >
                          {format(day, 'd')}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <button type="button" onClick={() => { setValue('dueDate', format(todayDate, 'yyyy-MM-dd'), { shouldValidate: true }); setOpenDropdown(null); }} className="text-xs font-bold text-primary hover:underline px-2 py-1 rounded bg-primary/5 hover:bg-primary/10">Hari Ini</button>
                    <button type="button" onClick={() => { setValue('dueDate', ''); setOpenDropdown(null); }} className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white px-2 py-1">Hapus Tenggat</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={closeModal}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                editingTask ? 'Simpan Perubahan' : 'Buat Tugas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
