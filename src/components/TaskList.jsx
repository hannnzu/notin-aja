import TaskItem from './TaskItem';

export default function TaskList({ title, icon, iconColor, count, tasks }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className={`material-symbols-outlined text-xl ${iconColor}`}>
          {icon}
        </span>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <span className="text-slate-400 text-sm font-normal ml-2">
          {count} tugas tersisa
        </span>
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem key={index} {...task} category={title.includes('Work') ? 'Work' : 'Personal'} />
        ))}
      </div>
    </section>
  );
}
