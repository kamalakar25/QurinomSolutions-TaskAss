const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const User = require('../models/User');

// Get all boards for user
router.get('/', auth, async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [
                { owner: req.user.id },
                { 'members.user': req.user.id }
            ]
        }).populate('owner', 'username email');
        res.json(boards);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create board
router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newBoard = new Board({
            title,
            description,
            owner: req.user.id,
            members: [{ user: req.user.id, role: 'Admin' }]
        });
        const board = await newBoard.save();
        res.json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get single board
router.get('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate('members.user', 'username email')
            .populate({
                path: 'lists',
                options: { sort: { position: 1 } },
                populate: { path: 'cards', options: { sort: { position: 1 } } }
            });
        if (!board) return res.status(404).json({ message: 'Board not found' });

        // Check access
        const hasAccess = board.owner.toString() === req.user.id || board.members.some(m => m.user._id.toString() === req.user.id);
        if (!hasAccess) return res.status(403).json({ message: 'Not authorized' });

        res.json(board);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Board not found' });
        res.status(500).send('Server Error');
    }
});

// Invite member to board
router.post('/:id/members', auth, async (req, res) => {
    try {
        const { email, role } = req.body;
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return res.status(404).json({ message: 'User not found' });

        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        // Only Admin can invite
        const currentMember = board.members.find(m => m.user.toString() === req.user.id);
        const isAdmin = board.owner.toString() === req.user.id || (currentMember && currentMember.role === 'Admin');
        if (!isAdmin) return res.status(403).json({ message: 'Not authorized to invite' });

        if (board.members.some(m => m.user.toString() === userToInvite._id.toString())) {
            return res.status(400).json({ message: 'User already a member' });
        }

        board.members.push({ user: userToInvite._id, role: role || 'Viewer' });
        await board.save();

        const updatedBoard = await Board.findById(req.params.id).populate('members.user', 'username email');
        res.json(updatedBoard.members);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update board details (Owner only)
router.put('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only board owner can edit details' });
        }

        const { title, description } = req.body;
        if (title) board.title = title;
        if (description !== undefined) board.description = description;

        await board.save();
        res.json(board);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete board (Owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only board owner can delete board' });
        }

        // We should ideally also delete related lists and cards
        const List = require('../models/List');
        const Card = require('../models/Card');

        await Card.deleteMany({ boardId: board._id });
        await List.deleteMany({ boardId: board._id });
        await Board.findByIdAndDelete(req.params.id);

        res.json({ message: 'Board removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
