import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import TaskFormModal from '../components/TaskFormModal';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <TopNav />
        {/* Render child routes here */}
        <div className="flex-1 flex flex-col relative w-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
      <TaskFormModal />
    </div>
  );
}
