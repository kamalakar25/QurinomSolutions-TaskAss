import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearBoard } from '../store/slices/boardSlice';
import { FileStack, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearBoard());
    };

    return (
        <nav className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-md backdrop-blur-md">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary transition-transform hover:scale-105">
                <FileStack className="text-primary w-6 h-6" />
                TaskFlow
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm">
                            <User className="w-4 h-4 text-slate-400" />
                            {user?.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">Login</Link>
                        <Link to="/register" className="px-4 py-2 rounded-lg bg-primary hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
