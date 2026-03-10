import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTaskStore } from '../store/useTaskStore';
import { getTodayDateString } from '../utils/dateUtils';

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

  const {
    register,
    handleSubmit,
    reset,
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer pr-10"
                >
                  <option value="Pekerjaan" className="py-2">Pekerjaan</option>
                  <option value="Pribadi" className="py-2">Pribadi</option>
                  <option value="Belanja" className="py-2">Belanja</option>
                  <option value="Lainnya" className="py-2">Lainnya</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prioritas
              </label>
              <div className="relative">
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer pr-10"
                >
                  <option value="Rendah" className="py-2">Rendah</option>
                  <option value="Menengah" className="py-2">Menengah</option>
                  <option value="Prioritas Tinggi" className="py-2 text-red-600 font-medium">Prioritas Tinggi</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tenggat Waktu
            </label>
            <div className="relative">
              <input
                type="date"
                {...register('dueDate')}
                min={getTodayDateString()}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm cursor-pointer"
              />
            </div>
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
