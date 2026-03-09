import TaskList from '../components/TaskList';
import { useTaskStore } from '../store/useTaskStore';

export default function ArchivePage() {
  const { tasks } = useTaskStore();

  const archivedTasks = tasks.filter(t => t.isArchived);

  return (
    <div className="max-w-[1440px] mx-auto p-6 w-full relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Arsip Tugas</h1>
        <p className="text-slate-500 mt-1">Tugas yang telah dihapus atau diarsipkan.</p>
      </div>
      
      {archivedTasks.length === 0 ? (
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
