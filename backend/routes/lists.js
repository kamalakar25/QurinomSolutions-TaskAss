const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');

const checkEditPermission = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) return false;
    if (board.owner.toString() === userId) return true;
    const member = board.members.find(m => m.user.toString() === userId);
    return member && (member.role === 'Admin' || member.role === 'Editor');
};

// GET all lists for a board
router.get('/', auth, async (req, res) => {
    try {
        const lists = await List.find({ boardId: req.params.boardId }).sort('position').populate('cards');
        res.json(lists);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST a new list
router.post('/', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        const canEdit = await checkEditPermission(req.params.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify lists' });

        const lists = await List.find({ boardId: req.params.boardId });
        const position = lists.length;

        const newList = new List({
            title: req.body.title,
            boardId: req.params.boardId,
            position
        });

        const list = await newList.save();
        board.lists.push(list.id);
        await board.save();

        res.json(list);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT to update a list (e.g. rename)
router.put('/:id', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });

        const canEdit = await checkEditPermission(list.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify lists' });

        list.title = req.body.title || list.title;
        await list.save();
        res.json(list);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE a list
router.delete('/:id', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        if (!list) return res.status(404).json({ message: 'List not found' });

        const canEdit = await checkEditPermission(list.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify lists' });

        // Remove list from board
        const board = await Board.findById(list.boardId);
        if (board) {
            board.lists = board.lists.filter(lId => lId.toString() !== list._id.toString());
            await board.save();
        }

        await List.findByIdAndDelete(req.params.id);
        res.json({ message: 'List removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
