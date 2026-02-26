import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';
import TaskCard from './TaskCard';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { getBoard, deleteList, updateListTitle } from '../store/slices/boardSlice';
export default function ListColumn({ list, index, setActiveCard, canEdit }) {
    const dispatch = useDispatch();
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitleConfig, setEditTitleConfig] = useState(list.title);

    const handleDeleteList = () => {
        if (window.confirm('Are you sure you want to delete this list and all its cards?')) {
            dispatch(deleteList(list._id));
        }
    };

    const handleSaveTitle = () => {
        if (editTitleConfig.trim() && editTitleConfig !== list.title) {
            dispatch(updateListTitle({ listId: list._id, title: editTitleConfig }));
        }
        setIsEditingTitle(false);
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!newCardTitle.trim()) return;
        try {
            await api.post(`/lists/${list._id}/cards`, { title: newCardTitle });
            dispatch(getBoard(list.boardId)); // refresh board to apply correct ids/orders
            setNewCardTitle('');
            setIsAddingCard(false);
        } catch (err) { console.error(err); }
    }

    return (
        <Draggable draggableId={list._id} index={index} isDragDisabled={!canEdit}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`glass min-w-[300px] w-[300px] shrink-0 rounded-2xl flex flex-col max-h-full border border-white/5 transition-all ${snapshot.isDragging ? 'rotate-1 shadow-2xl scale-105 border-primary/30 z-50' : ''}`}
                >
                    <div
                        {...provided.dragHandleProps}
                        className="p-4 flex items-center justify-between border-b border-white/5 group cursor-grab active:cursor-grabbing backdrop-blur-md rounded-t-2xl bg-white/5 min-h-[60px]"
                    >
                        {isEditingTitle ? (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    autoFocus
                                    className="bg-slate-800/80 border border-slate-700 rounded px-2 py-1 text-sm font-semibold text-white focus:outline-none focus:border-primary flex-1"
                                    value={editTitleConfig}
                                    onChange={e => setEditTitleConfig(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') setIsEditingTitle(false); }}
                                />
                                <button onClick={handleSaveTitle} className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
                                <button onClick={() => setIsEditingTitle(false)} className="text-slate-400 hover:text-slate-300"><X className="w-4 h-4" /></button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-semibold text-slate-200 tracking-wide flex-1 truncate">{list.title}</h3>
                                {canEdit && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setIsEditingTitle(true)} className="p-1 text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={handleDeleteList} className="p-1 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <Droppable droppableId={list._id} type="card">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px] transition-colors custom-scrollbar ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
                            >
                                {list.cards?.map((card, idx) => (
                                    <TaskCard key={card._id} card={card} index={idx} onClick={() => setActiveCard(card)} canEdit={canEdit} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <div className="p-3 border-t border-white/5 mt-auto rounded-b-2xl bg-white/[0.02]">
                        {canEdit && (
                            isAddingCard ? (
                                <form onSubmit={handleAddCard} className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <textarea
                                        autoFocus required
                                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none mb-2"
                                        rows="3"
                                        placeholder="Enter a title for this card..."
                                        value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(e); } }}
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="bg-primary hover:bg-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add Task</button>
                                        <button type="button" onClick={() => setIsAddingCard(false)} className="px-3 py-1.5 rounded-lg text-sm hover:bg-white/5 transition-colors">Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsAddingCard(true)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5 font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm">Add a task</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
