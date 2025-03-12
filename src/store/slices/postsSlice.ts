import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';

interface PostsState {
  posts: Post[];
  loading: boolean;
  page: number;
  hasMore: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  page: 1,
  hasMore: true,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex((post) => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setLoading,
  incrementPage,
  setHasMore,
} = postsSlice.actions;
export default postsSlice.reducer;