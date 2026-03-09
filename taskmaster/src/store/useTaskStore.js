import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const initialTasks = [
  {
    id: uuidv4(),
    title: 'Selesaikan Dek Kampanye Pemasaran Q4',
    priority: 'Prioritas Tinggi',
    dueDate: 'Hari Ini',
    project: 'Pekerjaan',
    isCompleted: false,
    isOverdue: false,
    isArchived: false,
    dateCreatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Tinjau umpan balik sprint tim',
    priority: 'Menengah',
    dueDate: '25 Okt',
    project: 'Pekerjaan',
    isCompleted: false,
    isOverdue: false,
    isArchived: false,
    dateCreatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Draf email pembaruan mingguan',
    priority: 'Rendah',
    dueDate: 'Selesai',
    project: 'Pekerjaan',
    isCompleted: true,
    isOverdue: false,
    isArchived: false,
    dateCreatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Pesan penerbangan untuk liburan',
    priority: 'Prioritas Tinggi',
    dueDate: '19 Okt',
    project: 'Pribadi',
    isCompleted: false,
    isOverdue: true,
    isArchived: false,
    dateCreatedAt: new Date().toISOString()
  },
];

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: initialTasks,
  
  // Actions
  addTask: (newTask) => set((state) => ({
    tasks: [...state.tasks, { ...newTask, id: uuidv4(), isCompleted: false, isArchived: false, dateCreatedAt: new Date().toISOString() }]
  })),

  editTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updatedTask } : task
    )
  })),
  
  toggleComplete: (id) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    )
  })),
  
  archiveTask: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, isArchived: true } : task
    )
  })),

  unarchiveTask: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, isArchived: false } : task
    )
  })),

  deleteTaskPermanently: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),

  // Filtering & Setup
  currentFilter: 'inbox', // 'inbox', 'today', 'important'
  currentCategory: 'all', // 'all', 'Pekerjaan', 'Pribadi', 'Belanja'
  searchQuery: '',

  setFilter: (filter) => set({ currentFilter: filter, currentCategory: 'all' }),
  setCategory: (category) => set({ currentCategory: category, currentFilter: 'all' }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modal State
  isModalOpen: false,
  editingTask: null, // null means "Create Mode", otherwise contains task object

      openModal: (task = null) => set({ isModalOpen: true, editingTask: task }),
      closeModal: () => set({ isModalOpen: false, editingTask: null })
    }),
    {
      name: 'notin-aja-storage', // unique name for localStorage key
      partialize: (state) => ({ tasks: state.tasks }), // only persist tasks
    }
  )
);
