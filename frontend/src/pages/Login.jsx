import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import { Link, Navigate } from 'react-router-dom';

import { useEffect } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const { isAuthenticated, error } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2 animate-in fade-in">
                        <span className="shrink-0 mt-0.5 font-bold">!</span>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Email</label>
                        <input
                            type="email" required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Password</label>
                        <input
                            type="password" required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 bg-primary hover:bg-indigo-600 rounded-lg font-semibold transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-500/25">
                        Log In
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
