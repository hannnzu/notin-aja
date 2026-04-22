import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute() {
    const { user, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin"></div>
            </div>
        );
    }

    // If user is not logged in, boot them to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
