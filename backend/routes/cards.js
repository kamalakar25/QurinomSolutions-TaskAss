const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');

const checkEditPermission = async (boardId, userId) => {
    const board = await Board.findById(boardId);
    if (!board) return false;
    if (board.owner.toString() === userId) return true;
    const member = board.members.find(m => m.user.toString() === userId);
    return member && (member.role === 'Admin' || member.role === 'Editor');
};

// POST a new card
router.post('/', auth, async (req, res) => {
    try {
        const list = await List.findById(req.params.listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        const canEdit = await checkEditPermission(list.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify cards' });

        const cards = await Card.find({ listId: req.params.listId });
        const position = cards.length;

        const newCard = new Card({
            title: req.body.title,
            listId: req.params.listId,
            boardId: list.boardId,
            position,
            description: req.body.description || ''
        });

        const card = await newCard.save();
        list.cards.push(card.id);
        await list.save();

        res.json(card);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET all cards for search/filter (boardId from query or params)
router.get('/', auth, async (req, res) => {
    try {
        const query = {};
        if (req.query.boardId) query.boardId = req.query.boardId;
        if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };

        const cards = await Card.find(query).sort('position');
        res.json(cards);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT update a card (details, comments, moving)
router.put('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        const canEdit = await checkEditPermission(card.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify cards' });

        const { title, description, dueDate, labels, attachments, listId, position } = req.body;

        // IF moving between lists
        if (listId && listId !== card.listId.toString()) {
            const oldList = await List.findById(card.listId);
            const newList = await List.findById(listId);

            if (oldList) {
                oldList.cards = oldList.cards.filter(c => c.toString() !== card._id.toString());
                await oldList.save();
            }
            if (newList) {
                newList.cards.push(card._id);
                await newList.save();
            }
            card.listId = listId;
        }

        if (title) card.title = title;
        if (description !== undefined) card.description = description;
        if (dueDate !== undefined) card.dueDate = dueDate;
        if (labels) card.labels = labels;
        if (attachments) card.attachments = attachments;
        if (position !== undefined) card.position = position;

        // Add comment
        if (req.body.commentText) {
            card.comments.push({ user: req.user.id, text: req.body.commentText });
        }

        await card.save();
        const updatedCard = await Card.findById(card._id).populate('comments.user', 'username avatar');
        res.json(updatedCard);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE a card
router.delete('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        const canEdit = await checkEditPermission(card.boardId, req.user.id);
        if (!canEdit) return res.status(403).json({ message: 'Not authorized to modify cards' });

        // Remove from list
        const list = await List.findById(card.listId);
        if (list) {
            list.cards = list.cards.filter(c => c.toString() !== card._id.toString());
            await list.save();
        }

        await Card.findByIdAndDelete(req.params.id);
        res.json({ message: 'Card removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
