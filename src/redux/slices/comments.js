import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchCommentsByPost = createAsyncThunk('comments/fetchCommentsByPost', async (post) => {
  const { data } = await axios.get(`/comments/${post}`);
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const commentsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const commentReducer = commentsSlice.reducer;
const { actions } = commentsSlice;
