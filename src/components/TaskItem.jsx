import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { formatTaskDateDisplay } from '../utils/dateUtils';

export default function TaskItem({
  id,
  title,
  priority,
  dueDate,
  category,
  isCompleted,
  isArchived,
  isOverdue,
  subtasks = [],
  status = 'todo',
  isBoardView = false,
  childTasks = [],
  isChild = false,
}) {
  const toggleComplete = useTaskStore(state => state.toggleComplete);
  const archiveTask = useTaskStore(state => state.archiveTask);
  const unarchiveTask = useTaskStore(state => state.unarchiveTask);
  const deleteTaskPermanently = useTaskStore(state => state.deleteTaskPermanently);
  const openModal = useTaskStore(state => state.openModal);

  const [isExpanded, setIsExpanded] = useState(true);

  const hasChildren = childTasks.length > 0;
  const showExpandCollapse = !isBoardView && hasChildren;
  const completedChildren = childTasks.filter(c => c.isCompleted).length;

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

  const formattedDate = formatTaskDateDisplay(dueDate);
  const completedSubtasks = subtasks ? subtasks.filter(s => s.isCompleted).length : 0;
  const totalSubtasks = subtasks ? subtasks.length : 0;

  return (
    <div>
      {/* Main task card */}
      <div className={`task-row group bg-white dark:bg-slate-900 rounded-xl border transition-all hover:shadow-md flex flex-wrap sm:flex-nowrap
        ${isBoardView ? 'flex-col p-3 shadow-sm' : 'p-3 md:p-4 items-start sm:items-center gap-3 md:gap-4'}
        ${isChild
          ? 'border-l-[3px] border-l-primary/40 border-slate-200 dark:border-slate-800 hover:border-l-primary/70'
          : 'border-slate-200 dark:border-slate-800 hover:border-primary/30'
        }
      `}>
        {/* Checkbox */}
        <div className={`flex shrink-0 ${isBoardView ? 'justify-between items-start mb-2' : 'items-center justify-center'}`}>
          <input
            checked={isCompleted}
            onChange={() => toggleComplete(id)}
            className={`w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer ${isBoardView ? 'mt-0.5' : ''}`}
            type="checkbox"
          />
        </div>

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isCompleted ? 'opacity-60' : ''}`}>
          <div className={`flex flex-col mb-2 ${!isBoardView ? 'sm:flex-row sm:items-center gap-1.5 sm:gap-3' : 'gap-1.5'}`}>
            <h4 className={`text-sm font-semibold text-slate-900 dark:text-white ${isBoardView ? '' : 'truncate'} ${isCompleted ? 'line-through' : ''}`}>
              {title}
            </h4>
            {!isBoardView && priority && (
              <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${getPriorityStyle(priority)}`}>
                {priority}
              </span>
            )}
            {/* Children badge — tampil di semua view */}
            {hasChildren && (
              <span className="w-fit flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full shrink-0">
                <span className="material-symbols-outlined text-[11px]">account_tree</span>
                {completedChildren}/{childTasks.length}
              </span>
            )}
          </div>
          <div className={`flex flex-wrap items-center text-[11px] sm:text-xs text-slate-500 ${isBoardView ? 'gap-2 justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/50' : 'gap-2 sm:gap-4'}`}>
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              <span className="material-symbols-outlined text-sm">
                {isCompleted ? 'check_circle' : isOverdue ? 'warning' : 'calendar_month'}
              </span>
              {isCompleted ? 'Selesai' : isOverdue ? `Terlambat: ${formattedDate}` : formattedDate}
            </span>
            {category && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  {category === 'Pekerjaan' ? 'account_tree' : category === 'Lainnya' ? 'flag' : category === 'Belanja' ? 'shopping_cart' : 'person'}
                </span>
                {category}
              </span>
            )}
            {totalSubtasks > 0 && (
              <span className={`flex items-center gap-1 ${completedSubtasks === totalSubtasks ? 'text-green-500' : ''}`}>
                <span className="material-symbols-outlined text-[14px]">checklist</span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isBoardView && (
          <div className="task-actions transition-opacity flex shrink-0 items-center gap-1 md:opacity-0 md:group-hover:opacity-100 mt-2 sm:mt-0 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                title={isExpanded ? 'Sembunyikan tugas turunan' : 'Tampilkan tugas turunan'}
              >
                <span className="material-symbols-outlined text-xl">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            )}
            {!isArchived && (
              <button
                onClick={() => openModal({ id, title, priority, dueDate, category, isCompleted, isArchived, subtasks, status })}
                className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
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
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md"
              onClick={() => isArchived ? deleteTaskPermanently(id) : archiveTask(id)}
              title={isArchived ? 'Hapus Permanen' : 'Arsipkan Tugas'}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Child tasks (tree rendering) */}
      {hasChildren && isExpanded && (
        <div className="mt-2 ml-6 space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
          {childTasks.map(child => (
            <TaskItem key={child.id} {...child} isChild={true} isBoardView={false} childTasks={[]} />
          ))}
        </div>
      )}
    </div>
  );
}
