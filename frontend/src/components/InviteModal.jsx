import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getBoard } from '../store/slices/boardSlice';
import api from '../utils/api';
import { X } from 'lucide-react';

export default function InviteModal({ boardId, onClose }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Viewer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post(`/boards/${boardId}/members`, { email, role });
            setSuccess('User invited successfully!');
            setEmail('');
            dispatch(getBoard(boardId));
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to invite user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass w-full max-w-md bg-darkCard rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold">Invite to Board</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleInvite} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <span className="shrink-0 mt-0.5 font-bold">!</span>
                            <p>{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                            <span className="shrink-0 mt-0.5 font-bold">✓</span>
                            <p>{success}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">User Email Address</label>
                        <input
                            type="email" required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                            value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="colleague@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Role</label>
                        <select
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors appearance-none"
                            value={role} onChange={e => setRole(e.target.value)}
                        >
                            <option value="Viewer">Viewer (Read Only)</option>
                            <option value="Editor">Editor (Edit Cards/Lists)</option>
                            <option value="Admin">Admin (Full Control)</option>
                        </select>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className={`w-full py-2.5 mt-2 bg-primary hover:bg-indigo-600 rounded-lg font-semibold transition-all shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Inviting...' : 'Send Invite'}
                    </button>
                </form>
            </div>
        </div>
    );
}
