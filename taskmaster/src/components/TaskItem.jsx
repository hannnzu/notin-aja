import { useTaskStore } from '../store/useTaskStore';

export default function TaskItem({
  id,
  title,
  priority,
  dueDate,
  project,
  category,
  isCompleted,
  isOverdue,
  isArchived,
}) {
  const toggleComplete = useTaskStore(state => state.toggleComplete);
  const archiveTask = useTaskStore(state => state.archiveTask);
  const unarchiveTask = useTaskStore(state => state.unarchiveTask);
  const deleteTaskPermanently = useTaskStore(state => state.deleteTaskPermanently);
  const openModal = useTaskStore(state => state.openModal);

  const getPriorityStyle = (prio) => {
    switch (prio) {
      case 'High Priority':
      case 'Prioritas Tinggi':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
      case 'Menengah':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low':
      case 'Rendah':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return 'Tidak diatur';
    if (dateStr === 'Hari Ini' || dateStr === 'Selesai') return dateStr;
    
    // Parse 'YYYY-MM-DD'
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="task-row group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex items-center justify-center shrink-0">
        <input
          checked={isCompleted}
          onChange={() => toggleComplete(id)}
          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
          type="checkbox"
        />
      </div>
      <div className={`flex-1 min-w-0 ${isCompleted ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3 mb-1">
          <h4
            className={`text-sm font-semibold text-slate-900 dark:text-white truncate ${
              isCompleted ? 'line-through' : ''
            }`}
          >
            {title}
          </h4>
          {priority && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(
                priority
              )}`}
            >
              {priority}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span
            className={`flex items-center gap-1 ${
              isOverdue ? 'text-red-500 font-medium' : ''
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isCompleted ? 'check_circle' : isOverdue ? 'warning' : 'calendar_month'}
            </span>
            {isCompleted ? 'Selesai' : isOverdue ? `Terlambat: ${getFormattedDate(dueDate)}` : getFormattedDate(dueDate)}
          </span>
          {project && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                {category === 'Work' ? 'account_tree' : 'flag'}
              </span>
              {project}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions opacity-0 transition-opacity flex items-center gap-1">
        {!isArchived && (
          <button 
            onClick={() => openModal({ id, title, priority, dueDate, project, category, isCompleted, isOverdue, isArchived })}
            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
        )}
        {isArchived && (
          <button 
            className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg"
            onClick={() => unarchiveTask(id)}
            title="Kembalikan Tugas"
          >
            <span className="material-symbols-outlined text-xl">unarchive</span>
          </button>
        )}
        <button 
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          onClick={() => isArchived ? deleteTaskPermanently(id) : archiveTask(id)}
          title={isArchived ? "Hapus Permanen" : "Arsipkan Tugas"}
        >
          <span className="material-symbols-outlined text-xl">delete</span>
        </button>
      </div>
    </div>
  );
}
