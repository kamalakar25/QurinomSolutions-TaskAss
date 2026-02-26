import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, MessageSquare, Clock } from 'lucide-react';
import moment from 'moment';

export default function TaskCard({ card, index, onClick, canEdit }) {
    return (
        <Draggable draggableId={card._id} index={index} isDragDisabled={!canEdit}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={onClick}
                    className={`bg-darkCard hover:bg-slate-700/80 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-all shadow-sm cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl shadow-primary/20 border-primary/50 z-50 ring-2 ring-primary/30' : ''}`}
                >
                    {card.labels && card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {card.labels.map((label, i) => (
                                <span key={i} className={`px-2 h-1.5 rounded-full w-10`} style={{ backgroundColor: label || '#6366f1' }}></span>
                            ))}
                        </div>
                    )}

                    <p className="text-[15px] font-medium text-slate-100 mb-3 leading-snug">{card.title}</p>

                    {(card.description || card.dueDate || card.comments?.length > 0) && (
                        <div className="flex flex-wrap items-center gap-3 text-slate-400">
                            {card.description && <AlignLeft className="w-4 h-4" title="Has description" />}
                            {card.comments?.length > 0 && (
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{card.comments.length}</span>
                                </div>
                            )}
                            {card.dueDate && (
                                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${moment(card.dueDate).isBefore(moment()) ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-slate-800 border border-slate-700'}`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{moment(card.dueDate).format('MMM D')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
