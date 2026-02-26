const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true }
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true }
}, { timestamps: true });

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    position: { type: Number, required: true, default: 0 },
    dueDate: { type: Date, default: null },
    labels: [{ type: String }],
    attachments: [{ type: String }],
    comments: [CommentSchema],
    activityLog: [ActivitySchema]
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
