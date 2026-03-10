import { useEffect } from 'react';
import TaskList from '../components/TaskList';
import { useTaskStore } from '../store/useTaskStore';

export default function ArchivePage() {
  const { tasks, fetchTasks, isLoading, error } = useTaskStore();

  useEffect(() => {
    // Explicitly fetch archived tasks
    fetchTasks(true);
  }, [fetchTasks]);

  const archivedTasks = tasks.filter(t => t.isArchived);

  return (
    <div className="max-w-[1440px] mx-auto p-6 w-full relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Arsip Tugas</h1>
        <p className="text-slate-500 mt-1">Tugas yang telah dihapus atau diarsipkan.</p>
      </div>


      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
          Gagal mengambil arsip: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
        </div>
      ) : archivedTasks.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          Tidak ada tugas yang diarsipkan.
        </div>
      ) : (
        <TaskList
          title="Tugas Diarsipkan"
          icon="archive"
          iconColor="text-slate-500"
          count={archivedTasks.length}
          tasks={archivedTasks}
        />
      )}
    </div>
  );
}
