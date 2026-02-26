import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBoard, reorderListsLocal, updateCardLocal, updateListLocal } from '../store/slices/boardSlice';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import ListColumn from '../components/ListColumn';
import CardModal from '../components/CardModal';
import InviteModal from '../components/InviteModal';
import { Plus } from 'lucide-react';

export default function BoardView() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentBoard, loading } = useSelector(state => state.boards);
    const { user } = useSelector(state => state.auth);
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Calculate Role Permissions
    let currentUserRole = 'Viewer';
    if (currentBoard && user) {
        const isOwner = currentBoard.owner?._id === user._id || currentBoard.owner === user._id;
        const memberRecord = currentBoard.members?.find(m => m.user?._id === user._id || m.user === user._id);
        currentUserRole = isOwner ? 'Admin' : (memberRecord ? memberRecord.role : 'Viewer');
    }
    const canEdit = currentUserRole === 'Admin' || currentUserRole === 'Editor';
    const canAdmin = currentUserRole === 'Admin';

    useEffect(() => {
        dispatch(getBoard(id));
    }, [dispatch, id]);

    const handleDragEnd = async (result) => {
        if (!canEdit) return;
        const { destination, source, draggableId, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'list') {
            const newLists = Array.from(currentBoard.lists);
            const [removed] = newLists.splice(source.index, 1);
            newLists.splice(destination.index, 0, removed);

            const updatedLists = newLists.map((list, index) => ({ ...list, position: index }));
            dispatch(reorderListsLocal(updatedLists));

            updatedLists.forEach(list => {
                api.put(`/lists/${list._id}`, { title: list.title });
            });
            return;
        }

        if (type === 'card') {
            const sourceList = currentBoard.lists.find(l => l._id === source.droppableId);
            const destList = currentBoard.lists.find(l => l._id === destination.droppableId);
            const card = sourceList.cards.find(c => c._id === draggableId);

            if (source.droppableId === destination.droppableId) {
                await api.put(`/cards/${draggableId}`, { position: destination.index });
                dispatch(getBoard(id));
            } else {
                dispatch(updateCardLocal({ oldListId: source.droppableId, card: { ...card, listId: destination.droppableId, position: destination.index } }));
                await api.put(`/cards/${draggableId}`, { listId: destination.droppableId, position: destination.index });
                dispatch(getBoard(id));
            }
        }
    };

    const handleAddList = async (e) => {
        e.preventDefault();
        if (!newListTitle.trim()) return;
        try {
            const res = await api.post(`/boards/${id}/lists`, { title: newListTitle });
            dispatch(updateListLocal({ ...res.data, cards: [] }));
            setNewListTitle('');
            setIsAddingList(false);
        } catch (err) { console.error(err); }
    }

    if (loading || !currentBoard) return <div className="p-8 text-center text-slate-400">Loading board...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="glass px-8 py-4 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold">{currentBoard.title}</h1>
                    <p className="text-sm text-slate-400">{currentBoard.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 flex-row-reverse">
                        {currentBoard.members.map((m, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold ring-2 ring-darkBg" title={`${m.user.username} - ${m.role}`}>
                                {m.user.username.charAt(0).toUpperCase()}
                            </div>
                        ))}
                    </div>
                    {canAdmin && (
                        <button
                            onClick={() => setIsInviteOpen(true)}
                            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium ml-4 border border-slate-700 transition-colors"
                        >
                            Invite
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="board" direction="horizontal" type="list">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex items-start gap-6 h-full pb-4"
                            >
                                {currentBoard.lists.map((list, index) => (
                                    <ListColumn key={list._id} list={list} index={index} setActiveCard={setActiveCard} canEdit={canEdit} />
                                ))}
                                {provided.placeholder}

                                {/* Add New List Button */}
                                {canEdit && (
                                    <div className="min-w-[280px] shrink-0">
                                        {isAddingList ? (
                                            <form onSubmit={handleAddList} className="glass p-3 rounded-xl border border-white/10 shadow-lg">
                                                <input
                                                    type="text" autoFocus required
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3"
                                                    placeholder="Enter list title..."
                                                    value={newListTitle} onChange={e => setNewListTitle(e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" className="bg-primary hover:bg-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add List</button>
                                                    <button type="button" onClick={() => setIsAddingList(false)} className="px-3 py-1.5 rounded-lg text-sm hover:bg-white/5 transition-colors">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                onClick={() => setIsAddingList(true)}
                                                className="glass w-full flex items-center gap-2 p-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 transition-colors shadow-sm"
                                            >
                                                <Plus className="w-5 h-5 text-slate-400" />
                                                <span className="font-medium">Add another list</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {activeCard && (
                <CardModal
                    card={activeCard}
                    boardId={id}
                    onClose={() => setActiveCard(null)}
                    canEdit={canEdit}
                />
            )}

            {isInviteOpen && (
                <InviteModal
                    boardId={id}
                    onClose={() => setIsInviteOpen(false)}
                />
            )}
        </div>
    );
}
