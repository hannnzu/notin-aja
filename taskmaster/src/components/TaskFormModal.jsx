import { useState, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';

export default function TaskFormModal() {
  const isModalOpen = useTaskStore(state => state.isModalOpen);
  const editingTask = useTaskStore(state => state.editingTask);
  const closeModal = useTaskStore(state => state.closeModal);
  const addTask = useTaskStore(state => state.addTask);
  const editTask = useTaskStore(state => state.editTask);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Rendah');
  const [dueDate, setDueDate] = useState('');
  const [project, setProject] = useState('Pekerjaan');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setPriority(editingTask.priority || 'Rendah');
      setDueDate(editingTask.dueDate || '');
      setProject(editingTask.project || 'Pekerjaan');
    } else {
      setTitle('');
      setPriority('Rendah');
      setDueDate('');
      setProject('Pekerjaan');
    }
  }, [editingTask, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      priority,
      dueDate: dueDate || 'Hari Ini', // default dummy
      project,
      isOverdue: false, // dummy logic for simplification
    };

    if (editingTask) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    closeModal();
  };

  // Helper to format date for display if needed
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Judul Tugas
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Apa yang perlu diselesaikan?"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              autoFocus
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <div className="relative">
                <select 
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
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
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
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
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getTodayDateString()}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm cursor-pointer"
              />
            </div>
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-primary/20"
            >
              {editingTask ? 'Simpan Perubahan' : 'Buat Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
