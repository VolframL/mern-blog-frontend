import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
  await axios.delete(`/posts/${id}`);
  return id;
});

export const fetchPostsByTag = createAsyncThunk('posts/fetchPostsByTag', async (tag) => {
  const { data } = await axios.get(`/tag/${tag}`);
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id) => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});

export const addComment = createAsyncThunk('posts/addComment', async (fields) => {
  const { data } = await axios.patch(`/posts/${fields.id}/comments`, fields);
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
  post: {
    post: {},
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsFilter: (state, action) => {
      if (action.payload === 'NEW') {
        state.posts.items = state.posts.items.sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return -1;
          }
          if (a.createdAt < b.createdAt) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      } else if (action.payload === 'POPULAR') {
        state.posts.items = state.posts.items.sort((a, b) => {
          if (a.viewsCount > b.viewsCount) {
            return -1;
          }
          if (a.viewsCount < b.viewsCount) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      }
    },
  },
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload.reverse();
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // Получение статей по тегу
    [fetchPostsByTag.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsByTag.fulfilled]: (state, action) => {
      state.posts.items = action.payload.reverse();
      state.posts.status = 'loaded';
    },
    [fetchPostsByTag.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // Получение статьи по тегу
    [fetchPostById.pending]: (state) => {
      state.post.post = {};
      state.post.status = 'loading';
    },
    [fetchPostById.fulfilled]: (state, action) => {
      state.post.post = action.payload;
      state.post.status = 'loaded';
    },
    [fetchPostById.rejected]: (state) => {
      state.post.post = {};
      state.post.status = 'error';
    },
    // Добавление комментариев
    [addComment.pending]: (state) => {
      state.post.post.status = 'loading';
    },
    [addComment.fulfilled]: (state, action) => {
      state.post.post.comments = action.payload;
      state.post.post.status = 'loaded';
    },
    [addComment.rejected]: (state) => {
      state.post.post.status = 'error';
    },
    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // Удаление статьи
    [fetchRemovePost.fulfilled]: (state, action) => {
      state.tags.status = 'loading';
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.payload);
    },
  },
});

export const postsReducer = postsSlice.reducer;
const { actions } = postsSlice;
export const { postsFilter } = actions;
