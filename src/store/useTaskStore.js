import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { isTaskOverdue } from '../utils/dateUtils';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  subscription: null,

  // Real-time Subscription Setup
  setupSubscription: () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    if (get().subscription) return; // already subscribed

    const channel = supabase
      .channel(`public:tasks:${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` }, (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        const mapTask = (t) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          dueDate: t.due_date,
          category: t.category,
          isCompleted: t.is_completed,
          isArchived: t.is_archived,
          isOverdue: isTaskOverdue(t.due_date, t.is_completed),
          dateCreatedAt: t.created_at,
          status: t.status || 'todo',
          subtasks: t.subtasks || [],
          parentId: t.parent_id || null
        });

        set((state) => {
          let updatedTasks = [...state.tasks];
          if (eventType === 'INSERT') {
            // Avoid duplicate if optimistic UI already added it (by checking ID)
            if (!updatedTasks.some(t => t.id === newRecord.id)) {
              updatedTasks = [mapTask(newRecord), ...updatedTasks];
            }
          } else if (eventType === 'UPDATE') {
            updatedTasks = updatedTasks.map(t => t.id === newRecord.id ? mapTask(newRecord) : t);
          } else if (eventType === 'DELETE') {
            updatedTasks = updatedTasks.filter(t => t.id !== oldRecord.id);
          }
          return { tasks: updatedTasks };
        });
      })
      .subscribe();

    set({ subscription: channel });
  },

  teardownSubscription: () => {
    const sub = get().subscription;
    if (sub) {
      supabase.removeChannel(sub);
      set({ subscription: null });
    }
  },

  // Fetch from Supabase
  fetchTasks: async (includeArchived = false) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });

    // Build query efficiently
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (!includeArchived) {
      query = query.eq('is_archived', false);
    } else {
      query = query.eq('is_archived', true);
    }

    const { data: tasks, error } = await query.order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      // Map Supabase casing to Frontend format
      const mappedTasks = tasks.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        dueDate: t.due_date,
        category: t.category,
        isCompleted: t.is_completed,
        isArchived: t.is_archived,
        isOverdue: isTaskOverdue(t.due_date, t.is_completed),
        dateCreatedAt: t.created_at,
        status: t.status || 'todo',
        subtasks: t.subtasks || [],
        parentId: t.parent_id || null
      }));
      set({ tasks: mappedTasks, isLoading: false });

      // Initialize Real-time Listener if not already
      get().setupSubscription();
    }
  },

  // Actions
  addTask: async (newTask) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    set({ isLoading: true, error: null });

    const dbTask = {
      user_id: user.id,
      title: newTask.title,
      category: newTask.category || newTask.project,
      priority: newTask.priority,
      due_date: newTask.dueDate,
      status: newTask.status || 'todo',
      subtasks: newTask.subtasks || [],
      parent_id: newTask.parentId || null
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([dbTask])
      .select()
      .single();

    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      const addedTask = {
        id: data.id,
        title: data.title,
        priority: data.priority,
        dueDate: data.due_date,
        category: data.category,
        isCompleted: data.is_completed,
        isArchived: data.is_archived,
        isOverdue: isTaskOverdue(data.due_date, data.is_completed),
        dateCreatedAt: data.created_at,
        status: data.status || 'todo',
        subtasks: data.subtasks || [],
        parentId: data.parent_id || null
      };
      set((state) => ({
        tasks: [addedTask, ...state.tasks],
        isLoading: false
      }));
    }
  },

  editTask: async (id, updatedTask) => {
    set({ isLoading: true, error: null });

    // Map Frontend keys back to db columns
    const dbUpdate = {};
    if (updatedTask.title !== undefined) dbUpdate.title = updatedTask.title;
    if (updatedTask.category !== undefined) dbUpdate.category = updatedTask.category;
    else if (updatedTask.project !== undefined) dbUpdate.category = updatedTask.project;
    if (updatedTask.priority !== undefined) dbUpdate.priority = updatedTask.priority;
    if (updatedTask.dueDate !== undefined) dbUpdate.due_date = updatedTask.dueDate;
    if (updatedTask.status !== undefined) dbUpdate.status = updatedTask.status;
    if (updatedTask.subtasks !== undefined) dbUpdate.subtasks = updatedTask.subtasks;
    if ('parentId' in updatedTask) dbUpdate.parent_id = updatedTask.parentId ?? null;

    const { error } = await supabase.from('tasks').update(dbUpdate).eq('id', id);

    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      set((state) => ({
        tasks: state.tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task),
        isLoading: false
      }));
    }
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    // Optimistic UI Update 
    const previousTasks = [...get().tasks];
    set((state) => ({
      tasks: state.tasks.map(t => {
        if (t.id === id) {
          const completed = !t.isCompleted;
          return { ...t, isCompleted: completed, isOverdue: isTaskOverdue(t.dueDate, completed) };
        }
        return t;
      })
    }));

    const { error } = await supabase.from('tasks').update({ is_completed: !task.isCompleted }).eq('id', id);
    if (error) {
      set({ error: error.message, tasks: previousTasks });
    }
  },

  archiveTask: async (id) => {
    // Cascade: juga arsipkan semua tugas anak
    const children = get().tasks.filter(t => t.parentId === id);
    const idsToArchive = [id, ...children.map(c => c.id)];

    const previousTasks = [...get().tasks];
    set(state => ({
      tasks: state.tasks.map(t => idsToArchive.includes(t.id) ? { ...t, isArchived: true } : t)
    }));

    const { error } = await supabase.from('tasks').update({ is_archived: true }).in('id', idsToArchive);
    if (error) set({ error: error.message, tasks: previousTasks });
  },

  unarchiveTask: async (id) => {
    const previousTasks = [...get().tasks];
    set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, isArchived: false } : t) }));

    const { error } = await supabase.from('tasks').update({ is_archived: false }).eq('id', id);
    if (error) set({ error: error.message, tasks: previousTasks });
  },

  // Parent-Child Hierarchy Actions
  setParent: async (childId, parentId) => {
    const previousTasks = [...get().tasks];
    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === childId ? { ...t, parentId } : t)
    }));

    const { error } = await supabase
      .from('tasks')
      .update({ parent_id: parentId })
      .eq('id', childId);

    if (error) {
      set({ error: error.message, tasks: previousTasks });
    }
  },

  detachParent: async (childId) => {
    const previousTasks = [...get().tasks];
    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === childId ? { ...t, parentId: null } : t)
    }));

    const { error } = await supabase
      .from('tasks')
      .update({ parent_id: null })
      .eq('id', childId);

    if (error) {
      set({ error: error.message, tasks: previousTasks });
    }
  },

  deleteTaskPermanently: async (id) => {
    // Cascade: juga hapus semua tugas anak
    const children = get().tasks.filter(t => t.parentId === id);
    const idsToDelete = [id, ...children.map(c => c.id)];

    const previousTasks = [...get().tasks];
    set(state => ({ tasks: state.tasks.filter(t => !idsToDelete.includes(t.id)) }));

    const { error } = await supabase.from('tasks').delete().in('id', idsToDelete);
    if (error) {
      set({ error: error.message, tasks: previousTasks });
    }
  },

  // Filtering & Setup
  currentFilter: 'inbox', // 'inbox', 'today', 'important'
  currentCategory: 'all', // 'all', 'Pekerjaan', 'Pribadi', 'Belanja'
  searchQuery: '',

  setFilter: (filter) => set({ currentFilter: filter, currentCategory: 'all' }),
  setCategory: (category) => set({ currentCategory: category, currentFilter: 'all' }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Server-Side Search
  searchTasksServerSide: async (query) => {
    const user = useAuthStore.getState().user;
    if (!user || !query.trim()) return;

    const { data: searchResults, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .ilike('title', `%${query}%`)
      .limit(20);

    if (!error && searchResults) {
      const mappedResults = searchResults.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        dueDate: t.due_date,
        category: t.category,
        isCompleted: t.is_completed,
        isArchived: t.is_archived,
        isOverdue: isTaskOverdue(t.due_date, t.is_completed),
        dateCreatedAt: t.created_at,
        status: t.status || 'todo',
        subtasks: t.subtasks || [],
        parentId: t.parent_id || null
      }));

      set(state => {
        const mergedTasks = [...state.tasks];
        mappedResults.forEach(mappedRec => {
          if (!mergedTasks.some(existing => existing.id === mappedRec.id)) {
            mergedTasks.push(mappedRec);
          }
        });
        return { tasks: mergedTasks };
      });
    }
  },

  // Modal State
  isModalOpen: false,
  editingTask: null, // null means "Create Mode", otherwise contains task object

  openModal: (task = null) => set({ isModalOpen: true, editingTask: task }),
  closeModal: () => set({ isModalOpen: false, editingTask: null }),

  // Mobile Navigation State
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen })
}));
