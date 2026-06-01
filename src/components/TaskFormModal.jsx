import { useEffect, useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTaskStore } from '../store/useTaskStore';
import { useCategoryStore, CATEGORY_COLOR_PALETTE } from '../store/useCategoryStore';
import { getTodayDateString } from '../utils/dateUtils';
import { startOfMonth, format, isToday, isSameMonth, isBefore, startOfDay } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { v4 as uuidv4 } from 'uuid';
import { useCalendar } from '../hooks/useCalendar';

const taskSchema = z.object({
  title: z.string().min(1, 'Judul tugas tidak boleh kosong'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
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
  const isLoading = useTaskStore(state => state.isLoading);
  const allTasks = useTaskStore(state => state.tasks);
  const categories = useCategoryStore(state => state.categories);
  const addCategory = useCategoryStore(state => state.addCategory);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(3);
  const [categoryError, setCategoryError] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState('info');
  const {
    currentCalendarMonth,
    calendarDays,
    nextMonth,
    prevMonth,
    setCurrentCalendarMonth
  } = useCalendar();

  // Sub-tasks state
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [subtaskError, setSubtaskError] = useState('');
  const subtaskInputRef = useRef(null);

  // Parent task state
  const [selectedParentId, setSelectedParentId] = useState(null);

  // Eligible parent tasks: non-archived root tasks, exclude self
  const eligibleParents = useMemo(() =>
    allTasks.filter(t =>
      !t.isArchived &&
      !t.parentId &&
      t.id !== editingTask?.id
    ),
    [allTasks, editingTask]
  );

  // Kumpulkan semua judul sub-tugas unik dari seluruh tugas
  const allSubtaskTitles = useMemo(() => {
    const titles = new Set();
    allTasks.forEach(task => {
      (task.subtasks || []).forEach(st => {
        if (st.title && st.title.trim()) titles.add(st.title.trim());
      });
    });
    return [...titles].sort();
  }, [allTasks]);

  // Filter saran berdasarkan input saat ini
  const subtaskSuggestions = useMemo(() => {
    if (!newSubtaskTitle.trim()) return [];
    const q = newSubtaskTitle.toLowerCase();
    return allSubtaskTitles.filter(title =>
      title.toLowerCase().includes(q) &&
      !subtasks.some(s => s.title.toLowerCase() === title.toLowerCase())
    ).slice(0, 6); // maks 6 saran
  }, [newSubtaskTitle, allSubtaskTitles, subtasks]);

  const addSubtask = (title) => {
    if (!title.trim()) return;
    // Cegah duplikasi — jika sudah ada sub-tugas dengan judul sama, skip dan tampilkan error
    if (subtasks.some(s => s.title.toLowerCase() === title.trim().toLowerCase())) {
      setSubtaskError('Sub-tugas ini sudah ada di dalam daftar!');
      // Hilangkan error setelah 3 detik secara otomatis
      setTimeout(() => setSubtaskError(''), 3000);
      subtaskInputRef.current?.focus();
      return;
    }
    setSubtasks(prev => [...prev, { id: uuidv4(), title: title.trim(), isCompleted: false }]);
    setNewSubtaskTitle('');
    setSubtaskError('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    subtaskInputRef.current?.focus();
  };

  const monthStart = startOfMonth(currentCalendarMonth);
  const todayDate = startOfDay(new Date());

  const handleNextMonth = (e) => { e.stopPropagation(); nextMonth(); };
  const handlePrevMonth = (e) => { e.stopPropagation(); prevMonth(); };

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
      description: '',
      priority: 'Rendah',
      category: 'Pekerjaan',
      dueDate: ''
    }
  });

  const categoryValue = watch('category');
  const priorityValue = watch('priority');
  const dueDateValue = watch('dueDate');
  const descriptionValue = watch('description') || '';

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
    } else {
      setActiveTab('info');
      setCurrentCalendarMonth(new Date());
    }
  }, [isModalOpen, setCurrentCalendarMonth]);

  // Redirect to info tab on validation error
  useEffect(() => {
    if (errors.title || errors.category || errors.priority || errors.dueDate) {
      setActiveTab('info');
    }
  }, [errors]);


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
        description: editingTask.description || '',
        priority: normPriority(editingTask.priority),
        category: normCategory(editingTask.category),
        dueDate: editingTask.dueDate || ''
      });
      setSubtasks(editingTask.subtasks || []);
      setSelectedParentId(editingTask.parentId || null);
    } else {
      reset({
        title: '',
        description: '',
        priority: 'Rendah',
        category: 'Pekerjaan',
        dueDate: ''
      });
      setSubtasks([]);
      setSelectedParentId(null);
    }
    setNewSubtaskTitle('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setSubtaskError('');
    setIsAddingCategory(false);
    setNewCategoryName('');
    setCategoryError('');
  }, [editingTask, isModalOpen, reset]);

  if (!isModalOpen) return null;

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const result = await addCategory(newCategoryName, newCategoryColor);
    if (result.success) {
      setValue('category', result.category.name, { shouldValidate: true });
      setIsAddingCategory(false);
      setNewCategoryName('');
      setNewCategoryColor(3);
      setCategoryError('');
      setOpenDropdown(null);
    } else {
      setCategoryError(result.error || 'Gagal menambah kategori.');
    }
  };

  const onSubmit = (data) => {
    const isEditMode = !!(editingTask && editingTask.id);
    const taskData = {
      title: data.title,
      description: data.description || '',
      priority: data.priority,
      dueDate: data.dueDate || getTodayDateString(),
      category: data.category,
      isCompleted: isEditMode ? editingTask.isCompleted : false,
      isArchived: isEditMode ? editingTask.isArchived : false,
      subtasks: subtasks,
      status: editingTask?.status || 'todo',
      parentId: selectedParentId
    };

    if (isEditMode) {
      editTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    closeModal();
  };

  const isEditMode = !!(editingTask && editingTask.id);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold">
            {isEditMode ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Info Utama
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subtasks')}
            className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'subtasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Sub-Tugas
            {subtasks.length > 0 && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {subtasks.length}
              </span>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4" ref={formRef}>
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-200">
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

          {/* Deskripsi / Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi
              <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span>
            </label>
            <div className="relative">
              <textarea
                {...register('description')}
                placeholder="Tambahkan catatan, konteks, atau detail tugas..."
                rows={3}
                maxLength={500}
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                  errors.description ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none placeholder:text-slate-400 transition-all`}
              />
              <span className={`absolute bottom-2 right-3 text-[10px] font-medium ${
                descriptionValue.length > 450 ? 'text-amber-500' : 'text-slate-400'
              }`}>
                {descriptionValue.length}/500
              </span>
            </div>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="hidden" {...register('category')} />
            <input type="hidden" {...register('priority')} />

            {/* Kategori */}
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
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
                    {categories.map((cat) => {
                      const color = CATEGORY_COLOR_PALETTE[cat.colorIndex ?? 3];
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setValue('category', cat.name, { shouldValidate: true });
                            setOpenDropdown(null);
                            setIsAddingCategory(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${categoryValue === cat.name ? 'font-bold text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <span className={`w-2.5 h-2.5 rounded-full ${color.bg} shrink-0`}></span>
                            <span className="truncate">{cat.name}</span>
                          </span>
                          {categoryValue === cat.name && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                      );
                    })}

                    {/* Tambah Kategori Baru */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      {!isAddingCategory ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_circle</span>
                          Tambah Kategori Baru
                        </button>
                      ) : (
                        <div className="p-3 space-y-2">
                          <input
                            type="text"
                            autoFocus
                            value={newCategoryName}
                            onChange={e => { setNewCategoryName(e.target.value); setCategoryError(''); }}
                            onKeyDown={e => {
                              if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }
                              if (e.key === 'Escape') { setIsAddingCategory(false); setNewCategoryName(''); }
                            }}
                            placeholder="Nama kategori baru..."
                            className="w-full px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          {/* Color picker */}
                          <div className="flex gap-1.5 flex-wrap">
                            {CATEGORY_COLOR_PALETTE.map((c, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setNewCategoryColor(idx)}
                                className={`w-5 h-5 rounded-full ${c.bg} transition-all ${
                                  newCategoryColor === idx ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'
                                }`}
                              />
                            ))}
                          </div>
                          {categoryError && <p className="text-red-500 text-xs">{categoryError}</p>}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              disabled={!newCategoryName.trim()}
                              className="flex-1 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); setCategoryError(''); }}
                              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            {/* Prioritas */}
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

          {/* Bagian dari Tugas (Parent Selector) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Bagian dari Tugas
              <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'parent' ? null : 'parent')}
                className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border ${openDropdown === 'parent' ? 'border-primary shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:outline-none text-sm cursor-pointer flex justify-between items-center text-left transition-all`}
              >
                <span className="flex items-center gap-2 truncate">
                  {selectedParentId
                    ? (
                      <>
                        <span className="material-symbols-outlined text-[14px] text-primary">account_tree</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium truncate">
                          {eligibleParents.find(t => t.id === selectedParentId)?.title || 'Tugas tidak ditemukan'}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400">Tidak ada (Tugas Mandiri)</span>
                    )
                  }
                </span>
                <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform shrink-0 ${openDropdown === 'parent' ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {openDropdown === 'parent' && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setSelectedParentId(null); setOpenDropdown(null); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${!selectedParentId ? 'font-bold text-primary bg-primary/5' : 'text-slate-500'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">remove_circle_outline</span>
                      Tidak ada (Tugas Mandiri)
                    </span>
                    {!selectedParentId && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  {eligibleParents.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">Belum ada tugas utama tersedia.</p>
                  )}
                  {eligibleParents.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { setSelectedParentId(t.id); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${selectedParentId === t.id ? 'font-bold text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-200'}`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">task_alt</span>
                        <span className="truncate">{t.title}</span>
                      </span>
                      {selectedParentId === t.id && <span className="material-symbols-outlined text-[16px]">check</span>}
                    </button>
                  ))}
                </div>
              )}
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
                      <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <p className="text-center font-bold text-sm capitalize">{format(currentCalendarMonth, 'MMMM yyyy', { locale: idLocale })}</p>
                      <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 flex items-center justify-center transition-colors">
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
          </div>
          )}

          {activeTab === 'subtasks' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Subtasks Section */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sub-Tugas <span className="text-slate-400 font-normal text-xs ml-1">({subtasks.filter(s => s.isCompleted).length}/{subtasks.length})</span>
            </label>
            {subtasks.length > 0 && (
              <div className="space-y-2 mb-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {subtasks.map(st => (
                  <div key={st.id} className="flex items-center gap-2 group bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSubtasks(subtasks.map(s => s.id === st.id ? { ...s, isCompleted: !s.isCompleted } : s))}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors shadow-sm ${st.isCompleted ? 'bg-primary border-primary text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`}
                    >
                      {st.isCompleted && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                    </button>
                    <span className={`text-sm flex-1 truncate transition-all ${st.isCompleted ? 'text-slate-400 line-through italic' : 'text-slate-700 dark:text-slate-200'}`}>
                      {st.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))}
                      className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input + Autocomplete */}
            <div className="flex gap-2">
              <div
                className="relative flex-1"
                onBlur={(e) => {
                  // Menutup suggestions hanya jika fokus berpindah keluar dari elemen dropdown/container autocomplete
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShowSuggestions(false);
                    setActiveSuggestionIndex(-1);
                  }
                }}
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400 pointer-events-none">
                  add_task
                </span>
                <input
                  ref={subtaskInputRef}
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => {
                    setNewSubtaskTitle(e.target.value);
                    setShowSuggestions(true);
                    setActiveSuggestionIndex(-1); // Reset highlight saat mengetik
                    if (subtaskError) setSubtaskError('');
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setShowSuggestions(true);
                      setActiveSuggestionIndex(prev =>
                        prev < subtaskSuggestions.length - 1 ? prev + 1 : prev
                      );
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveSuggestionIndex(prev => (prev > -1 ? prev - 1 : -1));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (showSuggestions && activeSuggestionIndex >= 0 && activeSuggestionIndex < subtaskSuggestions.length) {
                        // Jika ada saran yang disorot, pilih saran tersebut
                        addSubtask(subtaskSuggestions[activeSuggestionIndex]);
                      } else {
                        // Jika tidak, tambahkan teks mentah dari input
                        addSubtask(newSubtaskTitle);
                      }
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }
                  }}
                  placeholder="Ketik sub-tugas dan tekan Enter..."
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border ${
                    subtaskError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-slate-400 transition-all`}
                />

                {/* Dropdown Saran */}
                {showSuggestions && subtaskSuggestions.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                      Pernah dipakai
                    </p>
                    {subtaskSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // Cegah blur agar klik terdaftar instan
                        onClick={() => addSubtask(suggestion)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                          idx === activeSuggestionIndex
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px] text-slate-400">history</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => addSubtask(newSubtaskTitle)}
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">add</span>
              </button>
            </div>
            {/* Pesan Mikro-Error Visual jika Terjadi Kesalahan (Misal: Duplikasi Input) */}
            {subtaskError && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1.5 animate-in slide-in-from-top-1 duration-150">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {subtaskError}
              </p>
            )}
          </div>
          </div>
          )}

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
