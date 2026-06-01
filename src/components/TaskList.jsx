import TaskItem from './TaskItem';

export default function TaskList({
  title, icon, iconColor, count, tasks, childrenMap = {},
  selectionMode = false,
  selectedIds = [],
  onSelectTask,
  onSelectAll,
}) {
  const allSelected = tasks.length > 0 && tasks.every(t => selectedIds.includes(t.id));
  const someSelected = tasks.some(t => selectedIds.includes(t.id));

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {selectionMode && (
          <button
            onClick={() => onSelectAll?.(tasks.map(t => t.id), !allSelected)}
            className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
              border-slate-300 dark:border-slate-600 hover:border-primary"
            title={allSelected ? 'Batalkan pilih semua' : 'Pilih semua'}
          >
            {allSelected && (
              <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
            )}
            {!allSelected && someSelected && (
              <span className="w-2 h-2 rounded-sm bg-primary block" />
            )}
          </button>
        )}
        <span className={`material-symbols-outlined text-xl ${iconColor}`}>{icon}</span>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <span className="text-slate-400 text-sm font-normal ml-2">{count} tugas tersisa</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            {...task}
            childTasks={childrenMap[task.id] || []}
            selectionMode={selectionMode}
            isSelected={selectedIds.includes(task.id)}
            onSelect={onSelectTask}
          />
        ))}
      </div>
    </section>
  );
}
