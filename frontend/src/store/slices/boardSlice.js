import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getBoards = createAsyncThunk('boards/getBoards', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/boards');
        return res.data;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const getBoard = createAsyncThunk('boards/getBoard', async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`/boards/${id}`);
        return res.data;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const createBoard = createAsyncThunk('boards/createBoard', async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post('/boards', formData);
        return res.data;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const updateBoard = createAsyncThunk('boards/updateBoard', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/boards/${id}`, data);
        return res.data;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const deleteBoard = createAsyncThunk('boards/deleteBoard', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/boards/${id}`);
        return id;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const updateListTitle = createAsyncThunk('boards/updateListTitle', async ({ listId, title }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/lists/${listId}`, { title });
        return res.data;
    } catch (err) { return rejectWithValue(err.response.data); }
});

export const deleteList = createAsyncThunk('boards/deleteList', async (listId, { rejectWithValue }) => {
    try {
        await api.delete(`/lists/${listId}`);
        return listId;
    } catch (err) { return rejectWithValue(err.response.data); }
});


const boardSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: [],
        currentBoard: null,
        loading: true,
        error: null
    },
    reducers: {
        clearBoard: (state) => {
            state.currentBoard = null;
        },
        updateListLocal: (state, action) => {
            if (state.currentBoard) {
                const index = state.currentBoard.lists.findIndex(l => l._id === action.payload._id);
                if (index !== -1) state.currentBoard.lists[index] = action.payload;
                else state.currentBoard.lists.push(action.payload);
            }
        },
        reorderListsLocal: (state, action) => {
            if (state.currentBoard) {
                state.currentBoard.lists = action.payload;
            }
        },
        updateCardLocal: (state, action) => {
            const { oldListId, card } = action.payload;
            if (state.currentBoard) {
                if (oldListId && oldListId !== card.listId) {
                    const oldList = state.currentBoard.lists.find(l => l._id === oldListId);
                    if (oldList) oldList.cards = oldList.cards.filter(c => c._id !== card._id);
                }
                const list = state.currentBoard.lists.find(l => l._id === card.listId);
                if (list) {
                    const cardIndex = list.cards.findIndex(c => c._id === card._id);
                    if (cardIndex !== -1) {
                        list.cards[cardIndex] = card;
                    } else {
                        list.cards.push(card);
                        list.cards.sort((a, b) => a.position - b.position);
                    }
                }
            }
        },
        removeCardLocal: (state, action) => {
            const { listId, cardId } = action.payload;
            if (state.currentBoard) {
                const list = state.currentBoard.lists.find(l => l._id === listId);
                if (list) {
                    list.cards = list.cards.filter(c => c._id !== cardId);
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBoards.pending, (state) => { state.loading = true; })
            .addCase(getBoards.fulfilled, (state, action) => {
                state.boards = action.payload;
                state.loading = false;
            })
            .addCase(getBoard.pending, (state) => { state.loading = true; })
            .addCase(getBoard.fulfilled, (state, action) => {
                state.currentBoard = action.payload;
                state.loading = false;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.boards.push(action.payload);
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const index = state.boards.findIndex(b => b._id === action.payload._id);
                if (index !== -1) Object.assign(state.boards[index], action.payload);
                if (state.currentBoard && state.currentBoard._id === action.payload._id) {
                    state.currentBoard.title = action.payload.title;
                    state.currentBoard.description = action.payload.description;
                }
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.boards = state.boards.filter(b => b._id !== action.payload);
                if (state.currentBoard && state.currentBoard._id === action.payload) {
                    state.currentBoard = null;
                }
            })
            .addCase(updateListTitle.fulfilled, (state, action) => {
                if (state.currentBoard) {
                    const list = state.currentBoard.lists.find(l => l._id === action.payload._id);
                    if (list) list.title = action.payload.title;
                }
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                if (state.currentBoard) {
                    state.currentBoard.lists = state.currentBoard.lists.filter(l => l._id !== action.payload);
                }
            });
    }
});

export const { clearBoard, updateListLocal, reorderListsLocal, updateCardLocal, removeCardLocal } = boardSlice.actions;
export default boardSlice.reducer;
