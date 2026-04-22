import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import TaskItem from './TaskItem';

const COLUMNS = {
  'todo': { title: 'Belum Dimulai', icon: 'radio_button_unchecked', color: 'text-slate-400' },
  'in_progress': { title: 'Sedang Dikerjakan', icon: 'pending', color: 'text-blue-500' },
  'done': { title: 'Selesai', icon: 'check_circle', color: 'text-green-500' }
};

export default function KanbanBoard({ tasks }) {
  const editTask = useTaskStore(state => state.editTask);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Pindah antar kolom (ubah status)
    if (destination.droppableId !== source.droppableId) {
      editTask(draggableId, { status: destination.droppableId });
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(t => (t.status || 'todo') === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 h-full items-start">
        {Object.entries(COLUMNS).map(([statusId, column]) => {
          const columnTasks = getTasksByStatus(statusId);
          
          return (
            <div key={statusId} className="flex-1 min-w-[300px] w-full max-w-[400px] flex flex-col bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800 p-4 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${column.color}`}>{column.icon}</span>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{column.title}</h3>
                </div>
                <span className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                  {columnTasks.length}
                </span>
              </div>
              
              <Droppable droppableId={statusId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-slate-200/50 dark:bg-slate-800/50' : ''}`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{...provided.draggableProps.style}}
                            className={`${snapshot.isDragging ? 'rotate-2 scale-[1.02] shadow-2xl z-50' : ''} transition-transform`}
                          >
                            <TaskItem 
                              {...task} 
                              isBoardView={true} 
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
