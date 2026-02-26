import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBoards, createBoard, updateBoard, deleteBoard } from '../store/slices/boardSlice';
import { Link } from 'react-router-dom';
import { Plus, Layout, Edit2, Trash2 } from 'lucide-react';
import classNames from 'classnames';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { boards, loading } = useSelector(state => state.boards);
    const { user } = useSelector(state => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBoard, setNewBoard] = useState({ title: '', description: '' });

    useEffect(() => {
        dispatch(getBoards());
    }, [dispatch]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoard.title.trim()) return;
        await dispatch(createBoard(newBoard));
        setNewBoard({ title: '', description: '' });
        setIsModalOpen(false);
    };

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editBoardData, setEditBoardData] = useState({ id: null, title: '', description: '' });

    const openEditModal = (e, board) => {
        e.preventDefault();
        e.stopPropagation();
        setEditBoardData({ id: board._id, title: board.title, description: board.description || '' });
        setEditModalOpen(true);
    };

    const handleUpdateBoard = async (e) => {
        e.preventDefault();
        if (!editBoardData.title.trim()) return;
        await dispatch(updateBoard({ id: editBoardData.id, data: { title: editBoardData.title, description: editBoardData.description } }));
        setEditModalOpen(false);
    };

    const handleDeleteBoard = (e, boardId) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
            dispatch(deleteBoard(boardId));
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading boards...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Layout className="w-8 h-8 text-primary" />
                    Your Boards
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Create Board
                </button>
            </div>

            {boards.length === 0 ? (
                <div className="glass flex flex-col items-center justify-center p-12 rounded-2xl text-center border-dashed border-2 border-slate-700">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <Layout className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
                    <p className="text-slate-400 mb-6 max-w-md">Create your first board to start organizing your tasks, lists, and collaborating with your team.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition-colors border border-slate-600"
                    >
                        <Plus className="w-5 h-5" />
                        Create First Board
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {boards.map(board => (
                        <Link
                            key={board._id}
                            to={`/b/${board._id}`}
                            className="glass group relative h-40 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 flex flex-col"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-700 to-slate-600 group-hover:from-primary group-hover:to-secondary transition-all rounded-t-2xl"></div>
                            <h3 className="text-xl font-semibold mb-2 line-clamp-1">{board.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2 flex-1">{board.description || 'No description'}</p>
                            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>{board.members?.length || 1} members</span>
                                {board.owner?._id === user?._id && (
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Owner</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => openEditModal(e, board)} className="p-1 hover:text-white transition-colors bg-slate-800 rounded z-10"><Edit2 className="w-3.5 h-3.5" /></button>
                                            <button onClick={(e) => handleDeleteBoard(e, board._id)} className="p-1 hover:text-red-400 transition-colors bg-slate-800 rounded z-10"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-4">Create New Board</h2>
                        <form onSubmit={handleCreateBoard} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Board Title</label>
                                <input
                                    type="text" required autoFocus
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                                    value={newBoard.title} onChange={e => setNewBoard({ ...newBoard, title: e.target.value })}
                                    placeholder="e.g., Marketing Campaign"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors resize-none"
                                    rows="3"
                                    value={newBoard.description} onChange={e => setNewBoard({ ...newBoard, description: e.target.value })}
                                    placeholder="What's this board about?"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary hover:bg-indigo-600 font-medium transition-colors">
                                    Create Board
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-4">Edit Board</h2>
                        <form onSubmit={handleUpdateBoard} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Board Title</label>
                                <input
                                    type="text" required autoFocus
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                                    value={editBoardData.title} onChange={e => setEditBoardData({ ...editBoardData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors resize-none"
                                    rows="3"
                                    value={editBoardData.description} onChange={e => setEditBoardData({ ...editBoardData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-2 rounded-lg bg-primary hover:bg-indigo-600 font-medium transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
