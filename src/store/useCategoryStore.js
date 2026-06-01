import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

// Warna palet untuk kategori kustom
export const CATEGORY_COLOR_PALETTE = [
  { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20', icon: 'work' },
  { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20', icon: 'person' },
  { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-50 dark:bg-green-900/20', icon: 'shopping_cart' },
  { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20', icon: 'category' },
  { bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-50 dark:bg-rose-900/20', icon: 'favorite' },
  { bg: 'bg-teal-500', text: 'text-teal-500', light: 'bg-teal-50 dark:bg-teal-900/20', icon: 'spa' },
  { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20', icon: 'star' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'school' },
];

// Kategori bawaan (tidak bisa dihapus, selalu ada)
export const DEFAULT_CATEGORIES = [
  { id: 'default-pekerjaan', name: 'Pekerjaan', colorIndex: 0, isDefault: true },
  { id: 'default-pribadi', name: 'Pribadi', colorIndex: 1, isDefault: true },
  { id: 'default-belanja', name: 'Belanja', colorIndex: 2, isDefault: true },
  { id: 'default-lainnya', name: 'Lainnya', colorIndex: 3, isDefault: true },
];

export const useCategoryStore = create((set, get) => ({
  categories: [...DEFAULT_CATEGORIES],
  isLoading: false,
  error: null,

  // Ambil semua kategori user dari Supabase
  fetchCategories: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      // Tabel mungkin belum dibuat — fallback ke default
      set({ isLoading: false, categories: [...DEFAULT_CATEGORIES] });
    } else {
      const customCategories = (data || []).map(c => ({
        id: c.id,
        name: c.name,
        colorIndex: c.color_index ?? 3,
        isDefault: false,
      }));
      set({
        categories: [...DEFAULT_CATEGORIES, ...customCategories],
        isLoading: false
      });
    }
  },

  // Tambah kategori baru
  addCategory: async (name, colorIndex = 3) => {
    const user = useAuthStore.getState().user;
    if (!user) return { success: false };

    // Cegah duplikasi nama
    const exists = get().categories.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) return { success: false, error: 'Kategori dengan nama ini sudah ada.' };

    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id: user.id, name: name.trim(), color_index: colorIndex }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    const newCat = { id: data.id, name: data.name, colorIndex: data.color_index ?? 3, isDefault: false };
    set(state => ({ categories: [...state.categories, newCat] }));
    return { success: true, category: newCat };
  },

  // Hapus kategori kustom
  deleteCategory: async (id) => {
    const cat = get().categories.find(c => c.id === id);
    if (!cat || cat.isDefault) return { success: false, error: 'Kategori bawaan tidak bisa dihapus.' };

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    set(state => ({ categories: state.categories.filter(c => c.id !== id) }));
    return { success: true };
  },

  // Helper: dapatkan warna untuk nama kategori
  getCategoryColor: (name) => {
    const cat = get().categories.find(c => c.name === name);
    const idx = cat?.colorIndex ?? 3;
    return CATEGORY_COLOR_PALETTE[idx] ?? CATEGORY_COLOR_PALETTE[3];
  },

  // Hanya nama-nama kategori (untuk dropdown)
  getCategoryNames: () => get().categories.map(c => c.name),
}));
