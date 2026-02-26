import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, AlignLeft, MessageSquare, Clock, Tag, Paperclip } from 'lucide-react';
import api from '../utils/api';
import moment from 'moment';
import { getBoard } from '../store/slices/boardSlice';

export default function CardModal({ card, boardId, onClose, canEdit }) {
    const dispatch = useDispatch();
    const [description, setDescription] = useState(card.description || '');
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [dueDate, setDueDate] = useState(card.dueDate ? moment(card.dueDate).format('YYYY-MM-DD') : '');

    const [isAddingLabel, setIsAddingLabel] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [isAddingAttachment, setIsAddingAttachment] = useState(false);
    const [newAttachment, setNewAttachment] = useState('');

    const handleAddLabel = (e) => {
        e.preventDefault();
        if (!newLabel.trim()) return;
        const updatedLabels = [...(card.labels || []), newLabel.trim()];
        updateCard({ labels: updatedLabels });
        setNewLabel('');
        setIsAddingLabel(false);
    }

    const handleRemoveLabel = (labelToRemove) => {
        const updatedLabels = (card.labels || []).filter(l => l !== labelToRemove);
        updateCard({ labels: updatedLabels });
    }

    const handleAddAttachment = (e) => {
        e.preventDefault();
        if (!newAttachment.trim()) return;
        const updatedAttachments = [...(card.attachments || []), newAttachment.trim()];
        updateCard({ attachments: updatedAttachments });
        setNewAttachment('');
        setIsAddingAttachment(false);
    }

    const updateCard = async (updates) => {
        try {
            await api.put(`/cards/${card._id}`, updates);
            dispatch(getBoard(boardId));
        } catch (err) { console.error(err); }
    };

    const handleDescSave = () => {
        updateCard({ description });
        setIsEditingDesc(false);
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        updateCard({ commentText });
        setCommentText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 shadow-2xl backdrop-blur-md">
            <div className="glass w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">

                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-start shrink-0 bg-white/5 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">{card.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8 custom-scrollbar">

                    <div className="flex-1 space-y-8">
                        {/* Display Labels & Dates */}
                        {(card.labels?.length > 0 || card.dueDate) && (
                            <div className="flex flex-wrap gap-6 text-sm">
                                {card.labels?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Labels</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {card.labels.map((l, i) => (
                                                <span key={i} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-md flex items-center gap-2 font-medium">
                                                    {l} {canEdit && <button onClick={() => handleRemoveLabel(l)} className="hover:text-white transition-colors"><X className="w-3 h-3" /></button>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {card.dueDate && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Due Date</h4>
                                        <div className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-md text-slate-300 font-medium font-mono">
                                            <Clock className="inline w-3.5 h-3.5 mr-1.5 relative -top-[1px]" /> {moment(card.dueDate).format('MMM D, YYYY')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 font-semibold text-slate-200">
                                <AlignLeft className="w-5 h-5" /> Description
                            </div>
                            {isEditingDesc ? (
                                <div className="space-y-2 animate-in fade-in">
                                    <textarea
                                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-primary min-h-[100px]"
                                        value={description} onChange={e => setDescription(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleDescSave} className="bg-primary hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save</button>
                                        <button onClick={() => setIsEditingDesc(false)} className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={() => canEdit && setIsEditingDesc(true)} className={`bg-slate-800/30 hover:bg-slate-800/60 p-4 rounded-lg text-sm text-slate-300 min-h-[60px] transition-colors border border-transparent ${canEdit ? 'cursor-pointer hover:border-slate-700' : ''}`}>
                                    {description || 'No description provided.'}
                                </div>
                            )}
                        </div>

                        {/* Display Attachments */}
                        {card.attachments?.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 font-semibold text-slate-200">
                                    <Paperclip className="w-5 h-5" /> Attachments
                                </div>
                                <div className="grid gap-2">
                                    {card.attachments.map((att, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-800/30 hover:bg-slate-800/60 transition-colors px-4 py-3 border border-slate-700 rounded-lg">
                                            <a href={att} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline truncate flex-1 text-sm">{att}</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 font-semibold text-slate-200">
                                <MessageSquare className="w-5 h-5" /> Activity
                            </div>

                            {canEdit && (
                                <form onSubmit={handleAddComment} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary shrink-0 flex items-center justify-center font-bold text-xs uppercase">M</div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Write a comment..."
                                            value={commentText} onChange={e => setCommentText(e.target.value)}
                                        />
                                        {commentText && <button type="submit" className="bg-primary hover:bg-indigo-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors animate-in fade-in">Save</button>}
                                    </div>
                                </form>
                            )}

                            <div className="space-y-4 pt-4">
                                {card.comments?.map((comment, i) => (
                                    <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 flex items-center justify-center font-bold text-xs uppercase">{comment.user?.username?.charAt(0) || 'U'}</div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold text-sm">{comment.user?.username || 'User'}</span>
                                                <span className="text-xs text-slate-500">{moment(comment.createdAt).fromNow()}</span>
                                            </div>
                                            <div className="bg-slate-800/50 p-3 rounded-lg mt-1 text-sm border border-slate-700/50">
                                                {comment.text}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {canEdit && (
                        <div className="w-full md:w-48 space-y-6 shrink-0">
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Add to card</h4>
                                {isAddingLabel ? (
                                    <form onSubmit={handleAddLabel} className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-sm animate-in fade-in">
                                        <input
                                            autoFocus
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs mb-2 text-white focus:border-primary outline-none transition-colors"
                                            placeholder="Label title..."
                                            value={newLabel} onChange={e => setNewLabel(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 bg-primary hover:bg-indigo-600 transition-colors py-1.5 rounded text-xs font-medium">Add</button>
                                            <button type="button" onClick={() => setIsAddingLabel(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 transition-colors py-1.5 rounded text-xs">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setIsAddingLabel(true)} className="w-full bg-slate-800 hover:bg-slate-700 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 shadow-sm">
                                        <Tag className="w-4 h-4 text-slate-400" /> Labels
                                    </button>
                                )}

                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 cursor-pointer shadow-sm"
                                        value={dueDate}
                                        onChange={(e) => {
                                            setDueDate(e.target.value);
                                            updateCard({ dueDate: e.target.value });
                                        }}
                                    />
                                    {!dueDate && <div className="absolute inset-x-0 top-0 bottom-0 bg-slate-800 pointer-events-none flex items-center px-3 gap-2 rounded-lg text-sm border border-slate-700"><Clock className="w-4 h-4 text-slate-400" /> Dates</div>}
                                </div>

                                {isAddingAttachment ? (
                                    <form onSubmit={handleAddAttachment} className="bg-slate-800 p-2 rounded-lg border border-slate-700 shadow-sm animate-in fade-in">
                                        <input
                                            autoFocus
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs mb-2 text-white focus:border-primary outline-none transition-colors"
                                            placeholder="Paste a URL link..."
                                            value={newAttachment} onChange={e => setNewAttachment(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <button type="submit" className="flex-1 bg-primary hover:bg-indigo-600 transition-colors py-1.5 rounded text-xs font-medium">Attach</button>
                                            <button type="button" onClick={() => setIsAddingAttachment(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 transition-colors py-1.5 rounded text-xs">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <button onClick={() => setIsAddingAttachment(true)} className="w-full bg-slate-800 hover:bg-slate-700 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border border-slate-700 shadow-sm">
                                        <Paperclip className="w-4 h-4 text-slate-400" /> Attachment
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
