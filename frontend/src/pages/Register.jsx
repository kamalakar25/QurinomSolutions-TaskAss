import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import { Link, Navigate } from 'react-router-dom';

import { useEffect } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const { isAuthenticated, error } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2 animate-in fade-in">
                        <span className="shrink-0 mt-0.5 font-bold">!</span>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Username</label>
                        <input
                            type="text" required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })}
                            placeholder="johndoe"
                        />
                    </div>
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
                            type="password" required minLength="6"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 mt-4 bg-primary hover:bg-indigo-600 rounded-lg font-semibold transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-500/25">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-secondary hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
